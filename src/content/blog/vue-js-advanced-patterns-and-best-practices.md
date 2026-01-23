---
title: "Advanced Vue 3: Composables, Teleport, and Suspense"
date: "2023-11-15"
description: "Master the advanced features of Vue 3. Learn how to design robust Composables, use Teleport for modals, and handle async data with Suspense."
slug: "vue-js-advanced-patterns-and-best-practices"
published: true
tags: ["Frontend", "Vue.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Vue 3: Composables, Teleport, and Suspense

Modern Vue development is about building modular, high-performance user interfaces using the framework's powerful primitive features.

## 1. Designing Elite Composables

Don't just move code into a function. Follow the **Ref-Sugar** pattern.
*   **The Power:** Return both `raw` data and `computed` getters.
*   **Pattern:** `useMouse`, `useFetch`, `useAuth`.

```typescript
// composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const double = computed(() => count.value * 2);
  const increment = () => count.value++;
  
  return { count, double, increment };
}
```

## 2. Teleport (Breaking the DOM)

Need a modal that is logically part of a component but physically needs to be at the end of `<body>` to avoid CSS `z-index` issues?
*   **The Syntax:** `<Teleport to="body">...</Teleport>`

## 3. Suspense (Native Async)

Handling "Loading" and "Error" states for 10 different components is tedious.
*   **The Power:** Wrap your async components in a `<Suspense>` boundary.
*   **The Benefit:** One central spot to manage the loading state for an entire dashboard subtree.

## 4. Provide / Inject (Dependency Injection)

Stop "Prop Drilling."
*   **Use Case:** Providing a global "Theme" or "User Config" to deep-nested children without passing props through every layer.

## Summary

Advanced Vue 3 is about **Composition**. By mastering Composables and understanding the core primitives like Teleport and Suspense, you can build UIs that are both flexible and highly performant.