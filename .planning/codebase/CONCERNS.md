# Codebase Concerns

**Analysis Date:** 2026-04-12

## Tech Debt

**Stub and mock API routes (no persistence):**
- Issue: Historically, many `POST` handlers returned synthetic success without persistence.
- Files: `src/pages/api/donations.ts`, `src/pages/api/roadmap/vote.ts`, `src/pages/api/learning-journey/sponsor.ts`, `src/pages/api/bug-bounty/submit.ts`, `src/pages/api/auction/create-bid.ts`, `src/pages/api/crypto/create-payment.ts`, `src/pages/api/terminal/execute.ts`, `src/pages/api/ai-thank-you/generate.ts`
- Current mitigation (Phase 4 / DATA-01): In **`import.meta.env.PROD`**, these routes return **503** via `stubUnavailableInProduction` (`src/lib/production-stub-guard.ts`) instead of fake 200 success. Development behavior unchanged.
- Remaining gap: No real persistence or audit trail until a store is chosen and wired.

**D1 reference DDL (no TS module):**
- Issue: Previously `src/lib/db/index.ts` implied a bound D1 client without imports.
- Files: `src/lib/db/schema.sql`, `src/lib/db/README.md`
- Current mitigation (Phase 4 / DATA-02): TypeScript helpers **removed**; `schema.sql` kept as reference only (see README).
- Fix approach for production data: Add a real binding + migrations, then implement routes against that store.

**Skill Tree admin dashboard is mock-only:**
- Issue: `SkillTreeAdmin` loads hard-coded stats and donations, and approve/reject handlers only update local React state.
- Files: `src/components/SkillTreeAdmin.client.tsx`
- Impact: Admin UI cannot reflect production data; actions do not persist.
- Fix approach: Add authenticated admin API routes (e.g. `/api/admin/*`) and replace mock `fetchDashboardData` / handlers with real calls.

**Stripe webhook processes JSON without signature verification:**
- Issue: Commented-out `stripe.webhooks.constructEvent`; handler uses `JSON.parse(body)` and treats the result as a Stripe event.
- Files: `src/pages/api/stripe/webhook.ts`
- Impact: Anyone who can POST to the endpoint can forge events unless the route is blocked upstream (not visible in repo).
- Fix approach: Use the official Stripe SDK or verified signature construction with `STRIPE_WEBHOOK_SECRET`, reject unsigned bodies, then call `donationQueries` / related persistence.

**Stripe Payment Intent metadata encoding:**
- Issue: `metadata` is sent as `JSON.stringify({...})` in a single form field. Stripe expects `metadata[key=value]` style parameters per key.
- Files: `src/pages/api/stripe/create-payment.ts`
- Impact: Metadata may be wrong or empty in Stripe Dashboard, breaking downstream webhook logic when it is implemented.
- Fix approach: Send `metadata[skillId]`, `metadata[skillName]`, etc., as separate form fields per Stripe API docs.

**Terminal execute API is a stub:**
- Issue: Validates input but always returns a fixed mock success message.
- Files: `src/pages/api/terminal/execute.ts`
- Impact: Any UI that depends on real command output is non-functional.
- Fix approach: If a real shell is ever needed, use a tightly controlled allowlist and sandbox; otherwise remove or clearly disable the route in production.

**AI thank-you generation is a stub:**
- Issue: Returns placeholder content; TODO references real AI integration.
- Files: `src/pages/api/ai-thank-you/generate.ts`
- Impact: Feature does not deliver promised behavior.
- Fix approach: Call `ai` / `@ai-sdk/google` or `@google/generative-ai` with server-side keys and rate limits.

**TODO comments (tracked in source):**
- Issue: Explicit TODOs for database saves, emails, ticketing, and AI integration remain in multiple API files and `SkillTreeAdmin.client.tsx`.
- Files: `src/pages/api/bug-bounty/submit.ts`, `src/pages/api/crypto/create-payment.ts`, `src/pages/api/donations.ts`, `src/pages/api/learning-journey/sponsor.ts`, `src/pages/api/stripe/webhook.ts`, `src/pages/api/terminal/execute.ts`, `src/pages/api/ai-thank-you/generate.ts`, `src/pages/api/roadmap/vote.ts`, `src/components/SkillTreeAdmin.client.tsx`
- Impact: Easy to forget when shipping; behavior is incomplete.
- Fix approach: Track as issues or remove TODOs when implementing.

## Known Bugs

**None verified end-to-end in this audit.** The Stripe metadata and webhook verification items above are high-risk correctness/security issues rather than confirmed runtime failures.

## Security Considerations

**Forged certificate images:**
- Risk: `GET /api/certificate` accepts query parameters and renders a PNG for any `donatorName`, `skillName`, `amount`, etc., without tying to a verified payment or server-side id.
- Files: `src/pages/api/certificate.ts`, `src/lib/certificate-generator.ts`
- Current mitigation: None in code.
- Recommendations: Issue certificates only after verified payment, use opaque signed tokens or server-generated IDs in URLs, or require authentication.

**Public APIs without rate limiting:**
- Risk: Contact form, search, and payment-adjacent routes can be abused for spam, DoS, or cost amplification (if AI is added).
- Files: `src/pages/api/contact.ts`, `src/pages/api/search.ts`, and other `src/pages/api/**/*.ts`
- Current mitigation: None visible in handlers.
- Recommendations: Edge or server rate limits, CAPTCHA on sensitive forms, and request size limits.

**Search API error bodies:**
- Risk: On failure, `src/pages/api/search.ts` previously returned `(error as Error).message` to the client (paths / stack leakage).
- Files: `src/pages/api/search.ts`, `src/lib/api-error-response.ts`
- Current mitigation (2026-04-12, Phase 3): Generic JSON body (`Search is temporarily unavailable`); `logApiError` for server-side detail.
- Recommendations: Keep pattern for any new API routes that catch unexpected errors.

**Crypto payment flow uses placeholder wallet data:**
- Risk: Hard-coded example addresses and static exchange rates in `src/pages/api/crypto/create-payment.ts` are unsuitable for production; misdirected funds if deployed as-is.
- Files: `src/pages/api/crypto/create-payment.ts`
- Current mitigation: Comments state mock behavior.
- Recommendations: Integrate a payment processor or custodial flow; never commit real keys without secret management.

**Telegram credentials for contact form:**
- Risk: `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` must be set; missing config returns 500 (good). Ensure tokens never appear in client bundles or logs.
- Files: `src/pages/api/contact.ts`
- Current mitigation: Server-only `process.env` usage.
- Recommendations: Rotate tokens if ever exposed; avoid logging `telegramResult` with secrets.

## Performance Bottlenecks

**Search endpoint cold start and memory:**
- Problem: First request loads `@xenova/transformers` pipeline and LanceDB from `data/lancedb`; both are heavy for serverless-style or small VMs.
- Files: `src/pages/api/search.ts`, `scripts/index-content.ts`
- Cause: On-demand model initialization and synchronous embedding work.
- Improvement path: Pre-warm on deploy, use a smaller embedding service, or move search to a dedicated worker with persistent memory.

**Large client components:**
- Problem: Several React islands exceed ~500 lines (e.g. learning journey, AI thank-you, roadmap voting, skill tree).
- Files: `src/components/LearningJourney.client.tsx`, `src/components/AIThankYou.client.tsx`, `src/components/RoadmapVoting.client.tsx`, `src/components/SkillTree.client.tsx`, `src/components/BugBounty.client.tsx`
- Cause: Monolithic components with charts, motion, and forms.
- Improvement path: Split by feature, lazy-load heavy libraries (`d3`, `recharts`, force-graph), and measure bundle with `astro build` output.

**CI build memory:**
- Problem: Deploy workflow sets `NODE_OPTIONS: "--max-old-space-size=4096"` for `bun run build`, indicating large build footprint.
- Files: `.github/workflows/deploy.yml`
- Cause: Astro + React + MDX + optional heavy deps.
- Improvement path: Keep build graph lean; profile with `astro build --verbose` if needed.

## Fragile Areas

**Hybrid static + server output:**
- Why fragile: `astro.config.mjs` sets `output: 'static'` with `@astrojs/node` adapter; API routes rely on `export const prerender = false` per file. Misconfiguration can break SSR routes after deploy.
- Files: `astro.config.mjs`, `src/pages/api/**/*.ts`
- Safe modification: When changing build/deploy, verify every dynamic route and `GET`/`POST` handler still runs on the Node server (`dist/server/entry.mjs` per PM2 in deploy workflow).
- Test coverage: No automated E2E coverage for API routes detected.

**LanceDB path and deployment:**
- Why fragile: Search reads `data/lancedb` under `process.cwd()`; deploy copies `dist/client` to nginx and runs PM2 on `dist/server/entry.mjs`. If `data/lancedb` is not present on the server or out of sync with indexed content, search fails at runtime.
- Files: `src/pages/api/search.ts`, `scripts/index-content.ts`
- Safe modification: Document and automate index replication alongside deploy, or host DB on shared storage.

**Non-npm dependency alias for `@nanostores/react`:**
- Why fragile: `package.json` resolves `@nanostores/react` to `ai/react` (GitHub fork per lockfile), not the npm semver line.
- Files: `package.json`, `bun.lock`
- Safe modification: Pin to a specific commit or migrate to the official package when possible; audit updates carefully.

## Scaling Limits

**In-memory singletons in search:**
- Current capacity: Single-process embedder and DB connection reused via module-level `let` variables.
- Limit: Horizontal scaling duplicates model load per instance; concurrent first requests contend on CPU.
- Scaling path: External vector DB + embedding API, or sticky sessions with warm workers.

**Mock payment modes:**
- Current capacity: Unlimited fake success responses when Stripe is unset or flows are stubbed.
- Limit: Cannot reconcile real money with application state until persistence and webhooks are complete.
- Scaling path: End-to-end payment state machine and idempotent webhook handling.

## Dependencies at Risk

**`@nanostores/react` via `ai/react`:**
- Risk: Unusual alias to a GitHub dependency; harder to audit than npm semver.
- Impact: Install or lockfile drift, possible supply-chain surprises.
- Migration plan: Replace with `@nanostores/react` from npm if features match, or vendor a minimal fork with explicit version.

## Missing Critical Features

**End-to-end persistence for transactional features:**
- Problem: Donations, votes, bids, bug reports, and crypto payment records are not stored server-side in the current handlers.
- Blocks: Reporting, refunds, admin workflows, and legal compliance for payments.

**Admin authentication:**
- Problem: No auth layer for admin or sensitive APIs was found in the sampled routes.
- Blocks: Safe operation of `SkillTreeAdmin` and any future `/api/admin/*` endpoints.

## Test Coverage Gaps

**Minimal automated tests:**
- What's not tested: API routes, Stripe integration, search, contact form, certificate generation, and most React components.
- Files: Only `src/lib/utils.test.ts` (Bun test for `slugify` in `src/lib/utils.ts`) was found under `*.test.*` pattern.
- Risk: Regressions in payment and form flows go unnoticed.
- Priority: High for money and PII paths; Medium for pure UI.

---

*Concerns audit: 2026-04-12*
