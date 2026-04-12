---
status: testing
phase: 01-build-quality-baseline
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
started: "2026-04-12T00:00:00.000Z"
updated: "2026-04-12T00:00:00.000Z"
---

## Current Test

number: 1
name: One-shot verify pipeline
expected: |
  From the repository root, run `bun run verify`.
  The command runs ESLint, then `astro check`, then `astro build`, and exits with code 0 (no failures).

## Tests

### 1. One-shot verify pipeline
expected: bun run verify exits 0 after lint, check, and build
result: pending

### 2. CI workflow order
expected: deploy.yml runs bun install, then bun run lint, bun run check, then bun run build in that order
result: pending

### 3. package.json scripts
expected: package.json has scripts.check astro check and scripts.verify chaining lint, check, build
result: pending

### 4. Reading progress on posts
expected: On a blog or journal post URL (not the index), a thin top progress bar appears when scrolling
result: pending

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0

## Gaps

[none yet]
