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
- [x] **Phase 2: Trust boundaries (Stripe & certificates)** — Webhook signature verification and non-forgeable certificate issuance (completed 2026-04-12)
- [x] **Phase 3: Safe API error surfaces** — Generic client errors and server-only diagnostics for search and peers (completed 2026-04-12)
- [x] **Phase 4: Data layer & payment honesty** — Real persistence or explicit prod disable; resolve `src/lib/db` drift (completed 2026-04-12)
- [x] **Phase 5: Publishing & contact** — Content collections stable; Telegram contact delivery when configured (completed 2026-04-12)
- [x] **Phase 6: Domain cutover** — Canonical truongsoftware.com across config, SEO fallbacks, OG, and deployment docs; migration note for legacy domain references (completed 2026-04-12)
- [x] **Phase 7: Housekeeping** — Dependencies/scripts audit, `.gitignore` clarity, dead routes removed or documented (completed 2026-04-12)
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
**Plans**: 2 plans

Plans:
- [x] `02-01-PLAN.md` — Add `stripe` SDK; verify Stripe webhooks with `constructEvent`, raw body, and `STRIPE_WEBHOOK_SECRET` (SEC-01)
- [x] `02-02-PLAN.md` — HMAC `sig` gate on `/api/certificate` with `CERTIFICATE_SIGNING_SECRET`; 401 on invalid/missing signature (SEC-02)

### Phase 3: Safe API error surfaces
**Goal**: Clients never receive implementation-sensitive error details from sensitive APIs; operators can still diagnose issues from server-side logs.
**Depends on**: Phase 2
**Requirements**: SEC-03
**Success Criteria** (what must be TRUE):
  1. The search API returns generic error responses to clients; detailed errors are logged server-side only.
  2. Other sensitive API routes addressed in this phase follow the same pattern (generic outward, detailed inward).
**Plans**: 2 plans

Plans:
- [x] `03-01-PLAN.md` — Shared API error helpers + generic `GET /api/search` failures (SEC-03)
- [x] `03-02-PLAN.md` — Generic errors for `POST /api/certificate-issue` and peer leak scan (SEC-03)

### Phase 4: Data layer & payment honesty
**Goal**: Payment-adjacent and donation-related behavior matches reality in production; database helpers are either real or gone—no silent stubs or dead modules.
**Depends on**: Phase 3
**Requirements**: DATA-01, DATA-02
**Success Criteria** (what must be TRUE):
  1. Each payment-adjacent or donation flow either persists to a real store with auditable records or is clearly disabled or non-misleading in production (per routes listed in `.planning/codebase/CONCERNS.md`).
  2. `src/lib/db/index.ts` is wired to real bindings where the app relies on it, or is removed/replaced so the codebase does not imply persistence that does not exist.
**Plans**: 2 plans

Plans:
- [x] `04-01-PLAN.md` — `production-stub-guard` + honest 503s for demo POSTs; Stripe mock disabled in prod (DATA-01)
- [x] `04-02-PLAN.md` — Remove unused `src/lib/db/index.ts`; README + `schema.sql` reference; doc alignment (DATA-02)

### Phase 5: Publishing & contact
**Goal**: Visitors can read blog, journal, and course content reliably, and reach the owner via the contact form when Telegram is configured.
**Depends on**: Phase 4
**Requirements**: CONT-01, CONT-02
**Success Criteria** (what must be TRUE):
  1. Blog, journal, and course pages render from Content Collections without schema or build regressions.
  2. Submitting the contact form delivers messages via configured Telegram credentials when the required environment variables are present.
**Plans**: 2 plans

Plans:
- [x] `05-01-PLAN.md` — Shared content Zod schemas + `scripts/validate-content.ts` wired into `verify` (CONT-01)
- [x] `05-02-PLAN.md` — Contact form → `POST /api/contact`; remove client Telegram / `PUBLIC_*` path (CONT-02)
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
**Plans**: 2 plans

Plans:
- [x] `06-01-PLAN.md` — Astro `site`, `seo.url`, shared canonical constant, BaseLayout/Schema/blog/OG (DOM-01 app source)
- [x] `06-02-PLAN.md` — `nginx.conf`, `PREVIEW_SETUP.md`, `docs/DOMAIN_MIGRATION.md`, planning doc URLs, journal exception (DOM-02 + DOM-01 deploy/docs)

### Phase 7: Housekeeping
**Goal**: The repository matches what ships: dependencies and scripts are deliberate, local-only data and secrets are ignored and documented, and obsolete routes or experiments are removed or explained.
**Depends on**: Phase 6
**Requirements**: HK-01, HK-02
**Success Criteria** (what must be TRUE):
  1. `bun run build` and `bun run lint` succeed after dependency and script review.
  2. Unused packages are removed or explicitly documented with rationale if kept.
  3. `.gitignore` (and related docs) clearly exclude non-committed paths such as `data/lancedb`, keys, and pem material.
  4. Obvious dead or `.disabled` routes are either removed or listed in `docs/` with rationale.
**Plans**: 2 plans

Plans:
- [x] `07-01-PLAN.md` — Depcheck/knip + remove or document unused deps; scripts review; `docs/REPO_HYGIENE.md` Dependencies section (HK-01)
- [x] `07-02-PLAN.md` — `.gitignore` hardening; disabled-routes table + README link (HK-02)

### Phase 8: Feature documentation (PlantUML)
**Goal**: Major feature areas are documented under `docs/` with PlantUML diagrams and short companions, and visitors/contributors can find them from the root README.
**Depends on**: Phase 7
**Requirements**: DOC-01, DOC-02
**Success Criteria** (what must be TRUE):
  1. `docs/README.md` is the entry point and links every feature doc in the catalog.
  2. Root `README.md` includes a **Feature architecture** section pointing to `docs/`.
  3. For each catalogued feature area (content collections; page shell & navigation / command palette; public API routes; semantic search; contact/Telegram; payments & certificates), a `.puml` file exists under `docs/features/` with at least one diagram (component, sequence, or deployment) and a short markdown companion describing behavior and boundaries.
**Plans**: 2 plans

Plans:
- [ ] `08-01-PLAN.md` — Six `docs/features/` PlantUML + markdown pairs (DOC-02)
- [ ] `08-02-PLAN.md` — `docs/README.md` catalog + root README **Feature architecture** (DOC-01)

**UI hint**: yes

## Progress

**Execution Order (v1.0):** 1 → 2 → 3 → 4 → 5  
**Execution Order (v1.1):** 6 → 7 → 8 (Phase 6 is independent of v1.0 phases; Phases 7–8 follow 6)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Build & quality baseline | 2/2 | Complete   | 2026-04-12 |
| 2. Trust boundaries (Stripe & certificates) | 2/2 | Complete | 2026-04-12 |
| 3. Safe API error surfaces | 2/2 | Complete | 2026-04-12 |
| 4. Data layer & payment honesty | 2/2 | Complete | 2026-04-12 |
| 5. Publishing & contact | 2/2 | Complete | 2026-04-12 |
| 6. Domain cutover | 2/2 | Complete | 2026-04-12 |
| 7. Housekeeping | 2/2 | Complete | 2026-04-12 |
| 8. Feature documentation (PlantUML) | 0/2 | Planned | - |

---
*Roadmap created: 2026-04-12 — brownfield v1 requirements*  
*v1.1 milestone (domain, housekeeping, PlantUML docs): 2026-04-12 — Phases 6–8 appended*
