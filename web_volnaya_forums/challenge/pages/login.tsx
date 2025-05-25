import { useState } from 'react';
import type React from 'react';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardFooter } from 'components/ui/card';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                void router.push('/home');
            } else {
                const data = (await response.json()) as { message: string };
                toast.error(data.message || 'Authentication failed');
            }
        } catch (err) {
            toast.error('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Login | Volnaya Forums</title>
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Card className="w-full max-w-md space-y-8 p-8">
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <img src="/images/logo-forum.png" className="w-32 h-32" />
                        <h1 className="text-2xl font-bold tracking-tight">Volnaya Forums</h1>
                        <p className="text-sm">Socialize | Empire | Glory</p>
                    </div>
                    {error && <div className="p-3 text-center text-sm">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                value={username}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value)
                                }
                                placeholder="Enter username"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter password"
                                disabled={isLoading}
                            />
                        </div>
                        <Button
                            id="login-button"
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm">
                            Don&apos;t have an account?{' '}
                            <Link
                                href="/register"
                                className="text-black underline hover:text-blue-600"
                            >
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
