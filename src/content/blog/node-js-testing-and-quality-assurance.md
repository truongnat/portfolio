---
title: "Testing Node.js: Native Runners, Mocks, and Integration"
date: "2024-06-25"
description: "How to build a bulletproof backend. We cover the new Node.js native test runner, mocking network calls with MSW, and integration testing with real databases."
slug: "node-js-testing-and-quality-assurance"
published: true
tags: ["Backend", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Testing Node.js: Native Runners, Mocks, and Integration

Testing in Node.js has never been faster. With the new native runner, you don't even need Jest or Mocha anymore.

## 1. The Native Test Runner (v20+)

Node.js now has a built-in `node:test` module.
*   **The Benefit:** Zero dependencies and near-instant startup.
*   **Usage:**
    ```javascript
    import { test } from 'node:test';
    import assert from 'node:assert';

    test('it should calculate total', (t) => {
      assert.strictEqual(add(1, 2), 3);
    });
    ```

## 2. Mocking Everything

*   **Network:** Use **Mock Service Worker (MSW)**. It intercepts `fetch` calls at the network level, allowing you to test "Offline" or "500 Error" scenarios realistically.
*   **Timers:** Use `sinon` or `jest.useFakeTimers()` to test logic that depends on `setTimeout` without actually waiting for minutes.

## 3. Integration Testing (Testcontainers)

Don't mock your database. Use a real one.
*   **The Strategy:** Use `testcontainers-node` to spin up a Docker container with PostgreSQL for every test suite.
*   **Result:** You catch real issues (like syntax errors in SQL) that mocks would miss.

## 4. Code Coverage

*   **The Command:** `node --experimental-test-coverage --test`.
*   **The Rule:** Aim for 80%+ coverage, but focus on the "Happy Path" and "Edge Case" logic rather than generic boilerplate.

## Summary

Quality in Node.js is about **Realism**. Use the native runner for speed, but use Testcontainers for accuracy to ensure your backend works exactly as expected in production.