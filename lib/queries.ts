import { unstable_cache } from 'next/cache';
import type { Project, GitHubProject } from '@/types';

// Projects queries with Next.js caching
// Note: These queries require Supabase to be configured
// If Supabase is not available, they will return empty arrays
export const projectsQuery = {
    getAll: unstable_cache(
        async () => {
            // Supabase removed - return empty array
            // To re-enable, configure Supabase and restore query logic
            return [] as Project[];
        },
        ['projects-get-all'],
        { tags: ['projects'], revalidate: 3600 }
    ),

    getFeatured: unstable_cache(
        async () => {
            // Supabase removed - return empty array
            // To re-enable, configure Supabase and restore query logic
            return [] as Project[];
        },
        ['projects-get-featured'],
        { tags: ['projects'], revalidate: 3600 }
    ),

    getByCategory: (category: string) => unstable_cache(
        async () => {
            // Supabase removed - return empty array
            // To re-enable, configure Supabase and restore query logic
            return [] as Project[];
        },
        ['projects-get-by-category', category],
        { tags: ['projects', `category-${category}`], revalidate: 3600 }
    )(),
};

// GitHub projects queries with Next.js caching
// Note: These queries require Supabase to be configured
// If Supabase is not available, they will return empty arrays
export const githubProjectsQuery = {
    getAll: unstable_cache(
        async () => {
            // Supabase removed - return empty array
            // To re-enable, configure Supabase and restore query logic
            return [] as GitHubProject[];
        },
        ['github-projects-get-all'],
        { tags: ['github-projects'], revalidate: 3600 }
    ),

    getTop: (limit: number = 12) => unstable_cache(
        async () => {
            // Supabase removed - return empty array
            // To re-enable, configure Supabase and restore query logic
            return [] as GitHubProject[];
        },
        ['github-projects-get-top', `limit-${limit}`],
        { tags: ['github-projects'], revalidate: 3600 }
    )(),

    upsert: async (project: any) => {
        // Supabase removed - throw error
        // To re-enable, configure Supabase and restore query logic
        throw new Error('Supabase not configured - cannot upsert GitHub projects');
    },
};
