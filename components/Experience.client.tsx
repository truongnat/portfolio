'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Briefcase, Calendar, Building } from 'lucide-react';
import { workExperience, type Experience } from '@/lib/config';

interface ExperienceProps {
    experiences?: Experience[];
}

export function ExperienceClient({ experiences = workExperience }: ExperienceProps) {
    const { ref: sectionRef, isIntersecting: isInView } = useIntersectionObserver<HTMLElement>({
        threshold: 0.1,
        freezeOnceVisible: true,
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
            className="relative py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5"
        >
            <div className="max-w-4xl mx-auto">
                {/* Section header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.6 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        Work Experience
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        My professional journey and key contributions
                    </p>
                </motion.div>

                {/* Timeline */}
                <motion.div
                    className="relative space-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? 'visible' : 'hidden'}
                >
                    {/* Vertical line */}
                    <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            variants={itemVariants}
                            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Timeline dot */}
                            <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-[5px] md:-translate-x-1/2 z-10 hidden md:block" />

                            {/* Content */}
                            <div className="flex-1 md:w-1/2">
                                <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col gap-2 mb-4">
                                        <h3 className="text-xl font-bold text-primary">{exp.role}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Building className="h-4 w-4" />
                                            <span>{exp.company}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <Calendar className="h-4 w-4" />
                                            <span>{exp.period}</span>
                                        </div>
                                    </div>

                                    {exp.description && (
                                        <p className="text-muted-foreground mb-6">{exp.description}</p>
                                    )}

                                    <div className="bg-secondary/30 rounded-lg p-4 border-l-4 border-primary">
                                        <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                                            <span className="text-primary">⚡</span> Key Impact & Achievements
                                        </h4>
                                        <ul className="space-y-2.5">
                                            {exp.achievements.map((achievement, i) => (
                                                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                    <span>{achievement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Empty space for the other side of the timeline */}
                            <div className="hidden md:block flex-1 md:w-1/2" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
