'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2, RefreshCw, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as THREE from 'three';

interface Node {
  id: string;
  name: string;
  type: 'blog' | 'journal' | 'tag';
  val: number;
  group: number;
  x?: number;
  y?: number;
  z?: number;
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
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ForceGraph3D, setForceGraph3D] = useState<any>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  const [hoverNode, setHoverNode] = useState<Node | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Dynamic import on client side
  useEffect(() => {
    import('react-force-graph-3d').then(mod => {
      setForceGraph3D(() => mod.default);
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

  const nodeColor = useCallback((node: Node) => {
    if (node.type === 'blog') return '#3b82f6'; // blue-500
    if (node.type === 'journal') return '#10b981'; // emerald-500
    return '#71717a'; // zinc-500
  }, []);

  const nodeThreeObject = useCallback((node: any) => {
    const n = node as Node;
    const size = Math.sqrt(n.val || 1) * 2;
    
    // Create group to hold mesh and label
    const group = new THREE.Group();

    // Create Sphere
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const material = new THREE.MeshLambertMaterial({ 
      color: nodeColor(n), 
      transparent: true, 
      opacity: 0.9 
    });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Create label (only if important or on hover)
    if (n.type !== 'tag' || n.val > 10) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            canvas.width = 256;
            canvas.height = 64;
            ctx.font = '24px "JetBrains Mono"';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText(n.name, 128, 32);

            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
            const label = new THREE.Sprite(labelMaterial);
            label.position.set(0, size + 5, 0);
            label.scale.set(size * 4, size, 1);
            group.add(label);
        }
    }

    return group;
  }, [nodeColor]);

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
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Box size={18} />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-4 rounded-xl bg-background/60 border border-border/40 backdrop-blur-md space-y-2 pointer-events-none">
        <h4 className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-3">3D Knowledge Space</h4>
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

      {ForceGraph3D ? (
        <ForceGraph3D
          ref={fgRef}
          graphData={data}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          nodeThreeObject={nodeThreeObject}
          linkColor={() => 'rgba(255, 255, 255, 0.1)'}
          linkWidth={0.5}
          onNodeHover={(node: any) => setHoverNode(node)}
          onNodeClick={(node: any) => {
            if (node.type !== 'tag') {
              const path = node.type === 'blog' ? `/blog/${node.id}/` : `/journal/${node.id}/`;
              window.location.href = path;
            }
          }}
          showNavInfo={false}
          enableNodeDrag={false}
          cooldownTicks={100}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center font-mono text-muted-foreground animate-pulse">
          INITIALIZING_3D_ENGINE...
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
