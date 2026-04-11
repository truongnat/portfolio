---
phase: 02-trust-boundaries-stripe-certificates
plan: 01
subsystem: payments
tags: [stripe, webhooks, constructEvent]

requires:
  - phase: 01-build-quality-baseline
    provides: Green verify pipeline for lint/check/build
provides:
  - Official stripe SDK dependency with webhook signature verification
  - POST /api/stripe/webhook using raw body + Stripe-Signature + constructEvent
affects: [phase-03-safe-api-errors]

tech-stack:
  added: [stripe@^22]
  patterns: [Pinned Stripe API version via Stripe.API_VERSION]

key-files:
  created: []
  modified:
    - package.json
    - bun.lock
    - src/pages/api/stripe/webhook.ts
    - src/env.d.ts

key-decisions:
  - "Use Stripe.API_VERSION so apiVersion stays aligned with the installed SDK."
  - "Return 400 when STRIPE_WEBHOOK_SECRET is missing; 503 when STRIPE_SECRET_KEY is missing but webhook secret is set (misconfiguration)."

patterns-established:
  - "Webhook handlers must use constructEvent on the raw body; never JSON.parse the body for trust."

requirements-completed: [SEC-01]

duration: 15min
completed: 2026-04-12
---

# Phase 2 Plan 01 Summary

**Stripe webhooks verified with `constructEvent`, raw body, and typed `STRIPE_*` env vars — no trusted JSON.parse path**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Added `stripe` dependency and replaced insecure `JSON.parse(body)` with `stripe.webhooks.constructEvent`.
- Mapped missing secrets to 400/503 and `StripeSignatureVerificationError` to 400 without leaking details.

## Task Commits

1. **Tasks 1–2 (stripe + webhook)** — same commit as Phase 2 feat(security) bundle

## Files Created/Modified

- `package.json` / `bun.lock` — `stripe` dependency
- `src/pages/api/stripe/webhook.ts` — Verified webhook handler
- `src/env.d.ts` — `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`

## Decisions Made

- Followed plan: `constructEvent` + `Stripe.errors.StripeSignatureVerificationError` branch for verification failures.

## Deviations from Plan

None — plan executed as written.

## Issues Encountered

None.

## User Setup Required

Configure **Stripe Dashboard → Developers → Webhooks** with endpoint URL and copy **Signing secret** into `STRIPE_WEBHOOK_SECRET`. Use **Secret key** for `STRIPE_SECRET_KEY`.

## Next Phase Readiness

SEC-01 satisfied; SEC-02 completed in companion plan `02-02-SUMMARY.md`.

---
*Phase: 02-trust-boundaries-stripe-certificates*
*Completed: 2026-04-12*
