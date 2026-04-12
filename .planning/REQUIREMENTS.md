# Requirements: Portfolio (truongsoftware.com)

**Defined:** 2026-04-12  
**Core Value:** Visitors can reliably read your writing, understand your background, and reach you—while the site stays fast, maintainable, and honest to how you build software.

## Milestone v1.1 (current)

### Domain & URLs

- [ ] **DOM-01**: Production canonical URL is `https://truongsoftware.com` everywhere it matters for SEO and sharing — `astro.config.mjs` `site`, `src/lib/config.ts`, `BaseLayout.astro` / `Schema.astro` / blog slug fallbacks, OG image branding text, and nginx `server_name` (plus preview hostname notes in `PREVIEW_SETUP.md`).
- [ ] **DOM-02**: No remaining hard-coded `truongdq.com` in application source or deployment docs except intentional historical mentions in archived content (if any), called out in a short migration note.

### Housekeeping

- [ ] **HK-01**: Dependencies and scripts reviewed: unused packages removed or explicitly documented; `bun run build` and `bun run lint` still pass.
- [ ] **HK-02**: Repository hygiene: `.gitignore` (and docs) clarify non-committed paths (`data/lancedb`, keys, pem); obvious dead or `.disabled` routes are either removed or listed in `docs/` with rationale.

### Documentation (PlantUML)

- [ ] **DOC-01**: `docs/README.md` is the entry point and links every feature doc; root `README.md` has a **Feature architecture** section pointing to `docs/`.
- [ ] **DOC-02**: For each catalogued feature area below, a `.puml` file exists under `docs/features/` with at least one diagram (component, sequence, or deployment) and a short markdown companion describing the feature:
  - Content (blog & journal collections)
  - Page shell & navigation / command palette
  - Public API routes (grouped)
  - Semantic search (LanceDB + embeddings)
  - Contact / Telegram pipeline
  - Payments & certificates (Stripe, crypto stubs as documented)

---

## Milestone v1.0 (prior — roadmap phases 1–5)

### Operations & quality

- [ ] **OPS-01**: `bun run build` and CI deploy workflow succeed on the current Astro/React/Tailwind stack
- [ ] **OPS-02**: Lint and Astro check pass without new errors on touched files (`eslint`, `@astrojs/check`)

### Security & correctness (high priority)

- [x] **SEC-01**: Stripe webhook verifies signatures using `STRIPE_WEBHOOK_SECRET` before processing events (`src/pages/api/stripe/webhook.ts`)
- [x] **SEC-02**: Certificate issuance does not allow unauthenticated forgery of arbitrary donor/skill data (`src/pages/api/certificate.ts` + `src/lib/certificate-generator.ts`)
- [x] **SEC-03**: Search and other sensitive API routes return generic errors to clients; details logged server-side only (`src/pages/api/search.ts` and peers)

### Data & API integrity

- [x] **DATA-01**: Payment-adjacent and donation flows either persist to a real store with auditable records or are clearly disabled in production (routes listed in `.planning/codebase/CONCERNS.md`)
- [x] **DATA-02**: `src/lib/db/index.ts` is either wired to real bindings or removed to avoid dead-code drift

### Content & UX

- [x] **CONT-01**: Blog, journal, and course pages render from Content Collections without schema or build regressions
- [x] **CONT-02**: Contact form delivers messages via configured Telegram credentials when env is present

## v2 (backlog)

### Hardening

- **RATE-01**: Rate limiting or equivalent abuse protection on public POST/search endpoints
- **STUB-01**: Replace or remove stub APIs (terminal execute, AI thank-you placeholder, mock admin skill tree) with real behavior or explicit feature flags

### Experience

- **PERF-01**: Mitigate search cold-start / memory issues (pre-warm, smaller embedding path, or dedicated worker)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Framework migration off Astro | Not requested; large churn with no current driver |
| Full automated test suite | Explicitly deferred; add when maintenance cost justifies it |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| OPS-01 | Phase 1 | Complete |
| OPS-02 | Phase 1 | Complete |
| SEC-01 | Phase 2 | Pending |
| SEC-02 | Phase 2 | Pending |
| SEC-03 | Phase 3 | Pending |
| DATA-01 | Phase 4 | Pending |
| DATA-02 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Complete |
| CONT-02 | Phase 5 | Complete |
| DOM-01 | Phase 6 | Pending |
| DOM-02 | Phase 6 | Pending |
| HK-01 | Phase 7 | Pending |
| HK-02 | Phase 7 | Pending |
| DOC-01 | Phase 8 | Pending |
| DOC-02 | Phase 8 | Pending |

**Coverage — v1.0:** 9/9 mapped to Phases 1–5 ✓  
**Coverage — v1.1:** 6/6 mapped to Phases 6–8 ✓

---
*Requirements defined: 2026-04-12*  
*Last updated: 2026-04-12 — milestone v1.1 scope added*
