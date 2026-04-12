# Phase 7: Housekeeping — Context

**Gathered:** 2026-04-12  
**Status:** Planned  
**Source:** Roadmap Phase 7, REQUIREMENTS HK-01 / HK-02, `.planning/codebase/CONCERNS.md`

## Phase boundary

**HK-01** — **Dependencies and scripts** are reviewed: remove truly unused packages or **document** why they remain (e.g. fork alias, future feature). **`bun run build`** and **`bun run lint`** stay green after changes.

**HK-02** — **Repository hygiene**: `.gitignore` and short **operator docs** make non-committed paths obvious (`data/lancedb`, env files, keys, PEM material). **Disabled Astro routes** (`*.astro.disabled`) are either **removed**, **re-enabled** with a product decision, or **listed with rationale** under `docs/` (not left unexplained).

Out of scope: Phase 8 PlantUML feature docs; large refactors; replacing `@nanostores/react` fork unless a drop-in swap is trivial during audit.

## Implementation decisions (locked)

- **Unused deps:** Prefer **`depcheck`** or **`knip`** (or `bun pm ls` + import grep) with a recorded command in the plan summary — avoid guessing removals without tooling.
- **`.disabled` pages:** Inventory all `src/pages/**/*.disabled`; destination file **`docs/REPO_HYGIENE.md`** (or `docs/disabled-routes.md`) with table: path, purpose, re-enable criteria.
- **`.gitignore`:** Add **generic** patterns where safe (e.g. `*.pem`, optional `.env.*.local`) without ignoring files that must ship.

## Canonical references

- `.planning/ROADMAP.md` — Phase 7 success criteria
- `.planning/REQUIREMENTS.md` — HK-01, HK-02
- `package.json`, `bun.lock`, `.gitignore`

---
*Phase: 07-housekeeping*
