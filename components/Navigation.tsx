'use client';

import Link from 'next/link';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Portfolio
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#about"
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#skills"
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Projects
              </a>
              <a
                href="#blog"
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Blog
              </a>
              <a
                href="#contact"
                className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>

            <button
              onClick={toggleTheme}
              className={cn(
                'relative inline-flex h-9 w-9 items-center justify-center rounded-md',
                'text-foreground/60 hover:text-foreground hover:bg-accent',
                'transition-colors focus-visible:outline-none focus-visible:ring-2',
                'focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'
              )}
              aria-label="Toggle theme"
            >
              {mounted && (
                <>
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </>
              )}
              {!mounted && <div className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
