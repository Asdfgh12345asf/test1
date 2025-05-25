import type { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '../../lib/database';

type RegisterResponse = {
    success: boolean;
    message?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    try {
        const { username, password, email } = req.body as {
            username: string;
            password: string;
            email: string;
        };

        // Validate input
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, password, and email are required',
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
            });
        }

        const db = getDatabase();

        // Check if username already exists
        const existingUser = db
            .prepare('SELECT username FROM users WHERE username = ?')
            .get([username]);
        if (existingUser) {
            console.log(existingUser);
            return res.status(400).json({
                success: false,
                message: 'Username already exists',
            });
        }

        // Insert new user
        const stmt = db.prepare(
            'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)'
        );
        stmt.run([username, password, email, 'user']);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
