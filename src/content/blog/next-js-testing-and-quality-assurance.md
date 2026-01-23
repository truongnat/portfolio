---
title: "Testing the Modern Stack: Playwright and Vitest in Next.js"
date: "2024-06-30"
description: "How to test Server Components and Server Actions. We explore Playwright for full-page E2E tests and Vitest for fast, isolated unit testing."
slug: "next-js-testing-and-quality-assurance"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Testing the Modern Stack: Playwright and Vitest in Next.js

Traditional React testing libraries struggle with Server Components. We need a new approach.

## 1. End-to-End Testing (Playwright)

Since Server Components render on the server, the only way to truly test the final output is via the browser.
*   **Playwright:** The gold standard for modern E2E testing. It can test your app across different viewports (mobile/desktop) and network speeds.

## 2. Unit Testing Server Components (Vitest)

You don't need a browser to test logic.
*   **Vitest:** A fast, Vite-native testing framework. You can call your Server Component function directly in a test and assert on the returned JSX structure.

## 3. Mocking the Database

Don't call your real DB in unit tests.
*   **The Pattern:** Use **Mock Service Worker (MSW)** to intercept network requests, or use an abstraction layer (Repository Pattern) that you can swap out for a mock class during testing.

## 4. Testing Server Actions

Server Actions are just functions.
*   **Strategy:** Export your action logic into a separate file and test it like a standard Node.js function with mocked database results.

## Summary

Testing Next.js is about **Integration**. Combine Playwright for critical user flows (Login, Checkout) with Vitest for fast, reliable logic checks to ensure your full-stack app is bug-free.