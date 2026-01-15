import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowUpRight } from 'lucide-react';
import type { BlogPostMetadata } from '@/lib/blog';

interface PostCardProps {
  post: BlogPostMetadata;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-lg hover:shadow-2xl hover:border-primary/40 transition-all duration-500 hover:-translate-y-2"
      data-testid={`post-card-${post.slug}`}
    >
      {/* Gradient background overlay for the whole card */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Cover Image or Gradient Placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={`${post.title} cover image`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
            data-testid="post-cover-image"
          />
        ) : (
          <>
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />

            {/* Decorative circles */}
            <div className="absolute top-6 left-6 h-20 w-20 rounded-full bg-blue-500/20 blur-2xl" />
            <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-purple-500/20 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-pink-500/20 blur-xl" />

            {/* Code-like pattern */}
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="h-2 w-3/4 rounded-full bg-foreground/10" />
              <div className="h-2 w-1/2 rounded-full bg-foreground/8" />
              <div className="h-2 w-2/3 rounded-full bg-foreground/6" />
            </div>
          </>
        )}

        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Arrow indicator */}
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm shadow-lg opacity-0 -translate-y-2 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0">
          <ArrowUpRight className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Title */}
        <h2
          className="text-xl font-bold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-primary"
          data-testid="post-title"
        >
          {post.title}
        </h2>

        {/* Description */}
        {post.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {post.description}
          </p>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5" data-testid="post-date">
            <Calendar className="h-4 w-4 text-primary" />
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
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 transition-colors hover:bg-primary/20"
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
