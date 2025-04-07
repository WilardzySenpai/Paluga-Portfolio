// src/app/api/admin/settings/contact-form/route.ts

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { updateSetting, getSetting } from '@/lib/db'; // Import getSetting too if needed for GET
import { withAuth } from '@/lib/auth';
import type { JwtPayload } from '@/lib/auth';

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

// Schema for the request body
const updateSchema = z.object({
    isActive: z.boolean({ required_error: "isActive (boolean) is required in body" }),
});

// --- GET Handler (Optional but useful for admin panel initial load) ---
const getAdminHandler = async (req: AuthenticatedRequest) => {
     try {
        const setting = await getSetting('contactFormStatus');
        const isActive = setting !== null ? Boolean(setting.value) : false; // Default to false if not set
        return NextResponse.json({ isActive }, { status: 200 });
    } catch (error: any) {
        console.error('Admin: Error fetching contact form setting:', error);
        return NextResponse.json({ error: 'Failed to fetch setting', details: error.message }, { status: 500 });
    }
};

// --- PATCH Handler (To update the setting) ---
const patchHandler = async (req: AuthenticatedRequest) => {
    try {
        const body = await req.json();

        // Validate request body
        const validationResult = updateSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { isActive } = validationResult.data;

        // Update the setting in the database
        const updatedSetting = await updateSetting('contactFormStatus', isActive);

        if (!updatedSetting) {
            throw new Error('Failed to update setting in database.');
        }

        return NextResponse.json(
            { success: true, message: 'Contact form status updated.', isActive: updatedSetting.value },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Admin: Error updating contact form setting:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message || 'Failed to update setting.' },
            { status: 500 }
        );
    }
};

// Apply auth middleware and export handlers
export const GET = withAuth(getAdminHandler);
export const PATCH = withAuth(patchHandler);

// Disallow other methods
export async function POST() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }
export async function PUT() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }