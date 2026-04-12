# Phase 5: Publishing & contact — Context

**Gathered:** 2026-04-12  
**Status:** Planned  
**Source:** Roadmap Phase 5, REQUIREMENTS CONT-01 / CONT-02, codebase review

## Phase boundary

**CONT-01** — Keep **blog**, **journal**, and **courses** Content Collections on a **single, explicit contract**: Zod schemas stay aligned with every Markdown/MDX entry, and CI can catch drift without relying only on full `astro build`.

**CONT-02** — Contact submissions must **deliver via Telegram using server-side secrets** when `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set. Today the **homepage contact form** (`ContactForm.client.tsx`) calls **`sendContactMessage`** in **`src/lib/telegram.ts`**, which reads **`PUBLIC_TELEGRAM_*`** in the browser — **duplicating** logic already implemented in **`src/pages/api/contact.ts`** (`TELEGRAM_*` server env). Phase 5 must **route the form through `POST /api/contact`** and **remove client-side Telegram calls** so secrets are not exposed or required in the client bundle.

Out of scope: rate limiting on the server (backlog RATE-01), CAPTCHA, new CMS, Phase 6 domain URL rewrites.

## Implementation decisions (locked)

- **Contact:** Single path — `fetch('/api/contact', …)` with JSON body; **delete or narrow** `src/lib/telegram.ts` so it does not call Telegram from client code.
- **Content:** Schemas for the three collections must remain **one source of truth** (shared module imported by `content.config.ts` and any validation script).
- **Errors:** Contact API **500** responses stay **generic** to clients (already true); optional alignment with `logApiError` from `src/lib/api-error-response.ts` for consistency with Phase 3.

## Canonical references

- `.planning/ROADMAP.md` — Phase 5 goal and success criteria
- `.planning/REQUIREMENTS.md` — CONT-01, CONT-02
- `src/content.config.ts` — collection definitions
- `src/pages/api/contact.ts` — server Telegram delivery
- `src/components/ContactForm.client.tsx` — form UI (to be wired to API)

## Deferred

- Telegram `parse_mode: Markdown` and user-supplied `_`/`*` characters — optional escape or switch to plain text in a follow-up if messages break.
- Automated E2E browser test for contact — not required for this phase if manual UAT passes.

---
*Phase: 05-publishing-contact*
