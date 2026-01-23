import { lazy, Suspense } from 'react';

// Dynamically import ScrollToTop component (non-critical UI enhancement)
const ScrollToTopClient = lazy(() => import('./ScrollToTop.client').then(mod => ({ default: mod.default || mod.ScrollToTopClient })));

export function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopClient />
    </Suspense>
  );
}
