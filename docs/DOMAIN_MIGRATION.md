# Domain migration: truongdq.com → truongsoftware.com

**Cutover (repo):** Application canonical URL, Astro `site`, SEO fallbacks, OG branding, nginx `server_name`, and preview docs now target **`https://truongsoftware.com`** (and **`preview.truongsoftware.com`** for the password-protected preview).

## Operator checklist (production host)

1. **DNS** — Point `truongsoftware.com`, `www.truongsoftware.com`, and `preview.truongsoftware.com` A records to your server (e.g. Lightsail IP), or CNAME as your provider requires.
2. **TLS** — Run certbot (or equivalent) for those hostnames; see `PREVIEW_SETUP.md` for an example `certbot --nginx` line.
3. **Nginx** — Deploy updated `nginx.conf` from the repo and `nginx -t && systemctl reload nginx`.
4. **Legacy domain** — If `truongdq.com` still resolves, configure **301 redirects** to `https://truongsoftware.com` at DNS or nginx (optional; not committed here).

## Intentional non-migration strings

These are **not** the old public site hostname and were left unchanged:

- GitHub username **`truongdq01`** in profile/OG image URLs
- Personal email **`truongdq.dev@gmail.com`**
- Third-party project URLs (e.g. Vercel preview names) that contain `truongdq` as part of a project slug

## Planning / history

Older roadmap and milestone text may still mention the migration narrative (e.g. “migrated from truongdq.com”). That is documentation of the change, not a live config reference.
