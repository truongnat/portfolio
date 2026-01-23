---
title: "Advanced GitHub Actions: Composite Actions and Reusable Workflows"
date: "2023-11-15"
description: "Don't copy-paste YAML. Learn how to DRY up your CI/CD using Composite Actions and Reusable Workflows."
slug: "github-actions-advanced-patterns-and-best-practices"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1607799275518-d6c43953e6b0?auto=format&fit=crop&q=80&w=1000"
---

# Advanced GitHub Actions: Composite Actions and Reusable Workflows

YAML is verbose. As your pipelines grow, you will find yourself copy-pasting the same 20 lines of "Setup Node + Cache + Install" across every repo. Stop doing that.

## 1. Composite Actions (Local DRY)

A **Composite Action** allows you to bundle multiple steps into one action.
*   **Use Case:** A standard `setup-and-install` action that handles Node setup, caching, and `npm ci` in one line.

```yaml
# actions/setup/action.yml
name: 'Setup Node'
runs:
  using: "composite"
  steps:
    - uses: actions/setup-node@v3
    - run: npm ci
      shell: bash
```

## 2. Reusable Workflows (Global DRY)

You can call a workflow from *another* workflow.
*   **Use Case:** A centralized `deploy-to-aws.yml` workflow that enforces security checks. Every microservice calls this central workflow instead of defining its own deployment logic.

## 3. Dynamic Matrix

You don't have to hard-code your matrix. You can generate it using JSON.
*   **The Power:** A script that scans your repo for `package.json` files and dynamically creates a parallel build job for each one (Monorepo support).

## Summary

Advanced GHA is about **Abstraction**. Treat your CI configuration like code. Refactor it, modularize it, and share it across your organization.