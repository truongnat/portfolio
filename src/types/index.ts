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
    description: string;
    tech_stack: string[];
    categories: ProjectCategory[];
    screenshot: string | null;
    live_url: string | null;
    github_url?: string | null;
    featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source';

