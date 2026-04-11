# Testing Patterns

**Analysis Date:** 2026-04-12

## Test Framework

**Runner:**
- **Bun** built-in test runner — imports from `bun:test` (`describe`, `expect`, `test`).
- Config: Not applicable — no `vitest.config.*`, `jest.config.*`, or test script in `package.json`.

**Assertion Library:**
- Assertions via `expect` from `bun:test` (Jest-compatible API surface).

**Run Commands:**
```bash
bun test                    # Run all tests (from repo root; discovers *.test.ts)
bun test src/lib/utils.test.ts   # Single file
```

There is **no** `npm`/`package.json` script named `test`; developers run `bun test` directly.

## Test File Organization

**Location:**
- Co-located: tests live beside implementation — `src/lib/utils.test.ts` next to `src/lib/utils.ts`.

**Naming:**
- `*.test.ts` for TypeScript unit tests.

**Structure:**
```
src/lib/
├── utils.ts
└── utils.test.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, expect, test } from "bun:test";
import { slugify } from "./utils";

describe("slugify", () => {
  test("converts basic text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  // ...
});
```
(Source: `src/lib/utils.test.ts`.)

**Patterns:**
- `describe` groups a single function or feature.
- Each `test` case uses a clear sentence-style description.
- No shared `beforeEach`/`afterEach` in the current suite; add when setup cost appears.

## Mocking

**Framework:** Not used in the only existing test file; Bun supports mocking via `mock` module — use when adding tests that touch network, `fetch`, or time.

**Patterns:**
- Not yet established in-repo; prefer explicit fakes or small stubs next to tests when introduced.

**What to Mock:**
- External HTTP, filesystem, and environment-dependent code in unit tests.

**What NOT to Mock:**
- Pure functions under test (current `slugify` tests exercise real implementation end-to-end).

## Fixtures and Factories

**Test Data:**
- Inline string literals in assertions (`src/lib/utils.test.ts`).

**Location:**
- No dedicated `__fixtures__` or `test/factories` directory yet — add under `src/` or `tests/` if suites grow.

## Coverage

**Requirements:** None enforced — no coverage thresholds in config or CI.

**View Coverage:**
```bash
bun test --coverage    # Bun supports --coverage when enabled for the runtime version in use
```

Verify Bun version supports coverage flags in your environment; project does not pin a coverage workflow.

## Test Types

**Unit Tests:**
- Present for pure utilities (`slugify` in `src/lib/utils.test.ts`).

**Integration Tests:**
- Not detected (no API route tests, no DB integration tests in-repo).

**E2E Tests:**
- Not used (no Playwright/Cypress config or dependencies in `package.json`).

## Common Patterns

**Async Testing:**
- Use `async`/`await` in `test` callbacks when testing async code; Bun supports the same patterns as Vitest/Jest-style runners.

**Error Testing:**
- Use `expect(() => fn()).toThrow()` or `await expect(promise).rejects` when adding failure-path tests (not yet shown in existing file).

## CI / Automation

**GitHub Actions:**
- `.github/workflows/deploy.yml` — checkout, Node 22, Bun, `bun install`, `bun run build`, deploy. **Does not run `bun test` or `bun run lint`.**
- `.github/workflows/weekly-summary.yml` — scheduled/manual; runs `bun run scripts/generate-weekly.ts`; **no tests.**

**Recommendation for future work:** add a job step `bun test` and optionally `bun run lint` before build on pull requests to prevent regressions.

---

*Testing analysis: 2026-04-12*
