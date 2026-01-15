import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/blog';
import { BlogContent } from '@/components/BlogContent';

// Enable static generation
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical articles, tutorials, and insights on full-stack development, AI/ML, and software engineering.',
  openGraph: {
    title: 'Blog | Portfolio',
    description:
      'Technical articles, tutorials, and insights on full-stack development, AI/ML, and software engineering.',
    type: 'website',
  },
};

// Loading skeleton for blog posts
function BlogPostsSkeleton() {
  return (
    <div className="space-y-12">
      <div className="h-14 w-full bg-muted/20 animate-pulse rounded-2xl border border-border/40" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="blog-card overflow-hidden animate-pulse">
            <div className="h-52 bg-gradient-to-br from-muted/40 to-muted/20" />
            <div className="p-6 space-y-4">
              <div className="h-6 bg-muted/40 rounded-lg w-5/6" />
              <div className="space-y-2">
                <div className="h-4 bg-muted/30 rounded w-full" />
                <div className="h-4 bg-muted/20 rounded w-2/3" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted/20 rounded-full" />
                <div className="h-6 w-20 bg-muted/20 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Separate component for blog posts list
function BlogPostsList() {
  // Get all published posts from markdown files
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-6">
          <svg
            className="h-10 w-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <p className="text-xl text-muted-foreground">
          No blog posts yet. Check back soon!
        </p>
        <p className="text-sm text-muted-foreground/60 mt-2">
          New articles are coming soon
        </p>
      </div>
    );
  }

  return <BlogContent initialPosts={posts} />;
}

export default function BlogPage() {
  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="blog-title inline-block text-5xl sm:text-6xl md:text-7xl mb-6">
            Blog
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Technical articles, tutorials, and insights on software development,
            <br className="hidden sm:block" />
            <span className="text-primary font-medium">AI/ML</span>, and modern engineering practices
          </p>

          {/* Decorative line */}
          <div className="mt-10 flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-border" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <div className="h-px w-24 bg-gradient-to-r from-primary/50 via-border to-transparent" />
          </div>
        </div>

        {/* Posts Section with Search, Filter & Pagination */}
        <Suspense fallback={<BlogPostsSkeleton />}>
          <BlogPostsList />
        </Suspense>
      </div>
    </main>
  );
}

