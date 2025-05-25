import { getDatabase } from './database';
import type { DatabaseUser } from './database';

export interface User {
    username: string;
    password: string;
    email: string;
    role: string;
    verified: boolean;
}

/**
 * Authenticates a user against the SQLite database
 */
export async function authenticateUser(username: string, password: string): Promise<User | null> {
    try {
        const db = getDatabase();
        const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ? limit 1');
        const user: DatabaseUser | undefined = stmt.get([username, password]) as
            | DatabaseUser
            | undefined;

        if (user) {
            return {
                username: user.username,
                password: user.password,
                email: user.email,
                role: user.role,
                verified: user.verified,
            };
        }

        return null;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}
