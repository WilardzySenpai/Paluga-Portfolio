// src/lib/auth.ts

import * as jose from 'jose';
import { cookies } from 'next/headers';
import { type User } from './db';
import { NextResponse } from 'next/server';

const JWT_SECRET_STRING = process.env.JWT_SECRET;
// Encode the secret for jose
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const JWT_ALG = 'HS256'; // Algorithm used
const JWT_EXPIRES_IN = '24h';

export type JwtPayload = {
  userId: string;
  username: string;
  role: string;
  // Standard JWT claims (optional but good practice)
  // iat?: number; // Issued at
  // exp?: number; // Expiration time
};

// Generate a JWT token for a user (now async)
export async function generateToken(user: User): Promise<string> {
  const payload: JwtPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };

  const token = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET);

  return token;
}

// Verify and decode a JWT token (now async)
export async function verifyToken(token: string): Promise<JwtPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jose.jwtVerify<JwtPayload>(token, JWT_SECRET);
    // The payload already matches JwtPayload structure if verification succeeds
    return payload;
  } catch (error) {
    console.error('Error verifying token with jose:', error);
    return null;
  }
}

// Set cookie remains synchronous using next/headers cookies()
// Note: generateToken is now async, so call sites need 'await'
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

// Get cookie
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('auth_token')?.value;
}

// Remove cookie
export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

// Get current user (now async)
export async function getCurrentUser(): Promise<JwtPayload | null> {
  const token = await getAuthCookie();
  if (!token) return null;
  return await verifyToken(token);
}

// isAuthenticated (now async)
export async function isAuthenticated(): Promise<boolean> {
  try {
    return !!await getCurrentUser();
  } catch (error) {
    console.error('Authentication check failed:', error);
    return false;
  }
}

// hasRole (now async)
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user?.role && user.role === role;
}

export function withAuth(handler: (req: Request & { user?: JwtPayload }, params?: any) => Promise<Response | NextResponse>) {
  return async (req: Request, params?: any) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const decoded = await verifyToken(token);
      if (!decoded) {
        cookieStore.delete('auth_token');
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const reqWithUser = Object.assign(req, { user: decoded });
      return handler(reqWithUser, params);
    } catch (error) {
      console.error('Authentication middleware error:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
}