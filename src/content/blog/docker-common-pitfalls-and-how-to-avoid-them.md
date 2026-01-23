---
title: "Docker Pitfalls: Security, Secrets, and the 'Latest' Trap"
date: "2023-12-05"
description: "Why your Docker container is insecure. We explore running as root, leaking secrets in build layers, and the dangers of the ':latest' tag."
slug: "docker-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Docker Pitfalls: Security, Secrets, and the 'Latest' Trap

Containerization solves many problems, but it introduces new ones if you aren't careful.

## 1. Running as Root

**The Pitfall:** The default user in Docker is `root`. If an attacker breaks out of the container, they have root on your host.
**The Fix:** Always switch to a non-root user.
```dockerfile
RUN addgroup --system --gid 1001 nodejs
USER nodejs
```

## 2. The `latest` Tag Trap

**The Pitfall:** `FROM node:latest`.
**The Result:** Your build works today. Tomorrow, Node.js releases v22, and your build breaks.
**The Fix:** Pin your versions. `FROM node:20.9.0-alpine`.

## 3. Leaking Secrets in Layers

**The Pitfall:**
```dockerfile
COPY .env .  # Has AWS Keys
RUN npm install
RM .env      # Deletes it
```
**The Reality:** The `.env` file is still present in the intermediate layer history.
**The Fix:** Use Docker Secrets or inject environment variables at runtime. Never `COPY` sensitive files.

## 4. IP Binding (0.0.0.0 vs 127.0.0.1)

**The Pitfall:** Apps inside Docker default to listening on `127.0.0.1` (localhost).
**The Result:** The container can't be reached from outside.
**The Fix:** Configure your app to bind to `0.0.0.0` inside the container.

## Summary

Docker security is **Layered**. Secure your base image, secure your user permissions, and secure your build process.