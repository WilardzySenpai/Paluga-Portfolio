// src/app/api/login/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
// Import DB functions that return Mongoose documents
import { validateCredentials } from '@/lib/db';
// Import auth functions that expect plain data/JWTs
import { generateToken, setAuthCookie } from '@/lib/auth';
import { cookies } from 'next/headers';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      console.warn('Login validation failed:', validationResult.error.flatten());
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Validate credentials against the database
    const userDocument = await validateCredentials(username, password);

    if (!userDocument) {
      console.warn(`Login failed for username: ${username}`);
      // Generic error for security
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 } // Use 401 for Unauthorized
      );
    }

    // --- Extract data needed for the modified generateToken ---
    const tokenData = {
      userId: userDocument._id.toString(), // Convert ObjectId to string
      username: userDocument.username,
      role: userDocument.role,
    };

    // Credentials are valid, generate JWT
    const token = await generateToken(tokenData);

    // Create the success response
    const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
    );
    setAuthCookie(token);

    // Set the authentication cookie using the Response object
    (await
      // Set the authentication cookie using the Response object
      cookies()).set({ // Use cookies() from next/headers
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        sameSite: 'strict',
    });

     // **Important:** We need to actually *use* the response object to set the cookie.
     // However, the `cookies().set` function in Next.js 13+ App Router modifies the outgoing response headers directly.
     // So, simply calling `cookies().set` and returning the `response` should work.

    console.log(`Login successful for user: ${username}`);
    return response;

  } catch (error: any) {
    console.error('Error during login:', error);
     if (error instanceof SyntaxError) {
         return NextResponse.json(
           { error: 'Invalid JSON payload' },
           { status: 400 }
         );
     }
    return NextResponse.json(
      { error: 'An internal error occurred during login' },
      { status: 500 }
    );
  }
}

// Explicitly disallow GET
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}