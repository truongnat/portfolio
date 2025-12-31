import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Content directory path
const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

// Blog post metadata interface (without content)
export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  published: boolean;
  tags?: string[];
  author?: string;
  coverImage?: string;
}

// Full blog post interface (with content)
export interface BlogPost extends BlogPostMetadata {
  content: string;
}

/**
 * Validates that required frontmatter fields are present and valid
 */
function validateFrontmatter(data: any, filename: string): boolean {
  const requiredFields = ['title', 'date', 'description', 'slug'];
  
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string' || data[field].trim() === '') {
      console.warn(`[Blog] Skipping ${filename}: missing or invalid required field '${field}'`);
      return false;
    }
  }
  
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.date)) {
    console.warn(`[Blog] Skipping ${filename}: invalid date format '${data.date}' (expected YYYY-MM-DD)`);
    return false;
  }
  
  // Validate slug is URL-safe
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(data.slug)) {
    console.warn(`[Blog] Skipping ${filename}: invalid slug '${data.slug}' (must be lowercase, hyphenated, URL-safe)`);
    return false;
  }
  
  return true;
}

/**
 * Reads and parses a single markdown file
 */
function parseMarkdownFile(filename: string): BlogPost | null {
  try {
    const filePath = path.join(CONTENT_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { data, content } = matter(fileContents);
    
    // Validate required fields
    if (!validateFrontmatter(data, filename)) {
      return null;
    }
    
    // Default published to false if not specified
    const published = typeof data.published === 'boolean' ? data.published : false;
    
    return {
      slug: data.slug,
      title: data.title,
      date: data.date,
      description: data.description,
      published,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      author: typeof data.author === 'string' ? data.author : undefined,
      coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
      content: content.trim(),
    };
  } catch (error) {
    console.error(`[Blog] Error parsing ${filename}:`, error);
    return null;
  }
}

/**
 * Get all published posts sorted by date (newest first)
 * Returns only metadata without content for performance
 */
export function getAllPosts(): BlogPostMetadata[] {
  try {
    // Check if content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      console.warn(`[Blog] Content directory does not exist: ${CONTENT_DIR}`);
      return [];
    }
    
    // Read all files from content directory
    const files = fs.readdirSync(CONTENT_DIR);
    
    // Filter for markdown files (.md and .mdx)
    const markdownFiles = files.filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    // Parse all markdown files
    const posts: BlogPost[] = [];
    const slugs = new Set<string>();
    
    for (const file of markdownFiles) {
      const post = parseMarkdownFile(file);
      
      if (post) {
        // Check for duplicate slugs
        if (slugs.has(post.slug)) {
          console.warn(`[Blog] Duplicate slug detected: '${post.slug}' in ${file}. Using first occurrence.`);
          continue;
        }
        
        slugs.add(post.slug);
        posts.push(post);
      }
    }
    
    // Filter for published posts only
    const publishedPosts = posts.filter(post => post.published);
    
    // Sort by date descending (newest first)
    publishedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    // Return metadata only (without content)
    return publishedPosts.map(({ content, ...metadata }) => metadata);
  } catch (error) {
    console.error('[Blog] Error reading posts:', error);
    return [];
  }
}

/**
 * Get a single post by slug (includes content)
 * Returns null if post not found or not published
 */
export function getPostBySlug(slug: string): BlogPost | null {
  try {
    // Check if content directory exists
    if (!fs.existsSync(CONTENT_DIR)) {
      console.warn(`[Blog] Content directory does not exist: ${CONTENT_DIR}`);
      return null;
    }
    
    // Read all files from content directory
    const files = fs.readdirSync(CONTENT_DIR);
    
    // Filter for markdown files
    const markdownFiles = files.filter(file => 
      file.endsWith('.md') || file.endsWith('.mdx')
    );
    
    // Find the post with matching slug
    for (const file of markdownFiles) {
      const post = parseMarkdownFile(file);
      
      if (post && post.slug === slug) {
        // Only return published posts
        if (!post.published) {
          return null;
        }
        return post;
      }
    }
    
    // Post not found
    return null;
  } catch (error) {
    console.error(`[Blog] Error getting post by slug '${slug}':`, error);
    return null;
  }
}

/**
 * Get all slugs for static generation
 * Returns slugs for all published posts
 */
export function getAllSlugs(): string[] {
  const posts = getAllPosts();
  return posts.map(post => post.slug);
}
