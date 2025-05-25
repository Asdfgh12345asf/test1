import { Button } from 'components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'components/ui/card';
import { Layout } from '@/components/layout';
import { Calendar, Plus } from 'lucide-react';
import Head from 'next/head';

export default function ProfilesPage() {
    return (
        <>
            <Head>
                <title>C2 Profiles | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6 p-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">C2 Profiles</h1>
                        <Button className="bg-red-700 text-white hover:bg-red-800">
                            <Plus className="mr-2 h-4 w-4" /> Add New Profile
                        </Button>
                    </div>

                    <Card className="border-zinc-800 bg-zinc-900 text-white shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl">Default HTTP Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">
                                        Profile Name
                                    </p>
                                    <p className="font-mono">Default HTTP</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">
                                        Listener Host
                                    </p>
                                    <p className="font-mono">0.0.0.0</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">
                                        Listener Port
                                    </p>
                                    <p className="font-mono">80</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-zinc-400">User-Agent</p>
                                    <p className="font-mono text-xs">
                                        Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
                                        (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3">
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>Encryption Key Generated on: 2024-02-15 11:30 UTC</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t border-zinc-800 pt-4">
                            <Button
                                variant="outline"
                                className="border-zinc-700 text-zinc-300 hover:text-white"
                            >
                                View/Edit
                            </Button>
                            <Button
                                variant="destructive"
                                className="bg-red-900 text-white hover:bg-red-800 focus-visible:ring-red-500"
                            >
                                Delete
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
