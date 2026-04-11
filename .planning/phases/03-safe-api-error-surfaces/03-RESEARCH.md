# Phase 3: Safe API error surfaces — Research

**Researched:** 2026-04-12  
**Requirements:** SEC-03

## Summary

- **`src/pages/api/search.ts`** is the **only** API route that returns `(error as Error).message` in a JSON body (500). This can expose filesystem paths, LanceDB errors, or transformer loading failures — **must be fixed**.
- **`src/pages/api/certificate-issue.ts`** returns `error: 'CERTIFICATE_SIGNING_SECRET not set'` in JSON (503). That names the env var and hints configuration — **treat as sensitive**; use generic client message + server log.
- Other **`src/pages/api/**/*.ts`** routes reviewed via grep: catch blocks generally use static strings for 500 JSON (`contact`, `stripe/create-payment`, stubs, etc.). **Zod** handlers sometimes return `details: error.issues` on 400 — user-facing validation hints; acceptable for SEC-03 unless we tighten in a follow-up.
- **`portfolio.md.ts`** has no try/catch leak path for errors in the handler as written.

## Evidence

| File | Risk | Notes |
|------|------|--------|
| `search.ts` | High | `JSON.stringify({ error: (error as Error).message })` |
| `certificate-issue.ts` | Medium | Config hint in JSON body |
| Others | Low | Static generic messages on 500 |

## Recommendations

1. Add **`src/lib/api-error-response.ts`** (name flexible) with:
   - `logApiError(context: string, error: unknown): void` — `console.error` with context prefix
   - `jsonErrorResponse(status: number, body: Record<string, unknown>): Response` — sets `Content-Type: application/json`
   - Optional: `genericInternalErrorJson()` for `{ error: string }` shape matching search client expectations
2. **search.ts**: In `catch`, call `logApiError`, return **500** with fixed message e.g. `{ "error": "Search is temporarily unavailable" }` (exact string locked in plan).
3. **certificate-issue.ts**: Replace explicit secret-name message with generic **503** body; log reason server-side only.

## Risks

- **Breaking change** for any client that parsed raw search error strings — acceptable; those strings were never API contract.
- **Tests**: No automated API tests in repo; rely on `bun run verify` + manual curl.

## Validation

- Grep: no `(error as Error).message` inside `new Response` / `JSON.stringify` in `src/pages/api` after change.
- `bun run lint && bun run check && bun run build`
