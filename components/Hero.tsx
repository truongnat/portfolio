'use client';

import { motion } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';

import { personalInfo } from '@/lib/config';

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  typingPhrases?: string[];
  ctaButtons?: CTAButton[];
}

export function Hero({
  title = personalInfo.role,
  subtitle = personalInfo.bio,
  typingPhrases = personalInfo.typingPhrases,
  ctaButtons = [
    {
      label: 'View Projects',
      href: '#projects',
      variant: 'primary' as const,
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      label: 'Contact Me',
      href: '#contact',
      variant: 'secondary' as const,
      icon: <Mail className="h-4 w-4" />,
    },
  ],
}: HeroProps) {
  const [typingText, setTypingText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = typingPhrases[phraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timer = setTimeout(
      () => {
        if (!isDeleting && typingText === currentPhrase) {
          // Pause at end of phrase
          setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && typingText === '') {
          // Move to next phrase
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % typingPhrases.length);
        } else if (isDeleting) {
          // Delete character
          setTypingText(currentPhrase.substring(0, typingText.length - 1));
        } else {
          // Add character
          setTypingText(currentPhrase.substring(0, typingText.length + 1));
        }
      },
      isDeleting ? typingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [typingText, isDeleting, phraseIndex, typingPhrases]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: 0.1,
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
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Gradient blob background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={
            shouldReduceMotion
              ? {}
              : {
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
              }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl"
          animate={
            shouldReduceMotion
              ? {}
              : {
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
                y: [0, -30, 0],
              }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          className="mt-6 text-xl sm:text-2xl md:text-3xl text-muted-foreground min-h-[2.5rem]"
          variants={itemVariants}
          data-testid="typing-animation"
        >
          <span className="inline-block">
            {typingText}
            <span className="inline-block w-0.5 h-6 sm:h-7 md:h-8 bg-primary ml-1 animate-pulse" />
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          {ctaButtons.map((button, index) => (
            <motion.a
              key={index}
              href={button.href}
              className={`
                group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                font-medium transition-all duration-200 min-w-[160px]
                ${button.variant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                }
              `}
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              {button.label}
              {button.icon && (
                <span className="transition-transform group-hover:translate-x-1">
                  {button.icon}
                </span>
              )}
            </motion.a>
          ))}
        </motion.div>

        {/* Social links */}
        <motion.div
          className="mt-12 flex gap-6 justify-center items-center"
          variants={itemVariants}
        >
          {personalInfo.socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={social.platform}
            >
              <social.icon className="h-6 w-6" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full p-1"
          animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div className="w-1 h-2 bg-muted-foreground/50 rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
