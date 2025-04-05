// src/app/api/admin/profile/change-password/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getUserById, updateUserPassword, initDatabase } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import type { JwtPayload } from '@/lib/auth';

// Initialize DB
initDatabase().catch(console.error);

// Schema for password change request body
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, { message: 'Current password is required.' }),
    newPassword: z.string().min(8, { message: 'New password must be at least 8 characters long.' }),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ["confirmPassword"], // Attach error to the confirmation field
});

// Extend Request type if `withAuth` adds user property
interface AuthenticatedRequest extends Request {
    user?: JwtPayload; // User payload from verified JWT
}

// PATCH handler for changing password
const changePasswordHandler = async (req: AuthenticatedRequest) => {
    try {
        // Get user ID from the authenticated session
        const userId = req.user?.userId;
        if (!userId) {
            // This shouldn't happen if withAuth is working, but good practice
            console.error('Change password API called without authenticated user ID.');
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        const body = await req.json();

        // Validate request body
        const validationResult = passwordChangeSchema.safeParse(body);
        if (!validationResult.success) {
            console.warn(`Password change validation failed for user ${userId}:`, validationResult.error.flatten());
            return NextResponse.json(
                { error: 'Validation failed', details: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { currentPassword, newPassword } = validationResult.data;

        // Fetch the current user data from DB
        const currentUser = await getUserById(userId);
        if (!currentUser) {
            console.error(`Authenticated user ${userId} not found in DB during password change.`);
            return NextResponse.json({ error: 'User not found.' }, { status: 404 });
        }

        // Verify the current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.passwordHash);
        if (!isCurrentPasswordValid) {
            console.warn(`Incorrect current password provided for user ${userId}.`);
            return NextResponse.json(
                {
                    error: 'Validation failed',
                    details: { currentPassword: ['Incorrect current password.'] }
                },
                { status: 400 } // Use 400 for validation error
            );
        }

        // Update the password in the database (updateUserPassword handles hashing)
        const updateSuccess = await updateUserPassword(userId, newPassword);

        if (!updateSuccess) {
            console.error(`Failed to update password in DB for user ${userId}.`);
            throw new Error('Failed to update password in database.');
        }

        console.log(`Password successfully changed for user ${userId}.`);
        // Optionally: Force logout or token refresh here if needed
        return NextResponse.json({ success: true, message: 'Password updated successfully.' }, { status: 200 });

    } catch (error: any) {
        console.error('Error changing password:', error);
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message || 'Failed to change password.' },
            { status: 500 }
        );
    }
};

// Apply auth middleware and export PATCH handler
export const PATCH = withAuth(changePasswordHandler);

// Disallow other methods
export async function GET() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'PATCH' } }); }
export async function POST() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'PATCH' } }); }
export async function PUT() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'PATCH' } }); }
export async function DELETE() { return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405, headers: { Allow: 'PATCH' } }); }