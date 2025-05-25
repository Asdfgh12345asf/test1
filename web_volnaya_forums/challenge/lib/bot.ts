import puppeteer from 'puppeteer';
import { getDatabase } from '@/lib/database';

const db = getDatabase();
const stmt = db.prepare('SELECT username, password FROM users WHERE username = ?');
const admin = stmt.get('admin') as { username: string; password: string };

const browser_options = {
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
        '--no-sandbox',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--incognito',
        '--safebrowsing-disable-auto-update',
        '--js-flags=--noexpose_wasm,--jitless',
    ],
};

const reviewReport = async (forumThread: string) => {
    const browser = await puppeteer.launch(browser_options);

    try {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();

        // Login
        await page.goto(`http://127.0.0.1:1337/login`, {
            waitUntil: 'networkidle2',
        });

        await page.type('input[id="username"]', admin.username);
        await page.type('input[id="password"]', admin.password);
        await page.click('button[id="login-button"]');

        // wait for networkidle2
        await page.waitForNetworkIdle();

        const postURL =
            'http://127.0.0.1:1337' +
            (forumThread.startsWith('/') ? forumThread : '/' + forumThread);

        await Promise.race([
            page.goto(postURL, {
                waitUntil: 'networkidle2',
            }),
            new Promise(function (resolve) {
                setTimeout(function () {
                    resolve(true);
                }, 7000);
            }),
        ]);

        // review the post
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
        console.error(error);
    } finally {
        await browser.close();
    }
    try {
        const stmt = db.prepare('UPDATE reports SET reviewed = 1 WHERE post_thread = ?');
        stmt.run(forumThread);
    } catch (error) {
        console.error(error);
    }
};

export { reviewReport };
