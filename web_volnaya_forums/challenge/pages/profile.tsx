'use client';

import { Layout } from '@/components/layout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Editor from '@/components/rich-text/editor';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Edit, X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Profile {
    username: string;
    email: string;
    bio: string;
    created_at?: string;
    last_seen?: string;
}

interface ProfileUpdateData {
    username: string;
    email: string;
    bio: string;
}

interface Preferences {
    timezone: string;
    language: string;
}

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Russian' },
    { code: 'zh', label: 'Chinese' },
    { code: 'ko', label: 'Korean' },
];

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<Profile>({
        username: '',
        email: '',
        bio: '',
        created_at: '',
        last_seen: new Date().toISOString(),
    });
    const [preferences, setPreferences] = useState<Preferences>({
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone === 'UTC' ? 'UTC' : 'local',
        language: 'en',
    });

    useEffect(() => {
        void loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await fetch('/api/profile?t=' + new Date().getTime());
            if (!response.ok) throw new Error('Failed to load profile');

            const data = (await response.json()) as Profile;

            setProfile({
                username: data.username,
                email: data.email,
                bio: data.bio ?? '',
                created_at: data.created_at,
                last_seen: new Date().toISOString(),
            });
        } catch (error) {
            console.error(
                'Error loading profile:',
                error instanceof Error ? error.message : 'Unknown error'
            );
            toast.error('Failed to load profile information');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);
            const updateData: ProfileUpdateData = {
                username: profile.username,
                email: profile.email,
                bio: profile.bio,
            };

            const response = await fetch('/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            const data = (await response.json()) as Profile;
            toast.success('Profile updated successfully');
            setProfile({
                ...data,
                created_at: profile.created_at,
                last_seen: profile.last_seen,
            });
            setIsEditing(false);
        } catch (error) {
            console.error(
                'Error updating profile:',
                error instanceof Error ? error.message : 'Unknown error'
            );
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const updatePreferences = async (type: 'timezone' | 'language', value: string) => {
        const newPreferences = { ...preferences, [type]: value };
        setPreferences(newPreferences);
    };

    return (
        <>
            <Head>
                <title>Profile | Volnaya Forums</title>
                <meta name="author" content="rayhan0x01" />
            </Head>
            <Layout>
                <div className="space-y-6 pt-12">
                    <Card className="mb-12">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>User Profile</CardTitle>
                                {!isEditing ? (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-pointer"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                ) : null}
                            </div>
                        </CardHeader>
                        <CardContent suppressHydrationWarning={true}>
                            {!isEditing ? (
                                <div className="space-y-4 mx-auto max-w-[600px]">
                                    <h3 className="text-xl font-bold mb-3">Profile Information</h3>

                                    <div className="space-y-2">
                                        <Label className="">Username</Label>
                                        <p className="text-lg">{profile.username}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <p className="text-lg">{profile.email}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Bio</Label>
                                        {profile.bio ? (
                                            <div
                                                className="prose"
                                                dangerouslySetInnerHTML={{ __html: profile.bio }}
                                            />
                                        ) : (
                                            <p className="text-muted-foreground">Not specified</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Created At</Label>
                                        <p className="text-lg">
                                            {profile.created_at
                                                ? new Date(profile.created_at).toLocaleString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Last Seen Online</Label>
                                        <p className="text-lg">
                                            {new Date(
                                                profile.last_seen ?? Date.now()
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 mx-auto max-w-[600px]"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-xl font-bold">
                                            Update Profile Information
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            <X className="h-5 w-5 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={profile.username}
                                            onChange={e =>
                                                setProfile(prev => ({
                                                    ...prev,
                                                    username: e.target.value,
                                                }))
                                            }
                                            placeholder="Your username"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profile.email}
                                            onChange={e =>
                                                setProfile(prev => ({
                                                    ...prev,
                                                    email: e.target.value,
                                                }))
                                            }
                                            placeholder="Your email"
                                        />
                                    </div>

                                    <div className="space-y-2 flex flex-col gap-2 h-[300px]">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Editor
                                            content={profile.bio}
                                            onChange={value => {
                                                if (value.length > 1000) {
                                                    toast.error(
                                                        'Bio cannot exceed 1000 characters'
                                                    );
                                                    return;
                                                }
                                                setProfile(prev => ({ ...prev, bio: value }));
                                            }}
                                            placeholder="Write something about yourself..."
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Maximum 1000 characters
                                        </p>
                                    </div>

                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Updating...' : 'Update Profile'}
                                    </Button>
                                </form>
                            )}

                            <div className="mt-12 mx-auto max-w-[600px] mb-12">
                                <h3 className="text-xl font-bold mb-3">Site Preferences</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Select Timezone</Label>
                                        <Select
                                            value={preferences.timezone}
                                            onValueChange={(value: string) =>
                                                void updatePreferences('timezone', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timezone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UTC">UTC</SelectItem>
                                                <SelectItem value="local">
                                                    Local Timezone (
                                                    {
                                                        Intl.DateTimeFormat().resolvedOptions()
                                                            .timeZone
                                                    }
                                                    )
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="language">Select Language</Label>
                                        <Select
                                            value={preferences.language}
                                            onValueChange={(value: string) =>
                                                void updatePreferences('language', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {LANGUAGES.map(lang => (
                                                    <SelectItem key={lang.code} value={lang.code}>
                                                        {lang.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>
        </>
    );
}
