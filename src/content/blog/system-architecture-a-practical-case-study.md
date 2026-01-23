---
title: "The Monolith to Microservices Journey: A Case Study"
date: "2024-10-25"
description: "How we migrated a legacy PHP monolith to a distributed Node.js microservices architecture. Patterns, pitfalls, and the 'Strangler Fig' strategy."
slug: "system-architecture-a-practical-case-study"
published: true
tags: ["Leadership", "System Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
---

# The Monolith to Microservices Journey: A Case Study

Migrating a production system is like changing the engines on a plane while it's flying. This case study details our 18-month journey of deconstructing a legacy monolith into a high-scale event-driven architecture.

## The Challenge: The "Big Ball of Mud"

Our legacy system was a 10-year-old monolith.
*   **Deployment:** One change required a full 45-minute deployment.
*   **Scalability:** We had to scale the entire app just to handle high traffic on the "Search" feature.
*   **Knowledge:** No single person understood the whole codebase.

## The Solution: The Strangler Fig Pattern

We didn't do a "Big Bang" rewrite. Instead, we used the **Strangler Fig Pattern**—building new services around the edges and slowly redirecting traffic.

### Phase 1: The API Gateway
We introduced an API Gateway (Kong) to route traffic. This allowed us to swap out endpoints without the frontend ever knowing.

### Phase 2: Event-Driven Decomposition
Instead of synchronous REST calls, we used **RabbitMQ** for inter-service communication.
*   *Example:* When an "Order" is placed, the Order Service emits an event. The Inventory and Email services consume that event independently.

## The Results

| Metric | Monolith | Microservices |
| :--- | :--- | :--- |
| **Deployment Time** | 45 Mins | 4 Mins |
| **Recovery Time (MTTR)** | 2 Hours | 15 Mins |
| **Developer Productivity** | Low (Silos) | High (Independent) |

## Lesson Learned

Microservices are not free. They trade "Code Complexity" for "Operational Complexity." Only move to microservices if your organizational scale demands it.