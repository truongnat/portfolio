# Phase 1: Build & quality baseline — Research

**Researched:** 2026-04-12  
**Domain:** Astro 6 + Bun + ESLint + `@astrojs/check` + GitHub Actions (self-hosted deploy)  
**Confidence:** HIGH (repo inspected, commands run locally; CI behavior inferred from workflow YAML)

## Summary

The stack already supports a solid baseline: `bun run build` succeeds locally (Astro 6, `@astrojs/node` standalone, hybrid static + server). `@astrojs/check` is installed and `astro check` exits successfully with default `--minimumFailingSeverity error`, while surfacing many **hints** (unused imports, deprecations, Astro script note). **ESLint currently fails** with 16 errors across `scripts/`, `src/components`, `src/lib`, and `src/pages/api` — so OPS-02 is not met for a full-repo `bun run lint` until those are fixed or policy explicitly scopes lint (requirements text favors “touched files,” but CI typically needs a deterministic full-repo gate).

Deploy CI (`.github/workflows/deploy.yml`) runs **install → build → rsync static → PM2** only; it does **not** run ESLint or `astro check`. There is **no** `check` script in `package.json`, so discoverability and parity between local and CI rely on ad hoc `bunx astro check`.

**Primary recommendation:** Add explicit `package.json` scripts (`check` / `verify`), fix or baseline ESLint errors so `lint` is green, and extend the deploy workflow (or add a PR `pull_request` workflow on `ubuntu-latest`) so build + lint + `astro check` run before or alongside deploy — matching OPS-01 and OPS-02.

<phase_requirements>

## Phase Requirements

| ID | Description | Research support |
|----|-------------|-------------------|
| **OPS-01** | `bun run build` and CI deploy workflow succeed on current Astro/React/Tailwind stack | Build verified locally; workflow only gates on `bun run build`; self-hosted runner must have Bun, Node, PM2, nginx, sudo paths as today |
| **OPS-02** | ESLint and `@astrojs/check` pass without **new** errors on touched files | ESLint: flat config ignores `**/*.astro` (use `astro check` for `.astro`); full `bun run lint` currently **fails** (16 errors); `astro check` exits 0 with 44 hints at default severity — define “pass” (errors vs hints) for the phase |

</phase_requirements>

## Project constraints (from `.cursor/rules/`)

From `gsd-project.md` (portfolio rule snapshot):

- **Tech:** Stay compatible with Astro Content Collections and MDX; large migrations need explicit phases.
- **Secrets:** No secrets in repo; keys only via environment.
- **Performance:** Static-first; heavy JS only where islands justify it.

**ESLint conventions (documented in project stack):** `eslint.config.mjs` intentionally ignores `**/*.astro`; TypeScript/JS only. Astro templates rely on `astro check` / editor, not ESLint.

---

## Current state

### Build

| Item | Detail |
|------|--------|
| **Command** | `bun run build` → `astro build` |
| **Stack** | Astro `^6.0.4`, React 19, Tailwind v4 via `@tailwindcss/vite`, `@astrojs/node` adapter `mode: 'standalone'`, `output: 'static'` (hybrid: server entry + prerendered routes) |
| **Local result** | **Succeeds** (verified 2026-04-12). Build emits Vite warnings (chunk size, Node externals); content sync warns once for Shiki language `gradle` |
| **Memory** | CI uses `NODE_OPTIONS: "--max-old-space-size=4096"` for build |

### CI / deploy (`.github/workflows/deploy.yml`)

| Item | Detail |
|------|--------|
| **Trigger** | `push` to `main` |
| **Runner** | `self-hosted`, `linux` |
| **Steps** | `actions/checkout@v4` → `setup-node` **Node 22** → `oven-sh/setup-bun@v2` → `bun install` → `bun run build` (with `nvm.sh` sourced) → copy `dist/client/*` to `/var/www/html` → `pm2` start `dist/server/entry.mjs` → `nginx` reload |
| **Quality gates** | **Build only** — no ESLint, no `astro check` |
| **Other workflows** | `weekly-summary.yml` uses `ubuntu-latest` + Bun; unrelated to deploy baseline |

### Lint & Astro check

| Tool | Config / command | Current result |
|------|------------------|----------------|
| **ESLint** | `eslint.config.mjs` — flat config, `typescript-eslint` recommended, `eslint-plugin-react-hooks`; **ignores** `dist/`, `.astro/`, `node_modules/`, `public/`, **`**/*.astro`** | **`bun run lint` fails** — **16 errors** (e.g. `prefer-const`, `@typescript-eslint/ban-ts-comment`, `react-hooks/set-state-in-effect`, unused imports/vars) |
| **`@astrojs/check`** | Dependency `^0.9.8`; no npm script | **`bunx astro check` exits 0** — 0 errors, 0 warnings, **44 hints** (unused symbols, deprecated Lucide exports, Zod deprecation hints, Astro script `is:inline` suggestion) |

---

## Gaps

1. **No `astro check` in `package.json`** — operators must know to run `bunx astro check`; not part of `bun run build` (Astro docs: `astro build` does not type-check unless you compose `astro check && astro build`).
2. **CI does not run lint or `astro check`** — regressions can ship if build still passes (OPS-02 not enforced in pipeline).
3. **ESLint is red repo-wide** — blocks a strict interpretation of “lint passes” for OPS-02 unless errors are fixed or policy is “only touched files” with tooling (e.g. `lint-staged`) not yet present.
4. **`astro check` hints vs failures** — default `--minimumFailingSeverity` is `error`, so hints do not fail CI; if the phase goal is “clean” diagnostics, planners must decide whether to treat hints as failures (`--minimumFailingSeverity hint`) or chip away over time.
5. **Astro files excluded from ESLint** — by design; completeness requires both ESLint (TS/TSX/JS) and `astro check` (`.astro` + TS in Astro context).

---

## Recommendations

1. **Scripts in `package.json`:** Add `"check": "astro check"` and a composite e.g. `"verify": "bun run lint && bun run check"` (exact naming is planner’s choice) so OPS-02 checks are one command.
2. **CI:** Add a **lint + check** step after `bun install` and **before** or **with** build on the deploy workflow, or introduce a separate workflow for `pull_request` on `ubuntu-latest` (cache-friendly, doesn’t require self-hosted secrets) while keeping deploy on self-hosted. Ensure the chosen path matches how the team wants to gate `main`.
3. **ESLint debt:** Fix the 16 existing errors (or the subset blocking touched paths) so `bun run lint` is green — aligns full-repo gate with REQUIREMENTS and ROADMAP success criteria.
4. **Clarify “pass” for `astro check`:** For Phase 1 completion, recommend **exit code 0 with `minimumFailingSeverity` at default `error`** unless product owner wants zero hints (stricter follow-up).
5. **Optional:** Document in README or `AGENTS.md` the two-track static analysis — ESLint for JS/TS, `astro check` for Astro + project diagnostics.

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Self-hosted runner drift** | Missing Bun, PM2, nvm, or permissions breaks deploy even if lint passes | Document runner prerequisites; keep a minimal `ubuntu-latest` job for lint/check/build smoke |
| **Fixing ESLint exposes cascading issues** | `react-hooks/set-state-in-effect` may need small refactors | Scope fixes file-by-file; run `lint` after each |
| **Stricter `astro check`** | `--minimumFailingSeverity hint` fails on 44 hints | Treat hint cleanup as follow-up tasks unless Phase 1 explicitly requires it |
| **Build vs check ordering** | `astro check` can add CI time | Acceptable tradeoff for OPS-02; run in parallel with lint if workflow supports jobs |
| **Ignored `*.astro` in ESLint** | Confusion if contributors expect ESLint on Astro | Keep documented; rely on `astro check` |

---

## Standard stack

### Core

| Library | Version (project / registry) | Purpose | Why standard |
|---------|------------------------------|---------|--------------|
| `astro` | `^6.0.4` (latest registry **6.1.5**) | SSG + SSR/hybrid | Project baseline |
| `@astrojs/check` | `^0.9.8` | CLI type/Astro diagnostics | Official Astro tooling |
| `eslint` | `^10.0.3` (latest **10.2.0**) | JS/TS lint | Flat config with `typescript-eslint` |
| `typescript-eslint` | `^8.56.1` | Type-aware ESLint rules | Matches ESLint 9+ flat config |
| `bun` | lockfile + scripts | Install + run | Repo standard |

**Version verification:** `npm view astro version` → 6.1.5; `npm view @astrojs/check version` → 0.9.8; `npm view eslint version` → 10.2.0 (as of 2026-04-12).

---

## Don’t hand-roll

| Problem | Don’t build | Use instead |
|---------|-------------|-------------|
| Typecheck `.astro` + TS together | Raw `tsc` only | `astro check` (`@astrojs/check`) per [Astro TypeScript docs](https://docs.astro.build/en/guides/typescript/) |
| Astro file lint | Custom parser pipeline without maintenance | ESLint for TS/JS; `astro check` for `.astro` (current intentional split) |

---

## Common pitfalls

- **Assuming `astro build` implies type safety** — it does not; add `astro check` in CI or `check && build` if failures must block release.
- **`--minimumFailingSeverity` vs `--minimumSeverity`** — first controls exit code; second controls verbosity. Default failing severity is `error`, so hints alone stay green.
- **ESLint `--max-warnings 0`** — any warning fails lint; current failures are **errors**, not warnings.

---

## Validation Architecture

> Nyquist validation is **enabled** in `.planning/config.json` (`workflow.nyquist_validation: true`). Phase 1 is **build/quality**; automated unit/e2e suite is **out of scope** per REQUIREMENTS (“Full automated test suite” deferred).

### What “done” means for Phase 1

| Gate | Pass criterion |
|------|----------------|
| **OPS-01 — build** | `bun run build` completes with **exit code 0** in a clean install (same as CI: `bun install` then `bun run build`). |
| **OPS-01 — deploy** | Pushing to `main` runs `.github/workflows/deploy.yml` and the job **succeeds** end-to-end (build + copy + pm2 + nginx reload). |
| **OPS-02 — ESLint** | `bun run lint` exits **0** (`--max-warnings 0`). For the roadmap wording “no new errors on touched files,” the practical CI standard is **full-repo green** unless a narrower policy is formally adopted. |
| **OPS-02 — Astro check** | `bunx astro check` (or `bun run check` once added) exits **0** with default `--minimumFailingSeverity error` (hints allowed unless the phase tightens severity). |

### Commands (proposed baseline)

| Step | Command | Notes |
|------|---------|--------|
| Install | `bun install` | Match CI |
| Lint | `bun run lint` | Must be fixed to pass for strict OPS-02 |
| Astro check | `bunx astro check` or `bun run check` after script added | Optional: `--minimumSeverity warning` to reduce noise in logs |
| Build | `bun run build` | OPS-01 |
| Composite | `bun run verify` (lint + check, after defining script) | Single pre-push gate |

### CI gates

| Location | Recommended addition |
|----------|---------------------|
| **Deploy workflow** | After `bun install`, run `bun run lint` and `bunx astro check` (or `bun run verify`) before `bun run build`, **or** add a parallel/`ubuntu-latest` workflow on PRs that runs install + lint + check + build |

**Pass:** All configured steps exit 0; deploy only proceeds when quality steps succeed (if chained in the same job).

### Test framework

| Property | Value |
|----------|--------|
| Framework | None in `package.json` (deferred per REQUIREMENTS) |
| Quick run | `bun run lint && bunx astro check && bun run build` |
| Full suite | Same (no separate test runner) |

### Phase requirements → verification map

| Req ID | Automated command | Status note |
|--------|-------------------|-------------|
| OPS-01 | `bun run build` | Green locally |
| OPS-01 | GitHub Actions deploy workflow | Must succeed on `main`; not re-run here |
| OPS-02 | `bun run lint` | **Red** until ESLint errors fixed |
| OPS-02 | `bunx astro check` | **Green** (exit 0); hints present |

### Wave 0 gaps

- [ ] Add `check` / `verify` scripts to `package.json`
- [ ] Fix 16 ESLint errors (or document scoped lint policy + tooling)
- [ ] Add CI steps for lint + `astro check`
- No new test framework required for Phase 1 unless scope changes

---

## Environment availability

**Step 2.6 (local dev):** Bun and Node present; `bun run build` and `astro check` succeed.

| Dependency | Required by | Available (research machine) | Notes |
|------------|-------------|------------------------------|-------|
| Bun | scripts / CI | ✓ | Match `oven-sh/setup-bun` in CI |
| Node (22 in deploy workflow) | Astro / Actions | ✓ (mise 24 locally — CI uses 22) | Align local major with CI if diagnosing Node-specific issues |
| Self-hosted runner | deploy job | Not verified | PM2, nginx, sudo, `/var/www/html` paths required |

**Blocking:** None for local research; production CI depends on self-hosted runner health.

---

## Open questions

1. **Should CI run on `pull_request`?** — Improves gate before merge; deploy can stay `push` to `main` only.
2. **Treat `astro check` hints as failures?** — Default `error` only; 44 hints would become blocking if `--minimumFailingSeverity hint`.
3. **Monorepo-style “touched files” lint** — REQUIREMENTS mention touched files; without `lint-staged`/path-scoped CI, full-repo green is the straightforward interpretation.

---

## Sources

### Primary (HIGH)

- [Astro Docs — TypeScript / `astro check`](https://docs.astro.build/en/guides/typescript/) — build does not typecheck; use `astro check`
- Local command results: `bun run build`, `bun run lint`, `bunx astro check`, `bunx astro check --help` (2026-04-12)
- Repository files: `package.json`, `eslint.config.mjs`, `.github/workflows/deploy.yml`, `astro.config.mjs`

### Secondary (MEDIUM)

- `npm view` for package versions (registry snapshot 2026-04-12)

---

## Metadata

**Confidence breakdown:**

- Standard stack: **HIGH** — from `package.json` + registry
- Current state (build/check): **HIGH** — executed locally
- Lint: **HIGH** — full error list captured
- Self-hosted CI: **MEDIUM** — inferred from YAML, not executed

**Research date:** 2026-04-12  
**Valid until:** ~30 days (tooling) / refresh if ESLint or Astro major bumps

## RESEARCH COMPLETE
