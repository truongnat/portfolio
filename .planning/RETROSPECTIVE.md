# Retrospective

Cross-milestone notes for the portfolio GSD workflow.

## Milestone: v1.1 — Domain, housekeeping & feature documentation

**Shipped:** 2026-04-12  
**Phases:** 1–8 | **Plans:** 16

### What shipped

- Hardening: verify pipeline, Stripe/certificate boundaries, safe API errors, honest demo routes, content + contact path.
- Branding: single canonical site URL and migration documentation.
- Repo: dependency audit, ignore hygiene, disabled-route documentation.
- Docs: PlantUML feature maps with committed SVG previews for GitHub readers.

### What worked

- Phased CONCERNS ordering (build → security → data → UX) reduced thrash.
- Traceability tables in REQUIREMENTS kept execution aligned with roadmap IDs.

### Carry forward

- Backlog items (rate limits, stub API clarity, search ops) live in CONCERNS and the reset REQUIREMENTS candidate list.
- Optional: run `/gsd-audit-milestone` before the next major ship if scope grows.

---

## Cross-milestone trends

| Theme | Notes |
|-------|--------|
| Documentation | Prefer committed SVG + `docs:diagrams` over viewer-only `.puml` |
