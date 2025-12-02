import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import fc from 'fast-check';
import { RepositoryCard } from './ToolsHub';
import type { GitHubRepo } from '@/types';

/**
 * Property-Based Tests for ToolsHub Component
 * Feature: nextjs-portfolio
 */

// Arbitrary generator for GitHubRepo
const gitHubRepoArbitrary = fc.record({
  id: fc.integer({ min: 1, max: 1000000 }),
  name: fc.string({ minLength: 1, maxLength: 100 }).filter((s) => s.trim().length > 0),
  description: fc.oneof(
    fc.constant(null),
    fc.string({ minLength: 1, maxLength: 200 })
  ),
  language: fc.oneof(
    fc.constant(null),
    fc.constantFrom('TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'Ruby')
  ),
  languageColor: fc.oneof(
    fc.constant(null),
    fc.hexaString({ minLength: 6, maxLength: 6 }).map((hex) => `#${hex}`)
  ),
  stars: fc.integer({ min: 0, max: 100000 }),
  forks: fc.integer({ min: 0, max: 50000 }),
  url: fc.webUrl(),
});

describe('ToolsHub Property-Based Tests', () => {
  /**
   * Feature: nextjs-portfolio, Property 9: Repository card required fields
   * For any GitHub repository card displayed, the rendered output SHALL contain
   * repo name, description, language color dot, stars count, and forks count.
   * Validates: Requirements 5.5
   */
  it('property: repository card contains all required fields', () => {
    fc.assert(
      fc.property(gitHubRepoArbitrary, (repo: GitHubRepo) => {
        const { container } = render(<RepositoryCard repo={repo} />);

        // Verify repo name is present
        const repoName = screen.getByTestId('repo-name');
        expect(repoName).toBeInTheDocument();
        expect(repoName.textContent).toBe(repo.name);

        // Verify description is present (or fallback text)
        const repoDescription = screen.getByTestId('repo-description');
        expect(repoDescription).toBeInTheDocument();
        if (repo.description) {
          expect(repoDescription.textContent).toBe(repo.description);
        } else {
          expect(repoDescription.textContent).toBe('No description available');
        }

        // Verify metadata section exists
        const metadata = screen.getByTestId('repo-metadata');
        expect(metadata).toBeInTheDocument();

        // Verify language color dot is present if language exists
        if (repo.language) {
          const languageElement = screen.getByTestId('repo-language');
          expect(languageElement).toBeInTheDocument();
          expect(languageElement.textContent).toContain(repo.language);
        }

        // Verify stars count is present
        const starsElement = screen.getByTestId('repo-stars');
        expect(starsElement).toBeInTheDocument();
        expect(starsElement.textContent).toBe(repo.stars.toString());

        // Verify forks count is present
        const forksElement = screen.getByTestId('repo-forks');
        expect(forksElement).toBeInTheDocument();
        expect(forksElement.textContent).toBe(repo.forks.toString());

        // Verify the card links to the correct URL
        const card = container.querySelector('a');
        expect(card).toHaveAttribute('href', repo.url);
        expect(card).toHaveAttribute('target', '_blank');
        expect(card).toHaveAttribute('rel', 'noopener noreferrer');
      }),
      { numRuns: 100 }
    );
  });
});
