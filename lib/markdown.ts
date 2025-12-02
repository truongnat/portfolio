/**
 * Markdown processing utilities for blog posts
 * Handles MDX serialization, syntax highlighting, and TOC generation
 */

import { serialize } from 'next-mdx-remote/serialize';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { slugify } from './utils';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

/**
 * Process markdown content with syntax highlighting and heading links
 * @param content - Raw markdown content
 * @returns Serialized MDX content ready for rendering
 */
export async function processMarkdown(
  content: string
): Promise<MDXRemoteSerializeResult> {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor-link'],
            },
          },
        ],
        [
          rehypeShiki as any,
          {
            theme: 'github-dark',
          },
        ],
      ],
    },
  });

  return mdxSource;
}

/**
 * Generate table of contents from markdown content
 * Extracts all heading elements (h1-h6) and creates a hierarchical structure
 * @param content - Raw markdown content
 * @returns Array of TOC items with id, text, and level
 */
export function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugify(text);
    
    toc.push({ id, text, level });
  }

  return toc;
}

/**
 * Extract excerpt from markdown content
 * Returns the first paragraph or first N characters
 * @param content - Raw markdown content
 * @param maxLength - Maximum length of excerpt (default: 160)
 * @returns Excerpt text
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax
  const plainText = content
    .replace(/^#{1,6}\s+/gm, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .trim();

  // Get first paragraph or truncate to maxLength
  const firstParagraph = plainText.split('\n\n')[0];
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + '...';
}
