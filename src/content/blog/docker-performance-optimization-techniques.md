---
title: "Slimming the Whale: Optimizing Docker Image Size and Build Speed"
date: "2024-03-15"
description: "Is your CI taking 20 minutes? Learn how to optimize Docker layers, choose the right base image (Alpine vs. Distroless), and use .dockerignore effectively."
slug: "docker-performance-optimization-techniques"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Slimming the Whale: Optimizing Docker Image Size and Build Speed

Big images are slow to pull, slow to start, and expensive to store.

## 1. The Base Image Debate

*   **Ubuntu:** Huge (700MB+). Easy to debug.
*   **Alpine:** Tiny (5MB). Uses `musl` instead of `glibc`, which can cause compatibility issues with Python/Node.
*   **Distroless:** The Winner. Contains *only* your app and its runtime dependencies. No shell. Tiny and secure.

## 2. Layer Ordering

Docker caches layers.
*   **Bad:** Copy source code (`.`) -> Install dependencies. (Every code change breaks the cache).
*   **Good:** Copy package.json -> Install dependencies -> Copy source code. (Cache persists unless dependencies change).

## 3. The `.dockerignore` File

Don't copy your `.git` folder, `node_modules`, or `coverage` reports into the build context.
*   **Impact:** Reduces the "Context" size sent to the daemon from 500MB to 5MB.

## 4. Chaining Commands

Each `RUN` instruction creates a new layer.
*   **Bad:**
    ```dockerfile
    RUN apt-get update
    RUN apt-get install -y curl
    ```
*   **Good:**
    ```dockerfile
    RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
    ```
    (Cleans up the cache in the *same* layer).

## Summary

Optimization is about **Hygiene**. Keep your layers clean, your context small, and your base image minimal.