'use client';

import { motion, type Variants } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { ArrowRight, Mail, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

import { personalInfo, uiStrings } from '@/lib/config';

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

export function HeroClient({
  title = personalInfo.role,
  subtitle = personalInfo.bio,
  typingPhrases = personalInfo.typingPhrases,
  ctaButtons = [
    {
      label: uiStrings.hero.cta.projects,
      href: '#projects',
      variant: 'primary' as const,
      icon: <ArrowRight className="h-4 w-4" />,
    },
    {
      label: uiStrings.hero.cta.cv,
      href: personalInfo.resumeUrl,
      variant: 'secondary' as const,
      icon: <Download className="h-4 w-4" />,
    },
    {
      label: uiStrings.hero.cta.contact,
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
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.2,
        delayChildren: 0.1,
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

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pb-32 sm:pb-0 pt-24 sm:pt-16"
    >
      {/* Hero content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground font-mono"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          className="mt-6 text-xl sm:text-2xl md:text-3xl text-muted-foreground min-h-[2.5rem] font-mono"
          variants={itemVariants}
          data-testid="typing-animation"
        >
          <span className="inline-block">
            {typingText}
            <span className="inline-block w-0.5 h-6 sm:h-7 md:h-8 bg-primary ml-1 animate-pulse align-middle" />
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
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
                font-semibold transition-all duration-200 min-w-[160px] w-full sm:w-auto
                ${button.variant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border'
                }
              `}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
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

        {/* Quick Stats - Technical Focus */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-border pt-12"
          variants={itemVariants}
        >
          {personalInfo.stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center space-y-2">
              <span className="text-3xl sm:text-4xl font-bold text-foreground font-mono">
                {stat.value}
              </span>
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
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
