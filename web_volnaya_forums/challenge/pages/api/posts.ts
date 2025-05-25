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

    //   get id from query
    const { id } = req.query ?? null;

    if (!id || Number.isNaN(Number(id))) {
        //   get all posts and reply count
        const posts = db
            .prepare(
                'SELECT posts.*, COUNT(replies.id) as reply_count FROM posts LEFT JOIN replies ON posts.id = replies.post_id GROUP BY posts.id'
            )
            .all() as (Post & { reply_count: number })[];
        return res.status(200).json(posts);
    }

    //   get post by id
    const post = db
        .prepare(
            'SELECT * FROM posts LEFT JOIN replies ON posts.id = replies.post_id WHERE posts.id = ?'
        )
        .get(id) as Post;
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    //   get replies by post id
    const replies = db.prepare('SELECT * FROM replies WHERE post_id = ?').all(id) as Reply[];

    return res.status(200).json({ ...post, replies });
}
