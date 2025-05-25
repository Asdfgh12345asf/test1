'use client';

import { useState } from 'react';
import type React from 'react';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Label } from 'components/ui/label';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardFooter } from 'components/ui/card';
import Link from 'next/link';

import { toast } from 'sonner';

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                void router.push('/login');
            } else {
                const data = (await response.json()) as { message: string };
                toast.error(data.message);
            }
        } catch (err) {
            console.error(err);
            toast.error('An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Register | Volnaya Forums</title>
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Card className="w-full max-w-md space-y-8 p-8">
                    <div className="flex flex-col items-center justify-center space-y-2 text-center">
                        <img
                            src="/images/logo-forum.png"
                            className="w-32 h-32"
                            alt="Volnaya Forums"
                        />
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
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter email"
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
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </form>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-black underline hover:text-blue-600"
                            >
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
