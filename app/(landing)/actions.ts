'use server';

import { projectsQuery } from '@/lib/queries';

export async function getFeaturedProjects() {
    try {
        const projects = await projectsQuery.getFeatured();
        return projects;
    } catch (error) {
        console.error('Failed to fetch featured projects:', error);
        return [];
    }
}
