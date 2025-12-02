// Supabase client utilities for database operations
// Provides both client-side and server-side Supabase clients

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

/**
 * Client-side Supabase client
 * Use this in Client Components and browser-side code
 */
export const supabase = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    persistSession: false, // Portfolio doesn't need auth persistence
  },
});

/**
 * Server-side Supabase client
 * Use this in Server Components, API routes, and server-side code
 * Creates a new client instance for each request
 */
export function createServerClient() {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
    },
  });
}

/**
 * Type-safe query helpers
 */

// Posts queries
export const postsQuery = {
  /**
   * Get all published posts ordered by published date
   */
  getAll: () =>
    supabase
      .from('posts')
      .select('*')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }),

  /**
   * Get a single post by slug
   */
  getBySlug: (slug: string) =>
    supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .lte('published_at', new Date().toISOString())
      .single(),

  /**
   * Get posts with pagination
   */
  getPaginated: (page: number = 1, pageSize: number = 10) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    return supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .range(from, to);
  },

  /**
   * Get posts by tag
   */
  getByTag: (tag: string) =>
    supabase
      .from('posts')
      .select('*')
      .contains('tags', [tag])
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false }),
};

// Projects queries
export const projectsQuery = {
  /**
   * Get all projects ordered by display order
   */
  getAll: () =>
    supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),

  /**
   * Get featured projects only
   */
  getFeatured: () =>
    supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('display_order', { ascending: true, nullsFirst: false }),

  /**
   * Get projects by category
   */
  getByCategory: (category: string) => {
    if (category === 'All') {
      return projectsQuery.getAll();
    }
    return supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .order('display_order', { ascending: true, nullsFirst: false });
  },
};

// GitHub projects queries
export const githubProjectsQuery = {
  /**
   * Get all GitHub projects ordered by stars
   */
  getAll: () =>
    supabase
      .from('github_projects')
      .select('*')
      .order('stars', { ascending: false }),

  /**
   * Get top N GitHub projects
   */
  getTop: (limit: number = 12) =>
    supabase
      .from('github_projects')
      .select('*')
      .order('stars', { ascending: false })
      .limit(limit),

  /**
   * Upsert GitHub project (for syncing)
   */
  upsert: async (project: Database['public']['Tables']['github_projects']['Insert']) => {
    return supabase
      .from('github_projects')
      .upsert(project as any, { onConflict: 'repo_id' });
  },
};

/**
 * Error handling helper
 */
export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'Database operation failed');
}

/**
 * Type guard for checking if a Supabase response has data
 */
export function hasData<T>(
  response: { data: T | null; error: any }
): response is { data: T; error: null } {
  return response.data !== null && response.error === null;
}
