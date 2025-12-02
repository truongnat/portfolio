'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Star, GitFork, ExternalLink, AlertCircle, RefreshCw } from 'lucide-react';
import type { GitHubRepo } from '@/types';

interface ToolsHubProps {
  username: string;
  initialRepos?: GitHubRepo[];
}

/**
 * ToolsHub Component
 * Displays GitHub repositories with auto-fetching capabilities
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8
 */
export function ToolsHub({ username, initialRepos = [] }: ToolsHubProps) {
  const [displayLimit, setDisplayLimit] = useState(12);
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const shouldReduceMotion = useReducedMotion();

  // Fetch repositories using TanStack Query
  const {
    data: repos,
    isLoading,
    error,
    refetch,
  } = useQuery<GitHubRepo[]>({
    queryKey: ['github-repos', username],
    queryFn: async () => {
      const response = await fetch(`/api/github?username=${username}&limit=50`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch repositories');
      }

      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: initialRepos.length > 0 ? initialRepos : undefined,
  });

  const displayedRepos = repos?.slice(0, displayLimit) || [];
  const hasMore = (repos?.length || 0) > displayLimit;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="tools-hub"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Open Source Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my open source contributions and projects on GitHub
          </p>
        </motion.div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && <ErrorState error={error} onRetry={() => refetch()} />}

        {/* Empty state */}
        {!isLoading && !error && displayedRepos.length === 0 && <EmptyState />}

        {/* Repository grid */}
        {!isLoading && !error && displayedRepos.length > 0 && (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              data-testid="repos-grid"
            >
              {displayedRepos.map((repo) => (
                <RepositoryCard key={repo.id} repo={repo} variants={itemVariants} />
              ))}
            </motion.div>

            {/* Load more button */}
            {hasMore && (
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 12)}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  data-testid="load-more-button"
                >
                  Load More
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

interface RepositoryCardProps {
  repo: GitHubRepo;
  variants?: any;
}

/**
 * RepositoryCard Component
 * Displays individual repository information
 * Requirements: 5.5
 */
export function RepositoryCard({ repo, variants }: RepositoryCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={variants}
      className="group block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300"
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -4,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            }
      }
      data-testid={`repo-card-${repo.id}`}
      data-repo-name={repo.name}
    >
      {/* Header with external link icon */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1"
          data-testid="repo-name"
        >
          {repo.name}
        </h3>
        <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
      </div>

      {/* Description */}
      <p
        className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]"
        data-testid="repo-description"
      >
        {repo.description || 'No description available'}
      </p>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-sm" data-testid="repo-metadata">
        {/* Language */}
        {repo.language && (
          <div className="flex items-center gap-1.5" data-testid="repo-language">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: repo.languageColor || '#858585' }}
              aria-label={`${repo.language} language`}
            />
            <span className="text-muted-foreground">{repo.language}</span>
          </div>
        )}

        {/* Stars */}
        <div className="flex items-center gap-1.5" data-testid="repo-stars">
          <Star className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{repo.stars}</span>
        </div>

        {/* Forks */}
        <div className="flex items-center gap-1.5" data-testid="repo-forks">
          <GitFork className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{repo.forks}</span>
        </div>
      </div>
    </motion.a>
  );
}

/**
 * SkeletonCard Component
 * Loading placeholder for repository cards
 * Requirements: 5.2
 */
function SkeletonCard() {
  return (
    <div
      className="bg-card border border-border rounded-lg p-6 animate-pulse"
      data-testid="skeleton-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-5 w-5 bg-muted rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
      <div className="flex items-center gap-4">
        <div className="h-4 bg-muted rounded w-20" />
        <div className="h-4 bg-muted rounded w-12" />
        <div className="h-4 bg-muted rounded w-12" />
      </div>
    </div>
  );
}

/**
 * ErrorState Component
 * Displays error message with retry option
 * Requirements: 5.3, 7.3
 */
interface ErrorStateProps {
  error: Error;
  onRetry: () => void;
}

function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div
      className="text-center py-12 px-4"
      role="alert"
      aria-live="polite"
      data-testid="error-state"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Failed to Load Repositories</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {error.message || 'An error occurred while fetching repositories. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        data-testid="retry-button"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

/**
 * EmptyState Component
 * Displays when no repositories are found
 * Requirements: 5.4
 */
function EmptyState() {
  return (
    <div className="text-center py-12 px-4" data-testid="empty-state">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <GitFork className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No Repositories Found</h3>
      <p className="text-muted-foreground max-w-md mx-auto">
        There are no public repositories available at the moment. Check back later!
      </p>
    </div>
  );
}
