'use client';

import { Layout } from '@/components/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Category {
    category: string;
    count: number;
}

export default function TopicsPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = (await response.json()) as Category[];
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
            } finally {
                setIsLoading(false);
            }
        };

        void fetchCategories();
    }, []);

    // Function to handle category selection
    const handleCategoryClick = (category: string) => {
        void router.push({
            pathname: '/home',
            query: { category },
        });
    };

    return (
        <>
            <Head>
                <title>Topics | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Forum Topics</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>View Forum Posts By Topics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="text-center py-4">Loading categories...</div>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {categories.map(category => (
                                        <Button
                                            key={category.category}
                                            variant="outline"
                                            className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground"
                                            onClick={() => handleCategoryClick(category.category)}
                                        >
                                            {category.category}
                                            <Badge variant="outline" className="ml-2">
                                                {category.count}
                                            </Badge>
                                        </Button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
