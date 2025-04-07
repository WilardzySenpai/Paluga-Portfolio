// src/app/api/settings/contact-form/route.ts

import { NextResponse } from 'next/server';
import { getSetting } from '@/lib/db';

// Default value if the setting is not found in the DB
const DEFAULT_CONTACT_FORM_STATUS = false;

export async function GET() {
    try {
        const setting = await getSetting('contactFormStatus');

        // Determine the status: use the DB value if found, otherwise use the default
        const isActive = setting !== null ? Boolean(setting.value) : DEFAULT_CONTACT_FORM_STATUS;

        return NextResponse.json({ isActive }, { status: 200 });

    } catch (error: any) {
        console.error('Error fetching contact form setting:', error);
        // Return the default status even on error to avoid breaking the contact form display
        return NextResponse.json(
            {
                error: 'Failed to fetch setting',
                details: error.message,
                // Still return a default status for the frontend
                isActive: DEFAULT_CONTACT_FORM_STATUS
            },
            { status: 500 }
        );
    }
}

// Disallow other methods
export async function POST() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }
export async function PUT() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }
export async function PATCH() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 }); }