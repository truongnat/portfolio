import { supabase } from '@/lib/supabase';
import type { Post, Project, GitHubProject } from '@/types';

// Posts queries
export const postsQuery = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (error) throw error;
        return data as Post[];
    },

    getBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .lte('published_at', new Date().toISOString())
            .single();

        if (error) throw error;
        return data as Post;
    },

    getPaginated: async (page: number = 1, pageSize: number = 10) => {
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

    getByTag: async (tag: string) => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .contains('tags', [tag])
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (error) throw error;
        return data as Post[];
    },
};

// Projects queries
export const projectsQuery = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Project[];
    },

    getFeatured: async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('featured', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as Project[];
    },

    getByCategory: async (category: string) => {
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
};

// GitHub projects queries
export const githubProjectsQuery = {
    getAll: async () => {
        const { data, error } = await supabase
            .from('github_projects')
            .select('*')
            .order('stars', { ascending: false });

        if (error) throw error;
        return data as GitHubProject[];
    },

    getTop: async (limit: number = 12) => {
        const { data, error } = await supabase
            .from('github_projects')
            .select('*')
            .order('stars', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as GitHubProject[];
    },

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
