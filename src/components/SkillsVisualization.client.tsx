'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Brain, Layers, Server, Linkedin, Mail, Users, type LucideIcon } from 'lucide-react';

interface SkillLevel {
  name: string;
  level: number; // 0-100
}

interface SkillCategoryWithLevels {
  id: string;
  title: string;
  icon: LucideIcon;
  skills: SkillLevel[];
}

export function SkillsVisualizationClient() {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  });
  const shouldReduceMotion = useSafeReducedMotion();

  const skillsData: SkillCategoryWithLevels[] = [
    {
      id: 'ai-agentic',
      title: 'AI & Agentic Systems',
      icon: Brain,
      skills: [
        { name: 'Agentic AI', level: 95 },
        { name: 'LLMs', level: 90 },
        { name: 'LangGraph', level: 85 },
        { name: 'CrewAI', level: 80 },
        { name: 'Prompt Engineering', level: 90 },
        { name: 'Multi-agent Orchestration', level: 85 }
      ]
    },
    {
      id: 'frontend-crossplatform',
      title: 'Core Stack & Cross-Platform',
      icon: Layers,
      skills: [
        { name: 'TypeScript', level: 95 },
        { name: 'React', level: 90 },
        { name: 'React Native', level: 85 },
        { name: 'Electron.js', level: 80 },
        { name: 'Vue.js', level: 85 },
        { name: 'D3.js', level: 75 }
      ]
    },
    {
      id: 'backend-devops',
      title: 'Backend & DevOps',
      icon: Server,
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Python', level: 85 },
        { name: 'PostgreSQL', level: 80 },
        { name: 'Docker', level: 85 },
        { name: 'Jenkins', level: 75 },
        { name: 'Linux/Ubuntu', level: 80 }
      ]
    }
  ];

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
      id="skills-visualization"
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
            Skills & Proficiency
          </h2>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            Technical Expertise by Category
          </p>
        </motion.div>

        {/* Skills categories */}
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {skillsData.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              className="bg-card p-6 rounded-lg border border-border"
            >
              <div className="flex items-center mb-8">
                <category.icon className="h-6 w-6 text-foreground mr-3" />
                <h3 className="text-2xl font-bold">{category.title}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-foreground h-2.5 rounded-full"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}