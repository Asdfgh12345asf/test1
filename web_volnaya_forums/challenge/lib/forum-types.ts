export interface Author {
    id: string;
    name: string;
    avatar: string;
}

export interface Reply {
    id: string;
    content: string;
    author: Author;
    date: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: Author;
    date: string;
    category: 'Help' | 'Discussion' | 'DevOps';
    replies: Reply[];
}

export interface ForumData {
    posts: Post[];
}
