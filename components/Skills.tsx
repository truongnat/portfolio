'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
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
import { skillsConfig, type ExpertiseRing, type SkillPill, type SkillCategory } from '@/lib/config';

interface SkillsProps {
  expertiseRings?: ExpertiseRing[];
  skillPills?: SkillPill[];
}



export function Skills({
  expertiseRings = skillsConfig.expertiseRings,
  skillPills = skillsConfig.skillPills,
}: SkillsProps) {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
    freezeOnceVisible: true
  });
  const shouldReduceMotion = useSafeReducedMotion();
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
          className={`transition-all duration-300 ${isComplete ? 'drop-shadow-[0_0_8px_currentColor]' : ''
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
  const shouldReduceMotion = useSafeReducedMotion();

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
