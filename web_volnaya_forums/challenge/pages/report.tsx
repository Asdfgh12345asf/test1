'use client';

import { Layout } from '@/components/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ReportPage() {
    const router = useRouter();
    const { id } = router.query;
    const [postThread, setPostThread] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (id && typeof id === 'string') {
            setPostThread(`/post/${id}`);
        }
    }, [id]);

    const handleReport = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postThread,
                    reason,
                }),
            });

            let data: { message?: string };
            try {
                data = (await response.json()) as { message?: string };
            } catch (e) {
                data = { message: 'Failed to parse server response' };
            }

            if (response.ok) {
                toast.message('Post has been reported to moderators');
                await router.push('/home');
            } else {
                toast.error(data.message ?? 'Failed to report post');
            }
        } catch (error) {
            toast.error('Failed to connect to server');
        }
    };

    return (
        <>
            <Head>
                <title>Report Post | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6 pt-14">
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Report Forum Posts</CardTitle>
                            <CardDescription>
                                {id &&
                                    "Please provide details about why you're reporting this post."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!postThread && (
                                <div className="text-center">
                                    <p>
                                        If you see a forum post that goes against the views and
                                        leadership of Volnaya,
                                    </p>
                                    <p>please report it to us.</p>
                                </div>
                            )}
                            {postThread && (
                                <form onSubmit={handleReport} className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="postThread" className="text-sm font-medium">
                                            Post Thread
                                        </label>
                                        <Input
                                            id="postThread"
                                            value={postThread}
                                            onChange={e => setPostThread(e.target.value)}
                                            placeholder="Enter the thread URL"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="reason" className="text-sm font-medium">
                                            Reason
                                        </label>
                                        <Textarea
                                            id="reason"
                                            value={reason}
                                            onChange={e => setReason(e.target.value)}
                                            placeholder="Please explain why you are reporting this post"
                                            required
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.back()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" variant="default">
                                            Submit Report
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
