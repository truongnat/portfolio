---
phase: 03-safe-api-error-surfaces
plan: 02
subsystem: api
tags: [sec-03, certificate-issue]

requires:
  - phase: 03-safe-api-error-surfaces
    provides: api-error-response from 03-01
provides:
  - POST /api/certificate-issue uses generic 503/500 JSON; no env var names in response bodies
  - Non-Zod errors return 500 with generic message instead of rethrowing
affects: [skill-tree-admin-dev]

tech-stack:
  added: []
  patterns: [Reuse jsonErrorResponse + logApiError]

key-files:
  created: []
  modified:
    - src/pages/api/certificate-issue.ts

key-decisions:
  - "503 body: { error: \"Service unavailable\" }; misconfiguration logged only server-side."

requirements-completed: [SEC-03]

duration: 5min
completed: 2026-04-12
---

# Phase 3 Plan 02 Summary

**Certificate issuance dev route no longer leaks signing-secret configuration in HTTP JSON; unexpected errors handled with generic 500**

## Accomplishments

- Removed literal `CERTIFICATE_SIGNING_SECRET` text from client-facing JSON.
- Wrapped non-Zod throw path with `logApiError` + generic JSON 500.

## Peer scan

- Confirmed no remaining `(error as Error).message` in `src/pages/api` responses (search was the only instance).

## Deviations from Plan

None.

---
*Phase: 03-safe-api-error-surfaces*
