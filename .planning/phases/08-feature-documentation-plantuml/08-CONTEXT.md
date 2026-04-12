# Phase 8: Feature documentation (PlantUML) — Context

**Gathered:** 2026-04-12  
**Status:** Ready for planning  
**Source:** Roadmap + REQUIREMENTS (DOC-01, DOC-02)

## Phase boundary

Deliver **reader-facing and contributor-facing architecture documentation** under `docs/`: a catalog entry point, root README pointer, and for each mandated feature area one **PlantUML** diagram plus a short **markdown companion** describing behavior and boundaries. No application behavior change unless fixing broken links introduced by new doc structure.

## Implementation decisions

- **Diagram style:** One `.puml` per feature area; at least one of component, sequence, or deployment diagram per file (PlantUML syntax; no build-time render required in CI for v1.1 — source files are the artifact).
- **Companion tone:** Concise: purpose, main code paths (file references), trust boundaries, env/deployment notes where relevant.
- **Catalog:** `docs/README.md` lists every feature companion with a relative link; existing `docs/DOMAIN_MIGRATION.md` and `docs/REPO_HYGIENE.md` remain linked from the same index.
- **Root README:** New section title exactly **`## Feature architecture`** (per DOC-01) pointing to `docs/README.md` (or `docs/`).
- **Execution order:** Create feature artifacts (DOC-02) before finalizing the docs index (DOC-01) so the catalog links resolve.

## Canonical references

**Downstream agents should read before implementing:**

- `.planning/ROADMAP.md` — Phase 8 success criteria
- `.planning/REQUIREMENTS.md` — DOC-01, DOC-02 and feature list
- `docs/REPO_HYGIENE.md` — Disabled routes; align API doc wording with stubs
- `.planning/codebase/ARCHITECTURE.md` — If present, for consistency
- `src/content.config.ts` — Content collections
- `src/layouts/BaseLayout.astro`, `src/components/CommandPalette.tsx` — Shell & command palette
- `src/pages/api/**/*.ts` — Public API surface
- `src/pages/api/search.ts`, `scripts/index-content.ts` — Search pipeline
- `src/pages/api/contact.ts` — Telegram contact
- `src/pages/api/stripe/*.ts`, `src/pages/api/certificate.ts`, `src/pages/api/crypto/*.ts` — Payments & certificates

## Specific ideas

- Group API routes in one diagram (as REQUIREMENTS imply) with clusters or notes for Stripe, crypto stubs, contact, search, certificate.
- Call out **stub / demo** routes consistently with CONCERNS/REPO_HYGIENE.

## Deferred

- Automated PlantUML rendering to PNG/SVG in CI (optional future).
- Full OpenAPI spec for APIs (out of scope for this phase).

---

*Phase: 08-feature-documentation-plantuml*
