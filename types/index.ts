// Central export for all TypeScript types
export * from './database';

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
