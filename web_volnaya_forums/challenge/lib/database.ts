import Database from 'better-sqlite3';

// Database singleton
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
    if (!db) {
        db = new Database('./database.db');
        db.pragma('journal_mode = WAL');
    }
    return db;
}

// Export types
export interface DatabaseUser {
    username: string;
    password: string;
    email: string;
    role: string;
    verified: boolean;
}
