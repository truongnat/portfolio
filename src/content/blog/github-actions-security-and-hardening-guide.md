---
title: "Hardening the Pipeline: Pinned Actions and Environment Protection"
date: "2024-05-28"
description: "Your CI pipeline has root access to your cloud. Learn how to secure it using SHA pinning, Environment Rules, and OIDC auditing."
slug: "github-actions-security-and-hardening-guide"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening the Pipeline: Pinned Actions and Environment Protection

Supply chain attacks often target the build server. If you control the build, you control the production artifact.

## 1. SHA Pinning

Tags are mutable. `v1` can be changed by the author to point to malicious code.
*   **The Fix:** `uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab`.
*   **Tool:** Use **Renovate Bot** to automatically update these hashes.

## 2. Environment Protection Rules

Don't let just anyone deploy to Prod.
*   **The Setup:** Create a `production` environment in GitHub.
*   **The Rule:** Require approval from the "DevOps Team" group before any job referencing this environment can start.

## 3. OIDC Hardening

When trusting a repo in AWS, be specific.
*   **Bad:** Trust `repo:my-org/*` (Any repo can deploy).
*   **Good:** Trust `repo:my-org/my-app:ref:refs/heads/main` (Only the main branch of this specific app can deploy).

## Summary

Security in CI/CD is about **Trust Boundaries**. Define who can deploy, what code they can deploy, and where they can deploy it.