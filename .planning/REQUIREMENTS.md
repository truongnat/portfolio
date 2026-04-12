# Requirements: Portfolio (truongsoftware.com)

**Defined:** 2026-04-12 (reset after v1.1 ship)  
**Core value:** Visitors can reliably read your writing, understand your background, and reach you—while the site stays fast, maintainable, and honest to how you build software.

## Next milestone

Requirements for **v1.2+** are not defined yet. Use `/gsd-new-milestone` to capture goals and traceability.

## Candidate backlog (unprioritized)

Pulled forward from prior planning and [.planning/codebase/CONCERNS.md](codebase/CONCERNS.md):

- **Hardening:** rate limiting or equivalent on public POST/search (cf. RATE-01); clarify or flag stub/demo APIs (cf. STUB-01).
- **Experience:** search cold-start / memory (cf. PERF-01).
- **Ongoing:** keep deploy path aligned with Astro; maintain API safety; evolve content without breaking collection contracts.

## Out of scope (unchanged until reconsidered)

| Item | Reason |
|------|--------|
| Framework migration off Astro | Large churn; not a current driver |
| Full automated test suite | Deferred until maintenance cost justifies |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| — | — | Define in next milestone |

---

**Shipped requirements (v1.0 + v1.1):** [.planning/milestones/v1.1-REQUIREMENTS.md](milestones/v1.1-REQUIREMENTS.md)
