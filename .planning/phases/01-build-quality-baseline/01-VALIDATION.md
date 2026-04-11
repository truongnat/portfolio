---
phase: 1
slug: build-quality-baseline
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Phase 1 uses **lint + astro check + build** (no Vitest/Jest in repo yet).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — deferred per REQUIREMENTS; quality via ESLint + `@astrojs/check` + `astro build` |
| **Config file** | `eslint.config.mjs`, `astro.config.mjs`, `tsconfig.json` |
| **Quick run command** | `bun run lint && bunx astro check` |
| **Full suite command** | `bun run verify` (after added in plans) or `bun run lint && bunx astro check && bun run build` |
| **Estimated runtime** | ~2–5 minutes (depends on machine) |

---

## Sampling Rate

- **After every task commit:** Run `bun run lint` (or scoped path if task only touched specific files) and re-run `bunx astro check` when `.astro` or content config changes
- **After every plan wave:** Run full composite: `bun run lint && bunx astro check && bun run build`
- **Before `/gsd-verify-work`:** `bun run build` must exit 0; lint and check per OPS-02 policy

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| *Filled by executor from PLAN.md* | — | — | OPS-01 / OPS-02 | shell | see task `<acceptance_criteria>` | ⬜ |

---

## Wave 0 Requirements

- [ ] `package.json` includes `check` and `verify` (or equivalent) scripts
- [ ] ESLint exits 0 repo-wide (`bun run lint`)
- [ ] CI runs lint + `astro check` before or with build (see deploy workflow)

*No new Jest/Vitest install required for Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|---------------------|
| Deploy workflow success on `main` | OPS-01 | Self-hosted runner, secrets | Push to `main` (or dry-run on fork) and confirm GitHub Actions job green |

---

## Validation Sign-Off

- [ ] All tasks have shell-verifiable `<acceptance_criteria>` in PLAN.md
- [ ] OPS-01 and OPS-02 each mapped to at least one plan task
- [ ] `nyquist_compliant: true` set when plans verified

**Approval:** pending
