---
title: "PostgreSQL Performance Tuning: Indexes, EXPLAIN ANALYZE, and Query Optimization"
date: "2026-03-24"
description: "A practical guide to diagnosing and fixing slow PostgreSQL queries — reading EXPLAIN ANALYZE output, choosing the right index type, and eliminating common performance anti-patterns."
slug: "postgresql-performance-tuning"
published: true
tags: ["Backend", "PostgreSQL", "Performance", "Database"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# PostgreSQL Performance Tuning: Indexes, EXPLAIN ANALYZE, and Query Optimization

Most performance problems I've seen in PostgreSQL applications share a common origin: the developer wrote the SQL to produce correct results and never looked at how the database was executing it. When things are slow, it's almost always because the database is doing far more work than necessary — and the fix is usually an index or a query rewrite that takes ten minutes once you know what to look for.

Here's my process for finding and fixing slow queries.

## Step 1: Find the Slow Queries

Before tuning anything, find what actually needs tuning. Enable `pg_stat_statements` — a PostgreSQL extension that tracks query statistics across all executions:

```sql
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Find the 10 slowest queries by total time
SELECT
  query,
  calls,
  total_exec_time / 1000 AS total_seconds,
  mean_exec_time AS avg_ms,
  rows
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

This shows you where time is actually being spent, not where you think it's being spent. I've been surprised more than once.

## Step 2: Read EXPLAIN ANALYZE

`EXPLAIN ANALYZE` runs the query and shows the actual execution plan with timing. This is the core diagnostic tool.

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.email, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.email
ORDER BY order_count DESC
LIMIT 20;
```

A typical output:

```
Limit  (cost=1542.83..1542.88 rows=20 width=52) (actual time=45.234..45.237 rows=20 loops=1)
  ->  Sort  (cost=1542.83..1568.08 rows=10100 width=52) (actual time=45.232..45.233 rows=20 loops=1)
        Sort Key: (count(o.id)) DESC
        Sort Method: top-N heapsort  Memory: 26kB
        ->  HashAggregate  (cost=1163.50..1264.50 rows=10100 width=52) (actual time=38.421..42.891 rows=10100 loops=1)
              ->  Hash Left Join  (cost=412.50..1088.50 rows=15000 width=20) (actual time=5.234..28.445 rows=15000 loops=1)
                    Hash Cond: (o.user_id = u.id)
                    ->  Seq Scan on orders o  (cost=0.00..465.00 rows=15000 width=16) (actual time=0.012..8.234 rows=15000 loops=1)
                    ->  Hash  (cost=287.50..287.50 rows=10000 width=20) (actual time=4.891..4.891 rows=10000 loops=1)
                          ->  Seq Scan on users u  (cost=0.00..287.50 rows=10000 width=20) (actual time=0.009..2.456 rows=10000 loops=1)
                                Filter: (created_at > '2024-01-01')
                                Rows Removed by Filter: 5000
```

**What to look for:**

- **Seq Scan on large tables**: Sequential scans read every row. On a 100k-row table filtered to 100 rows, that's 99,900 unnecessary reads.
- **Rows Removed by Filter**: High numbers mean a missing index.
- **Nested Loop on large row counts**: Can become O(n²) very quickly.
- **actual time >> cost estimate**: The planner's estimate is wrong, usually because statistics are stale.
- **BUFFERS output**: `Buffers: shared hit=X read=Y` — high `read` means disk I/O (slow).

The `Seq Scan on users` with `Rows Removed by Filter: 5000` tells me I need an index on `users.created_at`.

## Index Types: Choosing the Right Tool

### B-tree (Default)

For equality checks, ranges, ordering. This is the right choice for 90% of indexes.

```sql
-- Equality
CREATE INDEX idx_orders_user_id ON orders (user_id);

-- Range queries on timestamps
CREATE INDEX idx_users_created_at ON users (created_at);

-- Composite: most selective column first
CREATE INDEX idx_orders_user_status ON orders (user_id, status);
```

Composite index order matters: `(user_id, status)` can serve `WHERE user_id = X` alone, but `(status, user_id)` cannot efficiently serve `WHERE user_id = X` alone.

### GIN (Generalized Inverted Index)

For JSONB, arrays, and full-text search. B-tree doesn't work for these.

```sql
-- JSONB containment queries
CREATE INDEX idx_events_metadata ON events USING GIN (metadata);

-- Query: find events where metadata contains a key
SELECT * FROM events WHERE metadata @> '{"type": "login"}';

-- Full-text search
CREATE INDEX idx_articles_search ON articles USING GIN (
  to_tsvector('english', title || ' ' || body)
);
```

### Partial Indexes

Index only the rows you actually query. Often 10x smaller and faster than full indexes.

```sql
-- Only index pending orders (most queries filter on pending)
CREATE INDEX idx_orders_pending ON orders (created_at)
  WHERE status = 'pending';

-- Only index active users
CREATE INDEX idx_users_active_email ON users (email)
  WHERE deleted_at IS NULL;
```

A partial index on 1% of rows is 100x smaller than a full index and fits entirely in memory. For write-heavy tables where you only query a subset, partial indexes are a significant win.

## Common Slow Query Patterns

**Pattern 1: Functions on indexed columns**

```sql
-- Bad: function call prevents index usage
WHERE LOWER(email) = 'user@example.com'

-- Fix: index the expression
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- Or: store already-lowercased in a generated column
ALTER TABLE users ADD COLUMN email_lower TEXT GENERATED ALWAYS AS (LOWER(email)) STORED;
CREATE INDEX idx_users_email_lower ON users (email_lower);
```

**Pattern 2: LIKE with leading wildcard**

```sql
-- Bad: can't use B-tree index
WHERE name LIKE '%smith%'

-- Fix: use GIN with pg_trgm for arbitrary substring search
CREATE EXTENSION pg_trgm;
CREATE INDEX idx_users_name_trgm ON users USING GIN (name gin_trgm_ops);

-- Now this uses the index
WHERE name ILIKE '%smith%'
```

**Pattern 3: N+1 queries**

```sql
-- Bad: one query per user
for user in users:
    orders = query("SELECT * FROM orders WHERE user_id = ?", user.id)

-- Fix: one query with JOIN or IN clause
SELECT u.*, o.*
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.id = ANY($1::uuid[])
```

## Connection Pooling

Every PostgreSQL connection consumes ~5-10MB of RAM and a backend process. At 200 concurrent requests each opening their own connection, you're using 1-2GB just for connection overhead before any actual queries run.

Use PgBouncer in transaction mode:

```
# pgbouncer.ini
[databases]
mydb = host=localhost dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20  # actual PostgreSQL connections
```

Transaction pooling means connections are returned to the pool between statements, not between sessions. This lets 1000 application connections share 20 PostgreSQL connections efficiently.

## VACUUM and Statistics

PostgreSQL's MVCC model means deleted rows aren't immediately removed — they're marked dead and cleaned up by VACUUM. Dead rows bloat tables and degrade query performance. Autovacuum handles this automatically, but for write-heavy tables, you may need to tune it:

```sql
-- Check table bloat
SELECT
  schemaname,
  relname AS tablename,
  n_dead_tup,
  n_live_tup,
  round(n_dead_tup::numeric / NULLIF(n_live_tup + n_dead_tup, 0) * 100, 1) AS dead_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- Manual vacuum analyze when needed
VACUUM ANALYZE orders;

-- More aggressive autovacuum for high-churn tables
ALTER TABLE orders SET (
  autovacuum_vacuum_scale_factor = 0.01,  -- trigger at 1% dead rows (vs 20% default)
  autovacuum_analyze_scale_factor = 0.005
);
```

The query planner uses statistics from ANALYZE to estimate row counts. Stale statistics cause bad query plans. If you see `actual rows=10000` but `estimated rows=100` in EXPLAIN output, run `ANALYZE tablename` and re-check.

Performance tuning in PostgreSQL isn't magic — it's methodical. Find the slow query, read the plan, find the missing index or the bad pattern, fix it, verify with EXPLAIN. Repeat. The tools are excellent; you just have to use them.
