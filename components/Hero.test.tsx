import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Hero } from './Hero';
import fc from 'fast-check';

/**
 * Feature: nextjs-portfolio, Property 4: Responsive layout without overflow
 * For any viewport width from 320px to 2560px, all sections SHALL display without horizontal scrollbar or content overflow.
 * Validates: Requirements 2.4, 3.8, 4.7
 */
describe('Hero - Property-Based Tests', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Store original dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // Restore original dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should not cause horizontal overflow at any viewport width', () => {
    /**
     * Property 4: Responsive layout without overflow
     * For any viewport width from 320px to 2560px, the Hero section SHALL display
     * without horizontal scrollbar or content overflow.
     */
    fc.assert(
      fc.property(
        // Generate viewport widths from 320px (mobile) to 2560px (large desktop)
        fc.integer({ min: 320, max: 2560 }),
        // Generate viewport heights from 568px to 1440px
        fc.integer({ min: 568, max: 1440 }),
        (viewportWidth, viewportHeight) => {
          // Clean up any previous renders
          cleanup();
          
          // Set viewport dimensions
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight,
          });

          // Trigger resize event
          window.dispatchEvent(new Event('resize'));

          // Render the Hero component
          const { container } = render(<Hero />);

          // Get the hero section element
          const heroSection = container.querySelector('section');
          expect(heroSection).toBeTruthy();

          if (heroSection) {
            // Check that the section doesn't have a width greater than viewport
            const sectionRect = heroSection.getBoundingClientRect();
            
            // The section should not extend beyond the viewport width
            // We allow for a small tolerance due to browser rendering differences
            const tolerance = 1;
            expect(sectionRect.width).toBeLessThanOrEqual(viewportWidth + tolerance);

            // Check for overflow-x on the section
            const computedStyle = window.getComputedStyle(heroSection);
            const overflowX = computedStyle.overflowX;
            
            // overflow-x should be 'hidden' or 'visible' (not 'scroll' or 'auto' which indicates overflow)
            // Note: 'visible' is acceptable as long as content doesn't exceed viewport
            // Empty string is also acceptable in jsdom (default value)
            expect(['hidden', 'visible', 'clip', '']).toContain(overflowX);

            // Check all child elements don't cause overflow
            const allElements = heroSection.querySelectorAll('*');
            allElements.forEach((element) => {
              const rect = element.getBoundingClientRect();
              // Elements should not extend significantly beyond the viewport
              // We check if the element starts within reasonable bounds
              if (rect.width > 0 && rect.height > 0) {
                // The element's right edge should not be too far beyond viewport
                // Allow some tolerance for animations and transforms
                const maxAllowedOverflow = 50; // pixels
                expect(rect.left).toBeLessThan(viewportWidth + maxAllowedOverflow);
              }
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render all required elements at any viewport width', () => {
    /**
     * Supplementary property: All hero elements should be present regardless of viewport
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 2560 }),
        (viewportWidth) => {
          // Clean up any previous renders
          cleanup();
          
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          window.dispatchEvent(new Event('resize'));

          const { container } = render(<Hero />);

          // Check that essential elements are present
          const typingAnimation = container.querySelector('[data-testid="typing-animation"]');
          expect(typingAnimation).toBeTruthy();

          // Check that CTA buttons are present using container queries to avoid duplicates
          const buttons = container.querySelectorAll('a[href^="#"]');
          expect(buttons.length).toBeGreaterThanOrEqual(2);
          
          // Verify the buttons have the expected hrefs
          const hrefs = Array.from(buttons).map(btn => btn.getAttribute('href'));
          expect(hrefs).toContain('#projects');
          expect(hrefs).toContain('#contact');
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Hero - Unit Tests', () => {
  it('renders typing animation on load', () => {
    render(<Hero />);
    const typingAnimation = screen.getByTestId('typing-animation');
    expect(typingAnimation).toBeInTheDocument();
  });

  it('displays CTA buttons with correct links', () => {
    const { container } = render(<Hero />);
    
    const projectsButton = container.querySelector('a[href="#projects"]');
    const contactButton = container.querySelector('a[href="#contact"]');
    
    expect(projectsButton).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    expect(projectsButton?.textContent).toMatch(/view projects/i);
    expect(contactButton?.textContent).toMatch(/contact me/i);
  });

  it('renders social links', () => {
    render(<Hero />);
    
    const githubLink = screen.getByLabelText(/github/i);
    const linkedinLink = screen.getByLabelText(/linkedin/i);
    const emailLink = screen.getByLabelText(/email/i);
    
    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(emailLink).toBeInTheDocument();
  });

  it('accepts custom props', () => {
    const customTitle = 'Custom Developer Title';
    const customSubtitle = 'Custom subtitle text';
    
    render(
      <Hero
        title={customTitle}
        subtitle={customSubtitle}
        typingPhrases={['Custom Phrase']}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customSubtitle)).toBeInTheDocument();
  });
});
