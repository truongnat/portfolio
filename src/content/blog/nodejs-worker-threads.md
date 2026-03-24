---
title: "CPU-Bound Tasks in Node.js: Worker Threads and Redis Streams in Practice"
date: "2026-03-24"
description: "How I offloaded CPU-intensive PDF generation and data aggregation to a Worker Threads pool, connected via Redis Streams, to keep Node.js API response times under 100ms."
slug: "nodejs-worker-threads"
published: true
tags: ["Backend", "Node.js", "Performance"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000"
---

# CPU-Bound Tasks in Node.js: Worker Threads and Redis Streams in Practice

Node.js is excellent at I/O-bound tasks. It's poorly suited for CPU-bound tasks — and that's not a knock on it, it's just physics. When you run a heavy computation on the main thread, you block the event loop, and every other request waits. I learned this lesson the hard way building a reporting service that generated PDF reports from complex data sets.

This post covers how I used Worker Threads and Redis Streams to solve the CPU bottleneck and keep API response times under 100ms even during heavy report generation.

## The Problem: Blocking the Event Loop

Our reporting service had an endpoint that:
1. Queried 6 months of order data (~50,000 rows)
2. Aggregated it into pivot tables and trend calculations
3. Generated a multi-page PDF using `pdfmake`

On the main thread, this took 2-4 seconds per report. During that time, every other API request was blocked. Under load, a few simultaneous report requests would bring API response times from 50ms to 8+ seconds for unrelated endpoints.

```typescript
// The problematic original implementation
app.post('/reports/generate', async (req, res) => {
  const data = await fetchOrderData(req.body.dateRange); // ~200ms
  const aggregated = aggregateData(data); // ~1.5s CPU work ❌
  const pdf = await generatePDF(aggregated); // ~1.5s CPU work ❌
  res.send(pdf);
  // Total: ~3.2s, all on main thread
});
```

## Why Not Just Use child_process?

The older solution is `child_process.fork()`. It works, but:
- Each fork is a full Node.js process with its own V8 heap (~50MB overhead)
- IPC between processes is slower than shared memory
- You can't share `ArrayBuffer`s between processes without copying

**Worker Threads** run in the same process, share the V8 heap for transferable objects, and have lower overhead per thread. For CPU-intensive tasks that need to share data, they're the right tool.

## The Worker Thread Pool

I built a simple worker pool that reuses threads instead of creating a new one per task:

```typescript
// workers/pool.ts
import { Worker } from 'worker_threads';
import path from 'path';
import { EventEmitter } from 'events';

interface WorkerTask<T> {
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
  data: unknown;
}

export class WorkerPool<TInput, TOutput> extends EventEmitter {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private queue: WorkerTask<TOutput>[] = [];

  constructor(
    private readonly workerFile: string,
    private readonly poolSize: number = 4
  ) {
    super();
    this.initWorkers();
  }

  private initWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker(this.workerFile);

      worker.on('message', (result: TOutput) => {
        const task = (worker as any)._currentTask as WorkerTask<TOutput>;
        if (task) {
          task.resolve(result);
          delete (worker as any)._currentTask;
        }
        this.onWorkerFree(worker);
      });

      worker.on('error', (error) => {
        const task = (worker as any)._currentTask as WorkerTask<TOutput>;
        if (task) {
          task.reject(error);
          delete (worker as any)._currentTask;
        }
        this.onWorkerFree(worker);
      });

      this.workers.push(worker);
      this.idleWorkers.push(worker);
    }
  }

  run(data: TInput): Promise<TOutput> {
    return new Promise((resolve, reject) => {
      const task: WorkerTask<TOutput> = { resolve, reject, data };

      if (this.idleWorkers.length > 0) {
        this.dispatch(this.idleWorkers.pop()!, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  private dispatch(worker: Worker, task: WorkerTask<TOutput>) {
    (worker as any)._currentTask = task;
    worker.postMessage(task.data);
  }

  private onWorkerFree(worker: Worker) {
    if (this.queue.length > 0) {
      this.dispatch(worker, this.queue.shift()!);
    } else {
      this.idleWorkers.push(worker);
    }
  }

  async destroy() {
    await Promise.all(this.workers.map((w) => w.terminate()));
  }
}
```

## The Worker Implementation

The worker file runs in its own V8 context and receives tasks via `parentPort`:

```typescript
// workers/report.worker.ts
import { parentPort, workerData } from 'worker_threads';
import { aggregateData } from '../lib/aggregation';
import { generatePDF } from '../lib/pdf';

if (!parentPort) throw new Error('Must run as Worker Thread');

parentPort.on('message', async (task: ReportTask) => {
  try {
    const aggregated = aggregateData(task.data);
    const pdfBuffer = await generatePDF(aggregated, task.options);

    // Transfer the buffer without copying using Transferable
    parentPort!.postMessage(
      { success: true, buffer: pdfBuffer.buffer },
      [pdfBuffer.buffer] // Transfer ownership — zero copy
    );
  } catch (error) {
    parentPort!.postMessage({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});
```

The `[pdfBuffer.buffer]` in the second argument to `postMessage` is the key optimization — it transfers ownership of the `ArrayBuffer` to the main thread without copying the bytes.

## Adding Redis Streams for Async Jobs

Some reports are too large to handle in a request-response cycle (minutes of generation time). For these, I used Redis Streams as a job queue:

```typescript
// services/report.service.ts
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);
const STREAM = 'report:jobs';

export async function enqueueReport(params: ReportParams): Promise<string> {
  const jobId = `job:${Date.now()}:${Math.random().toString(36).slice(2)}`;

  await redis.xadd(STREAM, '*',
    'jobId', jobId,
    'params', JSON.stringify(params),
    'status', 'pending',
    'createdAt', new Date().toISOString()
  );

  return jobId;
}

export async function getJobStatus(jobId: string): Promise<JobStatus> {
  const status = await redis.hgetall(`report:status:${jobId}`);
  return status as unknown as JobStatus;
}
```

The worker consumer picks up jobs from the stream and processes them with the thread pool:

```typescript
// workers/report.consumer.ts
import { Redis } from 'ioredis';
import { WorkerPool } from './pool';
import path from 'path';

const redis = new Redis(process.env.REDIS_URL!);
const pool = new WorkerPool(
  path.join(__dirname, 'report.worker.js'),
  Math.max(2, os.cpus().length - 1) // Leave 1 CPU for the event loop
);

async function consume() {
  const GROUP = 'report-workers';
  const CONSUMER = `worker-${process.pid}`;

  while (true) {
    const results = await redis.xreadgroup(
      'GROUP', GROUP, CONSUMER,
      'COUNT', '5',
      'BLOCK', '1000',
      'STREAMS', 'report:jobs', '>'
    );

    if (!results) continue;

    for (const [, messages] of results) {
      for (const [id, fields] of messages) {
        const jobId = fields[fields.indexOf('jobId') + 1];
        const params = JSON.parse(fields[fields.indexOf('params') + 1]);

        try {
          // Update status
          await redis.hset(`report:status:${jobId}`, 'status', 'processing');

          // Run in worker thread pool
          const result = await pool.run({ jobId, params });

          // Store result in Redis (or S3/storage)
          await redis.set(`report:result:${jobId}`, result.buffer, 'EX', 3600);
          await redis.hset(`report:status:${jobId}`,
            'status', 'completed',
            'completedAt', new Date().toISOString()
          );

          await redis.xack('report:jobs', GROUP, id);
        } catch (error) {
          await redis.hset(`report:status:${jobId}`,
            'status', 'failed',
            'error', String(error)
          );
          await redis.xack('report:jobs', GROUP, id);
        }
      }
    }
  }
}

consume();
```

## Results

After implementing the worker pool + Redis Streams architecture:

| Metric | Before | After |
|---|---|---|
| API p99 latency (during report gen) | 8,200ms | 95ms |
| Report generation throughput | 1 concurrent | 7 concurrent (per node) |
| Main thread CPU during report gen | 85-95% | 5-8% |
| Memory per report | N/A | 45 MB (in worker, released after) |

The p99 API latency improvement is the most important number. Unrelated endpoints are no longer affected by report generation. The main thread stays free for I/O handling.

**Key takeaway**: Node.js isn't the wrong tool for CPU-bound tasks — it's wrong to run them on the main thread. Worker Threads give you the parallelism you need while keeping the event loop responsive. Combine them with Redis Streams for durable job queuing and you have a robust async processing pipeline that scales horizontally.
