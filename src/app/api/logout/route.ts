// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Import cookies

// POST: Logout user by removing the auth cookie
export async function POST() {
  try {
    // Remove the auth cookie using next/headers
    (await
      // Remove the auth cookie using next/headers
      cookies()).delete('auth_token');

    // Return success response
    console.log('Logout successful');
    return NextResponse.json({ success: true, message: 'Logged out successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { error: 'An error occurred during logout', details: error.message },
      { status: 500 }
    );
  }
}

// Explicitly disallow other methods
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'POST' } });
}
export async function PUT() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'POST' } });
}
export async function DELETE() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'POST' } });
}
export async function PATCH() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'POST' } });
}