# Phase 8: Feature documentation (PlantUML) — Research

**Researched:** 2026-04-12 (refresh: `/gsd-plan-phase 8 --research`)  
**Requirements:** DOC-01, DOC-02

## PlantUML references (executor)

- **Language:** [PlantUML language reference](https://plantuml.com/) — use **component**, **sequence**, or **deployment** diagrams per feature; avoid experimental preprocessors not supported by common extensions.
- **Delimiters:** Every file must contain `@startuml` … `@enduml` (or `@startditaa` only if ASCII diagrams are explicitly desired — **not** required here).
- **Packages / clusters:** Use `package "Name" { }` or `together { }` to group related nodes in **public-api-routes** and **payments-certificates** diagrams.
- **Participants (sequence):** Prefer `participant "Name" as Alias` for long paths (e.g. `POST /api/contact`).
- **Optional:** `!theme plain` or `skinparam` at top of `.puml` for readable GitHub/Cursor previews — not mandatory for DOC-02.

## In-repo conventions (unchanged contract)

- **Location:** `docs/features/<slug>.puml` next to `docs/features/<slug>.md` (same basename).
- **No CI render:** Source `.puml` files are the deliverable; PNG/SVG export is optional locally.
- **Companions:** Link sibling diagram with a relative path, e.g. `` `content-collections.puml` `` or markdown image `![diagram](./content-collections.puml)` only if your renderer supports it; plain relative links are enough.

## `src/pages/api` inventory (22 `.ts` files — 2026-04-12)

Use this table in **public-api-routes** diagram / companion so stubs vs “core” are explicit.

| Cluster | Files | Notes |
|---------|-------|--------|
| **Core / integrations** | `contact.ts`, `search.ts`, `certificate.ts`, `certificate-issue.ts`, `portfolio.md.ts` | Contact, search, certificate flows |
| **Stripe** | `stripe/webhook.ts`, `stripe/create-payment.ts` | Webhook signature + payment creation |
| **Crypto (stub)** | `crypto/create-payment.ts`, `crypto/qr.ts` | Stub/demo paths — align wording with REPO_HYGIENE |
| **Donations** | `donations.ts` | Donation POST |
| **Demo / stub UIs** | `ai-thank-you/index.ts`, `ai-thank-you/generate.ts`, `bug-bounty/index.ts`, `bug-bounty/submit.ts`, `terminal/index.ts`, `terminal/execute.ts`, `learning-journey/index.ts`, `learning-journey/sponsor.ts`, `auction/index.ts`, `auction/create-bid.ts`, `roadmap/index.ts`, `roadmap/vote.ts` | Many are demo or low-trust; see CONCERNS |

**Count check:** 22 files — same as prior research; no new routes since last plan.

## Feature area → code anchors

| Area | Primary paths | Diagram suggestion |
|------|----------------|-------------------|
| Content collections | `src/content.config.ts`, `src/content/schemas.ts`, `src/content/{blog,journal,courses}/` | Component: collections → loader → schema → pages |
| Page shell & navigation / command palette | `src/layouts/BaseLayout.astro`, `src/components/CommandPalette.tsx` | Component or sequence: layout → island → cmdk |
| Public API routes | `src/pages/api/**/*.ts` (see table above) | Component with **packages** per cluster |
| Semantic search | `src/pages/api/search.ts`, `scripts/index-content.ts`, `data/lancedb` | Sequence or deployment: index script → DB → API |
| Contact / Telegram | `src/pages/api/contact.ts`, env `TELEGRAM_*` | Sequence: client → API → Telegram |
| Payments & certificates | `stripe/*`, `certificate*.ts`, `src/lib/certificate-generator.ts`, `crypto/*` | Component + notes on HMAC / webhook secrets |

## Indexing script (search)

- **Package script:** `bun run journal:index` → `bun scripts/index-content.ts` (per `package.json`).
- **Behavior:** Embeds blog/journal (and related) content into LanceDB under `data/lancedb` using `@xenova/transformers` — mention cold-start / local `data/` in companion.

## Existing docs to index (DOC-01)

- `docs/DOMAIN_MIGRATION.md`
- `docs/REPO_HYGIENE.md` (disabled routes + dependency notes)

## Disabled pages (not API — for cross-reference only)

Listed in `docs/REPO_HYGIENE.md` — do not imply these ship as routes; **public-api-routes** doc should clarify API stubs separately from `.astro.disabled` pages.

## Risks

- **Stale diagrams:** Add one line in each companion: “Regenerate if `src/pages/api/` layout changes materially.”
- **Scope creep:** Docs only — no behavior changes.

## Validation Architecture

> Phase 8 is **documentation-only**. Gates: **file presence**, **required headings/links**, **`bun run verify`** unchanged.

### What “done” means

| Gate | Pass criterion |
|------|----------------|
| **DOC-01** | `docs/README.md` links every feature companion + `DOMAIN_MIGRATION.md` + `REPO_HYGIENE.md`; root `README.md` has `## Feature architecture` linking to `docs/README.md` or `docs/`. |
| **DOC-02** | Six slugs under `docs/features/`: each `.puml` has `@startuml`/`@enduml`; each `.md` references its diagram and key files. |

### Commands

| Step | Command |
|------|---------|
| Health | `bun run verify` |
| Count | `ls docs/features/*.puml \| wc -l` → 6; same for `.md` |

### Phase requirements → verification map

| Req ID | Verification |
|--------|----------------|
| DOC-01 | `grep '## Feature architecture' README.md`; link check in `docs/README.md` |
| DOC-02 | Six pairs exist; `grep -l @startuml docs/features/*.puml \| wc -l` → 6 |

### Wave 0 gaps

- None.

---

## RESEARCH COMPLETE
