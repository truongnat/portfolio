---
title: "Testing the Container: Linting, Structure Tests, and Testcontainers"
date: "2024-06-30"
description: "How to write tests for your Dockerfile. We explore Hadolint, Google's Container Structure Tests, and integration testing with Testcontainers."
slug: "docker-testing-and-quality-assurance"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Testing the Container: Linting, Structure Tests, and Testcontainers

We test our code; why don't we test our environment?

## 1. Linting with Hadolint

Catch bad practices before you build.
*   **Check:** "Did you forget to pin a version?" "Did you use `sudo`?"
*   **Integration:** Run `hadolint Dockerfile` in your CI pipeline.

## 2. Container Structure Tests

Verify the final image state.
*   **Tool:** Google Container Structure Tests.
*   **The Test:** "Does `/app/server.js` exist?" "Is the user `nodejs`?" "Does `python --version` return 3.9?"

## 3. Testcontainers (Integration Testing)

Spin up real dependencies (Postgres, Redis) in Docker during your Java/Go/Node tests.
*   **Benefit:** No more mocking the database. Test against the real thing, ephemeral and isolated for every test run.

## 4. Scanning for "Drift"

Regularly re-scan your production images. A "clean" image today might have a "Zero-Day" discovered tomorrow.

## Summary

Testing containers ensures **Contract Validity**. It proves that the artifact you are shipping actually contains what you think it contains.