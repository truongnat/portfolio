# Architecture

**Analysis Date:** 2026-04-12

## Pattern Overview

**Overall:** Astro file-based static site generation with **hybrid rendering**: most routes are prerendered; selected API and dynamic endpoints opt out via `export const prerender = false`. React is used as **islands** (hydrated components) alongside Astro layouts and MD/MDX content.

**Key Characteristics:**
- **Content-first:** Markdown/MDX in `src/content/` with Astro Content Collections (`astro:content`) and Zod schemas in `src/content.config.ts`.
- **Shell + slots:** `src/layouts/BaseLayout.astro` provides global chrome (meta, nav, command palette data, transitions) and injects page content via `<slot />`.
- **Server endpoints:** `src/pages/api/**/*.ts` implement `APIRoute` handlers (POST/GET) for forms, search, payments, and interactive features; many set `prerender = false` so they run on the Node adapter at request time.
- **Configuration as code:** Portfolio copy, SEO defaults, navigation, and structured lists (skills, projects, experience) live in `src/lib/config.ts` rather than a headless CMS.

## Layers

**Presentation (Astro pages & layouts):**
- Purpose: Route mapping, static path generation, composing layouts and components.
- Location: `src/pages/`, `src/layouts/`
- Contains: `.astro` pages, `getStaticPaths`, `getCollection` / `render` calls.
- Depends on: `astro:content`, `@/layouts/*`, `@/components/*`, `@/lib/*`
- Used by: HTTP requests (build output + server adapter for non-prerendered routes).

**UI components (React + Astro):**
- Purpose: Interactive UI, MDX embeds, design-system primitives.
- Location: `src/components/` (root: feature components; `src/components/ui/`: shadcn-style primitives; `src/components/mdx/`: MDX helpers; `src/components/seo/`: structured data).
- Contains: `.tsx` (often `*.client.tsx` for explicit island hydration), `.astro` chrome.
- Depends on: `react`, Radix, Tailwind, `@/lib/utils`, `@/types/*`
- Used by: Astro pages via `client:load` / `client:visible` / `client:idle` and direct imports in `.astro` files.

**Content & schema:**
- Purpose: Validated frontmatter and body for blog, journal, and courses.
- Location: `src/content.config.ts`, `src/content/blog/`, `src/content/journal/`, `src/content/courses/`
- Contains: `.md`/`.mdx` files; collection schemas (Zod).
- Depends on: `astro:content`, `astro/loaders` (`glob`), `zod`
- Used by: Pages (`getCollection`, `render`), `src/lib/graph.ts`, RSS (`src/pages/rss.xml.js`), OG image route (`src/pages/og/[...path].png.ts`).

**Domain & integration logic:**
- Purpose: Shared business rules, API helpers, graph/search data assembly, feature-specific static data.
- Location: `src/lib/` (e.g. `api-utils.ts`, `graph.ts`, `config.ts`, `telegram.ts`, `*-data.ts` modules)
- Contains: Pure/async helpers, Zod validation in routes, fetch helpers.
- Depends on: `astro:content` where needed, env-backed services in API routes.
- Used by: `src/pages/api/*`, Astro pages, React components.

**Persistence & external IO (API routes):**
- Purpose: Contact, Telegram, Stripe, search, LanceDB-backed features, etc.
- Location: `src/pages/api/*`, `src/lib/db/` (D1-oriented types and SQL helpers for Cloudflare-style bindings), `data/` (LanceDB index — not committed as stable artifact in all environments).
- Contains: `APIRoute` handlers, optional DB query helpers in `src/lib/db/index.ts`.
- Depends on: `process.env` (never commit secrets); see deployment docs for bindings.

**Types:**
- Purpose: Shared TypeScript contracts for React and config.
- Location: `src/types/*.ts`, `src/types/index.ts`
- Used by: Components and `src/lib/config.ts`.

## Data Flow

**Static page (e.g. home):**

1. User requests `/` (trailing slash enforced per `astro.config.mjs`).
2. `src/pages/index.astro` runs at build time (`prerender = true`).
3. `BaseLayout` loads blog/journal collections for the command palette and SEO shell.
4. React islands (`Hero.client`, `ContactForm.client`, etc.) hydrate per `client:*` directives.

**Blog post:**

1. `src/pages/blog/[...slug].astro` `getStaticPaths` enumerates `blog` collection entries.
2. `render(post)` produces MDX content and headings for TOC.
3. `BaseLayout` receives title/description/tags; OG image path derived in layout for article routes.

**API POST (e.g. contact):**

1. Browser POSTs JSON to `/api/contact/`.
2. `src/pages/api/contact.ts` parses body, validates with Zod (`zod`), calls Telegram via `fetchWithRetry` from `src/lib/api-utils.ts`.
3. JSON `Response` with appropriate status codes.

**Knowledge graph page:**

1. `src/pages/graph.astro` calls `getGraphData()` from `src/lib/graph.ts` at build time.
2. Aggregated nodes/links from `blog` and `journal` collections pass to `KnowledgeGraphClient` as props.

**State Management:**
- **Server/build:** No global app store; Astro props and `getCollection` drive HTML.
- **Client:** Component-local React state; `@tanstack/react-query` where used in interactive features; Astro View Transitions (`ClientRouter` in `BaseLayout.astro`) for SPA-like navigation between static pages.

## Key Abstractions

**Content Collections:**
- Purpose: Typed, validated content with stable IDs (file paths as slugs).
- Examples: `src/content.config.ts`, usage in `src/pages/blog/[...slug].astro`, `src/pages/journal/[...slug].astro`, `src/pages/courses/[...slug].astro`
- Pattern: `defineCollection` + `glob` loader + Zod `schema`; consume with `getCollection` / `render`.

**Site configuration module:**
- Purpose: Single source for `seo`, `navLinks`, `personalInfo`, `projectsConfig`, UI strings.
- Examples: `src/lib/config.ts`
- Pattern: Exported const objects and typed interfaces; imported by layouts, RSS, and components.

**API route module:**
- Purpose: Standard HTTP handling for Astro server output.
- Examples: `src/pages/api/contact.ts`, `src/pages/api/search.ts`, `src/pages/api/stripe/webhook.ts`
- Pattern: Named exports `GET` / `POST` as `APIRoute`; `prerender = false` when the route must execute at runtime.

**Graph data builder:**
- Purpose: Derive visualization data from collections.
- Examples: `src/lib/graph.ts`
- Pattern: Async pure function returning `{ nodes, links }` for `KnowledgeGraph.client.tsx`.

## Entry Points

**Astro dev/build:**
- Location: `astro.config.mjs`
- Triggers: `npm run dev`, `npm run build`, `npm run preview`
- Responsibilities: Registers React, MDX, sitemap, Tailwind Vite plugin, path aliases, `trailingSlash: "always"`, `build.format: "directory"`, Node adapter in standalone mode.

**HTTP (static + server):**
- Location: `src/pages/**/*` — file system defines URLs (`index.astro` → `/`, `[...slug].astro` → catch-all segments).
- Triggers: User navigation and `fetch` to `/api/*`.
- Responsibilities: HTML for prerendered routes; server handlers for `prerender = false` routes.

**RSS:**
- Location: `src/pages/rss.xml.js` — `GET` export feeding `@astrojs/rss`.

**OG images:**
- Location: `src/pages/og/[...path].png.ts` — dynamic PNG generation with `satori` + `@resvg/resvg-js`, `prerender = false`.

## Error Handling

**Strategy:** Validate at API boundaries with Zod; return JSON `Response` objects with 4xx/5xx; use `try/catch` in handlers; `fetchWithRetry` for outbound HTTP resilience.

**Patterns:**
- `safeParse` / validation failure → 400 with JSON body (`src/pages/api/contact.ts`).
- Missing env configuration → 500 without leaking secrets (`src/pages/api/contact.ts`).
- DB init in `src/lib/db/index.ts` logs errors and continues when idempotent DDL fails.

## Cross-Cutting Concerns

**Logging:** `console.*` in API routes and DB init; avoid logging secrets.

**Validation:** Zod in API routes and content schemas (`src/content.config.ts`).

**Authentication:** Not a unified auth layer in-repo; feature-specific checks in API routes (e.g. webhooks verify Stripe signatures where implemented). Treat each route as responsible for its own auth.

---

*Architecture analysis: 2026-04-12*
