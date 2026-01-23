---
title: "Securing GitLab CI: Protected Variables and OIDC"
date: "2024-05-30"
description: "How to lock down your pipeline. We cover Protected Variables, Secure Files, and moving from static keys to OIDC authentication."
slug: "gitlab-ci-cd-security-and-hardening-guide"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Securing GitLab CI: Protected Variables and OIDC

The pipeline has the keys to the kingdom. Secure it.

## 1. Protected Variables & Environments

Don't expose Prod keys to feature branches.
*   **The Config:** Mark the `AWS_PROD_KEY` as "Protected."
*   **The Result:** It is only available to jobs running on "Protected Branches" (like `main` or `release/*`).

## 2. OIDC (OpenID Connect)

Just like GitHub, GitLab supports OIDC.
*   **The Workflow:** AWS trusts the GitLab OIDC provider. The runner requests a JWT. AWS exchanges it for a temporary role.
*   **Benefit:** Zero static secrets in GitLab variables.

## 3. Secure Files

Sometimes you need a binary certificate file (e.g., `keystore.jks`), not a text variable.
*   **Feature:** GitLab Secure Files. Upload the binary securely, and it is downloaded into the runner workspace only for the job.

## 4. Runner Security

*   **Privileged Mode:** Avoid using `privileged = true` in your Runner config unless absolutely necessary (Docker-in-Docker). It breaks container isolation.

## Summary

Security in GitLab is granular. Use **Scopes** (Protected Environments) to ensure that a developer working on a `dev` branch can never accidentally (or maliciously) access production secrets.