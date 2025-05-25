import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiSession } from '@/lib/session';
import fs from 'fs';

const flag = fs.readFileSync('/flag.txt', 'utf8').trim();

type AuthResponse = {
    authenticated: boolean;
    user?: {
        username: string;
        role: string;
        flag?: string;
    };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ authenticated: false });
    }

    // Get the session
    const session = await getApiSession(req, res);

    // Check if user is logged in
    if (!session.user?.isLoggedIn) {
        return res.status(200).json({ authenticated: false });
    }

    // Return authentication status and user information
    return res.status(200).json({
        authenticated: true,
        user: {
            username: session.user.username,
            role: session.user.role,
            ...(session.user.username === 'admin' ? { flag } : {}),
        },
    });
}
