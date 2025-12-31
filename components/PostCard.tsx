import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Clock, Calendar } from 'lucide-react';
import type { BlogPostMetadata } from '@/lib/blog';

interface PostCardProps {
  post: BlogPostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      data-testid={`post-card-${post.slug}`}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={post.coverImage}
            alt={`${post.title} cover image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
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
            <time dateTime={post.date}>
              {formatDate(post.date, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>
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
