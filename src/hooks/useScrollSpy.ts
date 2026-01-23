'use client';

import { useEffect, useState } from 'react';

/**
 * Custom hook for tracking which section is currently in view
 * Useful for table of contents highlighting
 * 
 * @param ids - Array of element IDs to track
 * @param options - IntersectionObserver options
 * @returns ID of the currently active section
 */
export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -35% 0px',
        threshold: 0,
        ...options,
      }
    );

    // Observe all elements with the provided IDs
    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      ids.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [ids, options]);

  return activeId;
}
