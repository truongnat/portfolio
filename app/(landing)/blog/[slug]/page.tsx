import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import Image from 'next/image';
import Link from 'next/link';
import { postsQuery } from '@/lib/queries';
import { generateTOC } from '@/lib/markdown';
import { formatDate } from '@/lib/utils';
import { TableOfContents } from '@/components/TableOfContents';
import { Clock, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Post } from '@/types';

// Enable ISR with 60 second revalidation
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = await postsQuery.getAll();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    post = await postsQuery.getBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch post for metadata:', error);
  }

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const typedPost: Post = post;

  return {
    title: typedPost.title,
    description: typedPost.content.substring(0, 160),
    openGraph: {
      title: typedPost.title,
      description: typedPost.content.substring(0, 160),
      type: 'article',
      publishedTime: typedPost.published_at || undefined,
      images: typedPost.cover_image ? [typedPost.cover_image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: typedPost.title,
      description: typedPost.content.substring(0, 160),
      images: typedPost.cover_image ? [typedPost.cover_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    post = await postsQuery.getBySlug(slug);
  } catch (error) {
    console.error('Failed to fetch post:', error);
  }

  if (!post) {
    notFound();
  }

  const typedPost: Post = post;

  // Generate table of contents
  const toc = generateTOC(typedPost.content);

  // Get all posts for navigation
  let posts: Post[] = [];
  try {
    posts = await postsQuery.getAll();
  } catch (error) {
    console.error('Failed to fetch all posts for navigation:', error);
  }

  // Find current post index
  const currentIndex = posts.findIndex((p) => p.id === typedPost.id);
  const previousPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <article className="min-h-screen">
      {/* Hero Section with Cover Image */}
      {typedPost.cover_image && (
        <div className="relative h-[400px] w-full" data-testid="post-hero-image">
          <Image
            src={typedPost.cover_image}
            alt={typedPost.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Back to Blog */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            {/* Post Header */}
            <header className="mb-8" data-testid="post-header">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" data-testid="post-title">
                {typedPost.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2" data-testid="post-date">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={typedPost.published_at || typedPost.created_at || ''}>
                    {formatDate(typedPost.published_at || typedPost.created_at || new Date(), {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {typedPost.reading_time && (
                  <div className="flex items-center gap-2" data-testid="post-reading-time">
                    <Clock className="h-4 w-4" />
                    <span>{typedPost.reading_time} min read</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {typedPost.tags && typedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4" data-testid="post-tags">
                  {typedPost.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div
              className="prose prose-lg dark:prose-invert max-w-none"
              data-testid="post-content"
            >
              <MDXRemote
                source={typedPost.content}
                options={{
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
                }}
              />
            </div>

            {/* Post Navigation */}
            <nav className="mt-16 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previousPost && (
                  <Link
                    href={`/blog/${previousPost.slug}`}
                    className="group p-4 border border-border rounded-lg hover:border-primary transition-colors"
                    data-testid="previous-post-link"
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Post
                    </div>
                    <div className="font-semibold group-hover:text-primary transition-colors">
                      {previousPost.title}
                    </div>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/blog/${nextPost.slug}`}
                    className="group p-4 border border-border rounded-lg hover:border-primary transition-colors md:text-right"
                    data-testid="next-post-link"
                  >
                    <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                      Next Post
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <div className="font-semibold group-hover:text-primary transition-colors">
                      {nextPost.title}
                    </div>
                  </Link>
                )}
              </div>
            </nav>
          </div>

          {/* Sidebar with Table of Contents */}
          {toc.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}
