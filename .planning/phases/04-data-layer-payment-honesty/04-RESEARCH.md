# Phase 4: Data layer & payment honesty — Research

**Researched:** 2026-04-12  
**Requirements:** DATA-01, DATA-02

## Summary

- **No TypeScript imports** of `@/lib/db` or `src/lib/db/index.ts` in app code (grep). **DATA-02** can safely remove `index.ts` after adding a README + keeping `schema.sql`.
- **Stub POST routes** (CONCERNS): `donations.ts`, `roadmap/vote.ts`, `learning-journey/sponsor.ts`, `bug-bounty/submit.ts`, `auction/create-bid.ts`, `crypto/create-payment.ts`, `terminal/execute.ts`, `ai-thank-you/generate.ts` — all return **200 + synthetic success** paths without persistence.
- **`stripe/create-payment.ts`**: When `STRIPE_SECRET_KEY` is absent, returns **200** mock PaymentIntent — **misleading if that ever ships to production** without keys. Should be **503 in PROD**, mock allowed in dev.
- **Webhook** was hardened in Phase 2; persistence TODOs remain — honesty for webhooks is “no fake DB writes”; not blocking DATA-01 if stubs elsewhere are gated.

## Route matrix

| Route | Current prod risk | Planned behavior |
|-------|-------------------|------------------|
| POST `/api/donations` | Fake donation object | 503 in PROD |
| POST `/api/roadmap/vote` | Fake vote | 503 in PROD |
| POST `/api/learning-journey/sponsor` | Fake sponsorship | 503 in PROD |
| POST `/api/bug-bounty/submit` | Fake submission | 503 in PROD |
| POST `/api/auction/create-bid` | Fake bid | 503 in PROD |
| POST `/api/crypto/create-payment` | Mock payment | 503 in PROD |
| POST `/api/terminal/execute` | Mock shell | 503 in PROD |
| POST `/api/ai-thank-you/generate` | Placeholder AI | 503 in PROD |
| POST `/api/stripe/create-payment` | Mock when no Stripe key | 503 in PROD if no key; real flow when key present |

## Risks

- **Breaking** demos that pointed at production deploy for “happy path” tests — intentional; production must not lie about persistence.
- **E2E** tests if any assume 200 from stubs — search for tests.

## Validation

- `bun run verify`
- Manual: `NODE_ENV=production` build + hit stub route → 503 (or use preview with `PROD` true)
