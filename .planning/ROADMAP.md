# Roadmap: Portfolio (truongdq.com)

## Overview

Brownfield hardening: establish a green build and quality gate, close high-risk API security gaps (Stripe, certificates, error leakage), make payment-adjacent data paths honest, then verify content collections and the contact path—aligned with CONCERNS ordering (build first, then trust boundaries, then persistence, then reader-facing UX).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Build & quality baseline** — Green `bun run build`, CI deploy, lint and Astro check on touched files
- [ ] **Phase 2: Trust boundaries (Stripe & certificates)** — Webhook signature verification and non-forgeable certificate issuance
- [ ] **Phase 3: Safe API error surfaces** — Generic client errors and server-only diagnostics for search and peers
- [ ] **Phase 4: Data layer & payment honesty** — Real persistence or explicit prod disable; resolve `src/lib/db` drift
- [ ] **Phase 5: Publishing & contact** — Content collections stable; Telegram contact delivery when configured

## Phase Details

### Phase 1: Build & quality baseline
**Goal**: Every change can be validated against a known-good build, deploy path, and static analysis baseline on the current Astro/React/Tailwind stack.
**Depends on**: Nothing (first phase)
**Requirements**: OPS-01, OPS-02
**Success Criteria** (what must be TRUE):
  1. `bun run build` completes successfully on the current stack.
  2. The CI deploy workflow succeeds for the repository’s intended pipeline.
  3. ESLint and `@astrojs/check` pass with no new errors on touched files in the project’s standard check workflow.
**Plans**: TBD

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

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Build & quality baseline | 0/TBD | Not started | - |
| 2. Trust boundaries (Stripe & certificates) | 0/TBD | Not started | - |
| 3. Safe API error surfaces | 0/TBD | Not started | - |
| 4. Data layer & payment honesty | 0/TBD | Not started | - |
| 5. Publishing & contact | 0/TBD | Not started | - |

---
*Roadmap created: 2026-04-12 — brownfield v1 requirements*
