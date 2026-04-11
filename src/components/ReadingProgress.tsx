'use client';

import { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ReadingProgress() {
  const [isVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname;
    const isPostPage = path.includes('/blog/') || path.includes('/journal/');
    const isIndexPage = path === '/blog/' || path === '/journal/';
    return isPostPage && !isIndexPage;
  });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-[250] origin-left"
      style={{ scaleX }}
    />
  );
}
