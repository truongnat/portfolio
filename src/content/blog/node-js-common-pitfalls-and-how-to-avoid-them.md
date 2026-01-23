---
title: "Node.js Pitfalls: Event Loop Blocking and Ghost Memory Leaks"
date: "2023-12-10"
description: "Why is your server hanging? We explore the top Node.js killers: expensive synchronous calls, closures that never die, and unhandled promise rejections."
slug: "node-js-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Backend", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Node.js Pitfalls: Event Loop Blocking and Ghost Memory Leaks

The very things that make Node.js fast (Event Loop, Closures) are also the most common sources of production failures.

## 1. Blocking the Event Loop (The #1 Killer)

**The Pitfall:** `JSON.parse()` on a 50MB string or a heavy `while` loop.
**The Result:** The entire server stops. It can't even respond to a health check or a ping.
**The Fix:** Break heavy work into chunks using `setImmediate()` or offload to a **Worker Thread**.

## 2. Ghost Memory Leaks (Closures)

**The Pitfall:** Attaching a listener to `process` or a global object inside a request handler.
**The Risk:** Every request adds a new listener. The memory grows until the process crashes.
**The Fix:** Always use `removeListener` or use `AbortController` to auto-cleanup when the request finishes.

## 3. Unhandled Rejections & Exceptions

**The Pitfall:** `async` functions without `try/catch`.
**The Result:** Node.js 15+ will exit the process by default.
**The Fix:** Use a global handler for `unhandledRejection` and `uncaughtException`, but only to log and exit cleanly. Never "ignore" them.

## 4. `npm install` Security Hole

**The Pitfall:** Running `npm install` without checking for malicious scripts.
**The Fix:** Use `npm ci --ignore-scripts` in your Dockerfile to prevent dependencies from running arbitrary code on your build server.

## Summary

Success with Node.js is about **Asynchronous Discipline**. Protect the event loop at all costs and be obsessive about cleaning up your event listeners and timers.