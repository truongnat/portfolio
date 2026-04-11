---
phase: 3
slug: safe-api-error-surfaces
status: draft
nyquist_compliant: true
created: 2026-04-12
---

# Phase 3 — Validation strategy

## Test infrastructure

| Property | Value |
|----------|--------|
| **Framework** | `bun run verify` + optional manual curl |
| **Quick check** | `bun run lint && bun run check && bun run build` |

## Per-plan verification

| Plan | Automated | Manual |
|------|------------|--------|
| 03-01 | No `(error as Error).message` in `search.ts`; lint/check | Force search error → generic JSON body |
| 03-02 | Lint/check; grep no secret names in JSON bodies for issuance | POST certificate-issue without env → 503 generic |

## Sign-off

- [ ] Both plans include executable tasks and SEC-03 traceability
- [ ] `02-VALIDATION.md`-style Nyquist checks satisfied at execute time

**Approval:** pending
