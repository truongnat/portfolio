---
phase: 06-domain-cutover
plan: 01
subsystem: seo
tags: [dom-01, canonical, astro]

provides:
  - CANONICAL_SITE_URL in src/lib/config.ts
  - astro.config.mjs site + BaseLayout, Schema, blog share URL, OG label from hostname
requirements-completed: [DOM-01]

completed: 2026-04-12
---

# Phase 6 Plan 01 Summary

**Single canonical origin + app-wide fallbacks**

## Accomplishments

- Added `CANONICAL_SITE_URL = 'https://truongsoftware.com'`; `seo.url` uses it.
- Set `astro.config.mjs` `site` with comment to keep in sync.
- `BaseLayout`, `Schema.astro`, `blog/[...slug].astro`, `og/[...path].png.ts` use `CANONICAL_SITE_URL` or derived `OG_SITE_LABEL`.

## Deviations from Plan

None.

## User Setup Required

None.

---
*Phase: 06-domain-cutover*
