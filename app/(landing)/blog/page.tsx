import { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/blog';
import { PostCard } from '@/components/PostCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-muted/20" />
          <div className="p-6">
            <div className="h-6 bg-muted/20 rounded mb-4" />
            <div className="h-4 bg-muted/20 rounded mb-2" />
            <div className="h-4 bg-muted/20 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Separate component for blog posts list
async function BlogPostsList() {
  // Get all published posts from markdown files
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No blog posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

export default function BlogPage() {
  return (
    <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technical articles, tutorials, and insights on software development
          </p>
        </div>

        {/* Posts Grid with Suspense */}
        <Suspense fallback={<BlogPostsSkeleton />}>
          <BlogPostsList />
        </Suspense>
      </div>
    </main>
  );
}
