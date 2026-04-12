# Phase 8: Feature documentation (PlantUML) — Research

**Researched:** 2026-04-12  
**Requirements:** DOC-01, DOC-02

## PlantUML in-repo conventions

- **Location:** `docs/features/*.puml` alongside `*.md` companions (same basename) keeps diagrams diffable and reviewable without a build step.
- **Syntax:** Use `@startuml` / `@enduml` (or `@startmindmap` only if a feature truly fits; prefer component/sequence for architecture).
- **IDE:** VS Code / Cursor PlantUML extension can preview; optional CLI `plantuml.jar` not required for phase completion — **file existence + valid delimiters** are the contract.
- **Linking:** Companions reference the sibling `.puml` with a fenced block or relative path `!./feature-name.puml` for readers who render locally.

## Feature area → code anchors (for accurate diagrams)

| Area | Primary paths |
|------|----------------|
| Content collections | `src/content.config.ts`, `src/content/schemas.ts`, `src/content/{blog,journal,courses}/` |
| Page shell & navigation / command palette | `src/layouts/BaseLayout.astro`, `src/components/CommandPalette.tsx`, shared UI under `src/components/` |
| Public API routes | `src/pages/api/**/*.ts` (22 TS entrypoints under `src/pages/api/`) |
| Semantic search | `src/pages/api/search.ts`, `scripts/index-content.ts`, LanceDB under `data/` (local) |
| Contact / Telegram | `src/pages/api/contact.ts`, env `TELEGRAM_*` |
| Payments & certificates | `src/pages/api/stripe/webhook.ts`, `create-payment.ts`, `src/pages/api/certificate.ts`, `certificate-issue.ts`, `src/lib/certificate-generator.ts`, `src/pages/api/crypto/*` |

## Existing docs

- `docs/` currently has `DOMAIN_MIGRATION.md`, `REPO_HYGIENE.md` — new `docs/README.md` must index these **and** feature companions.

## Risks

- **Stale diagrams:** Companions should name files explicitly and note "verify paths if refactoring."
- **Scope creep:** Do not rewrite app code; documentation only.

## Validation Architecture

> Phase 8 is **documentation-only**; no new test framework. Verification is **file presence**, **link integrity in markdown**, and **`bun run verify`** unchanged.

### What “done” means

| Gate | Pass criterion |
|------|----------------|
| **DOC-01** | `docs/README.md` exists and contains relative links to every feature companion **and** to `DOMAIN_MIGRATION.md`, `REPO_HYGIENE.md`; root `README.md` contains section `## Feature architecture` with link to `docs/`. |
| **DOC-02** | For each of the six feature areas, `docs/features/<slug>.puml` and `docs/features/<slug>.md` exist; each `.puml` has `@startuml` and `@enduml`. |

### Commands

| Step | Command | Notes |
|------|---------|--------|
| Verify repo health | `bun run verify` | Must exit 0 after doc-only changes |
| Spot-check files | `ls docs/features/*.puml docs/features/*.md` | Expect 6 of each |

### Test framework

| Property | Value |
|----------|-------|
| Framework | None (docs phase) |
| Quick run | `bun run verify` |
| Full suite | Same |

### Phase requirements → verification map

| Req ID | Verification |
|--------|----------------|
| DOC-01 | Grep `README.md` for `## Feature architecture`; read `docs/README.md` for link list |
| DOC-02 | Six `.puml` + six `.md` under `docs/features/` per REQUIREMENTS naming |

### Wave 0 gaps

- None — no test runner install required

---

## RESEARCH COMPLETE
