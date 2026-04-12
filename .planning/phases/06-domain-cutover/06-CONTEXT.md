# Phase 6: Domain cutover — Context

**Gathered:** 2026-04-12  
**Status:** Planned  
**Source:** Roadmap Phase 6, REQUIREMENTS DOM-01 / DOM-02, repo grep

## Phase boundary

Align **canonical public identity** with **`https://truongsoftware.com`**: Astro `site`, SEO helpers, layout fallbacks, OG image branding text, and operator-facing **nginx** / **preview** documentation. Satisfy **DOM-02** by eliminating stray **`truongdq.com`** from **application source** and **deployment docs**, while allowing **archived content** or **explicit migration notes** to mention the legacy domain when called out in **`docs/`**.

**In scope**

- `astro.config.mjs` `site`
- `src/lib/config.ts` `seo.url` and any other **site canonical** field pointing at the old domain
- `BaseLayout.astro`, `Schema.astro`, `blog/[...slug].astro` fallbacks when `Astro.site` is absent
- `src/pages/og/[...path].png.ts` visible domain string
- Shared constant (recommended) so fallback URLs cannot drift from `site` again
- `nginx.conf`, `PREVIEW_SETUP.md`
- Planning reference docs that still say `site: https://truongdq.com` (STACK, gsd-project)
- Short **`docs/`** migration note listing intentional legacy references (e.g. journal narrative)

**Out of scope**

- Renaming GitHub username / `truongdq01` URLs (not `truongdq.com`)
- Changing personal email `truongdq.dev@gmail.com` (different string than `truongdq.com`)
- DNS purchase or TLS execution on the live host (document only)

## Implementation decisions (locked)

- **Single canonical string** for TypeScript/Astro fallbacks: one exported constant (e.g. in `src/lib/config.ts` or `src/lib/site.ts`) used wherever `Astro.site || '…'` appears today.
- **Journal example** `noreply@truongdq.com` in frontmatter/code sample: either update to a **`truongsoftware.com`**-style example **or** leave unchanged and **list the file** in the migration note as historical (DOM-02 allows archived exceptions when documented).

## Canonical references

- `.planning/ROADMAP.md` — Phase 6 success criteria
- `.planning/REQUIREMENTS.md` — DOM-01, DOM-02

---
*Phase: 06-domain-cutover*
