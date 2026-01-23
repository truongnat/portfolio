---
title: "Next.js Pitfalls: Hydration Errors and Component Waterfalls"
date: "2023-12-05"
description: "Why is your Next.js app slow? We explore the top mistakes: using 'use client' too much, hydration mismatches, and the dreaded server request waterfall."
slug: "next-js-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Next.js Pitfalls: Hydration Errors and Component Waterfalls

The App Router is powerful, but its mental model is strict. One wrong move can turn your "High Performance" app into a slow, buggy mess.

## 1. The "Use Client" Viral Infection

**The Pitfall:** Adding `'use client'` at the top of your `layout.tsx`.
**The Result:** You've just turned your entire application tree into a client-side app, losing all the benefits of Server Components.
**The Fix:** Push "Client" logic to the **leaves** of your component tree. Only wrap the specific button or input that needs state.

## 2. Hydration Mismatch

**The Pitfall:** Rendering `new Date()` or `Math.random()` in a component.
**The Error:** "Text content did not match. Server: 10:00 AM, Client: 10:01 AM."
**The Fix:** Use `useEffect` to set state that depends on the client's environment, or use `suppressHydrationWarning` (sparingly).

## 3. The Sequential Waterfall

**The Pitfall:**
```typescript
const user = await getUser();
const posts = await getPosts(user.id);
```
**The Result:** `getPosts` doesn't start until `getUser` finishes. This doubles your load time.
**The Fix:** Use `Promise.all` or, better yet, fetch data in the specific components that need it to allow Next.js to parallelize requests.

## 4. Large Bundle Size (Barrel Files)

**The Pitfall:** Importing one icon from a library using `import { Icon } from 'my-lib'`.
**The Risk:** Without proper tree-shaking, you might import the entire library into your client bundle.

## Summary

Success with Next.js requires a **Server-First Mindset**. Start with a Server Component and only move to the client when you need interactivity.