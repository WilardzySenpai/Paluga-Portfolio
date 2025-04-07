// src/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, type JwtPayload } from '@/lib/auth'; // Assuming verifyToken is async and types exported

// export const runtime = 'nodejs'; // Force Node.js runtime, disabling Edge

const ADMIN_LOGIN_URL = '/admin/login';
const ADMIN_DASHBOARD_URL = '/admin/dashboard';
const API_ADMIN_PREFIX = '/api/admin/'; // Check specifically for API routes

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Check if the request is for an API route within the admin area
    const isApiRoute = pathname.startsWith(API_ADMIN_PREFIX);

    // If it's not an /admin route at all, allow immediately
    // The matcher should handle this, but belt-and-suspenders
    if (!pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    // --- Handle No Token ---
    if (!token) {
        // Allow access to the login page itself without a token
        if (pathname === ADMIN_LOGIN_URL) {
            return NextResponse.next();
        }

        // *** FIX: For API routes, return 401 JSON, not redirect ***
        if (isApiRoute) {
            console.log(`Middleware: No token for API route ${pathname}. Returning 401 JSON.`);
            // Use NextResponse.json for convenience
            return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
        }

        // For regular page routes, redirect to login
        console.log(`Middleware: No token for page route ${pathname}. Redirecting to login.`);
        const loginUrl = new URL(ADMIN_LOGIN_URL, request.url);
        return NextResponse.redirect(loginUrl);
    }

    // --- Handle Token Verification ---
    let user: JwtPayload | null = null;
    try {
        user = await verifyToken(token); // Await verification
    } catch (error) {
        console.error('Middleware: Error verifying token:', error);
        // Treat verification error as invalid token
    }

    const isAdmin = user?.role === 'admin';

    // --- Handle Invalid Token or Not Admin ---
    if (!isAdmin) {
        // If already on the login page, don't redirect loop (though clear cookie)
        if (pathname === ADMIN_LOGIN_URL) {
             const response = NextResponse.next();
             console.log(`Middleware: Invalid token/not admin on login page. Deleting cookie.`);
             response.cookies.delete('auth_token');
             return response;
        }

        // *** FIX: For API routes, return 401 JSON, not redirect ***
        if (isApiRoute) {
            console.log(`Middleware: Invalid token/not admin for API route ${pathname}. Returning 401 JSON.`);
            const response = NextResponse.json(
                { error: 'Authentication required or insufficient privileges.' },
                { status: 401 }
            );
            // Also clear the invalid cookie
            response.cookies.delete('auth_token');
            return response;
        }

        // For regular page routes, redirect to login & clear cookie
        console.log(`Middleware: Invalid token/not admin for page route ${pathname}. Redirecting to login.`);
        const loginUrl = new URL(ADMIN_LOGIN_URL, request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('auth_token');
        return response;
    }

    // --- Handle Valid Admin Token ---

    // If admin is trying to access login page, redirect to dashboard
    if (pathname === ADMIN_LOGIN_URL) {
        console.log(`Middleware: Admin accessing login page. Redirecting to dashboard.`);
        return NextResponse.redirect(new URL(ADMIN_DASHBOARD_URL, request.url));
    }

    // If it's an admin accessing any other valid /admin route (page or API), allow
    // console.log(`Middleware: Admin access granted for ${pathname}.`); // Optional: can be noisy
    return NextResponse.next();
}

// Keep the same matcher - it correctly selects all /admin paths
export const config = {
    matcher: ['/admin/:path*'],
};