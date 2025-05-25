import type { NextApiRequest, NextApiResponse } from 'next';
import { getApiSession } from '../../lib/session';

type LogoutResponse = {
    success: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<LogoutResponse>) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false });
    }

    // Get the session
    const session = await getApiSession(req, res);

    // Clear the session
    session.destroy();

    return res.status(200).json({ success: true });
}
