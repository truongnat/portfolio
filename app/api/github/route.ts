import { NextResponse } from 'next/server';
import { fetchWithRetry } from '@/lib/api-utils';

/**
 * GitHub API proxy route
 * Handles fetching user repositories with rate limiting and error handling
 * Requirements: 5.2, 5.3, 5.4, 10.5, 14.6
 */

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
}

interface GitHubRepoResponse {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  url: string;
}

// Language color mapping (subset of GitHub's language colors)
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Vue: '#41b883',
  React: '#61dafb',
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    if (!username) {
      return NextResponse.json(
        { success: false, error: 'Username parameter is required' },
        { status: 400 }
      );
    }

    // Get GitHub token from environment
    const githubToken = process.env.GITHUB_TOKEN;

    // Fetch repositories from GitHub API
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    };

    // Add authorization if token is available
    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`;
    }

    const response = await fetchWithRetry(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=${limit}`,
      {
        headers,
        next: { revalidate: 300 }, // Cache for 5 minutes
      },
      {
        maxRetries: 3,
        initialDelay: 1000,
        backoffMultiplier: 2,
      }
    );

    // Handle rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
      const rateLimitReset = response.headers.get('X-RateLimit-Reset');

      if (rateLimitRemaining === '0') {
        const resetTime = rateLimitReset
          ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString()
          : 'soon';

        return NextResponse.json(
          {
            success: false,
            error: `GitHub API rate limit exceeded. Resets at ${resetTime}`,
          },
          { status: 429 }
        );
      }
    }

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Transform the response to match our interface
    const transformedRepos: GitHubRepoResponse[] = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      language: repo.language,
      languageColor: repo.language ? LANGUAGE_COLORS[repo.language] || '#858585' : null,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
    }));

    return NextResponse.json(
      {
        success: true,
        data: transformedRepos,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error) {
    console.error('GitHub API proxy error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
