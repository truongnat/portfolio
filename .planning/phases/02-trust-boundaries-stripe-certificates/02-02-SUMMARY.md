---
phase: 02-trust-boundaries-stripe-certificates
plan: 02
subsystem: api
tags: [hmac, sha256, certificate, timingSafeEqual]

requires:
  - phase: 01-build-quality-baseline
    provides: Green verify pipeline
provides:
  - HMAC-SHA256 `sig` query gate on GET /api/certificate
  - Shared canonical message helper in src/lib/certificate-signature.ts
  - Dev-only POST /api/certificate-issue to mint signed relative URLs (prod 404)
affects: [skill-tree-admin, deployment-secrets]

tech-stack:
  added: []
  patterns: [Canonical newline-separated fields; timing-safe hex compare]

key-files:
  created:
    - src/lib/certificate-signature.ts
    - src/pages/api/certificate-issue.ts
  modified:
    - src/pages/api/certificate.ts
    - src/env.d.ts
    - src/components/SkillTreeAdmin.client.tsx

key-decisions:
  - "Placed POST signing helper at /api/certificate-issue (not under /api/certificate/*) to avoid Astro route file-vs-directory conflict with certificate.ts."
  - "Dev-only issuance endpoint keeps local admin working; production requires a separate trusted issuance path."

patterns-established:
  - "Certificate PNGs only after HMAC over fixed field order; 503 without CERTIFICATE_SIGNING_SECRET."

requirements-completed: [SEC-02]

duration: 15min
completed: 2026-04-12
---

# Phase 2 Plan 02 Summary

**GET /api/certificate requires hex HMAC `sig` over canonical fields; unsigned or tampered requests get 401**

## Performance

- **Duration:** ~15 min
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments

- Added `CERTIFICATE_SIGNING_SECRET` gate with `timingSafeEqual` on digest buffers.
- Centralized canonical string + `computeCertificateSignatureHex` in `src/lib/certificate-signature.ts`.
- Updated `SkillTreeAdmin` to request a signed URL via dev-only `POST /api/certificate-issue`; production build disables that route and skips client open with a console warning.

## Task Commits

1. **Task 1 (HMAC + issuance helper)** — same commit as Phase 2 feat(security) bundle

## Files Created/Modified

- `src/lib/certificate-signature.ts` — Canonical message + HMAC hex
- `src/pages/api/certificate.ts` — Verify `sig` before PNG generation
- `src/pages/api/certificate-issue.ts` — Dev-only signing helper
- `src/env.d.ts` — `CERTIFICATE_SIGNING_SECRET`
- `src/components/SkillTreeAdmin.client.tsx` — Dev flow for signed URLs

## Decisions Made

- Avoided nesting `api/certificate/sign` under `api/certificate/` because Astro treats `certificate.ts` and `certificate/` as conflicting routes during static prerender.

## Deviations from Plan

- Added `certificate-issue` route and `certificate-signature` module (plan allowed optional helper in-route; split kept verification and issuance readable and fixed build routing).

## Issues Encountered

- Initial `api/certificate/sign.ts` caused `EISDIR` during prerender; resolved by moving to `api/certificate-issue.ts`.

## User Setup Required

Set `CERTIFICATE_SIGNING_SECRET` (e.g. `openssl rand -hex 32`) in deployment secrets. For production certificate links, mint `sig` server-side (webhook, authenticated admin API, or tooling) using the same canonical format as `buildCertificateCanonicalMessage`.

## Next Phase Readiness

SEC-02 satisfied; ready for Phase 3 (safe API error surfaces).

---
*Phase: 02-trust-boundaries-stripe-certificates*
*Completed: 2026-04-12*
