# Technology Stack

**Analysis Date:** 2026-04-12

## Languages

**Primary:**
- TypeScript (strict, `extends` `astro/tsconfigs/strict` in `tsconfig.json`) — application, API routes, React islands, scripts
- MDX/Markdown — content in `src/content/blog/`, `src/content/journal/`, `src/content/courses/` via Astro Content Collections (`src/content.config.ts`)

**Secondary:**
- Astro component syntax — layouts and pages under `src/pages/`, `src/layouts/`, `src/components/*.astro`
- Shell — CI/deploy steps in `.github/workflows/deploy.yml`

## Runtime

**Environment:**
- Node.js — CI build uses Node 22 (`.github/workflows/deploy.yml`); production runs `dist/server/entry.mjs` under PM2
- Bun — primary package install and script runner (`bun install`, `bun run build`, `bun scripts/...` per `package.json` and workflows)

**Package Manager:**
- Bun — lockfile present: `bun.lock`

## Frameworks

**Core:**
- Astro `^6.0.4` — static + server hybrid; site `https://truongdq.com`; `output: 'static'` with `@astrojs/node` adapter `mode: 'standalone'` (`astro.config.mjs`)
- React `^19.2.3` — islands via `@astrojs/react` (`astro.config.mjs`, `tsconfig.json` `jsx`: `react-jsx`)
- Vite — bundler inside Astro; Tailwind CSS v4 via `@tailwindcss/vite` plugin (`astro.config.mjs`)

**Content:**
- `@astrojs/mdx` — MDX pages
- `@astrojs/rss`, `@astrojs/sitemap` — feeds and sitemap (`package.json` integrations in `astro.config.mjs`)

**Testing:**
- Not detected — no `vitest`, `jest`, or `playwright` test runner in `package.json`; only `src/lib/utils.test.ts` exists as a stray pattern (verify before relying on it)

**Build/Dev:**
- ESLint flat config — `eslint.config.mjs` (`typescript-eslint`, `eslint-plugin-react-hooks`)
- Astro Check — `@astrojs/check` in dependencies for typechecking Astro projects

## Key Dependencies

**Critical (UI & UX):**
- `tailwindcss` `^4.1.18`, `@tailwindcss/typography`, `tailwind-merge`, `class-variance-authority`, `clsx` — styling system
- `framer-motion`, `lucide-react`, Radix UI primitives (`@radix-ui/react-*`) — components
- `react-hook-form`, `@hookform/resolvers`, `zod` — forms and validation (`src/components/ContactForm.client.tsx`, API routes under `src/pages/api/`)

**Content & visualization:**
- `d3`, `recharts`, `mermaid`, `react-force-graph-2d`, `react-force-graph-3d`, `three` — charts, diagrams, graph views
- `cmdk` — command palette UX

**Server-side / tooling scripts:**
- `@lancedb/lancedb` — vector store for semantic search (`scripts/index-content.ts`, `src/pages/api/search.ts`)
- `@xenova/transformers` — local embedding model `Xenova/all-MiniLM-L6-v2` (same files)
- `gray-matter` (devDependency) — frontmatter parsing in scripts

**Image / OG-style generation:**
- `satori`, `@resvg/resvg-js` — certificate SVG generation (`src/lib/certificate-generator.ts`)

**Declared but not imported in `src/` or `scripts/` (as of analysis):**
- `ai`, `@ai-sdk/google`, `@ai-sdk/react`, `@google/generative-ai` — listed in `package.json` / `bun.lock` with no matching `import` statements in application or script code; treat as optional/future unless a build-time reference appears

**Infrastructure adapters (package vs config):**
- `@astrojs/cloudflare` is a dependency in `package.json` but `astro.config.mjs` uses `@astrojs/node`, not the Cloudflare adapter — do not assume Workers deployment from config alone

## Configuration

**Environment:**
- Astro injects build metadata via Vite `define`: `import.meta.env.APP_VERSION`, `APP_HASH`, `APP_LICENSE` (`astro.config.mjs`)
- Typed public env in `src/env.d.ts`: `APP_*` and other `import.meta.env` keys (no Telegram `PUBLIC_*` — contact uses server env only)
- Server APIs use `process.env` for Telegram in `src/pages/api/contact.ts` (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`)
- Local `.env` files are gitignored; use them for secrets in development and map equivalent vars on the host/PM2

**Path aliases:**
- `@/*` → `src/*` (`tsconfig.json`)

**Build:**
- `astro.config.mjs` — `trailingSlash: "always"`, `build.format: 'directory'`
- Git commit hash read at build time via `child_process.execSync` in `astro.config.mjs`

## Platform Requirements

**Development:**
- Bun for installs and scripts; Node compatible with Astro 6 / React 19
- Embedding + LanceDB indexing may be memory-heavy; CI uses `NODE_OPTIONS: "--max-old-space-size=4096"` for build

**Production:**
- Self-hosted AWS Lightsail (per `.github/workflows/deploy.yml`): static assets to Nginx docroot, Node server via PM2 on port 4321, Nginx reverse proxy implied

---

*Stack analysis: 2026-04-12*
