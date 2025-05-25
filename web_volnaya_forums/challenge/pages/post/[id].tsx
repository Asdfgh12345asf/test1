'use client';

import { Layout } from '@/components/layout';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, MessageSquare, Send, User, ThumbsUp, Flag } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { type Post, type Reply } from '@/types/posts';
import Link from 'next/link';

export default function PostDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [replyContent, setReplyContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [post, setPost] = useState<Post | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id || Array.isArray(id)) return;

            try {
                const response = await fetch(`/api/posts?id=${id}`);
                const data = (await response.json()) as Post | { error: string };
                if ('error' in data) {
                    toast.error(data.error);
                    return;
                }
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
                toast.error('Failed to load post');
            } finally {
                setIsLoading(false);
            }
        };

        if (router.isReady) {
            void fetchPost();
        }
    }, [id, router.isReady]);

    useEffect(() => {
        if (!isLoading && !post) {
            void router.push('/home');
        }
    }, [post, isLoading, router]);

    // If still loading, show loading state
    if (isLoading) {
        return <Layout>Loading...</Layout>;
    }

    // If post is not found, the useEffect will handle navigation
    if (!post) {
        return null;
    }

    const handleSubmitReply = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        toast.error('Your account must be verified to reply to posts.');

        // Clear the form
        setReplyContent('');
    };

    return (
        <>
            <Head>
                <title>{post.title} | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Link href="/home">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Back to Discussions
                            </Button>
                        </Link>
                    </div>

                    {/* Main post */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{post.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback>
                                                <User className="h-3 w-3" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{post.author}</span>
                                        <span>•</span>
                                        <span>
                                            {formatDistanceToNow(new Date(post.date), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                        <span>•</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            Like
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Reply
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 px-2"
                                            onClick={() => router.push(`/report?id=${post.id}`)}
                                        >
                                            <Flag className="h-4 w-4 mr-1" />
                                            Report
                                        </Button>
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary">{post.category}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap">{post.content}</p>
                        </CardContent>
                    </Card>

                    {/* Replies section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            <h2 className="text-xl font-semibold">
                                Replies ({post.replies.length})
                            </h2>
                        </div>

                        {post.replies.map((reply: Reply) => (
                            <Card key={reply.id}>
                                <CardHeader className="pb-2">
                                    <CardDescription className="flex items-center gap-2">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback>
                                                <User className="h-3 w-3" />
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{reply.author}</span>
                                        <span>•</span>
                                        <span>
                                            {formatDistanceToNow(new Date(reply.date), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                        <span>•</span>
                                        <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            Like
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-6 px-2">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            Reply
                                        </Button>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line">{reply.content}</p>
                                </CardContent>
                            </Card>
                        ))}

                        {post.replies.length === 0 && (
                            <Card>
                                <CardContent className="py-6 text-center">
                                    <p className="text-muted-foreground">
                                        No replies yet. Be the first to reply!
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Reply form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Post a Reply</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmitReply}>
                                <Textarea
                                    placeholder="Write your reply here..."
                                    className="min-h-[80px]"
                                    value={replyContent}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                        setReplyContent(e.target.value)
                                    }
                                />
                                <Button className="mt-4" type="submit">
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Reply
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
