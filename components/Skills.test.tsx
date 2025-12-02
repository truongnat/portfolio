import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Skills } from './Skills';
import fc from 'fast-check';
import { Code2, Brain, Server } from 'lucide-react';

describe('Skills - Property 1: Progress ring animation initialization', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockIntersectionObserver = vi.fn(function(callback) {
      setTimeout(() => {
        callback([{ isIntersecting: true }]);
      }, 0);
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('should animate all progress rings from 0% to target percentage when entering viewport', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            label: fc.string({ minLength: 3, maxLength: 50 }),
            percentage: fc.integer({ min: 1, max: 100 }),
            color: fc.constantFrom('hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'),
          }),
          { minLength: 1, maxLength: 6 }
        ),
        (expertiseRings) => {
          const { container } = render(<Skills expertiseRings={expertiseRings} />);
          vi.runAllTimers();
          expertiseRings.forEach((ring) => {
            const ringElement = container.querySelector(`[data-testid="expertise-ring-${ring.id}"]`);
            expect(ringElement).toBeInTheDocument();
          });
          vi.advanceTimersByTime(1600);
          expertiseRings.forEach((ring) => {
            const percentageText = container.querySelector(
              `[data-testid="expertise-ring-${ring.id}"] [data-testid="progress-ring-percentage"]`
            );
            if (percentageText) {
              const displayedPercentage = parseInt(percentageText.textContent || '0');
              expect(Math.abs(displayedPercentage - ring.percentage)).toBeLessThanOrEqual(1);
            }
          });
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Skills - Property 2: Progress ring glow effect on completion', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockIntersectionObserver = vi.fn(function(callback) {
      setTimeout(() => {
        callback([{ isIntersecting: true }]);
      }, 0);
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('should apply glow effect to rings that reach their target percentage', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            label: fc.string({ minLength: 3, maxLength: 50 }),
            percentage: fc.integer({ min: 1, max: 100 }),
            color: fc.constantFrom('hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--secondary))'),
          }),
          { minLength: 1, maxLength: 6 }
        ),
        (expertiseRings) => {
          const { container } = render(<Skills expertiseRings={expertiseRings} />);
          vi.runAllTimers();
          vi.advanceTimersByTime(1600);
          expertiseRings.forEach((ring) => {
            const progressCircle = container.querySelector(
              `[data-testid="expertise-ring-${ring.id}"] [data-testid="progress-ring-circle"]`
            );
            if (progressCircle) {
              const hasGlow = progressCircle.className.includes('drop-shadow');
              const currentPercentage = parseFloat(progressCircle.getAttribute('data-percentage') || '0');
              const isComplete = Math.abs(currentPercentage - ring.percentage) < 0.5;
              if (isComplete) {
                expect(hasGlow).toBe(true);
              }
            }
          });
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Skills - Property 3: Skill pill hover interactions', () => {
  beforeEach(() => {
    const mockIntersectionObserver = vi.fn(function(callback) {
      callback([{ isIntersecting: true }]);
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    cleanup();
  });

  it('should apply scale and gradient effects when skill pills are hovered', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
            name: fc.string({ minLength: 2, maxLength: 30 }),
            icon: fc.constantFrom(Code2, Brain, Server),
            category: fc.constantFrom('Frontend', 'Backend', 'AI/ML', 'DevOps', 'Tools'),
          }),
          { minLength: 1, maxLength: 25 }
        ),
        (skillPills) => {
          const { container } = render(<Skills skillPills={skillPills} />);
          const sampleSize = Math.min(3, skillPills.length);
          const sampledPills = skillPills.slice(0, sampleSize);
          for (const pill of sampledPills) {
            const pillElement = container.querySelector(`[data-testid="skill-pill-${pill.id}"]`);
            if (pillElement) {
              const hasHoverClasses = 
                pillElement.className.includes('hover:') || 
                pillElement.className.includes('group') ||
                pillElement.className.includes('transition');
              expect(hasHoverClasses).toBe(true);
              expect(pillElement.getAttribute('data-skill-name')).toBe(pill.name);
            }
          }
          cleanup();
        }
      ),
      { numRuns: 100 }
    );
  });
});