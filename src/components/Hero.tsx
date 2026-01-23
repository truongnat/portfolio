import { lazy, Suspense } from 'react';

// Dynamically import the client component with Framer Motion
const HeroClient = lazy(() => import('./Hero.client').then(mod => ({ default: mod.HeroClient })));

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  typingPhrases?: string[];
  ctaButtons?: CTAButton[];
}

export function Hero(props: HeroProps) {
  return (
    <Suspense fallback={
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pb-32 sm:pb-0 pt-24 sm:pt-16"
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="h-16 bg-muted/20 rounded-lg animate-pulse mb-6" />
          <div className="h-8 bg-muted/20 rounded-lg animate-pulse mb-6 max-w-md mx-auto" />
          <div className="h-6 bg-muted/20 rounded-lg animate-pulse max-w-2xl mx-auto" />
        </div>
      </section>
    }>
      <HeroClient {...props} />
    </Suspense>
  );
}
