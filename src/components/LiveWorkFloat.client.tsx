'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { liveWork } from '@/lib/config';

export function LiveWorkFloatClient() {
  const boundsRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const floatAnimation = isDragging
    ? {}
    : {
        y: [0, -10, 0],
        rotate: [0, 1.5, 0],
      };

  return (
    <div ref={boundsRef} className="absolute inset-0 pointer-events-none z-[9999]">
      <motion.div
        drag
        dragConstraints={boundsRef}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="pointer-events-auto absolute right-6 top-24 sm:right-12 sm:top-28 cursor-grab active:cursor-grabbing"
      >
        <motion.div
          animate={floatAnimation}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card/70 px-5 py-4 shadow-xl backdrop-blur"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 rgba(59,130,246,0.0)',
                '0 0 24px rgba(59,130,246,0.25)',
                '0 0 0 rgba(59,130,246,0.0)',
              ],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
          />
          <div className="h-12 w-12 rounded-xl border border-border bg-background/80 p-2">
            <img
              src="/livework/vietis-icon.png"
              alt="Viet IS"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] font-mono text-muted-foreground/70">
              {liveWork.label}
            </p>
            <a
              href={liveWork.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg sm:text-xl font-bold font-mono text-foreground hover:text-primary transition-colors"
            >
              {liveWork.company}
            </a>
            <p className="text-sm font-mono text-muted-foreground">{liveWork.location}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
