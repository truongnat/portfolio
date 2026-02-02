'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ExternalLink } from 'lucide-react';
import type { Project, ProjectCategory } from '@/types';

import { projectsConfig, uiStrings, projectCategories as categories } from '@/lib/config';

export function ProjectsClient() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const shouldReduceMotion = useSafeReducedMotion();

  // Map config projects to the Project type once
  const allProjects: Project[] = projectsConfig.map(p => {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      tech_stack: p.techStack,
      categories: p.categories,
      screenshot: null,
      live_url: p.link || null,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      display_order: 0,
    };
  });

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter((project) => project.categories.includes(selectedCategory));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono">
            {uiStrings.projects.title}
          </h2>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            {uiStrings.projects.subtitle}
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-200 border
                ${selectedCategory === category
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-transparent text-muted-foreground border-border hover:border-muted-foreground/50'
                }
              `}
              data-testid={`filter-tab-${category}`}
              data-active={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono text-sm text-destructive">{uiStrings.projects.emptyMessage}</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            data-testid="projects-grid"
          >
            <AnimatePresence mode="wait">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} variants={itemVariants} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

interface ProjectCardProps {
  project: Project;
  variants?: any;
}

export function ProjectCard({ project, variants }: ProjectCardProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <motion.div
      layout
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="group relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-muted-foreground/30"
      whileHover={
        shouldReduceMotion
          ? {}
          : {
            y: -4,
          }
      }
      data-testid={`project-card-${project.id}`}
      data-project-title={project.title}
      data-project-categories={project.categories.join(' ')}
    >
      {/* Screenshot */}
      {project.screenshot && (
        <div className="relative h-48 overflow-hidden bg-muted border-b border-border">
          <motion.div
            className="w-full h-full"
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={project.screenshot}
              alt={`${project.title} screenshot`}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              data-testid="project-screenshot"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="p-6" data-testid="project-content">
        {/* Title */}
        <h3 className="text-lg font-bold mb-3 font-mono tracking-tight" data-testid="project-title">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed" data-testid="project-description">
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-6" data-testid="project-tech-stack">
          {project?.tech_stack?.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-0.5 text-[10px] font-mono border border-border bg-muted/30 text-muted-foreground rounded"
              data-testid={`tech-badge-${tech}`}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3" data-testid="project-actions">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-foreground text-background rounded-md hover:opacity-90 transition-opacity text-xs font-bold font-mono"
              data-testid="live-demo-button"
            >
              <ExternalLink className="h-3 w-3" />
              {uiStrings.projects.viewLive}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
