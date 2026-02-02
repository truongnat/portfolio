'use client';

import { motion, type Variants } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { skillsConfig, uiStrings } from '@/lib/config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function SkillsClient() {
  const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
    freezeOnceVisible: true
  });
  const shouldReduceMotion = useSafeReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
      },
    },
  };

  const itemVariants: Variants = {
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
      className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight font-mono">
            {uiStrings.skills.title}
          </h2>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            {uiStrings.skills.subtitle}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {skillsConfig.cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.id} variants={itemVariants} className="h-full">
                <Card className="h-full bg-card/50 border-border hover:border-foreground/20 transition-all rounded-xl">
                  <CardHeader className="pb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-lg bg-secondary text-foreground">
                        <Icon size={20} />
                      </div>
                      {card.level && (
                        <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-tighter px-2 py-0 border-border text-muted-foreground">
                          {card.level}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold font-mono tracking-tight">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {card.subSections.map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        {section.label && (
                          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 font-mono">
                            {section.label}
                          </h4>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                          {section.skills.map((skill, sIdx) => {
                            const { tech, desc } = parseSkill(skill);
                            return (
                              <div key={sIdx} className="inline-flex items-center gap-1.5 bg-secondary/30 rounded-md px-2.5 py-1 border border-border/50 hover:border-border transition-colors">
                                <span className="font-medium text-xs text-foreground font-mono">{tech}</span>
                                {desc && (
                                  <span className="text-[10px] text-muted-foreground font-mono opacity-70">{desc}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        {section.highlight && (
                          <div className="text-[11px] text-muted-foreground border-l border-border pl-4 py-1 font-mono leading-relaxed opacity-80">
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
