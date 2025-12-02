import { Metadata } from 'next';
import { postsQuery } from '@/lib/queries';
import { PostCard } from '@/components/PostCard';
import type { Post } from '@/types';

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

export default async function BlogPage() {
  let posts: Post[] = [];
  let error = null;

  try {
    posts = await postsQuery.getAll();
  } catch (e) {
    console.error('Failed to fetch posts:', e);
    error = e;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Failed to load blog posts</h1>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const publishedPosts: Post[] = posts || [];

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

        {/* Posts Grid */}
        {publishedPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No blog posts yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publishedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
