# Coding Conventions

**Analysis Date:** 2026-04-12

## Naming Patterns

**Files:**
- React components: `PascalCase.tsx` (for example `BlogContent.tsx`, `CommandPalette.tsx`).
- Client-only islands: suffix `.client.tsx` (for example `Experience.client.tsx`, `ScrollToTop.client.tsx`).
- Astro API routes: `src/pages/api/**` as `*.ts` exporting HTTP method handlers (`GET`, `POST`, etc.).
- Utilities and shared logic: `camelCase.ts` under `src/lib/` (for example `api-utils.ts`, `utils.ts`).
- Tests: co-located `*.test.ts` next to the module under test (for example `src/lib/utils.test.ts`).

**Functions:**
- `camelCase` for functions and variables (for example `slugify`, `formatDate`, `fetchWithRetry` in `src/lib/utils.ts`, `src/lib/api-utils.ts`).

**Variables:**
- `camelCase` for locals; unused parameters/vars intentionally ignored with a leading `_` to satisfy ESLint (`argsIgnorePattern`, `varsIgnorePattern` in `eslint.config.mjs`).

**Types:**
- `PascalCase` for interfaces and types (for example `BlogPostMetadata`, `Post` in `src/types/index.ts`).
- Use `type` vs `interface` as already done in domain types; `import type` for type-only imports is common (for example `import type { APIRoute } from 'astro'` in `src/pages/api/contact.ts`).

## Code Style

**Formatting:**
- Prettier: Not detected (no `.prettierrc`, no `prettier` dependency).
- Rely on editor defaults; match surrounding files (single quotes are typical in `src/lib/utils.ts`; `src/lib/utils.test.ts` uses double quotes for imports—prefer aligning with the dominant single-quote style in `src/`).

**Linting:**
- ESLint flat config: `eslint.config.mjs`.
- Stack: `@eslint/js` recommended, `typescript-eslint` recommended (`...tseslint.configs.recommended`), `eslint-plugin-react-hooks` recommended rules merged in.
- **Ignored paths:** `dist/**`, `.astro/**`, `node_modules/**`, `public/**`, and **all `*.astro` files** (`**/*.astro`). Lint TypeScript/JavaScript only; Astro templates are not ESLint-covered here.
- **Notable rule overrides:** `no-console` off; `@typescript-eslint/no-explicit-any` off; `@typescript-eslint/no-unused-vars` error with `_` prefix ignore patterns; `no-undef` off (TypeScript handles this).

**TypeScript:**
- `tsconfig.json` extends `astro/tsconfigs/strict` with `baseUrl` `.` and path alias `@/*` → `src/*`.
- `bun-types` included in `compilerOptions.types` for Bun globals in tooling/scripts.

**Commands:**
```bash
bun run lint          # eslint . --ext .js,.mjs,.cjs,.ts,.tsx --max-warnings 0
bun run lint:fix      # same with --fix
```

## Import Organization

**Order (observed pattern):**
1. Type-only imports from frameworks (`import type { APIRoute } from 'astro'`).
2. Runtime imports from packages (`react`, `zod`, `framer-motion`, `lucide-react`, etc.).
3. Astro/virtual modules where used (`astro:content`, `astro:transitions/client`).
4. Alias imports from `@/` (`@/lib/...`, `@/hooks/...`, `@/components/...`, `@/types`).
5. Relative imports for siblings (`./PostCard`, `./utils`).

**Path Aliases:**
- `@/*` maps to `src/*` — use for anything under `src/` instead of long relative paths (`tsconfig.json`).

## Error Handling

**Patterns:**
- **API routes:** wrap handlers in `try`/`catch`, return `Response` with JSON body and appropriate `status`; validate input with **Zod** via `.safeParse()` and return `400` with a stable error shape on failure (see `src/pages/api/contact.ts`).
- **HTTP helpers:** `fetchWithRetry` in `src/lib/api-utils.ts` uses try/catch per attempt, distinguishes retryable cases, uses `console.warn` for retries, throws on exhaustion.
- **Narrow unknown errors:** `error instanceof Error ? error : new Error('...')` where errors are rethrown or stored (for example `src/lib/api-utils.ts`).
- **Client components:** local `try`/`catch` around async work where user feedback is needed (for example `src/components/ContactForm.client.tsx`, `src/components/CommandPalette.tsx`).

**Validation:**
- Prefer Zod schemas at API boundaries (`z.object`, `.safeParse`) as in `src/pages/api/contact.ts`.

## Logging

**Framework:** `console` (no dedicated logging library in `package.json`).

**Patterns:**
- `console.error` for misconfiguration or hard failures (for example missing env in `src/pages/api/contact.ts`).
- `console.warn` for retry/backoff noise in `src/lib/api-utils.ts`.

## Comments

**When to Comment:**
- File-level or function-level JSDoc on exported utilities where behavior is non-obvious (for example `formatDate`, `calculateReadingTime`, `slugify` in `src/lib/utils.ts`).
- Occasional requirement references in module headers (for example `src/lib/api-utils.ts` mentions "Requirements: 14.6").

**JSDoc/TSDoc:**
- Use `@param` / `@returns` on shared helpers when documenting public API of `src/lib/` exports.

## Function Design

**Size:** No enforced limit; keep handlers readable with early returns for validation failures (see API routes under `src/pages/api/`).

**Parameters:** Prefer explicit options objects for configurable behavior (`RetryOptions` in `src/lib/api-utils.ts`).

**Return Values:** API routes return Web `Response`; utilities return typed primitives or structured data.

## Module Design

**Exports:** Named exports are standard for libraries (`src/lib/utils.ts`); Astro `APIRoute` handlers export named `GET`/`POST`/etc.

**Barrel Files:** Used sparingly — for example `src/types/index.ts` re-exports shared interfaces. There is no DB access barrel; reference DDL lives under `src/lib/db/` without a TS entrypoint.

---

*Convention analysis: 2026-04-12*
