'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Home, User, Briefcase, Code, Mail, Radar, Clock } from 'lucide-react';
import { navigate } from 'astro:transitions/client';

interface BlogPost {
  title: string;
  slug: string;
  description: string;
}

interface CommandPaletteProps {
  posts?: BlogPost[];
}

export function CommandPalette({ posts = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (href: string) => {
    setOpen(false);
    navigate(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg shadow-2xl rounded-xl overflow-hidden border border-border bg-card ring-1 ring-white/10"
          >
            <Command className="w-full">
              <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground font-mono"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-mono">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                  <Command.Item
                    onSelect={() => handleSelect('/')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    <span>Home</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/#about')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/now')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    <span>Now</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/#skills')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    <span>Skills</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/tech-radar')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Radar className="mr-2 h-4 w-4" />
                    <span>Tech Radar</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/#experience')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Experience</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/#projects')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    <span>Projects</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/blog')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Blog</span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => handleSelect('/#contact')}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    <span>Contact</span>
                  </Command.Item>
                </Command.Group>

                {posts.length > 0 && (
                  <Command.Group heading="Blog Posts" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                    {posts.map((post) => (
                      <Command.Item
                        key={post.slug}
                        onSelect={() => handleSelect(`/blog/${post.slug}`)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <span className="truncate">{post.title}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}
              </Command.List>
              <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground font-mono flex justify-between items-center">
                <span>Navigate using arrows</span>
                <div className="flex gap-1">
                  <span className="bg-muted px-1.5 py-0.5 rounded border border-border">ESC</span> to close
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}