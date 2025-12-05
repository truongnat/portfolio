'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

/**
 * Cache revalidation utilities
 * Use these functions to invalidate caches after mutations
 */

// Revalidate all posts cache
export async function revalidatePostsCache() {
    revalidateTag('posts');
    revalidatePath('/blog');
}

// Revalidate specific post cache
export async function revalidatePostCache(slug: string) {
    revalidateTag(`post-${slug}`);
    revalidateTag('posts');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/blog');
}

// Revalidate all projects cache
export async function revalidateProjectsCache() {
    revalidateTag('projects');
    revalidatePath('/');
}

// Revalidate specific category cache
export async function revalidateCategoryCache(category: string) {
    revalidateTag(`category-${category}`);
    revalidateTag('projects');
    revalidatePath('/');
}

// Revalidate all GitHub projects cache
export async function revalidateGitHubProjectsCache() {
    revalidateTag('github-projects');
    revalidatePath('/');
}

// Revalidate everything
export async function revalidateAll() {
    revalidateTag('posts');
    revalidateTag('projects');
    revalidateTag('github-projects');
    revalidatePath('/', 'layout');
}
