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

