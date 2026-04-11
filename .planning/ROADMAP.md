# Roadmap: Portfolio (truongsoftware.com)

## Overview

Brownfield hardening: establish a green build and quality gate, close high-risk API security gaps (Stripe, certificates, error leakage), make payment-adjacent data paths honest, then verify content collections and the contact path—aligned with CONCERNS ordering (build first, then trust boundaries, then persistence, then reader-facing UX).

**Milestone v1.1 (Phases 6–8)** continues after v1.0: cut over canonical URLs and branding to **truongsoftware.com**, tidy dependencies and repository hygiene, and add **PlantUML-based feature documentation** under `docs/` (indexed from the root README). Phases 1–5 remain the v1.0 brownfield roadmap; new work is appended from Phase 6.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Build & quality baseline** — Green `bun run build`, CI deploy, lint and Astro check on touched files (completed 2026-04-12)
- [ ] **Phase 2: Trust boundaries (Stripe & certificates)** — Webhook signature verification and non-forgeable certificate issuance
- [ ] **Phase 3: Safe API error surfaces** — Generic client errors and server-only diagnostics for search and peers
- [ ] **Phase 4: Data layer & payment honesty** — Real persistence or explicit prod disable; resolve `src/lib/db` drift
- [ ] **Phase 5: Publishing & contact** — Content collections stable; Telegram contact delivery when configured
- [ ] **Phase 6: Domain cutover** — Canonical truongsoftware.com across config, SEO fallbacks, OG, and deployment docs; migration note for legacy domain references
- [ ] **Phase 7: Housekeeping** — Dependencies/scripts audit, `.gitignore` clarity, dead routes removed or documented
- [ ] **Phase 8: Feature documentation (PlantUML)** — `docs/` index, README link, one diagram + companion per major feature area

## Phase Details

### Phase 1: Build & quality baseline
**Goal**: Every change can be validated against a known-good build, deploy path, and static analysis baseline on the current Astro/React/Tailwind stack.
**Depends on**: Nothing (first phase)
**Requirements**: OPS-01, OPS-02
**Success Criteria** (what must be TRUE):
  1. `bun run build` completes successfully on the current stack.
  2. The CI deploy workflow succeeds for the repository’s intended pipeline.
  3. ESLint and `@astrojs/check` pass with no new errors on touched files in the project’s standard check workflow.
**Plans**: 2 plans

Plans:
- [x] `01-01-PLAN.md` — Add `check` / `verify` scripts and gate deploy workflow with lint + Astro check before build (OPS-01, OPS-02 pipeline)
- [x] `01-02-PLAN.md` — Fix all ESLint errors (16) for green `bun run lint` and full `verify` (OPS-02)

### Phase 2: Trust boundaries (Stripe & certificates)
**Goal**: Money- and identity-adjacent endpoints reject forgery: Stripe events are authentic, and certificates cannot be minted for arbitrary unverified claims.
**Depends on**: Phase 1
**Requirements**: SEC-01, SEC-02
**Success Criteria** (what must be TRUE):
  1. The Stripe webhook handler verifies signatures using `STRIPE_WEBHOOK_SECRET` before treating the body as a Stripe event.
  2. Certificate images cannot be obtained for arbitrary donor/skill data without a verified issuance path (or the route is disabled in a way that prevents public forgery).
**Plans**: TBD

### Phase 3: Safe API error surfaces
**Goal**: Clients never receive implementation-sensitive error details from sensitive APIs; operators can still diagnose issues from server-side logs.
**Depends on**: Phase 2
**Requirements**: SEC-03
**Success Criteria** (what must be TRUE):
  1. The search API returns generic error responses to clients; detailed errors are logged server-side only.
  2. Other sensitive API routes addressed in this phase follow the same pattern (generic outward, detailed inward).
**Plans**: TBD

### Phase 4: Data layer & payment honesty
**Goal**: Payment-adjacent and donation-related behavior matches reality in production; database helpers are either real or gone—no silent stubs or dead modules.
**Depends on**: Phase 3
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. Each payment-adjacent or donation flow either persists to a real store with auditable records or is clearly disabled or non-misleading in production (per routes listed in `.planning/codebase/CONCERNS.md`).
  2. `src/lib/db/index.ts` is wired to real bindings where the app relies on it, or is removed/replaced so the codebase does not imply persistence that does not exist.
**Plans**: TBD

### Phase 5: Publishing & contact
**Goal**: Visitors can read blog, journal, and course content reliably, and reach the owner via the contact form when Telegram is configured.
**Depends on**: Phase 4
**Requirements**: CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. Blog, journal, and course pages render from Content Collections without schema or build regressions.
  2. Submitting the contact form delivers messages via configured Telegram credentials when the required environment variables are present.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Domain cutover
**Goal**: The live site and repo-facing URLs consistently use **truongsoftware.com** as canonical for SEO and sharing, with no stray legacy domain in application source or deployment docs except intentionally documented historical mentions.
**Depends on**: Nothing (can run in parallel with v1.0 Phases 1–5 if you prioritize branding/DNS first)
**Requirements**: DOM-01, DOM-02
**Success Criteria** (what must be TRUE):
  1. `astro.config.mjs` `site`, `src/lib/config.ts`, layout/SEO fallbacks (`BaseLayout`, `Schema`), and OG-related branding reflect `https://truongsoftware.com` where they define canonical or sharing identity.
  2. Nginx `server_name`, `PREVIEW_SETUP.md` (and related preview hostname notes), and content examples that referenced the old domain are updated or explicitly migrated in docs.
  3. A short migration note exists where archived content or intentional historical mentions still reference the previous domain.
  4. No remaining hard-coded `truongdq.com` in application source or deployment documentation except those intentional historical mentions called out in that note.
**Plans**: TBD

### Phase 7: Housekeeping
**Goal**: The repository matches what ships: dependencies and scripts are deliberate, local-only data and secrets are ignored and documented, and obsolete routes or experiments are removed or explained.
**Depends on**: Phase 6
**Requirements**: HK-01, HK-02
**Success Criteria** (what must be TRUE):
  1. `bun run build` and `bun run lint` succeed after dependency and script review.
  2. Unused packages are removed or explicitly documented with rationale if kept.
  3. `.gitignore` (and related docs) clearly exclude non-committed paths such as `data/lancedb`, keys, and pem material.
  4. Obvious dead or `.disabled` routes are either removed or listed in `docs/` with rationale.
**Plans**: TBD

### Phase 8: Feature documentation (PlantUML)
**Goal**: Major feature areas are documented under `docs/` with PlantUML diagrams and short companions, and visitors/contributors can find them from the root README.
**Depends on**: Phase 7
**Requirements**: DOC-01, DOC-02
**Success Criteria** (what must be TRUE):
  1. `docs/README.md` is the entry point and links every feature doc in the catalog.
  2. Root `README.md` includes a **Feature architecture** section pointing to `docs/`.
  3. For each catalogued feature area (content collections; page shell & navigation / command palette; public API routes; semantic search; contact/Telegram; payments & certificates), a `.puml` file exists under `docs/features/` with at least one diagram (component, sequence, or deployment) and a short markdown companion describing behavior and boundaries.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order (v1.0):** 1 → 2 → 3 → 4 → 5  
**Execution Order (v1.1):** 6 → 7 → 8 (Phase 6 is independent of v1.0 phases; Phases 7–8 follow 6)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Build & quality baseline | 2/2 | Complete   | 2026-04-12 |
| 2. Trust boundaries (Stripe & certificates) | 0/TBD | Not started | - |
| 3. Safe API error surfaces | 0/TBD | Not started | - |
| 4. Data layer & payment honesty | 0/TBD | Not started | - |
| 5. Publishing & contact | 0/TBD | Not started | - |
| 6. Domain cutover | 0/TBD | Not started | - |
| 7. Housekeeping | 0/TBD | Not started | - |
| 8. Feature documentation (PlantUML) | 0/TBD | Not started | - |

---
*Roadmap created: 2026-04-12 — brownfield v1 requirements*  
*v1.1 milestone (domain, housekeeping, PlantUML docs): 2026-04-12 — Phases 6–8 appended*
