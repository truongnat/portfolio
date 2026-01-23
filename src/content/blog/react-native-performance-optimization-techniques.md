---
title: "Squeezing Native Performance: Reanimated, FlashList, and Hermes"
date: "2024-03-18"
description: "Is your app dropping frames? Learn how to optimize list performance with FlashList, move animations to the UI thread, and profile memory with Flipper."
slug: "react-native-performance-optimization-techniques"
published: true
tags: ["Frontend", "React Native"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Squeezing Native Performance: Reanimated, FlashList, and Hermes

Mobile users have zero tolerance for lag. Here is how to audit and optimize your React Native application for a "Butter Smooth" feel.

## 1. List Performance: The `FlatList` Killer

If your scroll is choppy, you are likely using `FlatList` with too many items.
*   **The Fix:** Switch to **@shopify/flash-list**.
*   **The Difference:** FlashList recycles views rather than unmounting them. It handles 10,000 items with zero memory spikes.

## 2. Profiling with Flipper and React DevTools

Don't guess; measure.
*   **Flipper:** Use the "Hermes Debugger" to find slow JS functions and the "Images" plugin to find unoptimized assets that are hogging VRAM.
*   **Trace:** Look for "Long Tasks" (>16ms) in the JS thread.

## 3. Offloading to the Native Thread

If you have a math-heavy task (e.g., image manipulation or complex sorting), don't do it in JS.
*   **The Strategy:** Use **Nitro Modules** or **TurboModules** to write that specific logic in Swift or Kotlin. The JSI makes the overhead of calling these native functions near-zero.

## 4. Lazy Loading of Screens

*   **Pattern:** Use `React.lazy` and `Suspense` for screens that aren't in the primary navigation flow.
*   **Benefit:** Reduces the memory footprint of the app at startup.

## Summary

Performance in React Native is a **Multi-Threaded** game. Keep the JS thread clear for business logic, move animations to the UI thread with Reanimated, and use FlashList to ensure your lists stay fluid at any scale.