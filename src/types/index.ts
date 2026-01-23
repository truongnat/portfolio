// Central export for all TypeScript types
export * from './database';
import { Tables, TablesInsert, TablesUpdate } from './database';

// Application-level type aliases for convenience
export type Post = Tables<'posts'>;
export type PostInsert = TablesInsert<'posts'>;
export type PostUpdate = TablesUpdate<'posts'>;

export type Project = Tables<'projects'>;
export type ProjectInsert = TablesInsert<'projects'>;
export type ProjectUpdate = TablesUpdate<'projects'>;

// Utility types for common query patterns
export type PostWithoutContent = Omit<Post, 'content'>;
export type FeaturedProject = Project & { featured: true };
export type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source';

