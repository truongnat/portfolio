---
status: testing
phase: 03-safe-api-error-surfaces
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
started: "2026-04-12T02:10:00.000Z"
updated: "2026-04-12T02:10:00.000Z"
---

## Current Test

number: 1
name: Verify pipeline still green
expected: |
  From repo root, `bun run verify` completes with exit code 0 (lint, astro check, build).
awaiting: user response

## Tests

### 1. Verify pipeline still green
expected: bun run verify exits 0
result: [pending]

### 2. Search API generic error on failure
expected: When GET /api/search?q=anything triggers a server error (e.g. temporarily move/rename `data/lancedb` in dev, or use a query after breaking DB access), the HTTP response is 500 with JSON body containing only the stable user message `"Search is temporarily unavailable"` — not raw Error.message text (no paths, LanceDB/transformer stack strings in the JSON body).
result: [pending]

### 3. Certificate-issue generic 503 when signing secret missing
expected: In development (`import.meta.env.DEV`), POST /api/certificate-issue with valid JSON body while `CERTIFICATE_SIGNING_SECRET` is unset returns 503 with JSON like `{"error":"Service unavailable"}` and the response body does not contain the substring `CERTIFICATE_SIGNING_SECRET`.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0

## Gaps

[none yet]
