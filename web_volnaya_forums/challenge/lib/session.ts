import { getIronSession } from 'iron-session';
import type { SessionOptions } from 'iron-session';
import type { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export interface SessionUser {
    username: string;
    role: string;
    isLoggedIn: boolean;
}

// Define session data interface
export interface SessionData {
    user?: SessionUser;
}

// Session configuration
export const sessionOptions: SessionOptions = {
    password:
        process.env.SESSION_SECRET ??
        '86060015409b3fccc0d1bf4a0e8e938739995cf170871b793fddfb6d54a36c22',
    cookieName: 'session',
    cookieOptions: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    },
};

// Get session for Next.js Edge middleware (works in middleware.ts)
export async function getEdgeSession(req: NextRequest) {
    const res = new Response();
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    return { session, res };
}

// Get session for API routes
export async function getApiSession(req: NextApiRequest, res: NextApiResponse) {
    return await getIronSession<SessionData>(req, res, sessionOptions);
}

// Helper function to check if user is authenticated (for middleware)
export async function isAuthenticated(req: NextRequest): Promise<boolean> {
    const { session } = await getEdgeSession(req);
    return !!session.user?.isLoggedIn;
}

// Helper function to check if user is admin (for middleware)
export async function isAdmin(req: NextRequest): Promise<boolean> {
    const { session } = await getEdgeSession(req);
    return !!session.user?.isLoggedIn && session.user.role === 'admin';
}
