# Domain migration: truongdq.com → truongsoftware.com

**Cutover (repo):** Application canonical URL, Astro `site`, SEO fallbacks, OG branding, nginx `server_name`, and preview docs now target **`https://truongsoftware.com`** (and **`preview.truongsoftware.com`** for the password-protected preview).

## Operator checklist (Cloudflare Workers)

1. **Worker** — `wrangler deploy` publishes the Astro build. The apex custom domain is `truongsoftware.com` (`routes` in `wrangler.json`). Do not point an A record at a VPS.
2. **www** — Redirect `www.truongsoftware.com` to the apex with a proxied placeholder record and a 301 rule. Do not attach `www` as a second site.
3. **Email** — Leave the existing Email Routing MX and SPF TXT records on the apex in place.
4. **Secrets** — `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are Worker secrets, not files in the repo.
5. **Legacy domain** — If `truongdq.com` still resolves, configure **301 redirects** to `https://truongsoftware.com` (optional; not committed here).

## Intentional non-migration strings

These are **not** the old public site hostname and were left unchanged:

- GitHub username **`truongdq01`** in profile/OG image URLs
- Personal email **`truongdq.dev@gmail.com`**
- Third-party project URLs (e.g. Vercel preview names) that contain `truongdq` as part of a project slug

## Planning / history

Older roadmap and milestone text may still mention the migration narrative (e.g. “migrated from truongdq.com”). That is documentation of the change, not a live config reference.
