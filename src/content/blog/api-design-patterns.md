---
title: "REST vs gRPC: Choosing the Right API Pattern for Your System"
date: "2026-03-24"
description: "A practical decision framework for choosing between REST and gRPC, with real code comparisons, versioning strategies, and honest trade-offs from production experience."
slug: "api-design-patterns"
published: true
tags: ["Architecture", "API", "Backend", "Best Practices"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000"
---

# REST vs gRPC: Choosing the Right API Pattern for Your System

I've designed APIs in both REST and gRPC across different systems, and I've made mistakes with both. Choosing the wrong API pattern is expensive — you end up rebuilding contracts, updating clients, and arguing in code review about decisions that should have been settled in architecture. 

This is my framework for making the right call upfront.

## REST: Timeless But Not Simple

REST is so ubiquitous that people assume they know it. Most "REST" APIs I see aren't actually RESTful — they're HTTP/JSON APIs that borrow REST vocabulary without the constraints. That's fine, practically speaking, but understanding what REST actually prescribes helps you decide when to follow it strictly and when to relax it.

True REST is resource-oriented:

```
GET    /users          → list users
GET    /users/:id      → get a user
POST   /users          → create a user
PUT    /users/:id      → replace a user
PATCH  /users/:id      → update a user
DELETE /users/:id      → delete a user
```

Resources are nouns. HTTP verbs are the operations. Status codes communicate outcomes. Links connect resources (HATEOAS — though few APIs actually implement this).

The strengths of REST are its universality and simplicity:

```typescript
// Client — any HTTP library, any language
const response = await fetch('/api/users/123', {
  headers: { Authorization: `Bearer ${token}` },
});
const user = await response.json();
```

No code generation. No shared schemas. Browser-native. Every frontend developer already understands it.

## gRPC: When REST Doesn't Fit

gRPC is built on Protocol Buffers (protobuf) and HTTP/2. You define your API in a `.proto` file, generate client and server code in any language, and get typed, efficient, streaming RPC.

```protobuf
// notification.proto
syntax = "proto3";

service NotificationService {
  rpc SendNotification (NotificationRequest) returns (NotificationResponse);
  rpc StreamNotifications (StreamRequest) returns (stream Notification);
}

message NotificationRequest {
  string user_id = 1;
  string message = 2;
  NotificationType type = 3;
}

enum NotificationType {
  ALERT = 0;
  MESSAGE = 1;
  SYSTEM = 2;
}
```

From this single source of truth, you generate:

```bash
protoc --ts_out=./generated --grpc-web_out=./generated notification.proto
```

And you get fully typed clients:

```typescript
// gRPC client — fully typed, generated from proto
const client = new NotificationServiceClient('localhost:50051', credentials);

const request = new NotificationRequest();
request.setUserId('user-123');
request.setMessage('Your order shipped');

client.sendNotification(request, (err, response) => {
  if (err) handleError(err);
  console.log('Sent:', response.getNotificationId());
});
```

gRPC's killer features are streaming and binary encoding. A server-streaming RPC lets the server push a stream of messages to the client — perfect for live feeds:

```typescript
const stream = client.streamNotifications(request);
stream.on('data', (notification: Notification) => {
  displayNotification(notification.toObject());
});
stream.on('end', () => console.log('Stream closed'));
```

## The Real Trade-offs

| Dimension | REST | gRPC |
|-----------|------|------|
| Browser support | Native | Requires grpc-web + proxy |
| Payload size | Larger (JSON text) | Smaller (binary protobuf) |
| Streaming | Awkward (SSE/WS) | First-class |
| Type safety | Optional (OpenAPI) | Built-in |
| Learning curve | Low | Medium |
| Debugging | Easy (readable JSON) | Harder (binary) |
| Service-to-service | Good | Excellent |

The binary encoding isn't just about size. Protobuf serialization/deserialization is 5-10x faster than JSON. At high RPC volume in internal microservices, this matters.

## When to Use REST

Use REST when:

- **You have external consumers** (public APIs, third-party integrations). REST is lingua franca. Every client can speak it.
- **Browser clients are primary.** gRPC-web exists but adds operational complexity (Envoy proxy).
- **Developer experience is critical.** `curl` debugging is worth more than you think.
- **CRUD operations dominate.** REST's resource model fits data management tasks naturally.
- **Team is polyglot but small.** No shared protobuf build infrastructure needed.

## When to Use gRPC

Use gRPC when:

- **Internal microservice communication.** Clients are under your control, language support is uniform, and you want strong contracts.
- **Streaming is a core requirement.** Bidirectional streaming in gRPC is first-class; in REST it's always a bolt-on.
- **Performance is critical.** 5-10x faster serialization, HTTP/2 multiplexing, connection reuse.
- **Strong typing across languages.** One `.proto` file generates idiomatic clients in Go, TypeScript, Python, Java.
- **You have a large service mesh.** Schema enforcement at build time prevents entire classes of integration bugs.

## Versioning Strategies

**REST versioning:** I prefer URL versioning (`/v1/`, `/v2/`) over header versioning (`Accept: application/vnd.api.v2+json`). It's explicit, readable in logs, and easy to route:

```typescript
// Express
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

Run old and new versions in parallel during migrations. Sunset old versions with deprecation headers and clear timelines.

**gRPC versioning:** Protobuf's field numbering provides forward/backward compatibility by default — adding new fields is non-breaking. For breaking changes, create a new package namespace:

```protobuf
package notification.v2;
```

## My Decision Framework

```
Is this a public API or browser-first?
  → Yes → REST

Is streaming (server-push or bidirectional) a core feature?
  → Yes → gRPC

Is this internal service-to-service?
  → Yes, performance-critical → gRPC
  → Yes, moderate traffic → Either works; pick what your team knows

Is type safety and contract enforcement across teams critical?
  → Yes → gRPC (protobuf as single source of truth)
```

In practice, most systems use both. My portfolio backend uses REST for the public API (consumed by the Astro frontend in the browser) and gRPC for internal communication between services where I control both sides.

The worst choice isn't REST or gRPC — it's not having a consistent choice at all, ending up with some services on each pattern for no architectural reason. Pick deliberately, document the decision, and be consistent within a service boundary.
