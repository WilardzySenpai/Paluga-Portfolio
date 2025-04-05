// premium-portfolio/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) { // Make async
    const token = request.cookies.get('auth_token')?.value;

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!token) {
            // Allow access to the login page itself without a token
            if (request.nextUrl.pathname === '/admin/login') {
                return NextResponse.next();
            }
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

        const user = await verifyToken(token); // Await verification

        if ((!user || user.role !== 'admin') && request.nextUrl.pathname !== '/admin/login') {
            // Clear potentially invalid cookie before redirecting
            const loginUrl = new URL('/admin/login', request.url);
            const response = NextResponse.redirect(loginUrl);
            response.cookies.delete('auth_token');
            return response;
        }

        if (user && user.role === 'admin' && request.nextUrl.pathname === '/admin/login') {
            const dashboardUrl = new URL('/admin/dashboard', request.url);
            return NextResponse.redirect(dashboardUrl);
        }
    }
    return NextResponse.next();
}

// Apply middleware to admin routes
export const config = {
    matcher: ['/admin/:path*'],
};