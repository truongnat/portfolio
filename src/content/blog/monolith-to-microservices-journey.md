---
title: "The Monolith to Microservices Journey: Strangler Fig Pattern in Practice"
date: "2026-03-24"
description: "A practical walkthrough of migrating a monolithic Node.js application to microservices using the Strangler Fig pattern, with lessons learned from real production migrations."
slug: "monolith-to-microservices-journey"
published: true
tags: ["Architecture", "Microservices", "Backend"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

# The Monolith to Microservices Journey: Strangler Fig Pattern in Practice

Every developer has heard the microservices pitch: independent deployments, technology diversity, team autonomy, infinite scalability. But what nobody talks about enough is the *journey* — the messy, real-world process of getting there from a codebase that's been running in production for years.

I've been through this migration twice now. The first time, we tried to do it all at once and nearly collapsed under the weight of our own ambition. The second time, we used the **Strangler Fig pattern** — and it was a completely different experience.

## Why Microservices (And Why Not)

Before I talk about how to migrate, let me be honest about when you should. Microservices solve specific problems:

- **Independent deployability**: teams can ship without coordinating with every other team
- **Fault isolation**: a bug in the notification service shouldn't take down checkout
- **Scalability per workload**: scale your image processing service independently of your auth service

But they introduce complexity: distributed transactions, network latency, service discovery, operational overhead. If your team is fewer than 20 engineers or your traffic is modest, a well-structured monolith will serve you better.

The right question isn't "should we use microservices?" but "what problem are we actually trying to solve?"

## The Strangler Fig Pattern

The Strangler Fig is named after a tree that grows around its host, gradually replacing it. In software terms, you build new functionality as microservices *alongside* the monolith, then incrementally route traffic from the old system to the new. The monolith shrinks; the services grow. Eventually, you strangle the monolith out of existence.

This is the opposite of a "big bang" rewrite, which almost always fails. Instead, you're making small, verifiable steps. Each step ships to production and can be rolled back independently.

The key infrastructure piece is a **routing layer** — typically an API Gateway or a reverse proxy like Nginx — that sits in front of both the monolith and the new services:

```nginx
# nginx.conf - route new /auth/* to microservice, everything else to monolith
upstream monolith {
    server monolith:3000;
}

upstream auth_service {
    server auth-service:4001;
}

server {
    location /api/auth/ {
        proxy_pass http://auth_service;
    }

    location / {
        proxy_pass http://monolith;
    }
}
```

Once the routing layer is in place, the monolith becomes just another upstream. You extract services one at a time, flip routes, decommission old code.

## Phase 1: Identify Service Boundaries with DDD

The most dangerous mistake in microservices is drawing service boundaries wrong. Extract along the wrong seams and you'll end up with a distributed monolith — all the complexity of microservices, none of the benefits.

I use **Domain-Driven Design** concepts to find natural boundaries. The key question is: which parts of the codebase change together, and which change independently?

In an e-commerce system, for example:

- **User/Auth domain**: registration, login, session management, permissions
- **Catalog domain**: products, categories, search, inventory
- **Order domain**: cart, checkout, order lifecycle
- **Notification domain**: email, SMS, push — triggered by events from other domains

Notice that Notifications doesn't know about Products. It just listens to events. That's a clean boundary.

Bounded contexts in DDD give you the vocabulary. Each context owns its data and its logic. When you extract a service, you extract the context — schema and all.

## Phase 2: The Extraction Process

For each service extraction, I follow a repeatable pattern:

1. **Duplicate**: Add the new service alongside the monolith. It runs the same code initially, or starts fresh for new features.
2. **Sync data**: Use CDC (Change Data Capture) or dual-write to keep data in sync during the transition.
3. **Shadow traffic**: Route a percentage of requests to the new service, compare results.
4. **Flip**: Route 100% of traffic to the new service.
5. **Delete**: Remove the old code from the monolith.

The data migration is usually the hardest part. I've used event sourcing with Kafka for complex cases, and simple PostgreSQL logical replication for simpler ones.

```typescript
// Dual-write pattern during migration
async function createUser(data: CreateUserDto): Promise<User> {
  // Write to monolith DB (legacy)
  const legacyUser = await legacyUserRepo.create(data);

  // Write to new auth service DB (new)
  try {
    await authServiceClient.createUser({
      id: legacyUser.id, // keep same ID for consistency
      ...data,
    });
  } catch (err) {
    logger.error('Auth service sync failed', { userId: legacyUser.id, err });
    // Don't fail the request — monolith is still source of truth
  }

  return legacyUser;
}
```

## Inter-Service Communication

Once you have multiple services, you need to decide how they talk to each other. I've settled on a simple rule: **synchronous for queries, asynchronous for commands**.

For synchronous calls, I use REST or gRPC with circuit breakers:

```typescript
import CircuitBreaker from 'opossum';

const inventoryCheck = new CircuitBreaker(
  (productId: string) => inventoryService.getStock(productId),
  { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 30000 }
);

inventoryCheck.fallback((productId) => ({ productId, available: false }));
```

For async communication — events like `order.placed` or `user.registered` — I use a message broker (Redis Streams for lower volume, Kafka for high throughput). Services subscribe to events they care about, without coupling to the publishers.

## Lessons From Real Migrations

**Lesson 1: Don't extract the first service you think of.** Extract the one that changes most frequently and causes the most deployment pain. Optimization follows pain.

**Lesson 2: Invest in observability early.** Distributed tracing (I use OpenTelemetry with Jaeger) is not optional. When a request touches 5 services, you need correlation IDs everywhere.

**Lesson 3: The monolith is not your enemy.** During migration, it's your most stable asset. Treat it with respect. Don't hack it to make extraction easier; refactor it properly.

**Lesson 4: Shared databases are the root of all evil.** If two services share a database table, they're not really separate services. The schema becomes a coupling point that defeats the entire purpose.

**Lesson 5: Start with the least critical service.** Your team needs to build operational muscles — CI/CD per service, health checks, alerting — before you tackle the payment service.

The Strangler Fig pattern works because it respects the reality of production systems: you can't stop the world to rewrite it. You migrate while the plane is flying. Done right, you land safely.
