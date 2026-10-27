'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Home, User, Briefcase, Code, Mail, Radar, Clock } from 'lucide-react';
import { navigate } from 'astro:transitions/client';

interface Post {
  title: string;
  slug: string;
  description: string;
  type: 'blog' | 'journal';
}

interface CommandPaletteProps {
  posts?: Post[];
}

export function CommandPalette({ posts = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const blogPosts = posts.filter(p => p.type === 'blog');
  const journalPosts = posts.filter(p => p.type === 'journal');
  const navigation = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/#about', label: 'About', icon: User },
    { href: '/now/', label: 'Now', icon: Clock },
    { href: '/#skills', label: 'Skills', icon: Code },
    { href: '/tech-radar/', label: 'Tech Radar', icon: Radar },
    { href: '/#experience', label: 'Experience', icon: Briefcase },
    { href: '/#projects', label: 'Projects', icon: Code },
    { href: '/blog/', label: 'Blog', icon: FileText },
    { href: '/#contact', label: 'Contact', icon: Mail },
  ];
  const matchesQuery = (text: string) => text.toLowerCase().includes(query);
  const postMatches = (post: Post) =>
    matchesQuery(post.title) || matchesQuery(post.description ?? '');
  // cmdk's default score treats the query as a character subsequence, so
  // "docker" matched almost every title. Substring matching stays exact.
  const visibleNav = query ? navigation.filter((item) => matchesQuery(item.label)) : navigation;
  const visibleBlog = query ? blogPosts.filter(postMatches) : blogPosts.slice(0, 5);
  const visibleJournal = query ? journalPosts.filter(postMatches) : journalPosts.slice(0, 5);

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
    setSearch('');
    navigate(href);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
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
            <Command className="w-full" shouldFilter={false}>
              <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Command.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground font-mono"
                />
              </div>
              <Command.List className="max-h-[300px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-mono">
                  No results found.
                </Command.Empty>

                {visibleNav.length > 0 && (
                <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                  {visibleNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Command.Item
                        key={item.href}
                        value={item.label}
                        onSelect={() => handleSelect(item.href)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Command.Item>
                    );
                  })}
                </Command.Group>
                )}

                {visibleBlog.length > 0 && (
                <Command.Group heading="Blog Posts" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                    {visibleBlog.map((post) => (
                    <Command.Item
                        key={post.slug}
                        value={`${post.title} ${post.description ?? ''}`}
                        onSelect={() => handleSelect(`/blog/${post.slug}/`)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                    >
                        <FileText className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{post.title}</span>
                    </Command.Item>
                    ))}
                </Command.Group>
                )}

                {visibleJournal.length > 0 && (
                <Command.Group heading="Journal Logs" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                    {visibleJournal.map((post) => (
                    <Command.Item
                        key={post.slug}
                        value={`${post.title} ${post.description ?? ''}`}
                        onSelect={() => handleSelect(`/journal/${post.slug}/`)}
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                    >
                        <Clock className="mr-2 h-4 w-4 shrink-0" />
                        <span className="truncate">{post.title}</span>
                    </Command.Item>
                    ))}
                </Command.Group>
                )}
              </Command.List>
              <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground font-mono flex justify-end items-center bg-muted/30">
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
