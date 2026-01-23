---
title: "Testing the Workflow: Linting, Local Runs, and Action Tests"
date: "2024-06-25"
description: "Don't debug by 'commit and push'. Learn how to run GHA locally with 'act', lint your YAML, and write integration tests for custom actions."
slug: "github-actions-testing-and-quality-assurance"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Testing the Workflow: Linting, Local Runs, and Action Tests

"Commit 1: Fix CI", "Commit 2: Fix CI again". We've all been there. There is a better way.

## 1. Local Testing with `act`

**`nektos/act`** runs your workflow locally using Docker.
*   **The Command:** `act push`.
*   **The Benefit:** Fast feedback loop. Test your environment variables and shell scripts without waiting for a cloud runner.

## 2. YAML Linting (`actionlint`)

`actionlint` is a static analyzer for GHA.
*   **What it catches:** Syntax errors, deprecated commands, quoting issues, and shell script bugs (using ShellCheck).

## 3. Testing Custom Actions

If you write a composite action, test it.
*   **The Strategy:** Create a separate workflow file `test-action.yml`.
*   **The Job:** Call your action, then run a script to verify it did what it claimed (e.g., check if a file exists).

## Summary

Treat your pipeline as software. It deserves unit tests (linting), integration tests (act), and end-to-end tests (test workflows).