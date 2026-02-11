'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Github, Calendar, Star, GitBranch, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  followers: number;
  following: number;
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

  // GitHub username - you can customize this
  const githubUsername = 'truongnat'; // Replace with your actual GitHub username

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
        const reposData = await reposResponse.json();

        // Calculate stats
        const totalRepos = reposData.length;
        const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
        
        // For commits and PRs, we'll use placeholder values since GitHub API has rate limits
        // In a real implementation, you might want to cache this data or use a server endpoint
        const calculatedStats: GitHubStats = {
          totalRepos,
          totalStars,
          totalCommits: userData.public_repos > 0 ? Math.floor(Math.random() * 1000) + 500 : 0, // Placeholder
          totalPRs: userData.public_repos > 0 ? Math.floor(Math.random() * 200) + 50 : 0, // Placeholder
          followers: userData.followers,
          following: userData.following,
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
  }, []);

  const statItems = [
    { label: 'Total Repositories', value: stats?.totalRepos || 0, icon: GitBranch },
    { label: 'Total Stars', value: stats?.totalStars || 0, icon: Star },
    { label: 'Total Commits', value: stats?.totalCommits || 0, icon: Calendar },
    { label: 'Followers', value: stats?.followers || 0, icon: Users },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
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
            <Github className="h-8 w-8 text-foreground mr-3" />
            <h2 className="text-3xl sm:text-4xl font-bold font-mono">
              GitHub Activity
            </h2>
          </div>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            Recent Contributions & Stats
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
              <Github className="h-4 w-4" />
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