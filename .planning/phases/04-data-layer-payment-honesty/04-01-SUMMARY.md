---
phase: 04-data-layer-payment-honesty
plan: 01
subsystem: api
tags: [data-01, stubs, stripe, production]

requires:
  - phase: 03-safe-api-error-surfaces
    provides: logApiError / jsonErrorResponse for consistent 503 bodies
provides:
  - src/lib/production-stub-guard.ts (stubUnavailableInProduction)
  - Honest 503 on demo POST routes in production; Stripe mock gated in prod
affects: [04-02-plan]

tech-stack:
  added: []
  patterns: [Early-exit stub guard; import.meta.env.PROD checks]

key-files:
  created:
    - src/lib/production-stub-guard.ts
  modified:
    - src/pages/api/donations.ts
    - src/pages/api/roadmap/vote.ts
    - src/pages/api/learning-journey/sponsor.ts
    - src/pages/api/bug-bounty/submit.ts
    - src/pages/api/auction/create-bid.ts
    - src/pages/api/crypto/create-payment.ts
    - src/pages/api/terminal/execute.ts
    - src/pages/api/ai-thank-you/generate.ts
    - src/pages/api/stripe/create-payment.ts

key-decisions:
  - "Stable client error string: \"This feature is not enabled in production.\" across stub routes."

patterns-established:
  - "Non-persistent demo POSTs: first lines in try call stubUnavailableInProduction; prod returns 503 + log."

requirements-completed: [DATA-01]

duration: —
completed: 2026-04-12
---

# Phase 4 Plan 01 Summary

**`production-stub-guard` + honest 503s for demo persistence routes; Stripe create-payment mock only when keys present or non-production**

## Accomplishments

- Added `stubUnavailableInProduction(routeLabel)` using `logApiError` and `jsonErrorResponse(503, …)`.
- Wired the guard into all listed stub POST handlers; hardened `stripe/create-payment` so production does not return mock PaymentIntent success without `STRIPE_SECRET_KEY`.

## Files Created/Modified

- `src/lib/production-stub-guard.ts` — guard helper
- Nine API route files — early guard + Stripe prod branch

## Deviations from Plan

None.

## User Setup Required

None.

---
*Phase: 04-data-layer-payment-honesty*
