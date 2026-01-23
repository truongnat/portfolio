---
title: "GitLab CI Pitfalls: Cache vs. Artifacts and Runner Tagging"
date: "2023-12-15"
description: "Why your build is slow and your artifacts are missing. We clarify the difference between Cache and Artifacts and solve runner scheduling issues."
slug: "gitlab-ci-cd-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# GitLab CI Pitfalls: Cache vs. Artifacts and Runner Tagging

GitLab CI is intuitive, but there are subtle distinctions that trip up even senior engineers.

## 1. Cache vs. Artifacts

This is the #1 confusion point.
*   **Cache:** For dependencies (`node_modules`). It is **best-effort**. It might not be there. It stays on the runner (or S3).
*   **Artifacts:** For build outputs (`dist/`, `jar`). It is **guaranteed** to be passed to the next stage. It is uploaded to the GitLab server.
*   **The Pitfall:** Trying to "Cache" your build output. If the cache miss happens, your deploy stage fails.

## 2. Runner Tagging Hell

**The Pitfall:** A job is "stuck" pending.
**The Cause:** You added `tags: [docker, linux]` but no runner has *both* tags.
**The Fix:** Be specific. Use tags to target capabilities (e.g., `gpu`, `high-memory`), not generic labels.

## 3. The `git clean` Surprise

**The Pitfall:** Your build fails because of leftover files from a previous run.
**The Cause:** GitLab Runners re-use the workspace by default.
**The Fix:** Configure `GIT_STRATEGY: fetch` (faster) but ensure your build script runs `git clean -fdx` or `npm ci` to ensure a pristine state.

## 4. Secret Leaks in Logs

**The Pitfall:** `echo $MY_SECRET_KEY` to debug.
**The Fix:** GitLab tries to mask secrets, but don't rely on it. Never print secrets. Use `script` masking or OIDC.

## Summary

GitLab CI is powerful because it is flexible. Understanding the lifecycle of a Job—how it fetches code, caches files, and uploads artifacts—is key to debugging.