---
title: "Under the Hood: Next.js Server Components and the RSC Payload"
date: "2024-01-15"
description: "How does React on the server talk to React on the client? A deep dive into the RSC serialization format and the Next.js router state."
slug: "next-js-deep-dive-into-core-internals"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: Next.js Server Components and the RSC Payload

How can a server component return a "Component" to the client without a bundle? The answer lies in the **RSC Payload**.

## 1. Serialization (The RSC Format)

When a Server Component renders, it doesn't return HTML. It returns a special string format that describes the UI tree.
*   **The Bridge:** This format contains "placeholders" for Client Components.
*   **The Client:** The React runtime on the client reads this stream and "hydrates" only the specific spots where interactivity is needed.

## 2. Router Cache vs. Full Route Cache

Next.js uses multiple layers of caching.
*   **Router Cache:** Client-side cache that remembers the last visited pages.
*   **Full Route Cache:** Server-side cache that stores the rendered output of static routes.

## 3. Data Cache (The `fetch` override)

Next.js extends the native `fetch` API to include deduplication and persistence.
*   **Mechanism:** If two components call `fetch('/api/user')`, Next.js only makes one network request and caches the result for the duration of the server render.

## 4. Middleware Edge Runtime

Middleware doesn't run in Node.js; it runs in **V8 Sandbox (Edge)**.
*   **Constraint:** You can't use Node APIs (like `fs`), but you get sub-10ms response times.

## Summary

Next.js is a complex orchestration of **React, V8, and HTTP Caching**. Understanding how the RSC payload is streamed allowed you to debug why certain components are re-rendering or why data feels stale.