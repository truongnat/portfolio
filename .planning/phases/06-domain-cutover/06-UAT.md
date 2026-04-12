---
status: testing
phase: 06-domain-cutover
source:
  - 06-01-SUMMARY.md
  - 06-02-SUMMARY.md
started: "2026-04-12T00:00:00.000Z"
updated: "2026-04-12T00:00:00.000Z"
---

## Current Test

number: 1
name: Built site canonical and meta URLs
expected: |
  Run `bun run build` then `bun run preview` (or use your deployed site). Open the homepage. View page source or DevTools Elements: the canonical link (`rel="canonical"`) and any absolute site URLs in meta/JSON-LD use `https://truongsoftware.com` — not `truongdq.com`.
awaiting: user response

## Tests

### 1. Built site canonical and meta URLs
expected: Homepage (preview or production) shows canonical/meta using https://truongsoftware.com
result: [pending]

### 2. Blog post absolute URL
expected: Open any blog post; the location bar or “copy link” URL uses the truongsoftware.com origin (with preview, same host you opened — no truongdq.com in path/host).
result: [pending]

### 3. OG image branding text
expected: Open an OG image route such as /og/blog/<any-published-slug>.png — the rendered image shows the site label truongsoftware.com (not truongdq.com).
result: [pending]

### 4. DOMAIN_MIGRATION.md
expected: docs/DOMAIN_MIGRATION.md exists, reads clearly, and mentions DNS/TLS checklist for truongsoftware.com (and preview subdomain).
result: [pending]

### 5. Nginx and PREVIEW_SETUP hostnames
expected: In-repo nginx.conf server_name and PREVIEW_SETUP.md certbot/DNS examples use truongsoftware.com and preview.truongsoftware.com (not old host).
result: [pending]

### 6. Journal code sample email
expected: Journal entry “DRY, KISS, YAGNI…” shows the Resend example with from: noreply@truongsoftware.com in the code block.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0
blocked: 0

## Gaps

<!-- Populated when a test result is issue -->
