// premium-portfolio/src/app/api/messages/route.ts
import { NextResponse } from 'next/server';
import { getMessages, initDatabase } from '@/lib/db';
import { withAuth } from '@/lib/auth'; // Assuming withAuth correctly handles Request context
import type { JwtPayload } from '@/lib/auth'; // Import type if needed

// Initialize the database
initDatabase().catch(console.error);

// Extend Request type if `withAuth` adds user property
interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// GET: Fetch all messages (protected)
const getHandler = async (req: AuthenticatedRequest) => {
  // req.user should be populated by withAuth if needed for authorization checks beyond simple token validation
  // console.log('Authenticated user accessing messages:', req.user);

  try {
    const messages = await getMessages();
    // Sort messages by date descending (newest first) by default
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages', details: error.message },
      { status: 500 }
    );
  }
};

// Apply the authentication middleware to the handler
export const GET = withAuth(getHandler);

// Explicitly disallow other methods if only GET is intended
export async function POST() {
   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'GET' } });
}
// ... add other methods like PUT, DELETE, PATCH as needed ...