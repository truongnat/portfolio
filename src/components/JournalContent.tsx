'use client';

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Target, Zap, BarChart3, Milestone, Infinity as InfinityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface Log {
  slug: string;
  title: string;
  date: string;
  type: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'cycle';
  summary?: string;
  tags?: string[];
}

interface JournalContentProps {
  initialLogs: Log[];
}

const TYPE_CONFIG = {
  day: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', label: 'Daily' },
  week: { icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Weekly' },
  month: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', label: 'Monthly' },
  quarter: { icon: BarChart3, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Quarterly' },
  year: { icon: Milestone, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', label: 'Yearly' },
  cycle: { icon: InfinityIcon, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: '5-Year Cycle' },
};

export function JournalContent({ initialLogs }: JournalContentProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const availableTypes = useMemo(() => {
    const presentTypes = new Set(initialLogs.map((log) => log.type));
    return Object.entries(TYPE_CONFIG).filter(([key]) => presentTypes.has(key as Log['type']));
  }, [initialLogs]);

  const effectiveFilter = useMemo(() => {
    if (activeFilter === 'all') return 'all';
    const stillAvailable = availableTypes.some(([type]) => type === activeFilter);
    return stillAvailable ? activeFilter : 'all';
  }, [activeFilter, availableTypes]);

  const filteredLogs = useMemo(() => {
    if (effectiveFilter === 'all') return initialLogs;
    return initialLogs.filter((log) => log.type === effectiveFilter);
  }, [effectiveFilter, initialLogs]);

  const filterOptions = useMemo(
    () => [
      { id: 'all', label: 'All Logs' },
      ...availableTypes.map(([key, config]) => ({
        id: key,
        label: config.label,
      })),
    ],
    [availableTypes]
  );

  return (
    <div className="space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border/40">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setActiveFilter(option.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-mono font-medium transition-all duration-300",
              effectiveFilter === option.id
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredLogs.map((log, index) => {
            const config = TYPE_CONFIG[log.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={log.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <a href={`/journal/${log.slug}/index.html`} className="block h-full">
                  <Card className={cn(
                    "group relative h-full p-6 bg-muted/30 border-border/40 hover:bg-muted/50 hover:border-border/80 transition-all duration-500 overflow-hidden cursor-pointer",
                    log.type !== 'day' && "md:col-span-2 lg:col-span-1 ring-1 ring-border/50 shadow-xl"
                  )}>
                    {/* Type Badge */}
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-[10px] font-mono uppercase tracking-widest",
                      config.bg, config.color, config.border, "border"
                    )}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </div>

                    <div className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {new Date(log.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                          {log.title}
                        </h3>
                      </div>

                      {log.summary && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {log.summary}
                        </p>
                      )}

                      {log.tags && log.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {log.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-mono text-muted-foreground/60">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Visual Decoration for non-daily logs */}
                    {log.type !== 'day' && (
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Icon className="w-24 h-24 rotate-12 translate-x-8 -translate-y-8" />
                      </div>
                    )}
                  </Card>
                </a>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredLogs.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/5">
          <p className="text-muted-foreground font-mono">NO_LOGS_FOUND_FOR_THIS_FILTER</p>
        </div>
      )}
    </div>
  );
}
