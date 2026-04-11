<!-- gsd-project-start source:PROJECT.md -->
## Project

**Portfolio (truongsoftware.com)**

A personal developer portfolio and publishing site: Astro-driven hybrid static site with React islands, Markdown/MDX content collections (blog, journal, courses), API routes for contact and interactive features, and optional LanceDB-backed semantic search. It showcases work, writing, and tooling experiments in one cohesive experience. The public domain is **truongsoftware.com** (migrated from truongdq.com in milestone v1.1).

**Core Value:** Visitors can reliably read your writing, understand your background, and reach you—while the site stays fast, maintainable, and honest to how you build software.

### Constraints

- **Tech**: Stay compatible with Astro Content Collections and existing MDX pipeline — large migrations need explicit phases
- **Secrets**: No secrets in repo; API keys only via environment — security baseline
- **Performance**: Static-first; heavy JS only where islands justify it
<!-- gsd-project-end -->

<!-- gsd-stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript (strict, `extends` `astro/tsconfigs/strict` in `tsconfig.json`) — application, API routes, React islands, scripts
- MDX/Markdown — content in `src/content/blog/`, `src/content/journal/`, `src/content/courses/` via Astro Content Collections (`src/content.config.ts`)
- Astro component syntax — layouts and pages under `src/pages/`, `src/layouts/`, `src/components/*.astro`
- Shell — CI/deploy steps in `.github/workflows/deploy.yml`
## Runtime
- Node.js — CI build uses Node 22 (`.github/workflows/deploy.yml`); production runs `dist/server/entry.mjs` under PM2
- Bun — primary package install and script runner (`bun install`, `bun run build`, `bun scripts/...` per `package.json` and workflows)
- Bun — lockfile present: `bun.lock`
## Frameworks
- Astro `^6.0.4` — static + server hybrid; site `https://truongdq.com`; `output: 'static'` with `@astrojs/node` adapter `mode: 'standalone'` (`astro.config.mjs`)
- React `^19.2.3` — islands via `@astrojs/react` (`astro.config.mjs`, `tsconfig.json` `jsx`: `react-jsx`)
- Vite — bundler inside Astro; Tailwind CSS v4 via `@tailwindcss/vite` plugin (`astro.config.mjs`)
- `@astrojs/mdx` — MDX pages
- `@astrojs/rss`, `@astrojs/sitemap` — feeds and sitemap (`package.json` integrations in `astro.config.mjs`)
- Not detected — no `vitest`, `jest`, or `playwright` test runner in `package.json`; only `src/lib/utils.test.ts` exists as a stray pattern (verify before relying on it)
- ESLint flat config — `eslint.config.mjs` (`typescript-eslint`, `eslint-plugin-react-hooks`)
- Astro Check — `@astrojs/check` in dependencies for typechecking Astro projects
## Key Dependencies
- `tailwindcss` `^4.1.18`, `@tailwindcss/typography`, `tailwind-merge`, `class-variance-authority`, `clsx` — styling system
- `framer-motion`, `lucide-react`, Radix UI primitives (`@radix-ui/react-*`) — components
- `react-hook-form`, `@hookform/resolvers`, `zod` — forms and validation (`src/components/ContactForm.client.tsx`, API routes under `src/pages/api/`)
- `d3`, `recharts`, `mermaid`, `react-force-graph-2d`, `react-force-graph-3d`, `three` — charts, diagrams, graph views
- `cmdk` — command palette UX
- `@lancedb/lancedb` — vector store for semantic search (`scripts/index-content.ts`, `src/pages/api/search.ts`)
- `@xenova/transformers` — local embedding model `Xenova/all-MiniLM-L6-v2` (same files)
- `gray-matter` (devDependency) — frontmatter parsing in scripts
- `satori`, `@resvg/resvg-js` — certificate SVG generation (`src/lib/certificate-generator.ts`)
- `ai`, `@ai-sdk/google`, `@ai-sdk/react`, `@google/generative-ai` — listed in `package.json` / `bun.lock` with no matching `import` statements in application or script code; treat as optional/future unless a build-time reference appears
- `@astrojs/cloudflare` is a dependency in `package.json` but `astro.config.mjs` uses `@astrojs/node`, not the Cloudflare adapter — do not assume Workers deployment from config alone
## Configuration
- Astro injects build metadata via Vite `define`: `import.meta.env.APP_VERSION`, `APP_HASH`, `APP_LICENSE` (`astro.config.mjs`)
- Typed public env in `src/env.d.ts`: `PUBLIC_TELEGRAM_BOT_TOKEN`, `PUBLIC_TELEGRAM_CHAT_ID`, plus `APP_*`
- Server APIs use `process.env` for Telegram in `src/pages/api/contact.ts` (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) — align client vs server naming when configuring
- Local `.env` files are gitignored; use them for secrets in development and map equivalent vars on the host/PM2
- `@/*` → `src/*` (`tsconfig.json`)
- `astro.config.mjs` — `trailingSlash: "always"`, `build.format: 'directory'`
- Git commit hash read at build time via `child_process.execSync` in `astro.config.mjs`
## Platform Requirements
- Bun for installs and scripts; Node compatible with Astro 6 / React 19
- Embedding + LanceDB indexing may be memory-heavy; CI uses `NODE_OPTIONS: "--max-old-space-size=4096"` for build
- Self-hosted AWS Lightsail (per `.github/workflows/deploy.yml`): static assets to Nginx docroot, Node server via PM2 on port 4321, Nginx reverse proxy implied
<!-- gsd-stack-end -->

<!-- gsd-conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- React components: `PascalCase.tsx` (for example `BlogContent.tsx`, `CommandPalette.tsx`).
- Client-only islands: suffix `.client.tsx` (for example `Experience.client.tsx`, `ScrollToTop.client.tsx`).
- Astro API routes: `src/pages/api/**` as `*.ts` exporting HTTP method handlers (`GET`, `POST`, etc.).
- Utilities and shared logic: `camelCase.ts` under `src/lib/` (for example `api-utils.ts`, `utils.ts`).
- Tests: co-located `*.test.ts` next to the module under test (for example `src/lib/utils.test.ts`).
- `camelCase` for functions and variables (for example `slugify`, `formatDate`, `fetchWithRetry` in `src/lib/utils.ts`, `src/lib/api-utils.ts`).
- `camelCase` for locals; unused parameters/vars intentionally ignored with a leading `_` to satisfy ESLint (`argsIgnorePattern`, `varsIgnorePattern` in `eslint.config.mjs`).
- `PascalCase` for interfaces and types (for example `BlogPostMetadata`, `Post` in `src/types/index.ts`).
- Use `type` vs `interface` as already done in domain types; `import type` for type-only imports is common (for example `import type { APIRoute } from 'astro'` in `src/pages/api/contact.ts`).
## Code Style
- Prettier: Not detected (no `.prettierrc`, no `prettier` dependency).
- Rely on editor defaults; match surrounding files (single quotes are typical in `src/lib/utils.ts`; `src/lib/utils.test.ts` uses double quotes for imports—prefer aligning with the dominant single-quote style in `src/`).
- ESLint flat config: `eslint.config.mjs`.
- Stack: `@eslint/js` recommended, `typescript-eslint` recommended (`...tseslint.configs.recommended`), `eslint-plugin-react-hooks` recommended rules merged in.
- **Ignored paths:** `dist/**`, `.astro/**`, `node_modules/**`, `public/**`, and **all `*.astro` files** (`**/*.astro`). Lint TypeScript/JavaScript only; Astro templates are not ESLint-covered here.
- **Notable rule overrides:** `no-console` off; `@typescript-eslint/no-explicit-any` off; `@typescript-eslint/no-unused-vars` error with `_` prefix ignore patterns; `no-undef` off (TypeScript handles this).
- `tsconfig.json` extends `astro/tsconfigs/strict` with `baseUrl` `.` and path alias `@/*` → `src/*`.
- `bun-types` included in `compilerOptions.types` for Bun globals in tooling/scripts.
## Import Organization
- `@/*` maps to `src/*` — use for anything under `src/` instead of long relative paths (`tsconfig.json`).
## Error Handling
- **API routes:** wrap handlers in `try`/`catch`, return `Response` with JSON body and appropriate `status`; validate input with **Zod** via `.safeParse()` and return `400` with a stable error shape on failure (see `src/pages/api/contact.ts`).
- **HTTP helpers:** `fetchWithRetry` in `src/lib/api-utils.ts` uses try/catch per attempt, distinguishes retryable cases, uses `console.warn` for retries, throws on exhaustion.
- **Narrow unknown errors:** `error instanceof Error ? error : new Error('...')` where errors are rethrown or stored (for example `src/lib/api-utils.ts`).
- **Client components:** local `try`/`catch` around async work where user feedback is needed (for example `src/components/ContactForm.client.tsx`, `src/components/CommandPalette.tsx`).
- Prefer Zod schemas at API boundaries (`z.object`, `.safeParse`) as in `src/pages/api/contact.ts`.
## Logging
- `console.error` for misconfiguration or hard failures (for example missing env in `src/pages/api/contact.ts`).
- `console.warn` for retry/backoff noise in `src/lib/api-utils.ts`.
## Comments
- File-level or function-level JSDoc on exported utilities where behavior is non-obvious (for example `formatDate`, `calculateReadingTime`, `slugify` in `src/lib/utils.ts`).
- Occasional requirement references in module headers (for example `src/lib/api-utils.ts` mentions "Requirements: 14.6").
- Use `@param` / `@returns` on shared helpers when documenting public API of `src/lib/` exports.
## Function Design
## Module Design
<!-- gsd-conventions-end -->

<!-- gsd-architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- **Content-first:** Markdown/MDX in `src/content/` with Astro Content Collections (`astro:content`) and Zod schemas in `src/content.config.ts`.
- **Shell + slots:** `src/layouts/BaseLayout.astro` provides global chrome (meta, nav, command palette data, transitions) and injects page content via `<slot />`.
- **Server endpoints:** `src/pages/api/**/*.ts` implement `APIRoute` handlers (POST/GET) for forms, search, payments, and interactive features; many set `prerender = false` so they run on the Node adapter at request time.
- **Configuration as code:** Portfolio copy, SEO defaults, navigation, and structured lists (skills, projects, experience) live in `src/lib/config.ts` rather than a headless CMS.
## Layers
- Purpose: Route mapping, static path generation, composing layouts and components.
- Location: `src/pages/`, `src/layouts/`
- Contains: `.astro` pages, `getStaticPaths`, `getCollection` / `render` calls.
- Depends on: `astro:content`, `@/layouts/*`, `@/components/*`, `@/lib/*`
- Used by: HTTP requests (build output + server adapter for non-prerendered routes).
- Purpose: Interactive UI, MDX embeds, design-system primitives.
- Location: `src/components/` (root: feature components; `src/components/ui/`: shadcn-style primitives; `src/components/mdx/`: MDX helpers; `src/components/seo/`: structured data).
- Contains: `.tsx` (often `*.client.tsx` for explicit island hydration), `.astro` chrome.
- Depends on: `react`, Radix, Tailwind, `@/lib/utils`, `@/types/*`
- Used by: Astro pages via `client:load` / `client:visible` / `client:idle` and direct imports in `.astro` files.
- Purpose: Validated frontmatter and body for blog, journal, and courses.
- Location: `src/content.config.ts`, `src/content/blog/`, `src/content/journal/`, `src/content/courses/`
- Contains: `.md`/`.mdx` files; collection schemas (Zod).
- Depends on: `astro:content`, `astro/loaders` (`glob`), `zod`
- Used by: Pages (`getCollection`, `render`), `src/lib/graph.ts`, RSS (`src/pages/rss.xml.js`), OG image route (`src/pages/og/[...path].png.ts`).
- Purpose: Shared business rules, API helpers, graph/search data assembly, feature-specific static data.
- Location: `src/lib/` (e.g. `api-utils.ts`, `graph.ts`, `config.ts`, `telegram.ts`, `*-data.ts` modules)
- Contains: Pure/async helpers, Zod validation in routes, fetch helpers.
- Depends on: `astro:content` where needed, env-backed services in API routes.
- Used by: `src/pages/api/*`, Astro pages, React components.
- Purpose: Contact, Telegram, Stripe, search, LanceDB-backed features, etc.
- Location: `src/pages/api/*`, `src/lib/db/` (D1-oriented types and SQL helpers for Cloudflare-style bindings), `data/` (LanceDB index — not committed as stable artifact in all environments).
- Contains: `APIRoute` handlers, optional DB query helpers in `src/lib/db/index.ts`.
- Depends on: `process.env` (never commit secrets); see deployment docs for bindings.
- Purpose: Shared TypeScript contracts for React and config.
- Location: `src/types/*.ts`, `src/types/index.ts`
- Used by: Components and `src/lib/config.ts`.
## Data Flow
- **Server/build:** No global app store; Astro props and `getCollection` drive HTML.
- **Client:** Component-local React state; `@tanstack/react-query` where used in interactive features; Astro View Transitions (`ClientRouter` in `BaseLayout.astro`) for SPA-like navigation between static pages.
## Key Abstractions
- Purpose: Typed, validated content with stable IDs (file paths as slugs).
- Examples: `src/content.config.ts`, usage in `src/pages/blog/[...slug].astro`, `src/pages/journal/[...slug].astro`, `src/pages/courses/[...slug].astro`
- Pattern: `defineCollection` + `glob` loader + Zod `schema`; consume with `getCollection` / `render`.
- Purpose: Single source for `seo`, `navLinks`, `personalInfo`, `projectsConfig`, UI strings.
- Examples: `src/lib/config.ts`
- Pattern: Exported const objects and typed interfaces; imported by layouts, RSS, and components.
- Purpose: Standard HTTP handling for Astro server output.
- Examples: `src/pages/api/contact.ts`, `src/pages/api/search.ts`, `src/pages/api/stripe/webhook.ts`
- Pattern: Named exports `GET` / `POST` as `APIRoute`; `prerender = false` when the route must execute at runtime.
- Purpose: Derive visualization data from collections.
- Examples: `src/lib/graph.ts`
- Pattern: Async pure function returning `{ nodes, links }` for `KnowledgeGraph.client.tsx`.
## Entry Points
- Location: `astro.config.mjs`
- Triggers: `npm run dev`, `npm run build`, `npm run preview`
- Responsibilities: Registers React, MDX, sitemap, Tailwind Vite plugin, path aliases, `trailingSlash: "always"`, `build.format: "directory"`, Node adapter in standalone mode.
- Location: `src/pages/**/*` — file system defines URLs (`index.astro` → `/`, `[...slug].astro` → catch-all segments).
- Triggers: User navigation and `fetch` to `/api/*`.
- Responsibilities: HTML for prerendered routes; server handlers for `prerender = false` routes.
- Location: `src/pages/rss.xml.js` — `GET` export feeding `@astrojs/rss`.
- Location: `src/pages/og/[...path].png.ts` — dynamic PNG generation with `satori` + `@resvg/resvg-js`, `prerender = false`.
## Error Handling
- `safeParse` / validation failure → 400 with JSON body (`src/pages/api/contact.ts`).
- Missing env configuration → 500 without leaking secrets (`src/pages/api/contact.ts`).
- DB init in `src/lib/db/index.ts` logs errors and continues when idempotent DDL fails.
## Cross-Cutting Concerns
<!-- gsd-architecture-end -->

<!-- gsd-workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- gsd-workflow-end -->



<!-- gsd-profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- gsd-profile-end -->
