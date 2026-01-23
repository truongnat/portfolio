---
title: "Speeding Up CI: Caching, Artifacts, and Parallelism"
date: "2024-03-18"
description: "Is your build taking 20 minutes? Learn how to optimize GitHub Actions cache, reduce artifact upload times, and run jobs in parallel."
slug: "github-actions-performance-optimization-techniques"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Speeding Up CI: Caching, Artifacts, and Parallelism

Developer time is expensive. Waiting for builds is a waste of money.

## 1. Advanced Caching

`actions/cache` is good, but it's not perfect.
*   **The Trick:** Cache both `~/.npm` (download cache) AND `node_modules` (install cache) if you have a stable lockfile.
*   **Fallback Keys:** Always provide restore keys so you can download a "mostly correct" cache even if the lockfile changed slightly.

## 2. Artifact Strategy

Don't upload `node_modules` as an artifact to pass to the next job. It's slow (zipped upload/download).
*   **The Fix:** Re-install (using cache) in the next job. It's often faster than downloading a 500MB artifact.

## 3. Fail Fast

**The Config:** `fail-fast: true` in your matrix strategy.
*   **The Result:** If Node 14 fails, don't waste money finishing the Node 16 and 18 builds. Kill them immediately.

## 4. Runner Sizing

For massive compilations (Rust/C++), the standard 2-core runner is too slow.
*   **The Fix:** Use **Larger Runners** (4-core or 8-core) for specific jobs. You pay more per minute, but you use fewer minutes.

## Summary

Optimization is about **Throughput**. Measure your "Time to Feedback" and ruthlessly eliminate wait times.