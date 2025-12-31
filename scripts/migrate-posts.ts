/**
 * Migration script to export blog posts from Supabase to markdown files
 * 
 * This script:
 * 1. Fetches all posts from Supabase database
 * 2. Converts each post to markdown format with frontmatter
 * 3. Generates URL-safe filenames from slugs
 * 4. Writes markdown files to content/blog/ directory
 * 
 * Usage: npx tsx scripts/migrate-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import type { Database } from '@/types/database';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Content directory path
const CONTENT_DIR = join(process.cwd(), 'content', 'blog');

/**
 * Generates a URL-safe filename from a slug
 */
function generateFilename(slug: string): string {
  // Ensure slug is lowercase and uses hyphens
  const safeSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `${safeSlug}.md`;
}

/**
 * Formats a date to YYYY-MM-DD format
 */
function formatDate(dateString: string | null): string {
  if (!dateString) {
    return new Date().toISOString().split('T')[0];
  }
  
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Converts a post to markdown format with frontmatter
 */
function postToMarkdown(post: any): string {
  const frontmatter = [
    '---',
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: "${formatDate(post.published_at || post.created_at)}"`,
    `description: "${(post.description || '').replace(/"/g, '\\"')}"`,
    `slug: "${post.slug}"`,
    `published: ${post.published ?? true}`,
  ];

  // Add optional fields if they exist
  if (post.tags && post.tags.length > 0) {
    frontmatter.push(`tags: [${post.tags.map((tag: string) => `"${tag}"`).join(', ')}]`);
  }

  if (post.cover_image) {
    frontmatter.push(`coverImage: "${post.cover_image}"`);
  }

  if (post.reading_time) {
    frontmatter.push(`readingTime: ${post.reading_time}`);
  }

  frontmatter.push('---');
  frontmatter.push('');
  frontmatter.push(post.content || '');

  return frontmatter.join('\n');
}

/**
 * Main migration function
 */
async function migratePosts() {
  console.log('🚀 Starting blog post migration from Supabase to markdown files...\n');

  // Ensure content directory exists
  if (!existsSync(CONTENT_DIR)) {
    console.log(`📁 Creating content directory: ${CONTENT_DIR}`);
    mkdirSync(CONTENT_DIR, { recursive: true });
  }

  try {
    // Fetch all posts from Supabase (including unpublished)
    console.log('📥 Fetching posts from Supabase...');
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch posts: ${error.message}`);
    }

    if (!posts || posts.length === 0) {
      console.log('ℹ️  No posts found in database');
      return;
    }

    console.log(`✅ Found ${posts.length} post(s)\n`);

    // Track migration results
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ slug: string; error: string }> = [];

    // Process each post
    for (const post of posts) {
      try {
        const filename = generateFilename(post.slug);
        const filepath = join(CONTENT_DIR, filename);
        const markdown = postToMarkdown(post);

        writeFileSync(filepath, markdown, 'utf-8');
        
        console.log(`✅ Exported: ${filename}`);
        console.log(`   Title: ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   Published: ${post.published ?? true}`);
        console.log('');
        
        successCount++;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`❌ Failed to export: ${post.slug}`);
        console.error(`   Error: ${errorMessage}\n`);
        
        errorCount++;
        errors.push({ slug: post.slug, error: errorMessage });
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Migration Summary');
    console.log('='.repeat(60));
    console.log(`Total posts: ${posts.length}`);
    console.log(`✅ Successfully exported: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Errors:');
      errors.forEach(({ slug, error }) => {
        console.log(`   - ${slug}: ${error}`);
      });
    }
    
    console.log('\n✨ Migration complete!');
    console.log(`📁 Markdown files saved to: ${CONTENT_DIR}`);
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migratePosts();
