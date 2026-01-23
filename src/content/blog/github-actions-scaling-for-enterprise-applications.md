---
title: "Enterprise GHA: Self-Hosted Runners and Policy Enforcement"
date: "2024-04-22"
description: "Managing CI/CD for 1,000 developers. We discuss Action Runner Controller (ARC), organization secrets, and enforcing compliance policies."
slug: "github-actions-scaling-for-enterprise-applications"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000"
---

# Enterprise GHA: Self-Hosted Runners and Policy Enforcement

In a startup, you just add a secret. In an enterprise, you need governance.

## 1. Action Runner Controller (ARC)

You need to run jobs in your own VPC (for security), but you want the scaling of the cloud.
*   **The Solution:** ARC allows you to run self-hosted runners on **Kubernetes**. It auto-scales pods up and down based on the GitHub job queue.

## 2. Organization Secrets

Don't add `AWS_KEY` to 500 repositories.
*   **The Strategy:** Add it once at the Org level and grant access to specific repositories.

## 3. Required Workflows

You want to ensure *every* deploy runs a security scan.
*   **Policy:** Configure a "Required Workflow" at the Org level. This workflow runs alongside the developer's workflow and blocks the PR if it fails.

## Conclusion

Scaling GHA is about **Centralization**. Centralize your runners, centralize your secrets, and centralize your policies to maintain control without slowing down developers.