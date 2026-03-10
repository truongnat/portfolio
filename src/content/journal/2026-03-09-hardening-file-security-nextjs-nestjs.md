---
title: "Hardening File Security in Next.js & NestJS"
date: 2026-03-09
type: "day"
summary: "Designed and implemented a robust file-validation pipeline for Next.js and NestJS, covering DoS prevention, file spoofing, polyglot detection, and PDF script/action hardening."
tags: ["Security", "Next.js", "NestJS", "File Validation", "PDF", "Upload Pipeline"]
---

Today I focused on **hardening the file upload pipeline** across **Next.js** and **NestJS**, with the goal of blocking malicious files as early as possible in validation.

## What I did

1. **Standardized the security pipeline** across Next.js and NestJS so the same rules apply end-to-end.
2. **Upgraded the validation engine** to check both metadata and real file structure, not just extension.

## Core protection layers

### 1. DoS protection
- Enforced **file-size limits**.
- Added **image dimension / resolution caps** to block resource abuse.
- Included **decompression-bomb** safeguards.

### 2. Path traversal prevention
- Applied **basename sanitization** to prevent `../` and absolute path injection.

### 3. Spoofing detection
- Cross-checked **extension ↔ magic-byte** to catch disguised formats.
- Magic bytes validated:
  - `PNG`: `89 50 4E 47 0D 0A 1A 0A`
  - `JPEG`: `FF D8 FF`
  - `WebP`: `RIFF????WEBP`
  - `PDF`: `%PDF-`

### 4. Polyglot detection
- Verified end markers to detect polyglots:
  - `PNG`: `IEND`
  - `JPEG`: `EOI`
  - `WebP`: valid `RIFF-size`

### 5. PDF hardening
- Checked **PDF version** and **EOF**.
- Scanned **dangerous dictionary keys** that can trigger scripts/actions/embedded files.

### 6. Error transparency
- System errors are **logged and re-thrown as 500** when appropriate.
- Avoided silently converting system failures into `400` that hide root causes.

## Result

The validation pipeline moved from surface checks to **defense-in-depth**, reducing risks such as:
- MIME/extension spoofing.
- Polyglot files bypassing parsers.
- Hidden payloads in PDFs.
- Resource exhaustion via malformed files.

Tomorrow I plan to add test cases per attack class to benchmark coverage and false-positive rates.
