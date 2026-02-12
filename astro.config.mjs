// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { execSync } from 'child_process';
import fs from 'fs';

// Get version and hash
let commitHash = 'unknown';
try {
  commitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (e) {
  console.warn('Could not get git commit hash, using "unknown"');
}

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

// https://astro.build/config
export default defineConfig({
  site: 'https://porfolio-truongdq.vercel.app',
  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.APP_HASH': JSON.stringify(commitHash),
      'import.meta.env.APP_LICENSE': JSON.stringify(pkg.license || 'MIT'),
    }
  }
});