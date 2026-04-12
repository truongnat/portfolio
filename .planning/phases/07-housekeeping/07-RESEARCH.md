# Phase 7: Housekeeping — Research

**Researched:** 2026-04-12  
**Requirements:** HK-01, HK-02

## `.gitignore` (current)

- Ignores: `dist/`, `.astro/`, `node_modules/`, `.env`, `.env.production`, `LightsailDefaultKey-ap-southeast-1.pem` (single named key), `data/`, `.gitnexus/`
- **Gap:** Generic `*.pem` not present — other key filenames could be committed by mistake.

## Disabled routes (inventory)

| Path |
|------|
| `src/pages/learning-journey.astro.disabled` |
| `src/pages/code-review-auction.astro.disabled` |
| `src/pages/ai-thank-you.astro.disabled` |
| `src/pages/bug-bounty.astro.disabled` |
| `src/pages/skill-tree.astro.disabled` |
| `src/pages/admin/skill-tree.astro.disabled` |

None are linked from production nav until renamed to `.astro` — **HK-02** requires documentation.

## Dependency hints (non-exhaustive — execute-phase must run tooling)

- **`@astrojs/cloudflare`** — In `package.json`; `astro.config.mjs` uses **`@astrojs/node`** (CONCERNS / STACK already note mismatch). Strong candidate to **remove** or **document** as optional future adapter.
- **`@ai-sdk/google`**, **`@google/generative-ai`**, **`ai`** — Quick grep found no `from 'ai'` / `@ai-sdk` in `src/**/*.ts(x)`; **verify with depcheck** before removal (could be dead or used indirectly).
- **`@nanostores/react`: `ai/react`** — Intentional fork per `bun.lock`; **document in REPO_HYGIENE** if not removed.

## Risks

- Removing a dep that is dynamically imported or used only in scripts — **verify** covers `scripts/` too.
- **Knip/depcheck** false positives on Astro content — tune ignores for `src/content/**` if needed.

## Validation

- `bun run verify` after dependency changes
- Manual: read `docs/REPO_HYGIENE.md` for disabled-route table

---
*Phase: 07-housekeeping*
