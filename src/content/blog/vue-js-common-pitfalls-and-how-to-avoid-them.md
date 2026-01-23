---
title: "Vue 3 Pitfalls: Reactivity Losses and Memory Leaks"
date: "2023-12-10"
description: "Why is your component not updating? We explore the top Vue 3 mistakes: losing reactivity during destructuring, memory leaks in watchers, and ref vs reactive confusion."
slug: "vue-js-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Frontend", "Vue.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Vue 3 Pitfalls: Reactivity Losses and Memory Leaks

Vue's reactivity system is "magic" until it isn't. Here are the most common ways to break it.

## 1. Destructuring `props` or `reactive`

**The Pitfall:** `const { name } = props;`
**The Result:** `name` is now a plain string. Reactivity is lost. When the parent component updates the prop, this component stays on the old value.
**The Fix:** Use `toRefs(props)` to destructure safely.

## 2. `ref` vs `reactive` Confusion

**The Pitfall:** Using `reactive([])` or `reactive({})` and then overwriting the entire object.
*   *Bad:* `state = reactive([]); state = [1, 2, 3];` (Reactivity is lost).
**The Fix:** Use `ref` for arrays and objects unless you specifically need the deep property access of `reactive`.

## 3. Memory Leaks in `watch`

**The Pitfall:** Creating a watcher inside a loop or a non-component context without stopping it.
**The Fix:** Always call the `unwatch()` function returned by `watch` or `watchEffect` when the logic is no longer needed.

## 4. Mutating `computed`

**The Pitfall:** Trying to change the value of a computed property directly.
**The Rule:** Computed properties should be **Pure**. If you need to change the value, change the *source* data that the computed depends on.

## Summary

Success with Vue 3 requires understanding **Proxies**. By respecting the rules of destructuring and choosing the right reactivity primitive (`ref` vs `reactive`), you can ensure your UI always stays in sync with your data.