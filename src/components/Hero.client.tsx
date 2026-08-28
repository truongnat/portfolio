'use client';

import { motion, type Variants } from 'framer-motion';
import { useSafeReducedMotion } from '@/hooks/useSafeReducedMotion';
import { ArrowRight, Mail, Download, MapPin, Sparkles } from 'lucide-react';
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
  title = personalInfo.name,
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
  const [typingText, setTypingText] = useState(typingPhrases[0] ?? '');
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
      aria-labelledby="hero-title"
      className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-8 pb-24 pt-28 sm:pt-32"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <motion.div
            className="max-w-3xl text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-3 border-l-2 border-primary pl-4 text-xs font-mono font-bold uppercase tracking-[0.2em] text-muted-foreground"
              variants={itemVariants}
            >
              <span className="text-primary">///</span>
              {uiStrings.hero.eyebrow}
            </motion.div>

            <motion.h1
              id="hero-title"
              className="mt-6 text-5xl font-bold tracking-[-0.06em] text-foreground sm:text-6xl lg:text-8xl"
              variants={itemVariants}
            >
              {title}
            </motion.h1>

            <motion.p
              className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
              variants={itemVariants}
            >
              {personalInfo.role}
            </motion.p>

            <motion.p
              className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>

            <motion.ul
              aria-label={uiStrings.hero.focusLabel}
              className="mt-8 grid gap-3 text-sm font-medium text-foreground sm:grid-cols-2"
              variants={itemVariants}
            >
              {personalInfo.focusAreas.map((area) => (
                <li key={area} className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                  {area}
                </li>
              ))}
            </motion.ul>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
              variants={itemVariants}
            >
              {ctaButtons.map((button, index) => (
                <motion.a
                  key={index}
                  href={button.href}
                  className={`group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-200 sm:w-auto ${button.variant === 'primary'
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
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

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              <a className="inline-flex items-center gap-2 hover:text-foreground" href={`mailto:${personalInfo.email}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                {personalInfo.email}
              </a>
              <span className="hidden text-border sm:inline" aria-hidden="true">/</span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {personalInfo.location}
              </span>
              <span className="hidden text-border sm:inline" aria-hidden="true">/</span>
              <div className="flex items-center gap-4">
                {personalInfo.socials.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={social.platform}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.aside
            aria-label={uiStrings.hero.snapshotLabel}
            className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/[0.04] p-6 shadow-2xl shadow-black/20 sm:p-8"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {uiStrings.hero.snapshotLabel}
              </p>
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
                {personalInfo.stats.map((stat) => (
                  <div key={stat.label}>
                    <dd className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{stat.value}</dd>
                    <dt className="mt-2 text-xs leading-5 text-muted-foreground">{stat.label}</dt>
                  </div>
                ))}
              </dl>

              <div className="mt-10 border-t border-border/70 pt-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {uiStrings.hero.currentFocusLabel}
                </p>
                <p className="mt-3 text-sm leading-7 text-foreground">
                  Building reliable full-stack applications, reporting workflows, and cross-platform products.
                </p>
              </div>

              <a
                href="#experience"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Review professional experience
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </motion.aside>
        </div>

        <motion.div
          className="mt-16 flex flex-col gap-3 border-t border-border pt-5 text-sm sm:flex-row sm:items-center sm:justify-between"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          data-testid="typing-animation"
        >
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Current technical lens
          </span>
          <span className="font-mono text-foreground" aria-live="polite">
            {typingText}
            <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-primary align-middle" aria-hidden="true" />
          </span>
        </motion.div>
      </div>

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
