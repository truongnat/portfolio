// Central export for all TypeScript types

export interface Post {
    id: string;
    title: string;
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

export type BlogPostMetadata = Omit<Post, 'content'> & {
    slug: string; // We map id to slug in pages/index.astro
};

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
