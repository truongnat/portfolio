import { lazy, Suspense } from 'react';
import type { Project } from '@/types';

const ProjectsClient = lazy(() => import('./Projects.client').then(mod => ({ default: mod.ProjectsClient })));

interface ProjectsProps {
  initialProjects?: Project[];
}

export function Projects(props: ProjectsProps) {
  return (
    <Suspense fallback={
      <section id="projects" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 bg-muted/20 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
            <div className="h-6 bg-muted/20 rounded-lg animate-pulse max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted/20 rounded mb-4" />
                <div className="h-4 bg-muted/20 rounded mb-2" />
                <div className="h-4 bg-muted/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    }>
      <ProjectsClient {...props} />
    </Suspense>
  );
}
