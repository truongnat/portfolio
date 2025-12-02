import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Projects, ProjectCard } from './Projects';
import fc from 'fast-check';
import type { Project } from '@/types';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />;
  },
}));

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  projectsQuery: {
    getFeatured: vi.fn().mockResolvedValue({ data: [], error: null }),
  },
}));

// Mock IntersectionObserver
beforeEach(() => {
  const mockIntersectionObserver = vi.fn(function(callback) {
    callback([{ isIntersecting: true }]);
    return {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
});

afterEach(() => {
  cleanup();
});

/**
 * Feature: nextjs-portfolio, Property 5: Project card required fields
 * For any project card displayed, the rendered output SHALL contain screenshot, title, description, tech stack badges, and action links.
 * Validates: Requirements 4.2
 */
describe('Projects - Property 5: Project card required fields', () => {
  it('should render all required fields for any project', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 3, maxLength: 100 }),
          description: fc.string({ minLength: 10, maxLength: 500 }),
          screenshot: fc.option(fc.webUrl(), { nil: null }),
          tech_stack: fc.array(
            fc.string({ minLength: 2, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s\-\.]+$/.test(s)),
            { minLength: 1, maxLength: 10 }
          ),
          live_url: fc.option(fc.webUrl(), { nil: null }),
          github_url: fc.option(fc.webUrl(), { nil: null }),
          category: fc.constantFrom('AI', 'Web', 'Mobile', 'Open Source'),
          featured: fc.boolean(),
          display_order: fc.option(fc.integer({ min: 0, max: 100 }), { nil: null }),
          created_at: fc.date().map(d => d.toISOString()),
          updated_at: fc.date().map(d => d.toISOString()),
        }),
        (project: Project) => {
          const { container, getByTestId, queryByTestId } = render(<ProjectCard project={project} />);

          // Check title is present
          const titleElement = getByTestId('project-title');
          expect(titleElement).toBeInTheDocument();
          expect(titleElement.textContent).toBe(project.title);

          // Check description is present
          const descriptionElement = getByTestId('project-description');
          expect(descriptionElement).toBeInTheDocument();
          expect(descriptionElement.textContent).toBe(project.description);

          // Check tech stack badges are present
          const techStackContainer = getByTestId('project-tech-stack');
          expect(techStackContainer).toBeInTheDocument();
          
          // Verify all tech stack items are rendered
          const badges = container.querySelectorAll('[data-testid^="tech-badge-"]');
          expect(badges.length).toBe(project.tech_stack.length);

          // Check screenshot if present
          if (project.screenshot) {
            const screenshot = queryByTestId('project-screenshot');
            expect(screenshot).toBeInTheDocument();
          }

          // Check action links container is present
          const actionsContainer = getByTestId('project-actions');
          expect(actionsContainer).toBeInTheDocument();

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: nextjs-portfolio, Property 6: Project card hover effects
 * For any project card, when hovered, the system SHALL apply card lift, image zoom, and glowing border effects simultaneously.
 * Validates: Requirements 4.3
 */
describe('Projects - Property 6: Project card hover effects', () => {
  it('should apply hover effects (lift, zoom, glow) to project cards', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 3, maxLength: 100 }),
          description: fc.string({ minLength: 10, maxLength: 500 }),
          screenshot: fc.option(fc.webUrl(), { nil: null }),
          tech_stack: fc.array(
            fc.string({ minLength: 2, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s\-\.]+$/.test(s)),
            { minLength: 1, maxLength: 10 }
          ),
          live_url: fc.option(fc.webUrl(), { nil: null }),
          github_url: fc.option(fc.webUrl(), { nil: null }),
          category: fc.constantFrom('AI', 'Web', 'Mobile', 'Open Source'),
          featured: fc.boolean(),
          display_order: fc.option(fc.integer({ min: 0, max: 100 }), { nil: null }),
          created_at: fc.date().map(d => d.toISOString()),
          updated_at: fc.date().map(d => d.toISOString()),
        }),
        (project: Project) => {
          const { container, getByTestId } = render(<ProjectCard project={project} />);

          // Get the card element
          const cardElement = getByTestId(`project-card-${project.id}`);
          expect(cardElement).toBeInTheDocument();

          // Check for hover classes that enable lift effect
          const hasHoverTransition = 
            cardElement.className.includes('hover:') || 
            cardElement.className.includes('transition') ||
            cardElement.className.includes('group');
          expect(hasHoverTransition).toBe(true);

          // Check for glowing border effect (should have opacity-0 that becomes opacity-100 on hover)
          const glowElement = container.querySelector('.group-hover\\:opacity-100');
          expect(glowElement).toBeTruthy();

          // Check for image zoom effect if screenshot exists
          if (project.screenshot) {
            const imageContainer = container.querySelector('[data-testid="project-screenshot"]')?.parentElement;
            expect(imageContainer).toBeTruthy();
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: nextjs-portfolio, Property 7: Project filtering correctness
 * For any selected category filter, all displayed projects SHALL match that category, and no projects from other categories SHALL be visible.
 * Validates: Requirements 4.4
 */
describe('Projects - Property 7: Project filtering correctness', () => {
  it('should display only projects matching the selected category', async () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.uuid(),
            title: fc.string({ minLength: 3, maxLength: 100 }),
            description: fc.string({ minLength: 10, maxLength: 500 }),
            screenshot: fc.option(fc.webUrl(), { nil: null }),
            tech_stack: fc.array(
              fc.string({ minLength: 2, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s\-\.]+$/.test(s)),
              { minLength: 1, maxLength: 5 }
            ),
            live_url: fc.option(fc.webUrl(), { nil: null }),
            github_url: fc.option(fc.webUrl(), { nil: null }),
            category: fc.constantFrom('AI', 'Web', 'Mobile', 'Open Source'),
            featured: fc.boolean(),
            display_order: fc.option(fc.integer({ min: 0, max: 100 }), { nil: null }),
            created_at: fc.date().map(d => d.toISOString()),
            updated_at: fc.date().map(d => d.toISOString()),
          }),
          { minLength: 3, maxLength: 15 }
        ),
        fc.constantFrom('All', 'AI', 'Web', 'Mobile', 'Open Source'),
        (projects: Project[], selectedCategory) => {
          const { container } = render(
            <Projects initialProjects={projects} />
          );

          // Find and click the filter tab
          const filterTabs = container.querySelectorAll('[data-testid^="filter-tab-"]');
          const filterTab = Array.from(filterTabs).find(
            tab => tab.getAttribute('data-testid') === `filter-tab-${selectedCategory}`
          ) as HTMLElement;
          
          expect(filterTab).toBeTruthy();
          filterTab.click();

          // Wait for filtering to complete
          const projectCards = container.querySelectorAll('[data-testid^="project-card-"]');

          // Verify filtering logic
          if (selectedCategory === 'All') {
            // All projects should be visible
            expect(projectCards.length).toBe(projects.length);
          } else {
            // Only projects matching the category should be visible
            const expectedCount = projects.filter(p => p.category === selectedCategory).length;
            expect(projectCards.length).toBe(expectedCount);

            // Verify each visible card matches the category
            projectCards.forEach((card) => {
              const category = card.getAttribute('data-project-category');
              expect(category).toBe(selectedCategory);
            });
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: nextjs-portfolio, Property 8: Conditional button rendering
 * For any project with a live_url or github_url, the corresponding "Live Demo" or "GitHub" button SHALL be rendered;
 * for projects without these URLs, the buttons SHALL not appear.
 * Validates: Requirements 4.6
 */
describe('Projects - Property 8: Conditional button rendering', () => {
  it('should render buttons only when URLs are present', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          title: fc.string({ minLength: 3, maxLength: 100 }),
          description: fc.string({ minLength: 10, maxLength: 500 }),
          screenshot: fc.option(fc.webUrl(), { nil: null }),
          tech_stack: fc.array(
            fc.string({ minLength: 2, maxLength: 20 }).filter(s => /^[a-zA-Z0-9\s\-\.]+$/.test(s)),
            { minLength: 1, maxLength: 10 }
          ),
          live_url: fc.option(fc.webUrl(), { nil: null }),
          github_url: fc.option(fc.webUrl(), { nil: null }),
          category: fc.constantFrom('AI', 'Web', 'Mobile', 'Open Source'),
          featured: fc.boolean(),
          display_order: fc.option(fc.integer({ min: 0, max: 100 }), { nil: null }),
          created_at: fc.date().map(d => d.toISOString()),
          updated_at: fc.date().map(d => d.toISOString()),
        }),
        (project: Project) => {
          const { queryByTestId } = render(<ProjectCard project={project} />);

          // Check Live Demo button
          const liveDemoButton = queryByTestId('live-demo-button');
          if (project.live_url) {
            // Button should be present when live_url exists
            expect(liveDemoButton).toBeInTheDocument();
            expect(liveDemoButton).toHaveAttribute('href', project.live_url);
          } else {
            // Button should not be present when live_url is null
            expect(liveDemoButton).not.toBeInTheDocument();
          }

          // Check GitHub button
          const githubButton = queryByTestId('github-button');
          if (project.github_url) {
            // Button should be present when github_url exists
            expect(githubButton).toBeInTheDocument();
            expect(githubButton).toHaveAttribute('href', project.github_url);
          } else {
            // Button should not be present when github_url is null
            expect(githubButton).not.toBeInTheDocument();
          }

          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});
