import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { MDXRemoteProps } from 'next-mdx-remote/rsc';

// Dynamically import MDXRemote only on blog pages
const MDXRemote = dynamic(
  () => import('next-mdx-remote/rsc').then((mod) => mod.MDXRemote),
  {
    ssr: true, // Keep SSR for SEO
    loading: () => (
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 bg-muted/20 rounded animate-pulse mb-2" />
              <div className="h-4 bg-muted/20 rounded animate-pulse w-5/6" />
            </div>
          ))}
        </div>
      </div>
    ),
  }
);

export function MDXContent(props: MDXRemoteProps) {
  return (
    <Suspense
      fallback={
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-muted/20 rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted/20 rounded animate-pulse w-5/6" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <MDXRemote {...props} />
    </Suspense>
  );
}
