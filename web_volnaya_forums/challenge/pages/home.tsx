'use client';

import { Layout } from '@/components/layout';
import Head from 'next/head';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type Post } from '@/types/posts';

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [posts, setPosts] = useState<(Post & { reply_count: number })[]>([]);
    const router = useRouter();
    const { category } = router.query;
    const categoryValue = typeof category === 'string' ? category : '';

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = (await response.json()) as (Post & { reply_count: number })[];
                // Apply category filter if present in URL
                if (category && typeof category === 'string') {
                    setPosts(data.filter(post => post.category === category));
                } else {
                    setPosts(data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        void fetchPosts();
    }, [router.isReady]);

    const filteredPosts = posts.filter(
        post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Dashboard | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">
                            {categoryValue
                                ? `Filtering Posts for "${categoryValue}"`
                                : 'Trending Discussions'}
                        </h1>
                        <Input
                            className="max-w-xs"
                            placeholder="Search discussions..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {filteredPosts.map(post => (
                            <Card key={post.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>
                                                <Link
                                                    href={`/post/${post.id}`}
                                                    className="hover:underline"
                                                >
                                                    {post.title}
                                                </Link>
                                            </CardTitle>
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
                                            </CardDescription>
                                        </div>
                                        <Badge variant="secondary">{post.category}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {post.content}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            <span>{post.reply_count} replies</span>
                                        </div>
                                        <Link href={`/post/${post.id}`}>
                                            <Button variant="ghost" size="sm">
                                                View Discussion
                                            </Button>
                                        </Link>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}

                        {filteredPosts.length === 0 && (
                            <Card>
                                <CardContent className="py-8 text-center">
                                    <p className="text-muted-foreground">
                                        No discussions found matching your search.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
