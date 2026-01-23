---
title: "Securing Next.js: Server Actions and CSRF Protection"
date: "2024-05-25"
description: "The App Router changes the security model. Learn how to protect your Server Actions, implement strict CSP headers, and secure your session cookies."
slug: "next-js-security-and-hardening-guide"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Securing Next.js: Server Actions and CSRF Protection

Server Actions are convenient, but they are also exposed endpoints that an attacker can call directly.

## 1. Server Action Authorization

Never assume a Server Action is safe because it's "not an API."
*   **The Fix:** Always check the user's session *inside* the server action function before performing any DB operations.

## 2. Content Security Policy (CSP)

Prevent malicious scripts from running in your user's browser.
*   **The Strategy:** Use Next.js Middleware to inject a strict `Content-Security-Policy` header. Only allow scripts from your domain and trusted providers (like Stripe or Google Analytics).

## 3. The `next-safe-action` Library

Instead of writing raw Server Actions, use a wrapper like `next-safe-action` to handle validation (Zod) and error reporting consistently.

## 4. Secure Environment Variables

Next.js separates `NEXT_PUBLIC_` (client-side) from regular env vars (server-side).
*   **The Pitfall:** Accidentally adding `NEXT_PUBLIC_` to your `STRIPE_SECRET_KEY`.
*   **The Fix:** Use a linter or a script to audit your `.env` file for sensitive keys with the `PUBLIC` prefix.

## Summary

Security in Next.js is **Implicit but Vital**. By treating every Server Action as a public API and enforcing strict CSP headers, you can build modern React apps that are as secure as any traditional backend.