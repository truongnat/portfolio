// Central export for all TypeScript types

export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    description: string;
    date: string;
    published: boolean;
    tags?: string[];
    author?: string;
    coverImage?: string;
    reading_time?: number;
    created_at?: string;
    updated_at?: string;
}

export interface BlogPostMetadata extends Omit<Post, 'id' | 'content'> { }

export interface Project {
    id: string;
    title: string;
    role: string;
    period: string;
    description: string;
    techStack: string[];
    categories: ProjectCategory[];
    achievements: string[];
    link?: string;
}

export type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source' | 'Product';

