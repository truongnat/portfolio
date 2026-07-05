'use client';

import { motion, type Variants } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ExternalLink, GithubIcon, GitBranch, RefreshCw, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

import { personalInfo } from '@/lib/config';

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  followers: number;
  following: number;
  featuredRepo?: {
    name: string;
    url: string;
    stars: number;
  };
  latestRepo?: {
    name: string;
    url: string;
    pushedAt: string;
  };
}

interface GitHubRepo {
  fork: boolean;
  html_url: string;
  name: string;
  pushed_at: string;
  stargazers_count: number;
}

export function GitHubStatsClient() {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const shouldReduceMotion = useSafeReducedMotion();
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const githubUsername = personalInfo.githubUsername;

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!userResponse.ok) {
          throw new Error('Failed to fetch GitHub user data');
        }
        const userData = await userResponse.json();

        // Fetch repos data
        const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch GitHub repos data');
        }
        const reposData: GitHubRepo[] = await reposResponse.json();
        const publicRepos = reposData.filter((repo) => !repo.fork);

        const totalRepos = publicRepos.length;
        const totalStars = publicRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const featuredRepo = [...publicRepos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
        const latestRepo = [...publicRepos].sort(
          (a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime()
        )[0];

        const calculatedStats: GitHubStats = {
          totalRepos,
          totalStars,
          followers: userData.followers,
          following: userData.following,
          featuredRepo: featuredRepo
            ? {
                name: featuredRepo.name,
                url: featuredRepo.html_url,
                stars: featuredRepo.stargazers_count,
              }
            : undefined,
          latestRepo: latestRepo
            ? {
                name: latestRepo.name,
                url: latestRepo.html_url,
                pushedAt: latestRepo.pushed_at,
              }
            : undefined,
        };

        setStats(calculatedStats);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, [githubUsername]);

  const statItems = [
    { label: 'Total Repositories', value: stats?.totalRepos || 0, icon: GitBranch },
    { label: 'Total Stars', value: stats?.totalStars || 0, icon: Star },
    { label: 'Followers', value: stats?.followers || 0, icon: Users },
    { label: 'Following', value: stats?.following || 0, icon: RefreshCw },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="github-stats"
      ref={sectionRef}
      className="relative py-16 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <GithubIcon className="h-8 w-8 text-foreground mr-3" />
            <h2 className="text-3xl sm:text-4xl font-bold font-mono">
              GitHub Footprint
            </h2>
          </div>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            Real public signals from github.com/{githubUsername}
          </p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {statItems.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card p-6 rounded-lg border border-border text-center"
            >
              <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-foreground mb-2">
                {loading ? '...' : stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {(stats?.latestRepo || stats?.featuredRepo) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 grid gap-4 md:grid-cols-2"
          >
            {stats.latestRepo && (
              <a
                href={stats.latestRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-muted-foreground/50"
              >
                <div className="mb-2 text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">
                  Recently active repo
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-foreground">{stats.latestRepo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Updated {new Date(stats.latestRepo.pushedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
            )}

            {stats.featuredRepo && (
              <a
                href={stats.featuredRepo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-muted-foreground/50"
              >
                <div className="mb-2 text-xs font-mono uppercase tracking-[0.24em] text-muted-foreground">
                  Most starred public repo
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-foreground">{stats.featuredRepo.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {stats.featuredRepo.stars.toLocaleString()} stars
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              </a>
            )}
          </motion.div>
        )}

        {/* Contribution graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-12 bg-card p-6 rounded-lg border border-border"
        >
          <h3 className="text-xl font-bold mb-4 text-center">Contribution Activity</h3>
          <div className="flex justify-center">
            <div className="overflow-x-auto w-full flex justify-center">
              <img 
                src={`https://ghchart.rshah.org/4f46d4/${githubUsername}`} 
                alt={`${githubUsername}'s GitHub chart`}
                className="rounded-lg border border-border max-w-full shadow-sm"
                style={{ minWidth: '600px', maxWidth: '100%', height: 'auto' }}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center">
            <a 
              href={`https://github.com/${githubUsername}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity text-sm font-bold font-mono"
            >
              <GithubIcon className="h-4 w-4" />
              View GitHub Profile
            </a>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-destructive/20 text-destructive rounded-lg text-center"
          >
            Error loading GitHub stats: {error}
          </motion.div>
        )}
      </div>
    </section>
  );
}
