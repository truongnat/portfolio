# Phase 4: Data layer & payment honesty — Context

**Gathered:** 2026-04-12  
**Status:** Ready for planning  
**Source:** ROADMAP Phase 4, REQUIREMENTS DATA-01/DATA-02, `.planning/codebase/CONCERNS.md`

## Phase boundary

**DATA-01:** Payment-adjacent and donation-related API routes listed in CONCERNS must not return **misleading success** in **production** when no real persistence or payment processor backs the action. Prefer an explicit **503** (or **501**) with a **stable, honest JSON body** over fake IDs and “success: true”.

**DATA-02:** `src/lib/db/index.ts` is **unused** in application code (no imports). Remove the dead D1-style module from `src/` **or** replace with documentation-only artifacts so the repo does not imply a live Cloudflare D1 binding.

Out of scope for this phase: choosing and wiring a production database product end-to-end; authenticated admin dashboard; rate limits; fixing Stripe metadata encoding (optional follow-up if time permits in execution).

## Locked decisions

- **Production** is detected via **`import.meta.env.PROD`** (Vite/Astro).
- **Stub routes** that today synthesize records without storage: reject in production with **generic** client messages; **log** server-side with route name (no stack traces to client — aligns with Phase 3).
- **Stripe `create-payment`:** In production, if **`STRIPE_SECRET_KEY`** is missing, return **503** (not mock `success: true`). Development may keep mock for local UX.
- **`src/lib/db`:** Delete **`index.ts`**; retain **`schema.sql`** as reference; add **`README.md`** stating the schema is not bound in this deployment.

## Canonical references

- `.planning/codebase/CONCERNS.md` — stub route inventory
- `src/lib/api-error-response.ts` — JSON + logging helpers from Phase 3
- `src/pages/api/**/*.ts` — routes to gate

## Deferred

- Real D1/Postgres wiring and migrations
- SkillTreeAdmin real data (separate milestone)

---
*Phase: 04-data-layer-payment-honesty*
