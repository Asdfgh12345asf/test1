import fs from 'fs';
import crypto from 'crypto';
import Database from 'better-sqlite3';

// Create SQLite database
const db = new Database('/app/database.db');
db.pragma('journal_mode = WAL');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT current_timestamp
  )
`);

// Generate secure random password for admin
const adminPassword = crypto.randomBytes(32).toString('hex');

// Insert admin user
const stmt = db.prepare(`
  INSERT OR REPLACE INTO users (username, password, email, role, bio, verified)
  VALUES (?, ?, ?, ?, ?, true)
`);

stmt.run(
    'admin',
    adminPassword,
    'admin@volnaya-forums.htb',
    'admin',
    '<b>Supreme Admin</b> of the forum'
);

console.log('[+] Admin user created');

// Create reports table
db.exec(`
  CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_thread TEXT NOT NULL,
    reason TEXT NOT NULL,
    username TEXT NOT NULL,
    reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TEXT NOT NULL DEFAULT current_timestamp
  )
`);

// insert forum users
const forumUsers = [
    { username: 'MikhailPetrov' },
    { username: 'IrinaSokolova' },
    { username: 'ViktorKim' },
    { username: 'SvetlanaOrlov' },
    { username: 'DmitriIvanov' },
    { username: 'YelenaPak' },
    { username: 'AlexeiMorozov' },
    { username: 'TatianaVolkov' },
    { username: 'SergeiAntonov' },
    { username: 'NataliaZhukova' },
];

const password = crypto.randomBytes(32).toString('hex');
forumUsers.forEach(user => {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO users (username, password, email, role, bio, verified)
        VALUES (?, ?, ?, ?, ?, true)
    `);
    stmt.run(
        user.username,
        password,
        `${user.username}@volnaya-forums.htb`,
        'user',
        'loyal citizen of Volnaya'
    );
});

console.log('[+] Forum users created');

// create categories
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )
`);

const categories = [
    'Daily Life',
    'Achievements of Leadership',
    'Community Events',
    'Work and Productivity',
    'Education and Youth',
    'State Announcements',
    'Patriotic Stories',
    'Questions and Guidance',
];

categories.forEach(category => {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO categories (name)
        VALUES (?)
    `);
    stmt.run(category);
});

console.log('[+] Categories created');

// create posts

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TEXT NOT NULL,
    category VARCHAR(255) NOT NULL
  )
`);

// create replies
db.exec(`
  CREATE TABLE IF NOT EXISTS replies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    date TEXT NOT NULL,
    post_id INTEGER NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id)
  )
`);

const forumPosts = [
    {
        id: '101',
        title: 'A New Monument Unveiled in Central Square',
        content:
            'Today, our beloved leadership unveiled a magnificent new monument in Central Square. The statue stands as a testament to the enduring strength and unity of Volnaya. I was moved to tears by the speech and the crowd’s enthusiasm. Has anyone else visited yet?',
        author: forumUsers[0]?.username,
        date: '2025-05-20T09:00:00Z',
        category: 'Achievements of Leadership',
        replies: [
            {
                id: 'r101-1',
                content:
                    'I was there too! The atmosphere was inspiring. Our leadership’s vision is truly unmatched.',
                author: forumUsers[1]?.username,
                date: '2025-05-20T10:00:00Z',
            },
            {
                id: 'r101-2',
                content:
                    'I brought my children to witness history. We are so fortunate to live in Volnaya.',
                author: forumUsers[2]?.username,
                date: '2025-05-20T10:30:00Z',
            },
        ],
    },
    {
        id: '102',
        title: 'How to Earn More Loyalty Points?',
        content:
            'Comrades, I am eager to serve Volnaya better. What are some ways to increase my loyalty score? I always attend rallies and report suspicious activity, but I want to do more.',
        author: forumUsers[3]?.username,
        date: '2025-05-19T14:00:00Z',
        category: 'Questions and Guidance',
        replies: [
            {
                id: 'r102-1',
                content:
                    'Participating in community clean-ups and writing letters of praise to the state media helps!',
                author: forumUsers[4]?.username,
                date: '2025-05-19T14:30:00Z',
            },
            {
                id: 'r102-2',
                content:
                    'Don’t forget to share positive stories about our leadership online. Every little bit counts.',
                author: forumUsers[5]?.username,
                date: '2025-05-19T15:00:00Z',
            },
        ],
    },
    {
        id: '103',
        title: 'Reflections on the National Unity Parade',
        content:
            'Yesterday’s parade was a powerful reminder of our collective strength. The synchronized marches and banners filled me with pride. What was your favorite part?',
        author: forumUsers[6]?.username,
        date: '2025-05-18T18:00:00Z',
        category: 'Community Events',
        replies: [
            {
                id: 'r103-1',
                content: 'The children’s choir singing the anthem brought tears to my eyes.',
                author: forumUsers[7]?.username,
                date: '2025-05-18T18:30:00Z',
            },
            {
                id: 'r103-2',
                content:
                    'I was impressed by the military’s discipline. Our nation is truly secure.',
                author: forumUsers[8]?.username,
                date: '2025-05-18T19:00:00Z',
            },
        ],
    },
    {
        id: '104',
        title: 'State Guidance on Internet Use',
        content:
            'The recent announcement on proper internet use is a wise step. It is important we all follow the guidelines to protect Volnaya from harmful foreign influences. How do you ensure your family stays safe online?',
        author: forumUsers[9]?.username,
        date: '2025-05-17T12:00:00Z',
        category: 'State Announcements',
        replies: [
            {
                id: 'r104-1',
                content:
                    'I regularly check my children’s browsing history and remind them to avoid unapproved sites.',
                author: forumUsers[0]?.username,
                date: '2025-05-17T12:30:00Z',
            },
            {
                id: 'r104-2',
                content: 'We only use the state’s official news portal. It’s the safest way.',
                author: forumUsers[1]?.username,
                date: '2025-05-17T13:00:00Z',
            },
        ],
    },
    {
        id: '105',
        title: 'Celebrating the Leader’s Birthday',
        content:
            'Our community organized a wonderful celebration for the Leader’s birthday. We decorated the square and sang patriotic songs. It was an honor to participate. How did your neighborhood celebrate?',
        author: forumUsers[2]?.username,
        date: '2025-05-16T16:00:00Z',
        category: 'Patriotic Stories',
        replies: [
            {
                id: 'r105-1',
                content: 'We baked a cake in the Leader’s image and shared it with neighbors.',
                author: forumUsers[3]?.username,
                date: '2025-05-16T16:30:00Z',
            },
            {
                id: 'r105-2',
                content:
                    'Our children performed a play about the Leader’s childhood. It was very moving.',
                author: forumUsers[4]?.username,
                date: '2025-05-16T17:00:00Z',
            },
        ],
    },
    {
        id: '201',
        title: 'Morning Exercise in the Park',
        content: 'Joined the community for morning exercises. Staying healthy for Volnaya!',
        author: forumUsers[5]?.username,
        date: '2025-05-20T07:00:00Z',
        category: 'Daily Life',
        replies: [],
    },
    {
        id: '202',
        title: 'School Children’s Art Contest',
        content: 'Proud to see my daughter’s drawing of the Leader displayed at school.',
        author: forumUsers[6]?.username,
        date: '2025-05-19T11:00:00Z',
        category: 'Education and Youth',
        replies: [],
    },
    {
        id: '203',
        title: 'Neighborhood Clean-Up',
        content:
            'Our block organized a clean-up. It feels good to contribute to our beautiful city.',
        author: forumUsers[7]?.username,
        date: '2025-05-18T09:00:00Z',
        category: 'Community Events',
        replies: [],
    },
    {
        id: '204',
        title: 'State News Broadcast',
        content:
            'The evening news was very informative. I appreciate the updates from our leadership.',
        author: forumUsers[8]?.username,
        date: '2025-05-17T20:00:00Z',
        category: 'State Announcements',
        replies: [],
    },
    {
        id: '205',
        title: 'Workplace Productivity Tips',
        content: 'Sharing tips on how to exceed quotas and support our collective goals.',
        author: forumUsers[9]?.username,
        date: '2025-05-16T08:00:00Z',
        category: 'Work and Productivity',
        replies: [],
    },
    {
        id: '206',
        title: 'Patriotic Song Recommendations',
        content: 'What are your favorite songs to sing at rallies?',
        author: forumUsers[0]?.username,
        date: '2025-05-15T19:00:00Z',
        category: 'Patriotic Stories',
        replies: [],
    },
    {
        id: '207',
        title: 'Question About State Holidays',
        content: 'Is there a list of official state holidays for this year?',
        author: forumUsers[1]?.username,
        date: '2025-05-14T10:00:00Z',
        category: 'Questions and Guidance',
        replies: [],
    },
    {
        id: '208',
        title: 'Thankful for Free Healthcare',
        content: 'Received excellent care at the clinic today. Grateful for our state’s support.',
        author: forumUsers[2]?.username,
        date: '2025-05-13T15:00:00Z',
        category: 'Daily Life',
        replies: [],
    },
    {
        id: '209',
        title: 'Youth Volunteer Program',
        content: 'My son joined the youth volunteer program. Proud of his dedication to Volnaya.',
        author: forumUsers[3]?.username,
        date: '2025-05-12T17:00:00Z',
        category: 'Education and Youth',
        replies: [],
    },
    {
        id: '210',
        title: 'Reminder: Curfew Hours',
        content: 'Let’s all remember to respect the curfew for our safety and unity.',
        author: forumUsers[4]?.username,
        date: '2025-05-11T21:00:00Z',
        category: 'State Announcements',
        replies: [],
    },
];

forumPosts.forEach(post => {
    const stmt = db.prepare(`
        INSERT OR REPLACE INTO posts (id, title, content, author, date, category)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(parseInt(post.id), post.title, post.content, post.author, post.date, post.category);

    post.replies.forEach(reply => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO replies (content, author, date, post_id)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(reply.content, reply.author, reply.date, parseInt(post.id));
    });
});

console.log('[+] Forum posts created');

// Update session secret
const envPath = '/app/.env';
const env = 'SESSION_SECRET=' + crypto.randomBytes(32).toString('hex');
fs.writeFileSync(envPath, env);

console.log('[+] Secrets updated');
