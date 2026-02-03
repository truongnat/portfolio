import { formatDate } from '@/lib/utils';
import { Calendar, ArrowUpRight } from 'lucide-react';
import type { BlogPostMetadata } from '@/types';

interface PostCardProps {
  post: BlogPostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group block relative overflow-hidden rounded-xl border border-border bg-card/50 transition-all duration-300 hover:border-foreground/20 hover:-translate-y-1"
      data-testid={`post-card-${post.slug}`}
    >
      {/* Cover Image or Placeholder */}
      <div className="relative h-48 overflow-hidden bg-secondary/30 border-b border-border">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={`${post.title} cover image`}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            data-testid="post-cover-image"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
            <div className="w-full px-8 space-y-3 opacity-30">
              <div className="h-1.5 w-full rounded bg-foreground/20" />
              <div className="h-1.5 w-3/4 rounded bg-foreground/20" />
              <div className="h-1.5 w-5/6 rounded bg-foreground/20" />
            </div>
          </div>
        )}

        {/* Arrow indicator */}
        <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded bg-background border border-border shadow-sm opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <ArrowUpRight className="h-4 w-4 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2
          className="text-lg font-bold mb-3 line-clamp-2 font-mono tracking-tight text-foreground transition-colors group-hover:text-foreground/80"
          data-testid="post-title"
        >
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-base text-muted-foreground mb-6 line-clamp-2 leading-relaxed" data-testid="post-description">
            {post.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground" data-testid="post-date">
            <Calendar className="h-3 w-3" />
            <time dateTime={post.date}>
              {formatDate(post.date, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5" data-testid="post-tags">
              <span
                className="px-2 py-0.5 text-sm font-mono border border-border bg-secondary/50 text-muted-foreground rounded"
              >
                {post.tags[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
