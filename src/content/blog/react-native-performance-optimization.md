---
title: "React Native Performance Optimization: Reanimated 3, FlashList, and Hermes"
date: "2026-03-24"
description: "How I eliminated jank in NetBI's mobile KPI dashboard using Reanimated 3 worklets, FlashList, and the Hermes JavaScript engine."
slug: "react-native-performance-optimization"
published: true
tags: ["Mobile", "React Native", "Performance"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=1000"
---

# React Native Performance Optimization: Reanimated 3, FlashList, and Hermes

**NetBI** is a business intelligence mobile app where executives view KPI dashboards: charts, tables, regional maps, and trend indicators — all updating in near real-time. When I joined the project, the app had serious performance issues. Scrolling through a list of 200 KPI cards dropped to 18 FPS. Animations stuttered. Cold start took 4.2 seconds on a mid-range Android device.

This post is the story of how I fixed all three.

## Understanding the React Native Threading Model

Before throwing libraries at the problem, I needed to understand *why* things were slow. React Native runs on two main threads:

- **JS Thread**: Your JavaScript code, React reconciliation, business logic
- **UI Thread** (Main Thread): Native rendering, touch events, layout

The bridge between them was historically the bottleneck. Every animated value, every style update, every gesture response had to cross this bridge via JSON serialization. With JSI (JavaScript Interface) and the Fabric renderer, this is improving — but older patterns still hurt.

I used Flipper's Performance plugin and Xcode Instruments to profile the app. The findings:

| Issue | Symptom | Root Cause |
|---|---|---|
| List scroll | 18 FPS | FlatList rendering 200 complex cells |
| Chart animation | Dropped frames on scroll | JS-driven `Animated` API |
| Cold start | 4.2s on Android | JSC engine + large bundle |

## Fix 1: FlashList vs FlatList

The KPI list was using `FlatList` with complex item components — each card had a mini chart, several text nodes, and conditional styling. FlatList re-renders aggressively and its recycling mechanism isn't optimized for non-uniform item sizes.

I switched to **FlashList** from Shopify:

```typescript
// Before: FlatList
import { FlatList } from 'react-native';

<FlatList
  data={kpiItems}
  renderItem={({ item }) => <KpiCard item={item} />}
  keyExtractor={(item) => item.id}
/>

// After: FlashList
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={kpiItems}
  renderItem={({ item }) => <KpiCard item={item} />}
  keyExtractor={(item) => item.id}
  estimatedItemSize={120}  // Critical: measure your average item height
  getItemType={(item) => item.type} // Separate recycling pools by item type
/>
```

The `estimatedItemSize` and `getItemType` props are crucial. Without them, FlashList falls back to dynamic measurement which kills the performance gains.

**Result**: Scroll frame rate went from 18 FPS to a consistent 59-60 FPS on the same device. Memory usage dropped by 35% because FlashList recycles view instances much more aggressively.

## Fix 2: Reanimated 3 Worklets

The original chart animation used React Native's `Animated` API:

```typescript
// Before: JS-driven animation (bad)
const opacity = useRef(new Animated.Value(0)).current;

Animated.timing(opacity, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // only transforms and opacity
}).start();
```

While `useNativeDriver: true` helps, you're still orchestrating from the JS thread. Any JS slowdown (a Redux dispatch, a re-render elsewhere) pauses your animation.

I rewrote the animations with **Reanimated 3 worklets**, which run directly on the UI thread:

```typescript
// After: UI-thread worklet animation (good)
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

function KpiCard({ item, onPress }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // This runs on the UI thread — no bridge crossing
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Trigger entry animation
  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  // Press feedback entirely on UI thread
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
    runOnJS(onPress)(item.id); // Cross back to JS only when needed
  }, [item.id, onPress]);

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      {/* card content */}
    </Animated.View>
  );
}
```

The key pattern here is `runOnJS` — it lets you call a JS function from a worklet when you need to (like triggering navigation), while keeping the animation itself isolated on the UI thread.

**Result**: Animations now maintain 60 FPS even when the JS thread is busy processing a large data update.

## Fix 3: Hermes Engine

This one was almost free. Hermes is Meta's JavaScript engine optimized specifically for React Native. Unlike V8/JSC which JIT-compile JavaScript at runtime, Hermes pre-compiles to bytecode at build time.

Enable it in `android/app/build.gradle`:

```gradle
project.ext.react = [
    enableHermes: true,
]
```

For iOS in `Podfile`:

```ruby
use_react_native!(
  :hermes_enabled => true
)
```

**Results on the same mid-range Android (Snapdragon 665)**:

| Metric | Before (JSC) | After (Hermes) | Improvement |
|---|---|---|---|
| Cold start | 4.2s | 1.8s | **57% faster** |
| TTI (interactive) | 5.1s | 2.3s | **55% faster** |
| Memory baseline | 148 MB | 112 MB | **24% less** |

The improvements are especially dramatic on low-end Android devices because Hermes avoids the expensive JIT compilation warmup.

## Putting It All Together

After all three optimizations, here's the before/after summary for NetBI mobile:

| Metric | Before | After |
|---|---|---|
| List scroll FPS | 18 | 60 |
| Animation FPS | 42 | 60 |
| Cold start (Android) | 4.2s | 1.8s |
| Memory usage | 148 MB | 98 MB |

The lesson I keep relearning: **profile before you optimize**. I initially assumed the charts were the bottleneck, but profiling showed the list rendering was responsible for 70% of the frame drops. Without the data, I would have spent a week optimizing the wrong thing.

If your React Native app is feeling sluggish, start with FlashList for any list over 50 items, move your animations to Reanimated worklets, and enable Hermes if you haven't already. These three changes alone will cover 80% of performance problems I've encountered in production apps.
