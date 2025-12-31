import dynamic from 'next/dynamic';

// Dynamically import Butterfly component (decorative, non-critical)
const ButterflyClient = dynamic(() => import('./Butterfly.client'), {
  loading: () => null, // No loading state needed for decorative element
});

export function Butterfly() {
  return <ButterflyClient />;
}
