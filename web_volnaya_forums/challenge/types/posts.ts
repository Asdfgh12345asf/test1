export interface Reply {
    id: number;
    content: string;
    author: string;
    date: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    date: string;
    category: 'Help' | 'Discussion' | 'DevOps';
    replies: Reply[];
}
