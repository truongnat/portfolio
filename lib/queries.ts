import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { supabase } from '@/lib/supabase';
import type { Post, Project, GitHubProject } from '@/types';

// Posts queries
export const postsQuery = {
    getAll: cache(unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data as Post[];
        },
        ['posts-get-all'],
        { tags: ['posts'], revalidate: 60 }
    )),

    getBySlug: cache(unstable_cache(
        async (slug: string) => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('slug', slug)
                .lte('published_at', new Date().toISOString())
                .single();

            if (error) throw error;
            return data as Post;
        },
        ['posts-get-by-slug'],
        { tags: ['posts'], revalidate: 60 }
    )),

    getPaginated: cache(unstable_cache(
        async (page: number = 1, pageSize: number = 10) => {
            const from = (page - 1) * pageSize;
            const to = from + pageSize - 1;

            const { data, error, count } = await supabase
                .from('posts')
                .select('*', { count: 'exact' })
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false })
                .range(from, to);

            if (error) throw error;
            return { data: data as Post[], count: count || 0 };
        },
        ['posts-get-paginated'],
        { tags: ['posts'], revalidate: 60 }
    )),

    getByTag: cache(unstable_cache(
        async (tag: string) => {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .contains('tags', [tag])
                .lte('published_at', new Date().toISOString())
                .order('published_at', { ascending: false });

            if (error) throw error;
            return data as Post[];
        },
        ['posts-get-by-tag'],
        { tags: ['posts'], revalidate: 60 }
    )),
};

// Projects queries
export const projectsQuery = {
    getAll: cache(unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as Project[];
        },
        ['projects-get-all'],
        { tags: ['projects'], revalidate: 3600 }
    )),

    getFeatured: cache(unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('featured', true)
                .order('display_order', { ascending: true });

            if (error) throw error;
            return data as Project[];
        },
        ['projects-get-featured'],
        { tags: ['projects'], revalidate: 3600 }
    )),

    getByCategory: cache(unstable_cache(
        async (category: string) => {
            if (category === 'All') {
                return projectsQuery.getAll();
            }
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('category', category)
                .order('display_order', { ascending: true });

            if (error) throw error;
            return data as Project[];
        },
        ['projects-get-by-category'],
        { tags: ['projects'], revalidate: 3600 }
    )),
};

// GitHub projects queries
export const githubProjectsQuery = {
    getAll: cache(unstable_cache(
        async () => {
            const { data, error } = await supabase
                .from('github_projects')
                .select('*')
                .order('stars', { ascending: false });

            if (error) throw error;
            return data as GitHubProject[];
        },
        ['github-projects-get-all'],
        { tags: ['github-projects'], revalidate: 3600 }
    )),

    getTop: cache(unstable_cache(
        async (limit: number = 12) => {
            const { data, error } = await supabase
                .from('github_projects')
                .select('*')
                .order('stars', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data as GitHubProject[];
        },
        ['github-projects-get-top'],
        { tags: ['github-projects'], revalidate: 3600 }
    )),

    upsert: async (project: any) => {
        const { data, error } = await supabase
            .from('github_projects')
            .upsert(project, { onConflict: 'repo_id' })
            .select()
            .single();

        if (error) throw error;
        return data as GitHubProject;
    },
};
