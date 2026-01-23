---
title: "Advanced Architecture: CQRS, Event Sourcing, and Sagas"
date: "2024-11-05"
description: "Move beyond simple REST. Explore the patterns that power the world's most resilient distributed systems."
slug: "system-architecture-advanced-patterns-and-best-practices"
published: true
tags: ["Leadership", "System Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Architecture: CQRS, Event Sourcing, and Sagas

When building at scale, traditional CRUD (Create, Read, Update, Delete) patterns often fall short. We need patterns that handle high concurrency and eventual consistency.

## 1. CQRS (Command Query Responsibility Segregation)

**Concept:** Separate the data model for *writing* from the data model for *reading*.
*   **Command:** Optimized for validation and consistency.
*   **Query:** Optimized for fast retrieval (often a flattened view in Elasticsearch or Redis).

## 2. Event Sourcing

Instead of storing the *current state* of an object, you store the *history of events* that led to that state.
*   **Why?** Perfect audit logs, the ability to "time travel," and high write performance.

## 3. The Saga Pattern (Distributed Transactions)

How do you maintain consistency across 3 microservices without a distributed lock?
*   **Orchestration Saga:** A central controller manages the steps.
*   **Choreography Saga:** Each service emits events that trigger the next service.
*   **Compensating Transactions:** If step 3 fails, the Saga triggers "undo" actions in steps 1 and 2.

## Summary

These patterns are powerful but complex. Use them only for the most critical parts of your system where high scale or rigorous auditing is required.