import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';
import type { Post } from '@/types';

interface PostCardProps {
  post: Omit<Post, 'content'>;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      data-testid={`post-card-${post.slug}`}
    >
      {/* Cover Image */}
      {post.cover_image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={post.cover_image}
            alt={`${post.title} cover image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid="post-cover-image"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2
          className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2"
          data-testid="post-title"
        >
          {post.title}
        </h2>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5" data-testid="post-date">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.published_at}>
              {formatDate(post.published_at, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>

          {post.reading_time && (
            <div className="flex items-center gap-1.5" data-testid="post-reading-time">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2" data-testid="post-tags">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
                data-testid={`post-tag-${tag}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
