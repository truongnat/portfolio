'use client';

import { motion, type Variants } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Calendar, Building } from 'lucide-react';
import { workExperience, uiStrings, type Experience } from '@/lib/config';

interface ExperienceProps {
    experiences?: Experience[];
}

export function ExperienceClient({ experiences = workExperience }: ExperienceProps) {
    const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
        threshold: 0.1,
        freezeOnceVisible: true,
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
        hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: shouldReduceMotion ? 0 : 0.5,
                ease: 'easeOut',
            },
        },
    };

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-border"
        >
            <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono">
                        {uiStrings.experience.title}
                    </h2>
                    <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
                        {uiStrings.experience.subtitle}
                    </p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    className="relative space-y-16"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {/* Vertical line - minimalist */}
                    <div className="absolute left-0 md:left-[24px] top-0 bottom-0 w-px bg-border hidden md:block" />

                    {experiences.map((exp) => (
                        <motion.div
                            key={exp.id}
                            variants={itemVariants}
                            className="relative flex flex-col md:flex-row gap-8"
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-0 md:left-[20px] top-2 w-2 h-2 rounded-full bg-foreground border border-background z-10 hidden md:block" />

                            {/* Content */}
                            <div className="flex-1 md:ml-12">
                                <div className="group relative bg-card/30 border border-border rounded-xl p-8 transition-all duration-300 hover:border-foreground/20">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                        <div>
                                            <h3 className="text-xl font-bold text-foreground font-mono mb-1">{exp.role}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground font-mono text-sm">
                                                <Building className="h-3.5 w-3.5" />
                                                <span className="uppercase tracking-tight">{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground font-mono text-[10px] bg-secondary/50 px-3 py-1 rounded-full border border-border uppercase tracking-widest">
                                            <Calendar className="h-3 w-3" />
                                            <span>{exp.period}</span>
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <p className="text-sm text-muted-foreground mb-8 leading-relaxed">{exp.description}</p>
                                    )}

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50 font-mono flex items-center gap-2">
                                            {uiStrings.experience.achievementsTitle}
                                        </h4>
                                        <ul className="space-y-3">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                                    <span className="mt-2 w-1 h-[1px] bg-foreground/30 flex-shrink-0" />
                                                    <span className="leading-relaxed">{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
