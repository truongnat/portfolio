# Portfolio (truongdq.com)

## What This Is

A personal developer portfolio and publishing site: Astro-driven hybrid static site with React islands, Markdown/MDX content collections (blog, journal, courses), API routes for contact and interactive features, and optional LanceDB-backed semantic search. It showcases work, writing, and tooling experiments in one cohesive experience.

## Core Value

Visitors can reliably read your writing, understand your background, and reach you—while the site stays fast, maintainable, and honest to how you build software.

## Requirements

### Validated

- ✓ **Content publishing** — Blog, journal, and course content via Astro Content Collections with Zod-validated frontmatter (`src/content/`, `src/content.config.ts`) — existing
- ✓ **Hybrid rendering** — Prerendered pages plus server API routes where needed (`export const prerender = false` on selected endpoints) — existing
- ✓ **Interactive UI** — React 19 islands with Tailwind v4, Radix, and shared layout shell (`src/components/`, `src/layouts/BaseLayout.astro`) — existing
- ✓ **Discovery & SEO** — RSS, sitemap, OG-oriented routes, structured metadata — existing
- ✓ **Contact & integrations** — API routes for forms and external services (e.g. Telegram, Stripe-related flows per `src/pages/api/`) — existing
- ✓ **Search & knowledge UX** — LanceDB + embeddings pipeline and search API (`scripts/index-content.ts`, `src/pages/api/search.ts`) — existing
- ✓ **Build & quality gate** — ESLint flat config, Astro check, Bun-based scripts (`package.json`) — existing

### Active

- [ ] Keep deployment path (Node adapter / CI) aligned with Astro and dependency updates
- [ ] Maintain API route safety (validation, env secrets, rate limits where applicable)
- [ ] Evolve content and features without breaking content collection contracts
- [ ] Address technical debt called out in `.planning/codebase/CONCERNS.md` as priorities emerge

### Out of Scope

- Replacing Astro with another framework — unnecessary churn; current stack is intentional
- Full test suite in the short term — testing posture is minimal today; expanding tests is optional future work

## Context

- **Stack:** Astro 6, React 19 islands, TypeScript (strict), Tailwind v4, Bun for scripts; see `.planning/codebase/STACK.md`.
- **Architecture:** File-based routes, content collections, domain logic in `src/lib/`; see `.planning/codebase/ARCHITECTURE.md`.
- **Indexing:** GitNexus graph index refreshed (`npx gitnexus analyze --force`); GSD codebase map in `.planning/codebase/`.
- **Data:** LanceDB under `data/` for local semantic search; treat env and bindings as deployment-specific.

## Constraints

- **Tech**: Stay compatible with Astro Content Collections and existing MDX pipeline — large migrations need explicit phases
- **Secrets**: No secrets in repo; API keys only via environment — security baseline
- **Performance**: Static-first; heavy JS only where islands justify it

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Astro + React islands | Content-first with interactive pockets | ✓ Good — matches current codebase |
| GSD brownfield init after codebase map | Accurate Validated requirements from existing code | — Pending |
| Skip ecosystem research pass for init | Codebase map + GitNexus already capture stack and structure | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-12 after initialization with codebase map*
