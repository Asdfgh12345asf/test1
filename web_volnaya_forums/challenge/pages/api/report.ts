import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiSession } from '@/lib/session';
import { getDatabase } from '@/lib/database';
import { reviewReport } from '@/lib/bot';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    //   get session
    const session = await getApiSession(req, res);

    //   check if user is logged in
    if (!session.user?.isLoggedIn) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // get database
    const db = getDatabase();

    if (req.method !== 'POST') {
        return res.status(400).json({ error: 'Invalid request method' });
    }

    // check if there is already unreviewed report
    const unreviewedReports = (await db
        .prepare('SELECT COUNT(*) FROM reports WHERE reviewed = 0')
        .get()) as { count: number };
    if (unreviewedReports.count >= 0) {
        return res
            .status(429)
            .json({ error: 'Please wait for previous reports to be reviewed first' });
    }

    const { postThread, reason } = req.body as { postThread: string; reason: string };

    // save report to database
    const stmt = db.prepare(
        'INSERT INTO reports (post_thread, reason, username, reviewed) VALUES (?, ?, ?, 0)'
    );
    stmt.run(postThread, reason, session.user.username);

    // review report in background
    void reviewReport(postThread);

    return res.status(200).json({ message: 'Report submitted for review successfully' });
}
