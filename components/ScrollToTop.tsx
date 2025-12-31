import dynamic from 'next/dynamic';

// Dynamically import ScrollToTop component (non-critical UI enhancement)
const ScrollToTopClient = dynamic(() => import('./ScrollToTop.client'), {
  loading: () => null, // No loading state needed
});

export function ScrollToTop() {
  return <ScrollToTopClient />;
}
