'use client';

import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, Home, User, Briefcase, Code, Mail, Radar, Clock, Sparkles, Loader2 } from 'lucide-react';
import { navigate } from 'astro:transitions/client';
import { useDebounce } from '@/hooks/useDebounce';

interface Post {
  title: string;
  slug: string;
  description: string;
  type: 'blog' | 'journal';
}

interface SearchResult {
    id: string;
    title: string;
    type: 'blog' | 'journal';
    excerpt: string;
    score: number;
}

interface CommandPaletteProps {
  posts?: Post[];
}

export function CommandPalette({ posts = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const blogPosts = posts.filter(p => p.type === 'blog');
  const journalPosts = posts.filter(p => p.type === 'journal');

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

  // AI Semantic Search Effect
  useEffect(() => {
    if (debouncedSearch.length < 3) {
        setSearchResults([]);
        return;
    }

    const performSearch = async () => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/search/?q=${encodeURIComponent(debouncedSearch)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (e) {
            console.error('Search failed:', e);
        } finally {
            setIsSearching(false);
        }
    };

    performSearch();
  }, [debouncedSearch]);

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
            <Command className="w-full" shouldFilter={debouncedSearch.length < 3 && searchResults.length === 0}>
              <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                {isSearching ? <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin text-primary" /> : <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                <Command.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or ask AI anything..."
                  className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground font-mono"
                />
              </div>
              <Command.List className="max-h-[300px] sm:max-h-[400px] overflow-y-auto overflow-x-hidden p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground font-mono">
                  {isSearching ? 'AI is thinking...' : 'No results found.'}
                </Command.Empty>

                {/* AI Results Section */}
                {searchResults.length > 0 && (
                    <Command.Group heading="AI Semantic Results" className="text-xs font-medium text-primary px-2 py-1.5 font-mono mb-2">
                        {searchResults.map((result) => (
                            <Command.Item
                                key={result.id}
                                value={result.title}
                                onSelect={() => handleSelect(`/${result.type}/${result.id}/`)}
                                className="relative flex cursor-pointer select-none items-start rounded-md px-2 py-3 text-sm outline-none data-[selected=true]:bg-primary/10 data-[selected=true]:text-foreground border border-transparent data-[selected=true]:border-primary/20 transition-all mb-1"
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-primary" />
                                        <span className="font-bold">{result.title}</span>
                                        <span className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded opacity-70 ml-auto">{result.type}</span>
                                    </div>
                                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed italic">
                                        "{result.excerpt}"
                                    </p>
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>
                )}

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
                    onSelect={() => handleSelect('/now/')}
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
                    onSelect={() => handleSelect('/tech-radar/')}
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
                    onSelect={() => handleSelect('/blog/')}
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

                {/* Only show static results if search is short */}
                {debouncedSearch.length < 3 && (
                    <>
                        {blogPosts.length > 0 && (
                        <Command.Group heading="Blog Posts" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                            {blogPosts.slice(0, 5).map((post) => (
                            <Command.Item
                                key={post.slug}
                                onSelect={() => handleSelect(`/blog/${post.slug}/`)}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                <span className="truncate">{post.title}</span>
                            </Command.Item>
                            ))}
                        </Command.Group>
                        )}

                        {journalPosts.length > 0 && (
                        <Command.Group heading="Journal Logs" className="text-xs font-medium text-muted-foreground px-2 py-1.5 font-mono mb-2">
                            {journalPosts.slice(0, 5).map((post) => (
                            <Command.Item
                                key={post.slug}
                                onSelect={() => handleSelect(`/journal/${post.slug}/`)}
                                className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground font-mono data-[selected=true]:bg-secondary/50 data-[selected=true]:text-foreground"
                            >
                                <Clock className="mr-2 h-4 w-4" />
                                <span className="truncate">{post.title}</span>
                            </Command.Item>
                            ))}
                        </Command.Group>
                        )}
                    </>
                )}
              </Command.List>
              <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground font-mono flex justify-between items-center bg-muted/30">
                <span className="flex items-center gap-1"><Sparkles size={10} className="text-primary" /> AI Search Enabled</span>
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
