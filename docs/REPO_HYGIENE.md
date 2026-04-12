# Repository hygiene

Non-committed paths, dependency choices, and **disabled** Astro pages are documented here so the repo matches what ships.

## Ignored paths (see root `.gitignore`)

| Pattern | Purpose |
|---------|---------|
| `dist/`, `.astro/` | Build output and generated types |
| `node_modules/` | Dependencies |
| `.env`, `.env.production`, `.env.local`, `.env.*.local` | Secrets and local overrides |
| `*.pem` | SSH/private keys (any filename) |
| `data/` | Local LanceDB index and generated data (`data/lancedb` — rebuild with `bun run journal:index` / indexing scripts) |
| `.gitnexus/` | Local GitNexus graph index |

## Dependencies (Phase 7 audit)

**Removed** (no `import` in `src/` or `scripts/`; confirmed before removal):

- `@ai-sdk/google`, `@ai-sdk/react`, `ai`, `@google/generative-ai` — unused AI SDK stubs
- `@astrojs/cloudflare` — deploy uses `@astrojs/node` (`astro.config.mjs`)
- `@tanstack/react-query` — only appeared in blog markdown examples, not app code
- `@radix-ui/react-toast` — no UI usage
- `d3`, `recharts`, `simple-icons` — no app imports (blog prose may mention similar libs)
- `react-force-graph-2d` — only `react-force-graph-3d` is used (`KnowledgeGraph.client.tsx`)
- `@nanostores/react` (alias `ai/react`) — no imports anywhere

**Moved to devDependencies**

- `@astrojs/check` — used by `bun run check` / `astro check`, not runtime

**Tooling**

- Unused dependency scan: `bunx depcheck` (expect false positives for Astro virtual modules; cross-check with grep before removing).

## Disabled routes (`*.astro.disabled`)

These files are **not** served as routes until renamed to `.astro`. They keep experimental or paused UIs out of production builds.

| File | Notes |
|------|--------|
| `src/pages/learning-journey.astro.disabled` | Learning journey experiment |
| `src/pages/code-review-auction.astro.disabled` | Code review / auction demo |
| `src/pages/ai-thank-you.astro.disabled` | AI thank-you placeholder |
| `src/pages/bug-bounty.astro.disabled` | Bug bounty UI |
| `src/pages/skill-tree.astro.disabled` | Skill tree (public) |
| `src/pages/admin/skill-tree.astro.disabled` | Skill tree admin |

To re-enable: rename to `.astro`, fix imports, run `bun run verify`.

## Related

- [DOMAIN_MIGRATION.md](./DOMAIN_MIGRATION.md) — canonical domain and server checklist
