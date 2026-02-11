'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { BadgeCheck } from 'lucide-react';
import { certificatesData } from '@/lib/config';

export function CertificatesClient() {
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
      id="certificates"
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
          <div className="flex items-center justify-center mb-4">
            <BadgeCheck className="h-8 w-8 text-foreground mr-3" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-mono">
              Certifications
            </h2>
          </div>
          <p className="text-base text-muted-foreground uppercase tracking-widest font-mono">
            Professional Credentials & Training
          </p>
        </motion.div>

        {/* Certificates grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {certificatesData.map((cert, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start mb-4">
                <BadgeCheck className="h-6 w-6 text-primary mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-foreground">{cert.title}</h3>
                  <p className="text-primary font-medium">{cert.issuer}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{cert.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {cert.year}
                </span>
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    Verify Credential
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}