# Migration Plan: Next.js to Astro

This document outlines the step-by-step plan to migrate the current Next.js portfolio project to Astro. The goal is to leverage Astro's "Island Architecture" for better performance while retaining the existing React components and Tailwind styling.

## Phase 1: Project Initialization

1.  **Create new Astro Project**:
    *   Run `npm create astro@latest .` (in a new branch or temporary folder, then merge).
    *   Select "Empty" or "Minimal" template.
2.  **Install Integrations**:
    *   `npx astro add react` (for reusing existing components).
    *   `npx astro add tailwind` (for styling).
    *   `npx astro add mdx` (for blog content).
    *   `npx astro add sitemap`.
3.  **Dependencies**:
    *   Install other dependencies from `package.json`: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`, `date-fns` (if used), etc.

## Phase 2: Configuration & Structure Setup

1.  **Tailwind Config**:
    *   Copy `tailwind.config.ts` content to the new Astro project's `tailwind.config.mjs`.
    *   Ensure content paths include `src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}`.
    *   Copy `app/globals.css` to `src/styles/globals.css`.
2.  **Directory Structure**:
    *   Create `src/components`.
    *   Create `src/layouts`.
    *   Create `src/lib` (or `src/utils`).
    *   Create `src/content/blog`.

## Phase 3: Content Migration (Content Collections)

1.  **Move Content**:
    *   Copy `content/blog/*.md` (or `.mdx`) to `src/content/blog/`.
2.  **Define Schema**:
    *   Create `src/content/config.ts`.
    *   Define the `blog` collection schema using `zod` to match the frontmatter of existing markdown files.
    *   *Note: Astro handles MDX/Markdown parsing built-in, so `lib/markdown.ts` might be simplified or removed.*

## Phase 4: Component Migration

1.  **Shared UI Components**:
    *   Copy `components/ui/*` to `src/components/ui/`.
    *   Ensure `lib/utils.ts` (cn helper) is moved and imports are updated.
2.  **Feature Components**:
    *   Copy `components/*.tsx` to `src/components/`.
    *   *Refactor check*: Check for `useRouter`, `usePathname` (Next.js specific hooks). Replace with standard `window.location` checks or pass props from Astro pages.
    *   *Client Components*: Identify components using `framer-motion` or `useState`. These will need `client:*` directives when used in Astro pages.

## Phase 5: Layout & Pages

1.  **Main Layout**:
    *   Create `src/layouts/Layout.astro`.
    *   Move `app/layout.tsx` logic here (HTML structure, Meta tags, Fonts).
    *   Import `globals.css`.
2.  **Landing Page**:
    *   Create `src/pages/index.astro`.
    *   Import React components (`Hero`, `Experience`, `Projects`, etc.).
    *   Usage: `<Hero client:load />` (or `client:visible` depending on interaction needs).
3.  **Blog Pages**:
    *   **Index**: Create `src/pages/blog/index.astro`. Fetch posts using `getCollection('blog')`.
    *   **Post**: Create `src/pages/blog/[...slug].astro`.
        *   Use `getStaticPaths` to generate routes from content collection.
        *   Render content using `<Content />` component from the collection entry.

## Phase 6: Admin & API (Optional/Advanced)

1.  **Admin Section**:
    *   If the admin section is client-side heavy (SPA), consider keeping it as a React-heavy page or using Astro's hybrid rendering (SSR) if it needs server-side auth.
    *   For now, focus on the public-facing site.
2.  **API Routes**:
    *   Move `app/api/*` to `src/pages/api/*`.
    *   Refactor handlers to use Astro's `APIRoute` types.

## Phase 7: Verification

1.  **Build Check**: Run `npm run build`.
2.  **Lint/Type Check**: Run `npm run lint` and `tsc`.
3.  **Performance**: Run Lighthouse to compare with the Next.js version.

## Key Changes Summary

*   **Routing**: `app/` folder -> `src/pages/` folder.
*   **Data Fetching**: `getStaticProps`/Server Components -> Astro Frontmatter / `getCollection`.
*   **Interactivity**: Default client components -> Explicit `client:*` directives ("Islands").
*   **Links**: `next/link` -> Standard `<a>` tags (or Astro's `<ViewTransitions />` if desired).
*   **Images**: `next/image` -> Astro's `<Image />` component.
