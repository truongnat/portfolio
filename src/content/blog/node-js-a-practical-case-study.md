---
title: "Building High-Concurrency Real-time Systems with Node.js: A Case Study"
date: "2023-10-12"
description: "How we scaled a real-time notification engine to 100k concurrent WebSocket connections using Node.js, Redis Streams, and Worker Threads."
slug: "node-js-a-practical-case-study"
published: true
tags: ["Backend", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Building High-Concurrency Real-time Systems with Node.js: A Case Study

Node.js is famous for its non-blocking I/O model, making it ideal for real-time applications. This case study details how we built a global notification system that handles 100,000 concurrent users with sub-50ms latency.

## The Challenge: The Single-Threaded Bottleneck

Our initial implementation struggled as traffic grew.
*   **CPU Bloat:** Complex JSON parsing and crypto operations were blocking the Event Loop.
*   **Memory Pressure:** Storing 100k WebSocket state objects in memory caused frequent Garbage Collection (GC) pauses.
*   **Scaling:** We needed a way to distribute messages across multiple server instances without losing real-time consistency.

## The Solution: Distributed Event-Driven Architecture

We re-architected the system to move heavy lifting away from the main Event Loop.

### 1. Worker Threads for CPU Tasks
We used the `worker_threads` module to offload image resizing and data encryption.
*   **Benefit:** The main thread stays responsive to incoming I/O, while expensive math happens in the background.

### 2. Redis Streams for Message Distribution
Instead of simple Pub/Sub, we used **Redis Streams**.
*   **Mechanism:** Every Node.js instance acts as a consumer in a group. This ensures that even if one server dies, the messages are re-delivered to another instance.

### 3. Native Addons (Node-API)
For the most performance-critical part—our custom protocol parser—we wrote a C++ addon using **Node-API**.
*   **Result:** A 10x speedup in raw throughput compared to pure JavaScript parsing.

## Results

| Metric | Version 1 (JS Only) | Version 2 (Workers + C++) |
| :--- | :--- | :--- |
| **Max Concurrent Conns** | 10,000 | 120,000+ |
| **P99 Latency** | 450ms | 35ms |
| **Crash Rate** | Weekly (OOM) | Zero (Stable) |

## Conclusion

Node.js is extremely capable at scale if you know when to "leave" the single thread. By utilizing Worker Threads for CPU-bound work and Redis for distributed state, you can build systems that rival Go or Java in raw performance while maintaining the high developer velocity of JavaScript.