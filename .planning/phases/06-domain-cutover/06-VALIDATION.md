---
phase: 6
slug: domain-cutover
status: complete
nyquist_compliant: true
created: 2026-04-12
---

# Phase 6 — Validation strategy

## Test infrastructure

| Property | Value |
|----------|--------|
| **Automated** | `bun run verify` |
| **Manual** | Operator DNS/TLS when deploying; optional browser check of canonical/OG URLs |

## Per-plan checks

| Plan | Automated | Manual |
|------|------------|--------|
| 06-01 | Lint/check/build; `rg 'truongdq\.com' src/` empty | View-source or devtools: canonical links use new host |
| 06-02 | Full verify | `rg 'truongdq\.com'` — only migration doc + documented exceptions |

## Sign-off

- [x] Plans trace DOM-01 / DOM-02
- [x] Execute-phase completes with green verify

**Approval:** 2026-04-12 — `bun run verify` green; `rg 'truongdq\.com' src/` empty.
