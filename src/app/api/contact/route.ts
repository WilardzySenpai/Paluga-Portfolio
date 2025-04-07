// src/app/api/contact/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addMessage } from '@/lib/db';

// Contact form schema (ensure it matches frontend)
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100), // Added max length
  email: z.string().email({ message: "Please enter a valid email address." }).max(100),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }).max(150),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(5000), // Added max length
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body
    const validationResult = formSchema.safeParse(body);

    if (!validationResult.success) {
      console.error('Validation Error:', validationResult.error.format());
      // Return specific validation errors
      return NextResponse.json(
        {
          error: 'Validation failed',
          // Convert ZodError to a simpler structure for the client
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Data is valid, proceed to add message
    const { name, email, subject, message } = validationResult.data;

    // Add the message to the database
    const addedMessage = await addMessage({ name, email, subject, message });

    // Return success response
    return NextResponse.json(
      { success: true, message: "Message received successfully!", data: addedMessage },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Error processing contact form:', error);
    // Handle potential JSON parsing errors
    if (error instanceof SyntaxError) {
        return NextResponse.json(
          { error: 'Invalid JSON payload' },
          { status: 400 }
        );
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message || 'Failed to process submission' },
      { status: 500 }
    );
  }
}

// Explicitly disallow GET for this endpoint
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405, headers: { 'Allow': 'POST' } }
  );
}

// Add OPTIONS handler for CORS preflight requests if needed (especially if frontend/backend are on different origins)
// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: {
//       'Allow': 'POST, OPTIONS',
//       'Access-Control-Allow-Origin': '*', // Be more specific in production
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type',
//     },
//   });
// }