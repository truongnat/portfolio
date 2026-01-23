---
title: "Optimizing Vue 3: ShallowRef, Async Components, and Bundle Tuning"
date: "2024-03-18"
description: "Is your Vue app lagging? Learn how to use shallowRef for performance, implement dynamic loading with Async Components, and analyze your Vite bundle."
slug: "vue-js-performance-optimization-techniques"
published: true
tags: ["Frontend", "Vue.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Optimizing Vue 3: ShallowRef, Async Components, and Bundle Tuning

Vue 3 is fast by default, but complex applications with large datasets still require careful optimization.

## 1. `shallowRef` for Large Data

Standard `ref` makes every property of an object recursive and reactive.
*   **The Problem:** Making a 10,000-row dataset reactive can freeze the browser for seconds.
*   **The Fix:** Use `shallowRef`. Only the `.value` property is reactive. The internal data is just a plain JS object.

## 2. Async Components (`defineAsyncComponent`)

Don't force the user to download the whole app at once.
*   **The Strategy:** Wrap heavy components (like Charts or Editors) in `defineAsyncComponent`.
*   **Benefit:** The component is only downloaded when it's about to be rendered.

## 3. `v-once` and `v-memo`

*   **v-once:** Tells the compiler to render a part of the template only once. Perfect for static content inside reactive trees.
*   **v-memo:** Only re-renders a component if specific dependencies change. This is the manual "Turbo" button for list rendering.

## 4. Vite Bundle Analysis

Use the `rollup-plugin-visualizer` to see what is taking up space in your JS bundle.
*   **Common Culprit:** Importing a heavy library (like `lodash`) instead of specific utility functions.

## Summary

Performance in Vue 3 is about **Reactivity Budgeting**. By limiting deep reactivity with `shallowRef` and implementing code splitting with Async Components, you keep your app responsive even under heavy data load.