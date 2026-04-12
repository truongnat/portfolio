# Phase 5: Publishing & contact — Research

**Researched:** 2026-04-12  
**Requirements:** CONT-01, CONT-02

## Summary

- **Content collections** are defined in `src/content.config.ts` with **three** loaders (`blog`, `journal`, `courses`) and **inline Zod** schemas. **`bun run build`** / **`astro check`** already surface many schema violations, but a **dedicated validation step** that fails fast and lists files improves **CONT-01** clarity for contributors.
- **Contact delivery:** `src/pages/api/contact.ts` correctly uses **`process.env.TELEGRAM_BOT_TOKEN`** and **`process.env.TELEGRAM_CHAT_ID`**. The **UI does not use this route** — it imports **`@/lib/telegram`** which uses **`import.meta.env.PUBLIC_TELEGRAM_BOT_TOKEN`** / **`PUBLIC_TELEGRAM_CHAT_ID`** (client-visible). **CONT-02** is not met for production-style deployments until the form posts to the API.
- **No other imports** of `telegram.ts` besides `ContactForm.client.tsx` (grep).

## Risks

- **Breaking** local dev flows that relied on `PUBLIC_TELEGRAM_*` in `.env` — after the change, developers must set **`TELEGRAM_*`** for the **server** (e.g. Vite/Astro dev server loads these for API routes).
- **Content script** must stay in sync with `content.config` — mitigated by **shared Zod** exports.

## Validation

- `bun run verify` after changes
- Manual: submit contact form with server env set → Telegram receives message; without env → stable error UX (no secret leakage)

---
*Phase: 05-publishing-contact*
