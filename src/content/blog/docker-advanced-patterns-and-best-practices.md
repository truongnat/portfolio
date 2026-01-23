---
title: "Advanced Docker: BuildKit, Profiles, and Healthchecks"
date: "2023-11-10"
description: "Mastering the Docker CLI. Learn how to speed up builds with Cache Mounts, manage environments with Profiles, and implement robust Healthchecks."
slug: "docker-advanced-patterns-and-best-practices"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1607799275518-d6c43953e6b0?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Docker: BuildKit, Profiles, and Healthchecks

Most developers stop at `FROM node`. But Docker has a suite of advanced features that can speed up your CI/CD and make your runtime more resilient.

## 1. BuildKit Cache Mounts

Don't re-download `npm install` every time.
*   **The Syntax:** `RUN --mount=type=cache,target=/root/.npm npm ci`
*   **The Benefit:** Docker persists the npm cache on your host machine between builds, making repeated builds near-instant.

## 2. Docker Compose Profiles

You don't always need the full stack.
*   **Use Case:** A `debug` profile that runs Jaeger and Swagger UI, and a `dev` profile that only runs the App and DB.
*   **Command:** `docker compose --profile debug up`

## 3. Robust Healthchecks

A container running doesn't mean it's working.
*   **Pattern:** Add a `HEALTHCHECK` instruction that curls a local `/health` endpoint.
*   **Integration:** Docker Swarm and Kubernetes use this status to automatically restart "Zombie" containers.

## 4. Multi-Architecture Builds (ARM64/AMD64)

With the rise of Apple Silicon (M1/M2), you must build for both `linux/amd64` and `linux/arm64`.
*   **Tool:** `docker buildx build --platform linux/amd64,linux/arm64`

## Summary

Advanced Docker usage is about **Optimization**. Optimizing build time, optimizing developer experience, and optimizing runtime reliability.