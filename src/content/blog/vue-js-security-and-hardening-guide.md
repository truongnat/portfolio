---
title: "Hardening Vue: Template Security and XSS Prevention"
date: "2024-05-30"
description: "Is your Vue app safe? Learn how to prevent template injection, sanitize dynamic HTML with v-html, and secure your provide/inject data."
slug: "vue-js-security-and-hardening-guide"
published: true
tags: ["Frontend", "Vue.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening Vue: Template Security and XSS Prevention

Vue provides excellent protection by default, but developers can easily open holes if they aren't careful.

## 1. The Dangers of `v-html`

**The Pitfall:** Rendering user-generated content directly.
**The Risk:** Cross-Site Scripting (XSS).
**The Fix:** Always use a library like `DOMPurify` to sanitize HTML before passing it to `v-html`.

```typescript
import DOMPurify from 'dompurify';

const sanitizedHtml = computed(() => DOMPurify.sanitize(props.userContent));
```

## 2. Template Injection

Never use user-provided strings as templates or part of a component's `template` option.
*   **The Attack:** An attacker providing a string like `{{ 7 * 7 }}` to see if it executes.
*   **The Fix:** Only use static templates. All dynamic content should be passed as **Data (props/refs)**, never as code.

## 3. Secure Provide / Inject

When using `provide/inject` for global state, mark your keys as `readonly` to prevent child components from maliciously (or accidentally) modifying the global state.

```typescript
// Parent
provide(userKey, readonly(user));
```

## 4. HTTP Headers

Use `helmet` (on the server) or configure your CDN to inject security headers:
*   `X-Content-Type-Options: nosniff`
*   `X-Frame-Options: DENY`
*   `Content-Security-Policy`

## Summary

Security in Vue is about **Data Sanitization**. Treat all incoming data as hostile, never trust `v-html`, and use `readonly` to protect your state tree.