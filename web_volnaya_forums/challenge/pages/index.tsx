'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Check authentication status when the component mounts
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth?t=' + new Date().getTime());
                const data = (await response.json()) as { authenticated: boolean };

                if (data.authenticated) {
                    void router.push('/profile');
                } else {
                    void router.push('/login');
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                void router.push('/login');
            }
        };

        void checkAuth();
    }, [router]);

    return (
        <>
            <Head>
                <title>Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <div className="flex min-h-screen items-center justify-center bg-black">
                {/* Loading indicator */}
            </div>
        </>
    );
}
