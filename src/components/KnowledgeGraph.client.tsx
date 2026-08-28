'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  name: string;
  type: 'blog' | 'journal' | 'tag';
  val: number;
  group: number;
}

interface Link {
  source: string;
  target: string;
}

interface KnowledgeGraphProps {
  data: {
    nodes: Node[];
    links: Link[];
  };
}

interface Position {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 560;

function getNodeColor(type: Node['type']) {
  if (type === 'blog') return '#60a5fa';
  if (type === 'journal') return '#34d399';
  return '#a1a1aa';
}

function getNodeHref(node: Node) {
  if (node.type === 'blog') return `/blog/${node.id}/`;
  if (node.type === 'journal') return `/journal/${node.id}/`;
  return null;
}

function getShortLabel(label: string, maxLength = 26) {
  return label.length > maxLength ? `${label.slice(0, maxLength - 1)}…` : label;
}

export function KnowledgeGraphClient({ data }: KnowledgeGraphProps) {
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [layoutSeed, setLayoutSeed] = useState(0);

  const positions = useMemo(() => {
    const positionMap = new Map<string, Position>();
    const contentNodes = data.nodes.filter((node) => node.type !== 'tag');
    const tagNodes = data.nodes.filter((node) => node.type === 'tag');
    const contentGroups = {
      blog: contentNodes.filter((node) => node.type === 'blog'),
      journal: contentNodes.filter((node) => node.type === 'journal'),
    };

    for (const [type, nodes] of Object.entries(contentGroups) as Array<[
      'blog' | 'journal',
      Node[],
    ]>) {
      const x = type === 'blog' ? 180 : 820;
      nodes.forEach((node, index) => {
        const progress = (index + 1) / (nodes.length + 1);
        positionMap.set(node.id, {
          x: x + Math.sin((index + layoutSeed) * 1.7) * 36,
          y: 48 + progress * 404,
        });
      });
    }

    const tagRadius = Math.min(222, 116 + tagNodes.length * 2.5);
    tagNodes.forEach((node, index) => {
      const angle = (index / Math.max(tagNodes.length, 1)) * Math.PI * 2 + layoutSeed * 0.22;
      positionMap.set(node.id, {
        x: VIEWBOX_WIDTH / 2 + Math.cos(angle) * tagRadius,
        y: VIEWBOX_HEIGHT / 2 + Math.sin(angle) * tagRadius * 0.72,
      });
    });

    return positionMap;
  }, [data.nodes, layoutSeed]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-500',
        isFullscreen ? 'fixed inset-0 z-[200] m-4 h-[calc(100vh-2rem)]' : 'w-full',
      )}
    >
      <div className="border-b border-border/40 px-4 py-3 text-center text-xs text-muted-foreground font-mono sm:hidden">
        Tap a node to open its article. Best viewed on a larger screen.
      </div>

      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsFullscreen((current) => !current)}
          className="rounded-lg border border-border bg-background/80 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit fullscreen' : 'View graph fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button
          type="button"
          onClick={() => setLayoutSeed((seed) => seed + 1)}
          className="rounded-lg border border-border bg-background/80 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Rearrange network"
          aria-label="Rearrange network"
        >
          <RefreshCw size={18} />
        </button>
        <div
          className="flex items-center justify-center rounded-lg border border-primary/20 bg-primary/10 p-2 text-primary"
          title="SVG knowledge network"
          aria-label="SVG knowledge network"
        >
          <Box size={18} />
        </div>
      </div>

      <svg
        className="min-h-[350px] w-full"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="Interactive engineering knowledge network"
      >
        <defs>
          <radialGradient id="network-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} fill="url(#network-glow)" />

        <g aria-hidden="true">
          {data.links.map((link, index) => {
            const source = positions.get(link.source);
            const target = positions.get(link.target);
            if (!source || !target) return null;
            const sourceNode = data.nodes.find((node) => node.id === link.source);

            return (
              <line
                key={`${link.source}-${link.target}-${index}`}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={getNodeColor(sourceNode?.type ?? 'tag')}
                strokeOpacity="0.2"
                strokeWidth="1"
              />
            );
          })}
        </g>

        <g>
          {data.nodes.map((node) => {
            const position = positions.get(node.id);
            if (!position) return null;
            const href = getNodeHref(node);
            const radius = Math.max(5, Math.sqrt(node.val || 1) * 1.8);
            const isHovered = hoverNode?.id === node.id;
            const nodeContent = (
              <>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={isHovered ? radius + 3 : radius}
                  fill={getNodeColor(node.type)}
                  fillOpacity={node.type === 'tag' ? 0.65 : 0.9}
                  stroke={isHovered ? '#ffffff' : getNodeColor(node.type)}
                  strokeOpacity={isHovered ? 0.9 : 0.45}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-200"
                />
                {node.type !== 'tag' && (
                  <text
                    x={position.x + radius + 7}
                    y={position.y + 3}
                    fill="currentColor"
                    className="fill-foreground/75 text-[10px] font-mono"
                  >
                    {getShortLabel(node.name)}
                  </text>
                )}
              </>
            );

            const sharedProps = {
              onMouseEnter: () => setHoverNode(node),
              onMouseLeave: () => setHoverNode(null),
            };

            return href ? (
              <a
                key={node.id}
                href={href}
                aria-label={`Open ${node.type}: ${node.name}`}
                {...sharedProps}
              >
                {nodeContent}
              </a>
            ) : (
              <g
                key={node.id}
                role="img"
                aria-label={`Topic: ${node.name}`}
                {...sharedProps}
              >
                {nodeContent}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 space-y-2 rounded-xl border border-border/40 bg-background/70 p-4 backdrop-blur-md">
        <h2 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
          Engineering knowledge network
        </h2>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-[10px] font-mono uppercase text-foreground/80">Engineering blog</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono uppercase text-foreground/80">Daily journal</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-zinc-400" />
          <span className="text-[10px] font-mono uppercase text-foreground/80">Core concepts</span>
        </div>
      </div>

      <AnimatePresence>
        {hoverNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="pointer-events-none absolute right-4 top-24 z-10 max-w-[240px] rounded-xl border border-border/80 bg-background/80 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  hoverNode.type === 'blog'
                    ? 'bg-blue-400'
                    : hoverNode.type === 'journal'
                      ? 'bg-emerald-400'
                      : 'bg-zinc-400',
                )}
              />
              <span className="text-[10px] font-mono uppercase text-muted-foreground">{hoverNode.type}</span>
            </div>
            <p className="text-sm font-bold leading-tight text-foreground">{hoverNode.name}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
