# Phase 6: Domain cutover — Research

**Researched:** 2026-04-12  
**Requirements:** DOM-01, DOM-02

## Current `truongdq.com` touchpoints (execute-phase will re-verify)

| Area | File / location | Notes |
|------|-----------------|--------|
| Astro `site` | `astro.config.mjs` | `site: 'https://truongdq.com'` |
| SEO config | `src/lib/config.ts` | `seo.url` |
| Layout / Schema / blog | `BaseLayout.astro`, `Schema.astro`, `blog/[...slug].astro` | Fallback when `Astro.site` falsy |
| OG image | `src/pages/og/[...path].png.ts` | Branding text `truongdq.com` |
| Nginx | `nginx.conf` | `server_name` production + preview subdomain |
| Preview docs | `PREVIEW_SETUP.md` | DNS + certbot hostnames |
| Planning | `.planning/codebase/STACK.md`, `.cursor/rules/gsd-project.md` | Documented old `site` URL |
| Content | `src/content/journal/2026-03-18-dry-kiss-yagni-technical-writing.md` | Example `noreply@truongdq.com` in code block |

## Not in scope for string replacement

- `truongdq.dev@gmail.com`, `truongdq01` (GitHub), Vercel project URLs containing `truongdq` — not the **`truongdq.com`** hostname requirement.

## Risks

- **Preview subdomain:** Changing `preview.truongdq.com` → `preview.truongsoftware.com` requires **DNS** and **TLS** on the operator side; docs must state that clearly.
- **301 / redirects:** Old domain may still receive traffic; nginx/DNS redirect from legacy host to new is **ops** (mention in migration note, optional server block not required in repo if not used).

## Validation

- `bun run verify`
- `rg 'truongdq\.com'` — only matches migration doc + explicitly listed exceptions (and planning history if excluded from DOM-02 scope — prefer to update planning to new URL)

---
*Phase: 06-domain-cutover*
