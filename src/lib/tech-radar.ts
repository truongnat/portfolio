export interface RadarBlip {
  name: string;
  ring: 'Adopt' | 'Trial' | 'Assess' | 'Hold';
  quadrant: 'Languages & Frameworks' | 'Tools' | 'Platforms' | 'Techniques';
  description?: string;
}

export const radarData: RadarBlip[] = [
  // Adopt
  { name: 'TypeScript', ring: 'Adopt', quadrant: 'Languages & Frameworks', description: 'Primary language for type-safe development.' },
  { name: 'React/Next.js', ring: 'Adopt', quadrant: 'Languages & Frameworks' },
  { name: 'Astro', ring: 'Adopt', quadrant: 'Languages & Frameworks', description: 'Preferred for content-heavy sites.' },
  { name: 'Tailwind CSS', ring: 'Adopt', quadrant: 'Languages & Frameworks' },
  { name: 'Node.js', ring: 'Adopt', quadrant: 'Languages & Frameworks' },
  { name: 'VS Code', ring: 'Adopt', quadrant: 'Tools' },
  { name: 'Docker', ring: 'Adopt', quadrant: 'Platforms' },
  { name: 'Vercel', ring: 'Adopt', quadrant: 'Platforms' },
  { name: 'CI/CD (GitHub Actions)', ring: 'Adopt', quadrant: 'Techniques' },
  { name: 'Agentic Workflows', ring: 'Adopt', quadrant: 'Techniques' },

  // Trial
  { name: 'Rust', ring: 'Trial', quadrant: 'Languages & Frameworks', description: 'Exploring for high-performance tooling.' },
  { name: 'Bun', ring: 'Trial', quadrant: 'Tools', description: 'Fast all-in-one runtime.' },
  { name: 'Supabase', ring: 'Trial', quadrant: 'Platforms' },
  { name: 'Tauri', ring: 'Trial', quadrant: 'Languages & Frameworks' },

  // Assess
  { name: 'Go', ring: 'Assess', quadrant: 'Languages & Frameworks' },
  { name: 'Kubernetes', ring: 'Assess', quadrant: 'Platforms' },
  { name: 'WebAssembly', ring: 'Assess', quadrant: 'Techniques' },

  // Hold
  { name: 'Redux (Vanilla)', ring: 'Hold', quadrant: 'Languages & Frameworks', description: 'Prefer Zustand or Context API.' },
  { name: 'Jenkins', ring: 'Hold', quadrant: 'Tools', description: 'Moving towards cloud-native CI/CD.' },
];
