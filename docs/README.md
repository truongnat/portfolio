# Documentation index

This folder holds **operational** and **architecture** docs for the portfolio. Start here for domain migration, repo hygiene, and **feature-level** diagrams (PlantUML) with short markdown companions.

## Feature architecture

Each item links to a companion markdown file and a sibling `.puml` diagram under `docs/features/`.

- [Content collections](./features/content-collections.md) — blog, journal, courses via Astro Content Collections
- [Page shell & command palette](./features/page-shell-navigation.md) — `BaseLayout`, `CommandPalette`
- [Public API routes](./features/public-api-routes.md) — grouped `src/pages/api` map
- [Semantic search](./features/semantic-search.md) — LanceDB, embeddings, `journal:index`
- [Contact / Telegram](./features/contact-telegram.md) — `POST /api/contact`
- [Payments & certificates](./features/payments-certificates.md) — Stripe, certificates, crypto stubs

## Operations & migration

- [DOMAIN_MIGRATION.md](./DOMAIN_MIGRATION.md) — Canonical domain (`truongsoftware.com`), nginx/DNS checklist
- [REPO_HYGIENE.md](./REPO_HYGIENE.md) — Ignored paths, dependency notes, disabled routes
