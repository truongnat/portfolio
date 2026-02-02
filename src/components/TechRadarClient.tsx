'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { radarData } from '@/lib/tech-radar';

const quadrants = ['Languages & Frameworks', 'Tools', 'Platforms', 'Techniques'];
const rings = ['Adopt', 'Trial', 'Assess', 'Hold'];

export function TechRadarClient() {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);
  const [hoveredBlip, setHoveredBlip] = useState<string | null>(null);

  const filteredData = selectedQuadrant
    ? radarData.filter(d => d.quadrant === selectedQuadrant)
    : radarData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      {/* Radar Visualization */}
      <div className="relative aspect-square w-full max-w-lg mx-auto bg-card/20 rounded-full border border-border overflow-hidden">
        {/* Rings */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-border/30"
            style={{
              margin: `${i * 12.5}%`,
              zIndex: 0,
            }}
          />
        ))}

        {/* Crosshair */}
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border/50" />
        <div className="absolute left-0 right-0 top-1/2 h-px bg-border/50" />

        {/* Quadrant Labels */}
        <div className="absolute top-4 left-4 text-[10px] font-mono text-muted-foreground uppercase opacity-50">Languages</div>
        <div className="absolute top-4 right-4 text-[10px] font-mono text-muted-foreground uppercase opacity-50">Tools</div>
        <div className="absolute bottom-4 left-4 text-[10px] font-mono text-muted-foreground uppercase opacity-50">Platforms</div>
        <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground uppercase opacity-50">Techniques</div>

        {/* Blips */}
        {radarData.map((blip, index) => {
          // Calculate pseudo-random position based on ring and quadrant
          // deterministic random based on name
          const seed = blip.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

          let ringIndex = rings.indexOf(blip.ring);
          let quadIndex = quadrants.indexOf(blip.quadrant);

          // Map quadrants to visual corners: 0:TL, 1:TR, 2:BL, 3:BR
          // 0 (Lang) -> TL (-x, -y)
          // 1 (Tools) -> TR (+x, -y)
          // 2 (Plat) -> BL (-x, +y)
          // 3 (Tech) -> BR (+x, +y)

          // Ring offset: Adopt (center) -> Hold (outer)
          // Adopt: 0-25%, Trial: 25-50%, Assess: 50-75%, Hold: 75-100%
          const baseDist = (ringIndex * 0.25) + 0.1; // start of ring
          const randomDist = (seed % 15) / 100; // small variation
          const distance = (baseDist + randomDist) * 50; // 0-50% from center

          const angleBase = quadIndex * 90; // 0, 90, 180, 270
          const randomAngle = (seed % 60) + 15; // 15-75 degrees inside quadrant

          // Adjust for visual quadrants
          let finalAngle = 0;
          if (blip.quadrant === 'Languages & Frameworks') finalAngle = 270 + (seed % 80); // Top Left-ish
          if (blip.quadrant === 'Tools') finalAngle = 0 + (seed % 80); // Top Right
          if (blip.quadrant === 'Platforms') finalAngle = 180 + (seed % 80); // Bottom Left
          if (blip.quadrant === 'Techniques') finalAngle = 90 + (seed % 80); // Bottom Right

          // Convert polar to cartesian (percentage)
          const rad = (finalAngle * Math.PI) / 180;
          const x = 50 + (Math.cos(rad) * distance); // %
          const y = 50 + (Math.sin(rad) * distance); // %

          const isHovered = hoveredBlip === blip.name;
          const isSelected = selectedQuadrant === null || selectedQuadrant === blip.quadrant;

          return (
            <motion.div
              key={blip.name}
              className={`absolute w-3 h-3 rounded-full border border-background shadow-sm cursor-pointer z-10 transition-all duration-300
                ${blip.ring === 'Adopt' ? 'bg-green-500' :
                  blip.ring === 'Trial' ? 'bg-blue-500' :
                    blip.ring === 'Assess' ? 'bg-yellow-500' : 'bg-red-500'}
              `}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                opacity: isSelected ? 1 : 0.2,
                scale: isHovered ? 1.5 : 1
              }}
              onMouseEnter={() => setHoveredBlip(blip.name)}
              onMouseLeave={() => setHoveredBlip(null)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isHovered ? 1.5 : 1, opacity: isSelected ? 1 : 0.2 }}
              transition={{ delay: index * 0.05 }}
            />
          );
        })}
      </div>

      {/* List / Controls */}
      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedQuadrant(null)}
            className={`px-3 py-1 text-xs font-mono border rounded transition-all ${!selectedQuadrant ? 'bg-foreground text-background border-foreground' : 'text-muted-foreground border-border'}`}
          >
            ALL
          </button>
          {quadrants.map(q => (
            <button
              key={q}
              onClick={() => setSelectedQuadrant(q === selectedQuadrant ? null : q as any)}
              className={`px-3 py-1 text-xs font-mono border rounded transition-all ${selectedQuadrant === q ? 'bg-foreground text-background border-foreground' : 'text-muted-foreground border-border hover:border-foreground/50'}`}
            >
              {q.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {rings.map(ring => {
            const items = filteredData.filter(d => d.ring === ring);
            if (items.length === 0) return null;

            return (
              <div key={ring} className="space-y-2">
                <h3 className={`text-sm font-bold font-mono uppercase tracking-widest border-b border-border pb-1 
                  ${ring === 'Adopt' ? 'text-green-500' :
                    ring === 'Trial' ? 'text-blue-500' :
                      ring === 'Assess' ? 'text-yellow-500' : 'text-red-500'}
                `}>
                  {ring}
                </h3>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li
                      key={item.name}
                      onMouseEnter={() => setHoveredBlip(item.name)}
                      onMouseLeave={() => setHoveredBlip(null)}
                      className={`text-sm group flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${hoveredBlip === item.name ? 'bg-secondary' : ''}`}
                    >
                      <span className="font-mono text-foreground/80 group-hover:text-foreground">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono opacity-50">{item.quadrant}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
