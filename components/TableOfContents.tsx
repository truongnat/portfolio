'use client';

import { useEffect, useState } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { cn } from '@/lib/utils';

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [mounted, setMounted] = useState(false);
  const activeId = useScrollSpy(items.map((item) => item.id));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <nav className="space-y-2" data-testid="table-of-contents">
      <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const isActive = activeId === item.id;
          const indent = (item.level - 1) * 16;

          return (
            <li key={item.id} style={{ paddingLeft: `${indent}px` }}>
              <a
                href={`#${item.id}`}
                className={cn(
                  'block text-sm py-1 transition-colors hover:text-primary',
                  isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
                )}
                data-testid={`toc-item-${item.id}`}
                data-active={isActive}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
