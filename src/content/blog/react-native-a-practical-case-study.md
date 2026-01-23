---
title: "Scaling Mobile Commerce with React Native and Expo: A Case Study"
date: "2023-10-25"
description: "How we migrated a complex delivery app to Expo-managed workflow, reducing build times by 70% and improving gesture performance with Reanimated 3."
slug: "react-native-a-practical-case-study"
published: true
tags: ["Frontend", "React Native"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000"
---

# Scaling Mobile Commerce with React Native and Expo: A Case Study

React Native has matured from a "experimental" bridge to a robust mobile platform. This case study details our migration of a large-scale delivery application from a "Bare" React Native project to the modern **Expo Managed Workflow**.

## The Challenge: "Native Code Drift"

Our bare React Native project was becoming a maintenance nightmare.
*   **Upgrade Friction:** Updating React Native version took 3-5 days due to complex native dependency conflicts.
*   **Build Complexity:** Developers needed Android Studio and Xcode installed and perfectly configured to run the app.
*   **Performance:** Complex animations (like swipe-to-delete) felt sluggish on mid-range Android devices.

## The Solution: Expo + Reanimated + EAS

We decided to "Lean into the Ecosystem" by adopting Expo's modern toolchain.

### 1. The Move to Expo Managed Workflow
We removed all `ios/` and `android/` folders and migrated to **Expo Modules**.
*   **Benefit:** Native code is now generated on-the-fly via **Continuous Native Generation (CNG)**. We never touch Xcode project files again.

### 2. High-Performance Animations (Reanimated 3)
We replaced standard React Native `Animated` API with **Reanimated 3**.
*   **Mechanism:** Logic runs on the "UI Thread" rather than the JS thread.
*   **Result:** 60fps animations even when the JS thread is busy fetching data.

### 3. EAS (Expo Application Services)
We used **EAS Build** to offload the heavy lifting of building `.ipa` and `.apk` files to the cloud.
*   **Benefit:** Any developer can trigger a build from a Windows or Linux machine.

## Results

| Metric | Bare React Native | Expo + EAS |
| :--- | :--- | :--- |
| **Local Environment Setup** | 4 Hours | 5 Minutes |
| **Build Time (CI/CD)** | 25 Mins | 8 Mins |
| **App Store Submission** | Manual (Hours) | Automated (Minutes) |

## Conclusion

The "Expo is for toys" myth is officially dead. By leveraging Expo's managed workflow and high-performance animation libraries, we built a production-grade mobile app that is faster to develop and smoother to use than our previous custom-native integration.