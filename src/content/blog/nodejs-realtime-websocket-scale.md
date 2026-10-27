---
title: "Scaling WebSocket Connections with Node.js and Redis Streams"
date: "2026-03-24"
description: "A design for a real-time notification engine on Node.js and Redis Streams: horizontal scaling, reconnects, and where a single process runs out of room."
slug: "nodejs-realtime-websocket-scale"
published: true
tags: ["Backend", "Node.js", "Real-Time", "Performance"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

# Scaling WebSocket Connections with Node.js and Redis Streams

A notification engine with one socket per connected user will not fit in a single Node.js process. File descriptors and memory give out first, so the design scales out from the start.

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

At scale, memory management becomes critical. The socket itself is the small part. What you attach to each connection is what blows the process up.

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

## What I'd Change

**Consider Redis Cluster once one instance is the bottleneck.** Redis Cluster with stream sharding by user ID handles that case.

**Add a circuit breaker on the consumer loop.** If Redis is slow or unavailable, the consume loop hammers it with retries. A proper circuit breaker with exponential backoff is essential in production.
