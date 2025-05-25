import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiSession } from '@/lib/session';
import { getDatabase } from '@/lib/database';
import { type Post, type Reply } from '@/types/posts';

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
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    //  get categories and count
    const categories = db
        .prepare('SELECT category, COUNT(*) as count FROM posts GROUP BY category')
        .all() as { category: string; count: number }[];

    return res.status(200).json(categories);
}
