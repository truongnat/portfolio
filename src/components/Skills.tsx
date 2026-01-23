import { lazy, Suspense } from 'react';

const SkillsClient = lazy(() => import('./Skills.client').then(mod => ({ default: mod.SkillsClient })));

export function Skills() {
  return (
    <Suspense fallback={
      <section id="skills" className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-muted/20 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
            <div className="h-6 bg-muted/20 rounded-lg animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-8 bg-muted/20 rounded mb-4" />
                <div className="h-4 bg-muted/20 rounded mb-2" />
                <div className="h-4 bg-muted/20 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    }>
      <SkillsClient />
    </Suspense>
  );
}
