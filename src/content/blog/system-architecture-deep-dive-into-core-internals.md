---
title: "The Laws of Distributed Systems: CAP, PACELC, and Trade-offs"
date: "2024-12-05"
description: "Why you can't have it all. We dive into the fundamental physics of distributed systems and how to make informed architectural decisions."
slug: "system-architecture-deep-dive-into-core-internals"
published: true
tags: ["Leadership", "System Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=1000"
---

# The Laws of Distributed Systems: CAP, PACELC, and Trade-offs

Architecture is the art of trade-offs. To be a great architect, you must understand the "physics" of data across a network.

## 1. The CAP Theorem
In a distributed system, you can only have two of the three:
*   **Consistency:** Everyone sees the same data at the same time.
*   **Availability:** Every request gets a response (success/failure).
*   **Partition Tolerance:** The system works even if the network fails.

**The Reality:** On the internet, network failure (P) is inevitable. So you are always choosing between **C** and **A**.

## 2. PACELC (The Extension)
CAP is too simple for production. PACELC adds: "In the absence of a Partition (PA), what is the trade-off between Latency (L) and Consistency (C)?"

## 3. Fallacies of Distributed Computing
Never assume:
1.  The network is reliable.
2.  Latency is zero.
3.  Bandwidth is infinite.
4.  The network is secure.

## Summary
Understanding these constraints allows you to choose the right database for the right job. Need high availability for a social feed? Use **DynamoDB** (AP). Need strict consistency for a bank balance? Use **PostgreSQL** (CP).