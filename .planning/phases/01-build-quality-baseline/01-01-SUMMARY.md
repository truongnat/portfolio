# Plan 01-01 Summary — Scripts & CI gates

**Completed:** 2026-04-12

## Done

- Added `check`: `astro check` and `verify`: `bun run lint && bun run check && bun run build` to `package.json`.
- Extended `.github/workflows/deploy.yml` with **ESLint** and **Astro check** steps after `bun install`, before **Build** (order: install → lint → check → build).

## Verification

- `node -e` asserts exact `scripts.check` and `scripts.verify` strings.
- `bun run check` exits 0.
- Workflow YAML contains `bun run lint`, `bun run check`, `bun run build` in correct order.

## Note

Full `bun run verify` requires Wave 2 (ESLint fixes). Lint was failing before this phase.
