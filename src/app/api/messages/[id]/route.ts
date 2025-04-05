// premium-portfolio/src/app/api/messages/[id]/route.ts
import { NextResponse } from 'next/server';
import { deleteMessage, initDatabase } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import type { JwtPayload } from '@/lib/auth';

// Initialize the database
initDatabase().catch(console.error);

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

interface RouteContext { // Renamed for clarity
  params: { id: string };
}

const deleteHandler = async (req: AuthenticatedRequest, context: RouteContext) => { // Use the context parameter name
  // Directly access id from context.params
  const id = context.params.id;

  try {
    // Validate the ID immediately after accessing it
    if (!id || typeof id !== 'string') {
      console.warn("Invalid message ID received for deletion:", id);
      return NextResponse.json(
        { error: 'Invalid Message ID provided' },
        { status: 400 }
      );
    }

    console.log(`Attempting to delete message with ID: ${id} by user: ${req.user?.username}`);

    const success = await deleteMessage(id); // Await the async DB operation

    if (!success) {
      console.warn(`Message not found for deletion: ${id}`);
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully deleted message: ${id}`);
    return NextResponse.json({ success: true, message: 'Message deleted successfully' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error deleting message ${id}:`, error); // Use the validated id variable
    return NextResponse.json(
      { error: 'Failed to delete message', details: error.message },
      { status: 500 }
    );
  }
};

export const DELETE = withAuth(deleteHandler);

// Explicitly disallow other methods
export async function GET(req: Request, context: RouteContext) { // Use context
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'DELETE' } });
}
export async function POST(req: Request, { params }: RouteContext) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'DELETE' } });
}
export async function PUT(req: Request, { params }: RouteContext) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'DELETE' } });
}
export async function PATCH(req: Request, { params }: RouteContext) {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'DELETE' } });
}