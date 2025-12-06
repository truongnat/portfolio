'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { skillsConfig } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import React from 'react';

export function Skills() {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true
  });
  const shouldReduceMotion = useSafeReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
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

  const parseSkill = (skillStr: string) => {
    const match = skillStr.match(/^(.*?)\s*(\(.*\))$/);
    if (match) {
      return {
        tech: match[1],
        desc: match[2]
      };
    }
    return { tech: skillStr, desc: null };
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background/50"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Technical Expertise
          </h2>
          <p className="text-lg text-muted-foreground/80 font-medium max-w-2xl mx-auto">
            Senior Fullstack Engineer & Team Leader
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillsConfig.cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.id} variants={itemVariants} className="h-full">
                <Card className="h-full border-primary/10 bg-card/50 backdrop-blur-md hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 group">
                  <CardHeader className="pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <Icon size={24} />
                      </div>
                      {card.level && (
                        <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-background/50 backdrop-blur border-primary/20 text-primary">
                          {card.level}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold leading-tight">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {card.subSections.map((section, idx) => (
                      <div key={idx} className="space-y-3">
                        {section.label && (
                          <h4 className="text-xs uppercase tracking-wider font-bold text-muted-foreground/70 flex items-center gap-2">
                            {section.label}
                          </h4>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          {section.skills.map((skill, sIdx) => {
                            const { tech, desc } = parseSkill(skill);
                            return (
                              <div key={sIdx} className="inline-flex items-center gap-1.5 bg-secondary/50 rounded-full px-3 py-1 border border-secondary transition-colors hover:bg-secondary">
                                <span className="font-semibold text-sm text-secondary-foreground">{tech}</span>
                                {desc && (
                                  <span className="text-xs text-muted-foreground font-normal">{desc}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {section.highlight && (
                          <div className="text-xs text-muted-foreground border-l-2 border-primary/30 pl-3 py-1 italic bg-primary/5 rounded-r-md">
                            {section.highlight}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
