import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';
import { markdownToHtml } from '@/lib/markdown';
import { Clock, Calendar, ArrowLeft, User } from 'lucide-react';

// Enable static generation
export const dynamic = 'force-static';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all posts
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // Handle 404 for non-existent posts
  if (!post) {
    notFound();
  }

  // Convert markdown to HTML
  const htmlContent = await markdownToHtml(post.content);

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <article className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* Back to Blog */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {/* Post Header */}
        <header className="blog-header blog-animate" data-testid="post-header">
          {/* Title with gradient */}
          <h1 className="blog-title" data-testid="post-title">
            {post.title}
          </h1>

          {/* Description */}
          {post.description && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed blog-animate blog-animate-delay-1">
              {post.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground blog-animate blog-animate-delay-2">
            {/* Author */}
            {post.author && (
              <div className="flex items-center gap-3" data-testid="post-author">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="text-sm text-foreground font-medium">
                    {post.author}
                  </span>
                </div>
              </div>
            )}

            {/* Divider */}
            {post.author && (
              <div className="h-6 w-px bg-border hidden sm:block" />
            )}

            {/* Date */}
            <div className="flex items-center gap-2" data-testid="post-date">
              <Calendar className="h-4 w-4 text-primary/70" />
              <time dateTime={post.date} className="text-sm">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Reading Time */}
            <div className="flex items-center gap-2" data-testid="post-reading-time">
              <Clock className="h-4 w-4 text-primary/70" />
              <span className="text-sm">{readingTime} min read</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 blog-animate blog-animate-delay-3" data-testid="post-tags">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="blog-tag"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content with Premium prose styling */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          data-testid="post-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Post Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium transition-all duration-200 hover:gap-3"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>

            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Tagged:</span>
                {post.tags.slice(0, 2).map((tag: string) => (
                  <span key={tag} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}
