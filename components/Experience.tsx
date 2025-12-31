import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import type { Experience } from '@/lib/config';

const ExperienceClient = dynamic(() => import('./Experience.client').then(mod => ({ default: mod.ExperienceClient })), {
  loading: () => (
    <section id="experience" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-12 bg-muted/20 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
          <div className="h-6 bg-muted/20 rounded-lg animate-pulse max-w-2xl mx-auto" />
        </div>
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-muted/20 rounded mb-4" />
              <div className="h-4 bg-muted/20 rounded mb-2 w-1/2" />
              <div className="h-4 bg-muted/20 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

interface ExperienceProps {
    experiences?: Experience[];
}

export function Experience(props: ExperienceProps) {
  return (
    <Suspense fallback={
      <section id="experience" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted/20 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
            <div className="h-6 bg-muted/20 rounded-lg animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="space-y-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-muted/20 rounded mb-4" />
                <div className="h-4 bg-muted/20 rounded mb-2 w-1/2" />
                <div className="h-4 bg-muted/20 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    }>
      <ExperienceClient {...props} />
    </Suspense>
  );
}
