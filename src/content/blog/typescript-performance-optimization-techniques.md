---
title: "Optimizing the Compiler: Speeding Up Your TypeScript Build"
date: "2024-03-18"
description: "Is your VS Code lagging? Learn how to use Project References for modularity, enable incremental builds, and avoid 'Type Gymnastics' that crash the compiler."
slug: "typescript-performance-optimization-techniques"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Optimizing the Compiler: Speeding Up Your TypeScript Build

As a codebase grows, the TypeScript compiler (`tsc`) can become slow, leading to "Red squiggles" taking seconds to appear.

## 1. Project References

Don't treat your app as one big pile of code.
*   **The Strategy:** Break your app into independent sub-projects (e.g., `core`, `api`, `web`).
*   **The Benefit:** When you change `api`, TypeScript only re-checks that sub-project. It uses the pre-built `.d.ts` files from `core` without re-parsing it.

## 2. Enabling Incremental Builds

*   **Config:** `"incremental": true`.
*   **Mechanism:** TypeScript creates a `.tsbuildinfo` file that tracks which files have changed. Subsequent builds are 10x faster because they only check the "Dirty" files.

## 3. Avoiding Excessive Recursion

*   **The Pitfall:** Complex recursive types (like deep-merging or complex route parsers) can hit the compiler's stack limit.
*   **The Fix:** Limit the depth of your types. Use simpler, flat structures where possible. If a type needs more than 50 lines of "logic," it's too complex.

## 4. `skipLibCheck`

*   **Config:** `"skipLibCheck": true`.
*   **The Benefit:** Tells TS to NOT re-check the types inside `node_modules`. Since you can't fix errors in your dependencies anyway, skipping this saves massive amounts of time.

## Summary

Build performance is a **Developer Productivity** feature. By using Project References and Incremental builds, you keep your IDE snappy and your CI pipelines fast, even in a million-line monorepo.