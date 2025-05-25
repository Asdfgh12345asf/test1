import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUser } from '@/lib/authentication';
import { getApiSession } from '@/lib/session';
import type { SessionUser } from '@/lib/session';

type LoginResponse = {
    success: boolean;
    message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body as { username: string; password: string };

        // Validate input
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
            });
        }

        // Authenticate user against admin.json
        const user = await authenticateUser(username, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password',
            });
        }

        // Get session
        const session = await getApiSession(req, res);

        // Set session data
        session.user = {
            username: user.username,
            role: user.role,
            isLoggedIn: true,
            verified: user.verified,
        } as SessionUser;

        // Save session
        await session.save();

        // Return success
        return res.status(200).json({
            success: true,
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
