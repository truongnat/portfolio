---
title: "Under the Hood: JSI, Yoga, and the Fabric Renderer"
date: "2024-01-20"
description: "How does JS become a native UI? A technical deep dive into the JSI (JavaScript Interface), the C++ Yoga layout engine, and the new Fabric architecture."
slug: "react-native-deep-dive-into-core-internals"
published: true
tags: ["Frontend", "React Native"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: JSI, Yoga, and the Fabric Renderer

React Native is more than just a bridge. It's a sophisticated cross-platform engine written largely in C++.

## 1. JSI (JavaScript Interface)

The JSI is the most important part of the "New Architecture."
*   **The Old Way:** JS and Native talked via JSON serialization across a bridge (Slow).
*   **The JSI Way:** JS has a direct reference to C++ objects. It can call native methods synchronously. No more JSON stringify/parse!

## 2. The Yoga Engine

How does Flexbox work on Android?
*   **The Engine:** **Yoga** is a layout engine written in C++ that implements the Flexbox spec.
*   **Workflow:** Yoga calculates the exact pixel positions of every `<View>` and `<Text>` component and sends those coordinates to the native OS (UIKit on iOS, View on Android).

## 3. Fabric (The Renderer)

Fabric is the UI-thread counterpart to React's Fiber.
*   **The Benefit:** It allows for "Priority Rendering." User interactions (like a scroll) take precedence over background data updates, eliminating "UI stutter."

## 4. Hermes: The Optimized Engine

Unlike the V8 engine in Chrome, **Hermes** is an engine built by Meta specifically for React Native.
*   **The Trick:** It uses **AOT (Ahead-of-Time)** compilation to pre-parse JS into bytecode at build time, significantly reducing app startup time.

## Summary

React Native's internal architecture is moving toward **Native Integration**. By replacing the asynchronous bridge with the synchronous JSI and utilizing the C++ Yoga engine, React Native is closing the performance gap with 100% native apps.