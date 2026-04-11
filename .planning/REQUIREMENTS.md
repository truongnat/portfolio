# Requirements: Portfolio (truongdq.com)

**Defined:** 2026-04-12  
**Core Value:** Visitors can reliably read your writing, understand your background, and reach you—while the site stays fast, maintainable, and honest to how you build software.

## v1 Requirements

### Operations & quality

- [ ] **OPS-01**: `bun run build` and CI deploy workflow succeed on the current Astro/React/Tailwind stack
- [ ] **OPS-02**: Lint and Astro check pass without new errors on touched files (`eslint`, `@astrojs/check`)

### Security & correctness (high priority)

- [ ] **SEC-01**: Stripe webhook verifies signatures using `STRIPE_WEBHOOK_SECRET` before processing events (`src/pages/api/stripe/webhook.ts`)
- [ ] **SEC-02**: Certificate issuance does not allow unauthenticated forgery of arbitrary donor/skill data (`src/pages/api/certificate.ts` + `src/lib/certificate-generator.ts`)
- [ ] **SEC-03**: Search and other sensitive API routes return generic errors to clients; details logged server-side only (`src/pages/api/search.ts` and peers)

### Data & API integrity

- [ ] **DATA-01**: Payment-adjacent and donation flows either persist to a real store with auditable records or are clearly disabled in production (routes listed in `.planning/codebase/CONCERNS.md`)
- [ ] **DATA-02**: `src/lib/db/index.ts` is either wired to real bindings or removed to avoid dead-code drift

### Content & UX

- [ ] **CONT-01**: Blog, journal, and course pages render from Content Collections without schema or build regressions
- [ ] **CONT-02**: Contact form delivers messages via configured Telegram credentials when env is present

## v2 Requirements

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

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| OPS-01 | Phase 1 | Pending |
| OPS-02 | Phase 1 | Pending |
| SEC-01 | Phase 2 | Pending |
| SEC-02 | Phase 2 | Pending |
| SEC-03 | Phase 3 | Pending |
| DATA-01 | Phase 4 | Pending |
| DATA-02 | Phase 4 | Pending |
| CONT-01 | Phase 5 | Pending |
| CONT-02 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-12*  
*Last updated: 2026-04-12 — roadmap created (brownfield v1)*
