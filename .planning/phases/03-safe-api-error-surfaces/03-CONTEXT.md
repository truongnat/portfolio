# Phase 3: Safe API error surfaces — Context

**Gathered:** 2026-04-12  
**Status:** Ready for planning  
**Source:** Roadmap Phase 3, REQUIREMENTS SEC-03, `.planning/codebase/CONCERNS.md`

## Phase boundary

Deliver **generic, non-diagnostic JSON/text error responses** to clients for **sensitive API routes**, while preserving **full error details in server-side logs** for operators. Primary focus: **semantic search** (`src/pages/api/search.ts`) and **peer routes** that echo implementation details or configuration hints.

Out of scope for this phase: rate limiting, CAPTCHA, new persistence, changing Zod validation UX for 400 responses beyond removing internal-only fields if required by review.

## Implementation decisions (locked)

- **Search failures** must not return `Error.message` (paths, LanceDB/transformers internals may leak).
- **500-class responses** use a **stable, user-safe message** (and optional stable `code` string) — never raw exception text.
- **Server logs** retain `console.error` with full `error` / stack where useful.
- **Dev-only routes** (`certificate-issue` in non-prod) must not reveal secret names or missing-env diagnostics in JSON bodies to unauthenticated callers; use the same generic pattern as production or omit body detail.

## Canonical references

- `.planning/ROADMAP.md` — Phase 3 goal and success criteria
- `.planning/REQUIREMENTS.md` — SEC-03
- `.planning/codebase/CONCERNS.md` — Search API error bodies; sensitive APIs list
- `src/pages/api/search.ts` — current leak: `(error as Error).message` in 500 JSON

## Specific ideas

- Introduce a tiny **`src/lib/`** helper (e.g. `logApiError` + `jsonError`) to avoid copy-paste and keep responses consistent.
- Manual verification: trigger search failure (e.g. temporarily invalid `data/lancedb` path in dev) and confirm response body is generic while terminal log shows real error.

## Deferred

- Rate limits and request size caps (CONCERNS) — later phase or ops layer.
- Replacing Zod `details: error.issues` on 400 responses — only if product/security review requires; not default scope.

---
*Phase: 03-safe-api-error-surfaces*
