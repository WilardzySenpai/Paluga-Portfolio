// src/app/api/messages/[id]/read/route.ts

import { NextResponse } from 'next/server';
import { markMessageAsRead, initDatabase } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import type { JwtPayload } from '@/lib/auth';

// Initialize the database
initDatabase().catch(console.error);

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

interface RouteContext {
    params: { id: string } | Promise<{ id: string }>;
}

// PATCH: Mark a message as read (protected)
const patchHandler = async (req: AuthenticatedRequest, context: RouteContext) => {

  try {

    const resolvedContext = await context;
    const resolvedParams = resolvedContext.params;

    const awaitedParams = await context.params;
    const id = awaitedParams.id;

    // Validate the ID immediately after accessing it
    if (!id || typeof id !== 'string') {
      console.warn("Invalid message ID received:", id);
      return NextResponse.json(
        { error: 'Invalid Message ID provided' },
        { status: 400 }
      );
    }

    console.log(`Attempting to mark message as read: ${id} by user: ${req.user?.username}`);

    const success = await markMessageAsRead(id); // Await the async DB operation

    if (!success) {
      console.warn(`Message not found to mark as read: ${id}`);
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    console.log(`Successfully marked message as read: ${id}`);
    return NextResponse.json({ success: true, message: 'Message marked as read' }, { status: 200 });

  } catch (error: any) {
    console.error(`Error marking message`, error); // Use the validated id variable
    return NextResponse.json(
      { error: 'Failed to update message status', details: error.message },
      { status: 500 }
    );
  }
};

export const PATCH = withAuth(patchHandler);

// Explicitly disallow other methods
export async function GET(req: Request, { params }: RouteContext) {
   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'PATCH' } });
}
export async function POST(req: Request, { params }: RouteContext) {
   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'PATCH' } });
}
export async function PUT(req: Request, { params }: RouteContext) {
   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'PATCH' } });
}
export async function DELETE(req: Request, { params }: RouteContext) {
   return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { 'Allow': 'PATCH' } });
}