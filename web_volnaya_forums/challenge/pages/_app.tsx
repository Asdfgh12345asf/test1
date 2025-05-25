import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from '@/components/ui/sonner';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} suppressHydrationWarning />
            <Toaster />
        </>
    );
}
