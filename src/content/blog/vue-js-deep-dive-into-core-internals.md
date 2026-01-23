---
title: "Under the Hood: The Vue 3 Proxy Reactivity System"
date: "2024-01-20"
description: "How does Vue know when to re-render? A technical deep dive into JavaScript Proxies, the Effect system, and the Virtual DOM."
slug: "vue-js-deep-dive-into-core-internals"
published: true
tags: ["Frontend", "Vue.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: The Vue 3 Proxy Reactivity System

In Vue 2, reactivity was limited by `Object.defineProperty`. In Vue 3, it's powered by **ES6 Proxies**.

## 1. Proxies: The Interceptor

A Proxy allows Vue to "trap" operations like `get` and `set`.
*   **The Workflow:**
    1.  `get`: Vue records that "Component A" is interested in "Variable X" (**Track**).
    2.  `set`: Vue tells "Component A" to re-render because "Variable X" changed (**Trigger**).

## 2. The `effect` System

The heart of Vue is the `effect` function.
*   **The Magic:** When an effect runs, it automatically tracks all reactive variables it accesses. This is how `computed` and `watch` work without manual dependency arrays.

## 3. The Virtual DOM (VNodes)

Vue doesn't update the real DOM instantly. It creates a lightweight JavaScript tree (Virtual DOM).
*   **The Patch Algorithm:** Vue compares the new tree with the old one and only applies the minimum required changes to the real DOM.

## 4. Static Hoisting (The Compiler)

Vue's compiler is incredibly smart.
*   **Optimization:** It identifies parts of your template that are static (never change) and "hoists" them out of the render function so they are only created once.

## Summary

Vue 3 is an **Optimized Reactivity Engine**. By utilizing Proxies and compiler-time optimizations, it provides a developer-friendly API that outperforms almost every other framework in raw rendering speed.