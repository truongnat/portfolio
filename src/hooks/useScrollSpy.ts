'use client';

import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook for tracking which section is currently in view
 * Useful for table of contents highlighting
 * 
 * @param ids - Array of element IDs to track (in order)
 * @param options - IntersectionObserver options
 * @returns ID of the currently active section
 */
export function useScrollSpy(
  ids: string[],
  options: IntersectionObserverInit = {}
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const intersectingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            intersectingIds.current.add(entry.target.id);
          } else {
            intersectingIds.current.delete(entry.target.id);
          }
        });

        // Find the first ID from the ordered list that is currently intersecting
        const visibleId = ids.find((id) => intersectingIds.current.has(id));
        
        // If we found a visible ID, update state. 
        // If not (e.g. scrolled past everything or between sections), we might keep the last one or clear it.
        // For a smooth experience, we usually want to keep the last active one if nothing is strictly "intersecting" 
        // but often 'rootMargin' ensures something is always intersecting.
        if (visibleId) {
          setActiveId(visibleId);
        }
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
      intersectingIds.current.clear();
    };
  }, [ids, options]);

  return activeId;
}
