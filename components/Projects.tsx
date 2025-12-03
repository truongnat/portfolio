'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import type { Project, ProjectCategory } from '@/types';
import { getFeaturedProjects } from '@/app/(landing)/actions';

interface ProjectsProps {
  initialProjects?: Project[];
}

const categories: ProjectCategory[] = ['All', 'AI', 'Web', 'Mobile', 'Open Source'];

export function Projects({ initialProjects = [] }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>('All');
  const [isLoading, setIsLoading] = useState(initialProjects.length === 0);
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const shouldReduceMotion = useSafeReducedMotion();

  // Fetch projects on mount if not provided
  useEffect(() => {
    if (initialProjects.length === 0) {
      fetchProjects();
    }
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await getFeaturedProjects();
      setProjects(data || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter projects based on selected category
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter((project) => project.category === selectedCategory);

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
      className="relative py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A showcase of my recent work across different domains
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-2 rounded-full font-medium transition-all duration-200
                ${selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found in this category.</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      whileHover={
        shouldReduceMotion
          ? {}
          : {
            y: -8,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }
      }
      data-testid={`project-card-${project.id}`}
      data-project-title={project.title}
      data-project-category={project.category}
    >
      {/* Glowing border effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg border-2 border-primary/50 blur-sm" />
      </div>

      {/* Screenshot */}
      {project.screenshot && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <motion.div
            className="w-full h-full"
            whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={project.screenshot}
              alt={`${project.title} screenshot`}
              fill
              className="object-cover"
              data-testid="project-screenshot"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="p-6" data-testid="project-content">
        {/* Title */}
        <h3 className="text-xl font-bold mb-2" data-testid="project-title">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid="project-description">
          {project.description}
        </p>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-4" data-testid="project-tech-stack">
          {project?.tech_stack?.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full"
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              data-testid="live-demo-button"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
              data-testid="github-button"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
