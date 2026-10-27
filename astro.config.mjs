// @ts-check
import { defineConfig, sessionDrivers } from 'astro/config';
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
} catch {
  console.warn('Could not get git commit hash, using "unknown"');
}

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Keep in sync with CANONICAL_SITE_URL in src/lib/config.ts
  site: 'https://truongsoftware.com',
  output: 'static',
  // The site does not use Astro sessions. Pin a memory driver so the
  // Cloudflare adapter does not provision a KV namespace.
  session: {
    driver: sessionDrivers.lruCache(),
  },
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  integrations: [react(), mdx(), sitemap()],

  vite: {
    plugins: [
      /** @type {any} */ (tailwindcss()),
      {
        name: 'externalize-resvg',
        enforce: 'post',
        options(options) {
          const previous = options.external;
          options.external = (id, importer, isResolved) => {
            if (id.includes('@resvg/resvg-js') || id.includes('resvgjs')) return true;
            if (typeof previous === 'function') return previous(id, importer, isResolved);
            if (Array.isArray(previous)) return previous.includes(id);
            return false;
          };
          return options;
        },
      },
    ],
    ssr: {
      noExternal: ['lucide-react'],
      external: ['@resvg/resvg-js'],
    },
    build: {
      rollupOptions: {
        external: ['@resvg/resvg-js'],
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.APP_HASH': JSON.stringify(commitHash),
      'import.meta.env.APP_LICENSE': JSON.stringify(pkg.license || 'MIT'),
    },
  },
  trailingSlash: "always",
  build: {
    format: 'directory',
  }
});
