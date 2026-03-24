---
title: "Scaling to 100k Concurrent WebSocket Connections with Node.js and Redis Streams"
date: "2026-03-24"
description: "How I designed and scaled a real-time notification engine to handle 100,000 concurrent WebSocket connections using Node.js, Redis Streams, and horizontal scaling."
slug: "nodejs-realtime-websocket-scale"
published: true
tags: ["Backend", "Node.js", "Real-Time", "Performance"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

# Scaling to 100k Concurrent WebSocket Connections with Node.js and Redis Streams

When I was tasked with building a real-time notification engine for a platform expecting 100,000 concurrent users, my first reaction was excitement. My second was: *a single Node.js process handles ~65,000 connections before TCP file descriptor limits kick in*. This was going to require horizontal scaling from day one.

Here's how I designed the system, handled the scaling challenges, and load-tested it to validate the result.

## The Architecture

The notification engine needed to:
- Maintain persistent WebSocket connections per authenticated user
- Fan out notifications from backend services to all connected devices for a given user
- Handle user sessions across multiple server instances
- Survive individual server crashes without losing notification delivery

My architecture had four main components:

1. **WebSocket Gateway Pods** — Node.js processes accepting WebSocket connections
2. **Redis Streams** — Pub/sub backbone between pods and producers
3. **Presence Service** — Tracks which pod holds a user's connection
4. **Notification Producer** — Backend services that push events to Redis

```
[Backend Services] → [Redis Streams] → [WS Gateway Pods] → [User Devices]
                           ↑
                    [Presence Service]
                    (Redis Hash)
```

## WebSocket Gateway: The Core Loop

Each gateway pod runs a tight WebSocket server using `uWebSockets.js` instead of the more common `ws` library. The performance difference is significant: `uWS` can handle ~2x the connections at half the memory footprint because it's a native C++ implementation.

```typescript
// gateway/server.ts
import uWS from 'uWebSockets.js';
import { Redis } from 'ioredis';
import { verifyJWT } from './auth';
import { presenceService } from './presence';
import { startStreamConsumer } from './consumer';

interface UserSocket {
  userId: string;
  deviceId: string;
}

const app = uWS.App();
const redis = new Redis(process.env.REDIS_URL!);

// Map userId -> Set of socket objects
const connections = new Map<string, Set<uWS.WebSocket<UserSocket>>>();

app.ws<UserSocket>('/ws', {
  // Native compression for text payloads
  compression: uWS.SHARED_COMPRESSOR,
  maxPayloadLength: 16 * 1024,
  idleTimeout: 60, // seconds

  upgrade: async (res, req, context) => {
    const token = req.getQuery('token');
    const user = await verifyJWT(token);

    if (!user) {
      res.writeStatus('401').end('Unauthorized');
      return;
    }

    // Pass user data to the WebSocket object
    res.upgrade(
      { userId: user.id, deviceId: user.deviceId },
      req.getHeader('sec-websocket-key'),
      req.getHeader('sec-websocket-protocol'),
      req.getHeader('sec-websocket-extensions'),
      context
    );
  },

  open: async (ws) => {
    const { userId } = ws.getUserData();

    // Register in local connection map
    if (!connections.has(userId)) {
      connections.set(userId, new Set());
    }
    connections.get(userId)!.add(ws);

    // Register presence in Redis
    const podId = process.env.POD_ID!;
    await presenceService.register(userId, podId);

    ws.subscribe(`user:${userId}`); // uWS pub/sub topic
  },

  close: async (ws) => {
    const { userId } = ws.getUserData();
    const userSockets = connections.get(userId);

    if (userSockets) {
      userSockets.delete(ws);
      if (userSockets.size === 0) {
        connections.delete(userId);
        await presenceService.unregister(userId);
      }
    }
  },
});

app.listen(3001, () => {
  startStreamConsumer(app, connections);
});
```

## Redis Streams: The Message Backbone

Redis Streams (`XADD` / `XREADGROUP`) are a perfect fit here because they provide:
- Persistent message storage (unlike pub/sub which is fire-and-forget)
- Consumer groups with acknowledgment — each pod processes messages independently
- Backpressure handling when a pod is overloaded

Each pod reads from a consumer group, filters for users it has connections for, and delivers:

```typescript
// gateway/consumer.ts
import { Redis } from 'ioredis';
import uWS from 'uWebSockets.js';

const redis = new Redis(process.env.REDIS_URL!);
const STREAM_KEY = 'notifications:stream';
const GROUP_NAME = 'gateway-consumers';
const POD_ID = process.env.POD_ID!;

export async function startStreamConsumer(
  app: uWS.TemplatedApp,
  connections: Map<string, Set<uWS.WebSocket<any>>>
) {
  // Ensure consumer group exists
  try {
    await redis.xgroup('CREATE', STREAM_KEY, GROUP_NAME, '$', 'MKSTREAM');
  } catch (e) {
    // Group already exists — fine
  }

  async function consume() {
    const results = await redis.xreadgroup(
      'GROUP', GROUP_NAME, POD_ID,
      'COUNT', '100',
      'BLOCK', '100', // block for 100ms max
      'STREAMS', STREAM_KEY, '>'
    );

    if (!results) {
      setImmediate(consume);
      return;
    }

    const messageIds: string[] = [];

    for (const [, messages] of results) {
      for (const [id, fields] of messages) {
        const data = Object.fromEntries(
          fields.reduce<[string, string][]>((acc, val, idx) => {
            if (idx % 2 === 0) acc.push([val, fields[idx + 1]]);
            return acc;
          }, [])
        );

        const { userId, payload } = data;
        const userConnections = connections.get(userId);

        if (userConnections) {
          // Publish to all connected sockets for this user
          app.publish(`user:${userId}`, payload, false, true);
        }

        messageIds.push(id);
      }
    }

    // Acknowledge processed messages
    if (messageIds.length > 0) {
      await redis.xack(STREAM_KEY, GROUP_NAME, ...messageIds);
    }

    setImmediate(consume); // Non-blocking loop
  }

  consume();
}
```

## Connection Pooling and Memory Management

At scale, memory management becomes critical. Each WebSocket connection in `uWS` costs ~1.3 KB for the socket itself. At 50k connections per pod, that's 65 MB just for connection overhead — manageable, but you need to be careful about what you attach to each socket.

I kept the per-connection data minimal (`userId` + `deviceId`). User preferences, notification history, and other data stays in Redis, fetched only when needed.

For graceful pod shutdown (during deploys), I implemented a draining strategy:

```typescript
process.on('SIGTERM', async () => {
  // Stop accepting new connections
  server.close();

  // Notify connected clients to reconnect to another pod
  for (const [userId, sockets] of connections) {
    for (const ws of sockets) {
      ws.send(JSON.stringify({ type: 'RECONNECT', delay: 3000 }));
      ws.end(1001, 'Server shutting down');
    }
  }

  // Wait for connections to drain
  await new Promise(resolve => setTimeout(resolve, 5000));
  process.exit(0);
});
```

Clients receive the `RECONNECT` message, wait 3 seconds, then reconnect — by which time the load balancer has stopped sending traffic to the shutting-down pod.

## Load Testing Results

I used `artillery` with a custom WebSocket plugin for load testing:

| Concurrent Connections | Pod Count | Avg Latency | Memory/Pod | CPU/Pod |
|---|---|---|---|---|
| 10,000 | 1 | 8ms | 340 MB | 12% |
| 50,000 | 1 | 14ms | 890 MB | 31% |
| 100,000 | 2 | 11ms | 870 MB each | 28% each |
| 200,000 | 4 | 12ms | 880 MB each | 30% each |

The system scaled linearly. Adding a pod doubled capacity with minimal overhead from the Redis Stream coordination.

## What I'd Change

**Consider using Redis Cluster for > 1M connections.** A single Redis instance becomes the bottleneck at extreme scale. Redis Cluster with stream sharding by user ID shard handles this.

**Add a circuit breaker on the consumer loop.** If Redis is slow or unavailable, the consume loop hammers it with retries. A proper circuit breaker with exponential backoff is essential in production.

The architecture held up well in production. Real-time notifications are now delivered in under 50ms end-to-end for 95% of events — a significant improvement over the polling approach it replaced.
