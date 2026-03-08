'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  name: string;
  type: 'blog' | 'journal' | 'tag';
  val: number;
  group: number;
  x?: number;
  y?: number;
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

export function KnowledgeGraphClient({ data }: KnowledgeGraphProps) {
  const fgRef = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [ForceGraph2D, setForceGraph2D] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic import on client side
  useEffect(() => {
    import('react-force-graph-2d').then(mod => {
      setForceGraph2D(() => mod.default);
    });
  }, []);

  // Resize handler
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: isFullscreen ? window.innerHeight - 100 : 600
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isFullscreen]);

  const nodeColor = (node: any) => {
    const n = node as Node;
    if (n.type === 'blog') return '#3b82f6'; // blue-500
    if (n.type === 'journal') return '#10b981'; // emerald-500
    return '#71717a'; // zinc-500
  };

  const nodeCanvasObject = (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const n = node as Node;
    const label = n.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px "JetBrains Mono"`;
    const r = Math.sqrt(n.val || 1) * 2;
    
    // Draw circle
    ctx.beginPath();
    ctx.arc(n.x!, n.y!, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = nodeColor(node);
    ctx.fill();

    // Draw label on hover or if important
    if (hoverNode === n || n.type !== 'tag' || globalScale > 1.5) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#f4f4f5'; // zinc-100
      ctx.fillText(label, n.x!, n.y! + r + fontSize + 2);
    }
    
    // Highlight hover
    if (hoverNode === n) {
      ctx.beginPath();
      ctx.arc(n.x!, n.y!, r + 2, 0, 2 * Math.PI, false);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1 / globalScale;
      ctx.stroke();
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative rounded-2xl border border-border/40 bg-card/30 overflow-hidden backdrop-blur-sm transition-all duration-500",
        isFullscreen ? "fixed inset-0 z-[200] m-4 h-[calc(100vh-2rem)]" : "w-full h-[600px]"
      )}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-lg bg-background/80 border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button 
          onClick={() => fgRef.current?.zoomToFit(400)}
          className="p-2 rounded-lg bg-background/80 border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="Zoom to Fit"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-4 rounded-xl bg-background/60 border border-border/40 backdrop-blur-md space-y-2">
        <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">Knowledge Nodes</h4>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-mono text-foreground/80 uppercase">Engineering Blog</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-mono text-foreground/80 uppercase">Daily Journal</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-zinc-500" />
          <span className="text-[10px] font-mono text-foreground/80 uppercase">Core Concepts</span>
        </div>
      </div>

      {ForceGraph2D ? (
        <ForceGraph2D
          ref={fgRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          nodeRelSize={6}
          nodeVal={(n: any) => n.val}
          linkColor={() => 'rgba(255, 255, 255, 0.1)'}
          linkWidth={1}
          nodeCanvasObject={nodeCanvasObject}
          onNodeHover={(node: any) => setHoverNode(node)}
          onNodeClick={(node: any) => {
            if (node.type !== 'tag') {
              const path = node.type === 'blog' ? `/blog/${node.id}/index.html` : `/journal/${node.id}/index.html`;
              window.location.href = path;
            }
          }}
          cooldownTicks={100}
          d3VelocityDecay={0.3}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-muted-foreground animate-pulse">
          INITIALIZING_GRAPH_ENGINE...
        </div>
      )}

      {/* Hover Info Overlay */}
      <AnimatePresence>
        {hoverNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 left-4 z-10 p-4 max-w-[240px] rounded-xl bg-background/80 border border-border/80 backdrop-blur-xl shadow-2xl pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                hoverNode.type === 'blog' ? "bg-blue-500" : hoverNode.type === 'journal' ? "bg-emerald-500" : "bg-zinc-500"
              )} />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{hoverNode.type}</span>
            </div>
            <h3 className="text-sm font-bold font-mono leading-tight">{hoverNode.name}</h3>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
