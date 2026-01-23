---
title: "Hardening Node.js: Proto-Injection and the Permission Model"
date: "2024-05-30"
description: "Is your backend secure? Learn how to defend against Prototype Pollution, use the new Node.js Permission Model, and audit your dependencies for supply chain attacks."
slug: "node-js-security-and-hardening-guide"
published: true
tags: ["Backend", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening Node.js: Proto-Injection and the Permission Model

JavaScript's flexibility is its biggest security risk. Here is how to lock down your Node.js production server.

## 1. Prototype Pollution

**The Attack:** A user passes a JSON object like `{"__proto__": {"admin": true}}`.
**The Result:** Every object in your JS environment now has an `admin: true` property.
**The Fix:** Use `Object.freeze(Object.prototype)` or use `Map` instead of raw objects for user-provided keys.

## 2. The Node.js Permission Model (v20+)

You can now restrict what Node.js can access at the OS level.
*   **Command:** `node --experimental-permission --allow-fs-read=/app/data server.js`
*   **The Benefit:** If an attacker compromises your app, they cannot read your `/etc/shadow` or your AWS keys because Node.js simply doesn't have the permission.

## 3. Dependency Auditing

**The Workflow:** `npm audit --audit-level=high` in your CI/CD pipeline.
*   **Supply Chain:** Use **Socket.dev** or **Snyk** to detect "Malicious" packages (e.g., packages that steal environment variables) before they even reach your dev machine.

## 4. Secure Cookies & Headers

*   **Helmet:** Always use `app.use(helmet())` to set secure HTTP headers (HSTS, CSP).
*   **HttpOnly:** Never store session tokens in a cookie that JS can read. Always set `httpOnly: true`.

## Summary

Security in Node.js is about **Restricting Power**. Use the Permission Model to limit the OS access and be obsessive about Prototype Pollution defense.