// TypeScript types generated from Supabase schema
// This file defines the database structure and types for type-safe queries

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          cover_image: string | null;
          published_at: string;
          reading_time: number | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content: string;
          cover_image?: string | null;
          published_at?: string;
          reading_time?: number | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string;
          cover_image?: string | null;
          published_at?: string;
          reading_time?: number | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          screenshot: string | null;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          category: string;
          featured: boolean;
          display_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          screenshot?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          category: string;
          featured?: boolean;
          display_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          screenshot?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          category?: string;
          featured?: boolean;
          display_order?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      github_projects: {
        Row: {
          id: string;
          repo_id: number;
          repo_name: string;
          description: string | null;
          language: string | null;
          language_color: string | null;
          stars: number;
          forks: number;
          url: string;
          synced_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          repo_id: number;
          repo_name: string;
          description?: string | null;
          language?: string | null;
          language_color?: string | null;
          stars?: number;
          forks?: number;
          url: string;
          synced_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          repo_id?: number;
          repo_name?: string;
          description?: string | null;
          language?: string | null;
          language_color?: string | null;
          stars?: number;
          forks?: number;
          url?: string;
          synced_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Application-level type aliases for convenience
export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type GitHubProject = Database['public']['Tables']['github_projects']['Row'];
export type GitHubProjectInsert = Database['public']['Tables']['github_projects']['Insert'];
export type GitHubProjectUpdate = Database['public']['Tables']['github_projects']['Update'];

// Utility types for common query patterns
export type PostWithoutContent = Omit<Post, 'content'>;
export type FeaturedProject = Project & { featured: true };
export type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source';
