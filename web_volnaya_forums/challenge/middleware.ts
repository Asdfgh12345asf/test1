import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from './lib/session';

// Public paths that don't require authentication
const PUBLIC_PATHS = [
    '/login',
    '/api/login',
    '/register',
    '/api/register',
    '/api/auth',
    '/_next',
    '/favicon.ico',
    '/images',
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the path is public
    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Check if user is authenticated using iron-session
    const authenticated = await isAuthenticated(request);

    if (!authenticated) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If authenticated, continue
    return NextResponse.next();
}

// Helper function to check if a path is public (doesn't require authentication)
function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'));
}

// Configure middleware to run on all paths
export const config = {
    matcher: [
        /*
         * Match all request paths except static files
         */
        '/((?!_next/static|_next/image|favicon\\.ico).*)',
    ],
};
