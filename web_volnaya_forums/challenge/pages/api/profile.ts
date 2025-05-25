import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiSession } from '@/lib/session';
import { getDatabase } from '@/lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //   get session
    const session = await getApiSession(req, res);

    //   check if user is logged in
    if (!session.user?.isLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // get database
    const db = getDatabase();

    //   get user profile
    if (req.method === 'GET') {
        const user = await db
            .prepare('SELECT username, email, bio, created_at FROM users WHERE username = ?')
            .get(session.user.username);

        return res.status(200).json(user);
    }

    //   update user profile
    if (req.method === 'POST') {
        const { username, email, bio } = req.body as {
            username: string;
            email: string;
            bio: string;
        };

        try {
            db.prepare('UPDATE users SET email = ?, bio = ? WHERE username = ?').run(
                email,
                bio,
                username
            );

            // Fetch and return the updated user data
            const updatedUser = await db
                .prepare('SELECT username, email, bio FROM users WHERE username = ?')
                .get(username);
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    }
}
