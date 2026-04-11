# Phase 2: Trust boundaries — Research

**Researched:** 2026-04-12  
**Requirements:** SEC-01 (Stripe webhook signatures), SEC-02 (non-forgeable certificates)

## Summary

- **`src/pages/api/stripe/webhook.ts`** parses JSON without `stripe.webhooks.constructEvent`; must use **raw body** + **`stripe-signature`** header + **`STRIPE_WEBHOOK_SECRET`**. The official `stripe` Node SDK provides `constructEvent`.
- **`package.json`** does not list the `stripe` package yet — add it for signature verification.
- **`src/pages/api/certificate.ts`** renders a PNG for **any** query params passing Zod — no link to a real payment. Mitigations: (1) **HMAC-signed query** (`sig` or `t` token) using a server secret; (2) **disable** public issuance unless `CERTIFICATE_PUBLIC_ISSUANCE=true`; (3) verify **PaymentIntent** id with Stripe API before generating. Phase plan should pick one minimal path that matches “verified issuance.”

## Current state

| File | Issue |
|------|--------|
| `webhook.ts` | `JSON.parse(body)` — forgeable |
| `certificate.ts` | No auth; long cache headers amplify abuse |

## Recommendations

1. Install `stripe` (^18+ compatible with Node 22). Use `constructEvent(body, signature, webhookSecret)`; reject 400 on `StripeSignatureVerificationError`.
2. Certificates: add **HMAC-SHA256** over canonical query string (or JSON payload) with `CERTIFICATE_SIGNING_SECRET` (or reuse a dedicated secret). Handler validates signature before `generateCertificatePng`. Document that payment flow must redirect with signed URL (generated server-side after verified webhook or payment success page).
3. Env: `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY` (for optional PI retrieval), `CERTIFICATE_SIGNING_SECRET`.

## Risks

- Raw body must be passed to Stripe **exactly** as received (no `JSON.parse` first).
- Astro `APIRoute`: use `request.text()` for webhook (already done).

## Validation Architecture

### SEC-01

| Check | Pass |
|-------|------|
| Webhook rejects missing `stripe-signature` | 400 |
| Webhook rejects invalid signature | 400 |
| Valid test signature (Stripe CLI `stripe trigger`) | 200 + `received` |

### SEC-02

| Check | Pass |
|-------|------|
| `/api/certificate` without valid `sig` (or chosen param) | 401/403 or 404 |
| Request with valid HMAC | 200 PNG |

### Commands

- `bun run lint && bun run check` after edits
- Manual: `stripe listen --forward-to localhost:4321/api/stripe/webhook` (when dev server exposes route)

## RESEARCH COMPLETE
