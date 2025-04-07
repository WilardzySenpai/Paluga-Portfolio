// src/lib/auth.ts

import * as jose from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
// --- Import ONLY from types.ts ---
import type { JwtPayload as BaseJwtPayload, BaseUser } from './types'; // Import with alias if needed, or directly

// --- ADD THIS RE-EXPORT LINE ---
export type { BaseJwtPayload as JwtPayload }; // Re-export the type, possibly renaming back
// Or if you didn't use an alias during import:
// export type { JwtPayload };
// --- END RE-EXPORT ---

const JWT_SECRET_STRING = process.env.JWT_SECRET;
if (!JWT_SECRET_STRING) {
  throw new Error('JWT_SECRET environment variable is not defined');
}
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_ALG = 'HS256';
const JWT_EXPIRES_IN = '24h';

// export type JwtPayload = {
//   // Use MongoDB's _id (as a string) for userId
//   userId: string;
//   username: string;
//   role: string;
//   // Standard JWT claims (optional but good practice)
//   // iat?: number; // Issued at (added by jose)
//   // exp?: number; // Expiration time (added by jose)
// };

// Generate a JWT token for a user (now accepts IUser)
export async function generateToken(userData: { userId: string; username: string; role: string; }): Promise<string> {
  const payload: BaseJwtPayload = { // Use the imported type
      userId: userData.userId,
      username: userData.username,
      role: userData.role,
  };

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
}

// Verify and decode a JWT token (remains async)
export async function verifyToken(token: string): Promise<BaseJwtPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify<BaseJwtPayload>(token, JWT_SECRET);

    return payload;
  } catch (error) {
    // Handle specific JWT errors if needed (e.g., expired, invalid signature)
    if (error instanceof jose.errors.JWTExpired) {
      console.log('Token verification failed: Expired token');
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.log('Token verification failed: Invalid signature');
    } else {
      console.error('Error verifying token with jose:', error);
    }
    return null;
  }
}

// --- Cookie functions remain the same ---
export async function setAuthCookie(token: string): Promise<void> {
  (await cookies()).set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours in seconds
    path: '/',
    sameSite: 'strict',
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// --- User/Auth state functions remain the same, relying on verifyToken ---
export async function getCurrentUser(): Promise<BaseJwtPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return await verifyToken(token);
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    return !!await getCurrentUser();
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user?.role && user.role === role;
}

// --- withAuth middleware wrapper remains the same logic ---
// Note: Ensure `verifyToken` correctly returns null for invalid/expired tokens
export function withAuth(handler: (req: Request & { user?: BaseJwtPayload }, params?: any) => Promise<Response | NextResponse>) {
  return async (req: Request, params?: any) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        // Invalid/Expired token - clear cookie and deny access
        const response = NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
        response.cookies.delete('auth_token'); // Clear the bad cookie
        return response;
      }

      // Attach decoded user payload to the request object
      const reqWithUser = Object.assign(req, { user: decoded as BaseJwtPayload });
      return handler(reqWithUser, params); // Proceed to the actual route handler

    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json({ error: 'Internal server error during authentication' }, { status: 500 });
    }
  };
}