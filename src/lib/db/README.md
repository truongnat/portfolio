# Database reference (not bound in this deployment)

This folder holds **reference DDL** for a possible future **Cloudflare D1** (or compatible SQL) deployment for donations, skills, and related tables.

- **`schema.sql`** — table definitions; use with `wrangler d1 execute` or your SQL migration tool when/if you add a real database binding.
- **Runtime:** The site ships with **`@astrojs/node`**. There is **no** `env.DONATE_DB` (or similar) wired in this repository. The TypeScript D1 helper module that previously lived here was **removed** (Phase 4, DATA-02) so the codebase does not imply live persistence without bindings.

For embedded search and vectors, the app uses **LanceDB** under `data/lancedb/` (see `scripts/index-content.ts` and `src/pages/api/search.ts`).
