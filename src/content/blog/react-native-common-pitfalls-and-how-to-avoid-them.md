---
title: "React Native Pitfalls: Bridge Bottlenecks and Memory Leaks"
date: "2023-12-10"
description: "Why is your app lagging? We explore the top React Native performance killers: too many bridge passes, unoptimized images, and JS thread blocking."
slug: "react-native-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Frontend", "React Native"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# React Native Pitfalls: Bridge Bottlenecks and Memory Leaks

React Native performance is usually a game of **"Thread Management."** If you treat mobile like the web, your app will feel sluggish.

## 1. The "Bridge Traffic" Jam

**The Pitfall:** Sending massive objects through props every frame (e.g., during an animation).
**The Result:** The "Bridge" becomes a bottleneck. The JS thread sends data, the UI thread waits, and you drop frames.
**The Fix:** Use `useSharedValue` and `useAnimatedStyle` from Reanimated to keep animation logic entirely on the UI thread.

## 2. Heavy JS Computations

**The Pitfall:** Running a complex search or data transformation on the main thread.
**The Result:** The UI becomes unresponsive. The user clicks a button, and nothing happens for 500ms.
**The Fix:** Use a **Web Worker** (via `react-native-multithreading`) or offload the work to a native module written in C++.

## 3. Large Image Overkill

**The Pitfall:** Displaying a 4000x4000px image in a 100x100px thumbnail.
**The Result:** High memory usage and random app crashes (OOM) on Android.
**The Fix:** Use the `resizemode` and `blurRadius` props correctly, and leverage libraries like `expo-image` which handle caching and downsampling automatically.

## 4. Console.log in Production

**The Pitfall:** Leaving `console.log` statements in your code.
**The Risk:** In React Native, `console.log` is synchronous and can significantly slow down the app.
**The Fix:** Use a babel plugin (`babel-plugin-transform-remove-console`) to automatically strip logs from your production bundle.

## Summary

Success with React Native is about **Respecting the Device**. Minimize bridge communication, optimize your assets, and keep the JS thread clear for user interactions.