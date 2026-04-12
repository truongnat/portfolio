---
phase: 05-publishing-contact
plan: 01
subsystem: content
tags: [cont-01, zod, astro-content]

provides:
  - src/content/schemas.ts (blog, journal, courses Zod)
  - scripts/validate-content.ts + package.json content:validate in verify
affects: [05-02-plan]

requirements-completed: [CONT-01]

completed: 2026-04-12
---

# Phase 5 Plan 01 Summary

**Shared collection schemas and `content:validate` in `verify`**

## Accomplishments

- Extracted `blogSchema`, `journalSchema`, `coursesSchema` to `src/content/schemas.ts`; `content.config.ts` imports them.
- Added `scripts/validate-content.ts` (gray-matter + Zod per file, same glob rules as loaders).
- Wired `content:validate` into `bun run verify` after `check`.

## Files Created/Modified

- `src/content/schemas.ts` — new
- `src/content.config.ts` — uses schemas
- `scripts/validate-content.ts` — new
- `package.json` — scripts

## Deviations from Plan

None.

## User Setup Required

None.

---
*Phase: 05-publishing-contact*
