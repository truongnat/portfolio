---
title: "Modernizing E-commerce with Next.js App Router: A Case Study"
date: "2023-10-15"
description: "How we migrated a legacy React app to Next.js 14, achieving a 90+ Lighthouse score and 2x faster page loads using Server Components and Streaming."
slug: "next-js-a-practical-case-study"
published: true
tags: ["Frontend", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=1000"
---

# Modernizing E-commerce with Next.js App Router: A Case Study

The shift from Client-Side Rendering (CSR) to Server Components is the biggest change in React's history. This case study details our migration of a high-traffic e-commerce store to the Next.js App Router.

## The Challenge: The "White Screen" Problem

Our legacy React app relied on `useEffect` for data fetching.
*   **Performance:** Users saw a white screen for 2-3 seconds while JavaScript loaded and fetched data.
*   **SEO:** Search engines struggled to index our dynamic product descriptions.
*   **Bundle Size:** Our JS bundle had grown to 1.5MB, slowing down mobile users.

## The Solution: Next.js 14 & Server Components

We completely re-architected the application using the **App Router**.

### 1. React Server Components (RSC)
We moved 80% of our logic to the server.
*   **Benefit:** Zero JavaScript is sent to the client for static parts of the page.
*   **Mechanism:** Database queries happen directly inside the component function.

### 2. Streaming with Suspense
Instead of waiting for the *entire* page to load, we stream it in chunks.
*   **Workflow:** The navbar and product skeleton show up instantly, while the slow "Related Products" API streams in later.

### 3. Next.js Image Optimization
We replaced all `<img>` tags with the `next/image` component.
*   **Result:** Automatic WebP conversion and lazy loading reduced image payloads by 70%.

## Results

| Metric | Legacy React | Next.js 14 |
| :--- | :--- | :--- |
| **First Contentful Paint** | 2.8s | 0.8s |
| **JS Bundle Size** | 1.5 MB | 180 KB |
| **Lighthouse SEO** | 72 | 100 |

## Conclusion

Next.js is no longer just a "wrapper" for React; it's a full-stack framework. By leveraging Server Components and Streaming, we eliminated the performance bottlenecks of client-side rendering and built a truly "instant" web experience.