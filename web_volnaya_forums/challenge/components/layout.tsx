import type React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, HomeIcon, BookOpen, User, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen items-center justify-center px-10 py-5 gap-8 max-w-[1400px] mx-auto">
            {/* Sidebar */}
            <Card className="w-full flex flex-row px-4 items-center">
                <img
                    src="/images/logo-forum.png"
                    className="w-16 h-16 me-10"
                    alt="Volnaya Forums"
                />

                <nav className="px-2 py-2 space-x-4 flex flex-row">
                    <Link
                        href="/home"
                        className={`flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 ${
                            router.pathname === '/home'
                                ? 'bg-primary text-primary-foreground shadow-sm border'
                                : 'text-black hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm'
                        }`}
                    >
                        <HomeIcon className="mr-3 h-5 w-5" />
                        Home
                    </Link>

                    <Link
                        href="/topics"
                        className={`flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 ${
                            router.pathname === '/topics'
                                ? 'bg-primary text-primary-foreground shadow-sm border'
                                : 'text-black hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm'
                        }`}
                    >
                        <BookOpen className="mr-3 h-5 w-5" />
                        Topics
                    </Link>
                    <Link
                        href="/report"
                        className={`flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 ${
                            router.pathname === '/report'
                                ? 'bg-primary text-primary-foreground shadow-sm border'
                                : 'text-black hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm'
                        }`}
                    >
                        <AlertCircle className="mr-3 h-5 w-5" />
                        Report
                    </Link>
                    <Link
                        href="/profile"
                        className={`flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 ${
                            router.pathname === '/profile'
                                ? 'bg-primary text-primary-foreground shadow-sm border'
                                : 'text-black hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm'
                        }`}
                    >
                        <User className="mr-3 h-5 w-5" />
                        Profile
                    </Link>
                </nav>
                <div className="ms-auto p-4 py-2">
                    <Link
                        href="/login"
                        className="flex items-center px-2 py-2 text-sm rounded-md transition-all duration-200 text-black hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm"
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Logout
                    </Link>
                </div>
            </Card>

            {/* Main content */}
            <div className="flex flex-col flex-grow w-full">
                <div className="flex-1 md:pt-0 pt-16">{children}</div>
            </div>
        </div>
    );
}
