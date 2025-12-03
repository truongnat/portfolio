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

export type GitHubProject = Tables<'github_projects'>;
export type GitHubProjectInsert = TablesInsert<'github_projects'>;
export type GitHubProjectUpdate = TablesUpdate<'github_projects'>;

// Utility types for common query patterns
export type PostWithoutContent = Omit<Post, 'content'>;
export type FeaturedProject = Project & { featured: true };
export type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source';

// GitHub API types
export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  url: string;
}
