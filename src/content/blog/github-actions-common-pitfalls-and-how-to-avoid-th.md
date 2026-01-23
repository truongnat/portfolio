---
title: "GitHub Actions Pitfalls: Security Leaks and Billing Explosions"
date: "2023-12-10"
description: "The hidden dangers of CI/CD. We explore the 'pull_request_target' security hole, infinite loops, and how to avoid a $1,000 bill."
slug: "github-actions-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# GitHub Actions Pitfalls: Security Leaks and Billing Explosions

GitHub Actions is powerful, but it gives you enough rope to hang yourself (and your wallet).

## 1. The `pull_request_target` Trap

**The Pitfall:** Using `on: pull_request_target` combined with an explicit checkout of the PR code.
**The Risk:** This runs in the context of the *base* repo (with access to secrets). A malicious actor can submit a PR that changes the build script to print your secrets.
**The Fix:** Never check out PR code in a `pull_request_target` workflow. Only use it for labeling or commenting.

## 2. Third-Party Action Risks

**The Pitfall:** `uses: some-stranger/cool-action@master`.
**The Risk:** The author can push malicious code to `master` anytime.
**The Fix:** Pin to a SHA. `uses: some-stranger/cool-action@a1b2c3d`.

## 3. Billing Explosions (MacOS Runners)

**The Pitfall:** Using `runs-on: macos-latest` for everything.
**The Reality:** MacOS runners cost 10x more than Linux runners.
**The Fix:** Only use Mac runners for iOS builds. Use Linux for everything else.

## 4. Infinite Loops

**The Pitfall:** A workflow that commits to the repo, which triggers the workflow again.
**The Fix:** Use `[skip ci]` in the commit message or use a Personal Access Token (PAT) that ignores its own commits.

## Summary

Security in CI/CD is critical. A compromised workflow is a compromised production environment.