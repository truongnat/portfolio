# External Integrations

**Analysis Date:** 2026-04-12

## APIs & External Services

**Messaging (contact form):**
- Telegram Bot API — `https://api.telegram.org/bot<token>/sendMessage`
  - Client: native `fetch` with retries via `fetchWithRetry` in `src/lib/api-utils.ts`
  - Used from: `src/pages/api/contact.ts` (`process.env.TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`); `src/lib/telegram.ts` uses `import.meta.env.PUBLIC_TELEGRAM_*` (same integration, two env patterns)
  - Auth: bot token + chat ID (never commit; configure in environment)

**Payments:**
- Stripe REST API — `https://api.stripe.com/v1/payment_intents` via `fetch` with `Bearer` secret
  - Implementation: `src/pages/api/stripe/create-payment.ts` (`import.meta.env.STRIPE_SECRET_KEY`); mock mode when key absent
  - Webhook endpoint: `src/pages/api/stripe/webhook.ts` — expects `stripe-signature` header; verification code commented; parses JSON directly (documented as dev-oriented)

**Fonts (certificate generation):**
- Google Fonts CDN — `fonts.gstatic.com` for Inter WOFF used by `src/lib/certificate-generator.ts`

**Semantic search (local ML, no third-party inference API):**
- Hugging Face model weights — loaded by `@xenova/transformers` pipeline `Xenova/all-MiniLM-L6-v2` at runtime (first load may fetch/cache model assets per library behavior)

**CI automation (optional secret):**
- `.github/workflows/weekly-summary.yml` sets `GOOGLE_GENERATIVE_AI_API_KEY` for `bun run scripts/generate-weekly.ts`, but `scripts/generate-weekly.ts` only forwards to `scripts/generate-journal-summaries.ts`, which contains no Google API calls — integration is currently a no-op for Gemini; align workflow env with a real caller before relying on it

**Placeholder / mock APIs:**
- `src/pages/api/ai-thank-you/generate.ts` — TODO for AI provider; returns mock payload
- `src/pages/api/crypto/create-payment.ts` — mock wallets and rates; comments reference Coinbase Commerce, BitPay, etc.
- `src/pages/api/donations.ts` — dev: mock response; **production:** 503 (no persistence) per Phase 4

## Data Storage

**Databases:**
- LanceDB (embedded, filesystem) — path `data/lancedb/` relative to project root; table `content` built by `scripts/index-content.ts`, queried by `src/pages/api/search.ts`
- Cloudflare D1 **reference DDL** — `src/lib/db/schema.sql` only (see `src/lib/db/README.md`). TypeScript D1 helpers were removed so the repo does not imply a bound database; current deploy uses `@astrojs/node`, not Cloudflare Workers bindings

**File Storage:**
- Local filesystem — content under `src/content/`, generated LanceDB under `data/lancedb/`, build output under `dist/`

**Caching:**
- Not applicable as a separate service — `@xenova/transformers` and LanceDB may use on-disk caches implicit to those libraries

## Authentication & Identity

**Auth Provider:**
- None for the public portfolio — no session/JWT/OAuth flow detected in `src/pages/api/`
- Forms use Zod validation only; payment and donation flows use provider secrets where applicable

## Monitoring & Observability

**Error Tracking:**
- None detected — `console.error` in API routes; no Sentry/Datadog imports

**Logs:**
- stdout/stderr from Node/PM2 on the deployment host (per `.github/workflows/deploy.yml`)

## CI/CD & Deployment

**Hosting:**
- Self-hosted Linux runner: checkout, `bun install`, `bun run build`, copy `dist/client/*` to `/var/www/html`, PM2 start `dist/server/entry.mjs` — `.github/workflows/deploy.yml`

**CI Pipeline:**
- GitHub Actions — deploy workflow above; `weekly-summary.yml` for scheduled journal automation (PR creation via `peter-evans/create-pull-request@v6`)

## Environment Configuration

**Required env vars (by feature):**

| Concern | Variables | Where referenced |
|--------|-----------|------------------|
| Contact (API route) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | `src/pages/api/contact.ts` |
| Contact (lib helper) | `PUBLIC_TELEGRAM_BOT_TOKEN`, `PUBLIC_TELEGRAM_CHAT_ID` | `src/lib/telegram.ts`, `src/env.d.ts` |
| Stripe | `STRIPE_SECRET_KEY`; docs mention `STRIPE_WEBHOOK_SECRET`, `PUBLIC_STRIPE_PUBLISHABLE_KEY` | `src/pages/api/stripe/create-payment.ts`, comments in same file |
| Weekly workflow (unused by scripts today) | `GOOGLE_GENERATIVE_AI_API_KEY` | `.github/workflows/weekly-summary.yml` |

**Secrets location:**
- GitHub Actions secrets for CI; host/PM2 environment for production — do not commit `.env` files

## Webhooks & Callbacks

**Incoming:**
- `POST` `src/pages/api/stripe/webhook.ts` — Stripe-style events; signature verification not enforced in current code

**Outgoing:**
- Telegram `sendMessage` from contact flow — see APIs section

---

*Integration audit: 2026-04-12*
