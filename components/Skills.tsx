'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useRef, useState, useEffect } from 'react';
import {
  Code2,
  Brain,
  Layers,
  Database,
  Cloud,
  Sparkles,
  Rocket,
  Terminal,
  GitBranch,
  Package,
  Server,
  Palette,
  Search,
  BarChart,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

export interface ExpertiseRing {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

export interface SkillPill {
  id: string;
  name: string;
  icon: LucideIcon;
  category: SkillCategory;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Tools';

interface SkillsProps {
  expertiseRings?: ExpertiseRing[];
  skillPills?: SkillPill[];
}

const defaultExpertiseRings: ExpertiseRing[] = [
  {
    id: 'ai-ml',
    label: 'AI & Machine Learning',
    percentage: 94,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'fullstack-ts',
    label: 'Full-Stack TypeScript',
    percentage: 92,
    color: 'hsl(var(--accent))',
  },
  {
    id: 'system-design',
    label: 'System Design & Architecture',
    percentage: 90,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'python-ds',
    label: 'Python & Data Science',
    percentage: 96,
    color: 'hsl(var(--accent))',
  },
  {
    id: 'devops-cloud',
    label: 'DevOps & Cloud',
    percentage: 85,
    color: 'hsl(var(--primary))',
  },
  {
    id: 'prompt-eng',
    label: 'Prompt Engineering & LLMs',
    percentage: 98,
    color: 'hsl(var(--accent))',
  },
];

const defaultSkillPills: SkillPill[] = [
  // Frontend
  { id: 'react', name: 'React', icon: Code2, category: 'Frontend' },
  { id: 'nextjs', name: 'Next.js', icon: Rocket, category: 'Frontend' },
  { id: 'typescript', name: 'TypeScript', icon: Code2, category: 'Frontend' },
  { id: 'tailwind', name: 'Tailwind CSS', icon: Palette, category: 'Frontend' },
  { id: 'vue', name: 'Vue.js', icon: Code2, category: 'Frontend' },
  
  // Backend
  { id: 'nodejs', name: 'Node.js', icon: Server, category: 'Backend' },
  { id: 'python', name: 'Python', icon: Terminal, category: 'Backend' },
  { id: 'graphql', name: 'GraphQL', icon: Database, category: 'Backend' },
  { id: 'postgresql', name: 'PostgreSQL', icon: Database, category: 'Backend' },
  { id: 'mongodb', name: 'MongoDB', icon: Database, category: 'Backend' },
  
  // AI/ML
  { id: 'tensorflow', name: 'TensorFlow', icon: Brain, category: 'AI/ML' },
  { id: 'pytorch', name: 'PyTorch', icon: Brain, category: 'AI/ML' },
  { id: 'openai', name: 'OpenAI', icon: Sparkles, category: 'AI/ML' },
  { id: 'langchain', name: 'LangChain', icon: MessageSquare, category: 'AI/ML' },
  { id: 'huggingface', name: 'Hugging Face', icon: Brain, category: 'AI/ML' },
  
  // DevOps
  { id: 'docker', name: 'Docker', icon: Package, category: 'DevOps' },
  { id: 'kubernetes', name: 'Kubernetes', icon: Cloud, category: 'DevOps' },
  { id: 'aws', name: 'AWS', icon: Cloud, category: 'DevOps' },
  { id: 'cicd', name: 'CI/CD', icon: GitBranch, category: 'DevOps' },
  { id: 'terraform', name: 'Terraform', icon: Layers, category: 'DevOps' },
  
  // Tools
  { id: 'git', name: 'Git', icon: GitBranch, category: 'Tools' },
  { id: 'vscode', name: 'VS Code', icon: Code2, category: 'Tools' },
  { id: 'figma', name: 'Figma', icon: Palette, category: 'Tools' },
  { id: 'analytics', name: 'Analytics', icon: BarChart, category: 'Tools' },
  { id: 'seo', name: 'SEO', icon: Search, category: 'Tools' },
];

export function Skills({
  expertiseRings = defaultExpertiseRings,
  skillPills = defaultSkillPills,
}: SkillsProps) {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({ 
    threshold: 0.2,
    freezeOnceVisible: true 
  });
  const shouldReduceMotion = useReducedMotion();
  const [animatedPercentages, setAnimatedPercentages] = useState<Record<string, number>>({});

  // Animate progress rings when in view
  useEffect(() => {
    if (isInView && Object.keys(animatedPercentages).length === 0) {
      expertiseRings.forEach((ring) => {
        animateRing(ring.id, ring.percentage);
      });
    }
  }, [isInView, expertiseRings, animatedPercentages]);

  const animateRing = (id: string, targetPercentage: number) => {
    if (shouldReduceMotion) {
      setAnimatedPercentages((prev) => ({ ...prev, [id]: targetPercentage }));
      return;
    }

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = targetPercentage / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const currentPercentage = Math.min(increment * currentStep, targetPercentage);
      
      setAnimatedPercentages((prev) => ({ ...prev, [id]: currentPercentage }));

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, duration / steps);
  };

  // Group skills by category
  const skillsByCategory = skillPills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, SkillPill[]>);

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
      id="skills"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Moving gradient mesh background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, hsl(var(--accent) / 0.15) 0%, transparent 50%),
              radial-gradient(circle at 40% 20%, hsl(var(--primary) / 0.1) 0%, transparent 50%)
            `,
          }}
          animate={
            shouldReduceMotion
              ? {}
              : {
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical capabilities and areas of expertise
          </p>
        </motion.div>

        {/* Expertise Rings */}
        <div className="mb-20">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {expertiseRings.map((ring) => (
              <motion.div
                key={ring.id}
                variants={itemVariants}
                className="flex flex-col items-center"
                data-testid={`expertise-ring-${ring.id}`}
              >
                <ProgressRing
                  percentage={animatedPercentages[ring.id] || 0}
                  targetPercentage={ring.percentage}
                  color={ring.color}
                  size={140}
                  strokeWidth={8}
                />
                <p className="mt-4 text-sm text-center font-medium max-w-[140px]">
                  {ring.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Skill Pills */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-8"
        >
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <motion.div key={category} variants={itemVariants}>
              <h3 className="text-xl font-semibold mb-4 text-muted-foreground">
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <SkillPillComponent key={skill.id} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

interface ProgressRingProps {
  percentage: number;
  targetPercentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

function ProgressRing({
  percentage,
  targetPercentage,
  color,
  size = 120,
  strokeWidth = 8,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const isComplete = Math.abs(percentage - targetPercentage) < 0.5;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        data-testid="progress-ring-svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-300 ${
            isComplete ? 'drop-shadow-[0_0_8px_currentColor]' : ''
          }`}
          style={{ color }}
          data-testid="progress-ring-circle"
          data-percentage={percentage}
        />
      </svg>
      
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold" data-testid="progress-ring-percentage">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

interface SkillPillComponentProps {
  skill: SkillPill;
}

function SkillPillComponent({ skill }: SkillPillComponentProps) {
  const Icon = skill.icon;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="group relative px-4 py-2 rounded-full border border-border bg-card hover:bg-accent/10 transition-all duration-200 cursor-default"
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              scale: 1.05,
              backgroundImage: 'linear-gradient(135deg, hsl(var(--accent) / 0.1) 0%, hsl(var(--primary) / 0.1) 100%)',
            }
      }
      data-testid={`skill-pill-${skill.id}`}
      data-skill-name={skill.name}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        <span className="text-sm font-medium">{skill.name}</span>
      </div>
    </motion.div>
  );
}
