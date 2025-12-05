'use server';

import { revalidateTag } from 'next/cache';
import { projectsQuery } from '@/lib/queries';

/**
 * Get featured projects with caching
 * This function uses Next.js unstable_cache for automatic caching
 */
export async function getFeaturedProjects() {
    try {
        const projects = await projectsQuery.getFeatured();
        return projects;
    } catch (error) {
        console.error('Failed to fetch featured projects:', error);
        return [];
    }
}

/**
 * Revalidate projects cache
 * Call this after creating/updating/deleting projects
 */
export async function revalidateProjects() {
    revalidateTag('projects');
}

/**
 * Revalidate posts cache
 * Call this after creating/updating/deleting posts
 */
export async function revalidatePosts() {
    revalidateTag('posts');
}

/**
 * Revalidate GitHub projects cache
 * Call this after syncing GitHub data
 */
export async function revalidateGitHubProjects() {
    revalidateTag('github-projects');
}
