---
title: "PostgreSQL Row Level Security: Multi-Tenant Architecture Done Right"
date: "2026-03-24"
description: "A practical guide to PostgreSQL Row Level Security for multi-tenant applications — policy types, JWT claims integration, tenant isolation, and performance gotchas with real SQL examples."
slug: "postgresql-row-level-security"
published: true
tags: ["Backend", "PostgreSQL", "Security", "Database"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000"
---

# PostgreSQL Row Level Security: Multi-Tenant Architecture Done Right

In multi-tenant applications, tenant isolation is usually enforced in application code: every query includes a `WHERE tenant_id = $1` clause, and you hope every developer on the team remembers to add it. That's a fragile guarantee. One missing WHERE clause and Tenant A reads Tenant B's data.

PostgreSQL's Row Level Security (RLS) moves that guarantee into the database. The isolation is enforced at the storage layer, not the application layer. Even if your application code has a bug and forgets the tenant filter, the database silently enforces it. I've used RLS in both my Agentic SDLC project and client portfolio applications, and I'll never go back to application-layer-only isolation for multi-tenant systems.

## What Row Level Security Does

RLS lets you attach **policies** to a table that control which rows each database role can see or modify. When enabled, a `SELECT` query only returns rows where the policy evaluates to `true`. No policy match means no row — no error, no data.

```sql
-- Without RLS: returns all projects
SELECT * FROM projects;

-- With RLS and a tenant policy: only returns the current tenant's projects
SELECT * FROM projects; -- same query, filtered by policy
```

The magic is that RLS is transparent to the application. Same SQL, different results depending on who's executing it.

## Enabling RLS

```sql
-- Enable RLS on a table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- By default, RLS blocks ALL access to the table owner too
-- Use FORCE ROW LEVEL SECURITY to apply to superusers/owners as well
ALTER TABLE projects FORCE ROW LEVEL SECURITY;
```

Once enabled, a table has no accessible rows until you add at least one policy.

## Policy Types

PostgreSQL RLS policies can target specific commands:

```sql
-- SELECT policy: users can only see their own tenant's projects
CREATE POLICY tenant_isolation_select ON projects
  FOR SELECT
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- INSERT policy: new rows must belong to the current tenant
CREATE POLICY tenant_isolation_insert ON projects
  FOR INSERT
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- UPDATE policy: can only update own tenant's rows
CREATE POLICY tenant_isolation_update ON projects
  FOR UPDATE
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID)
  WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- DELETE policy
CREATE POLICY tenant_isolation_delete ON projects
  FOR DELETE
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);
```

`USING` controls which *existing* rows are visible (for SELECT, UPDATE, DELETE). `WITH CHECK` controls which rows are *allowed* in write operations.

## Integrating JWT Claims

The most elegant pattern I've used is passing JWT claims through PostgreSQL's `current_setting()` mechanism. Your application sets the tenant context at the start of each connection/transaction:

```typescript
// In your database middleware (e.g., Express)
async function setTenantContext(pool: Pool, tenantId: string, userId: string) {
  const client = await pool.connect();
  await client.query(`
    SELECT
      set_config('app.current_tenant_id', $1, true),
      set_config('app.current_user_id', $2, true)
  `, [tenantId, userId]);
  return client;
}

// In your JWT verification middleware
app.use(async (req, res, next) => {
  const payload = verifyJwt(req.headers.authorization);
  req.db = await setTenantContext(pool, payload.tenantId, payload.userId);
  next();
});
```

The `true` parameter in `set_config` makes it transaction-local — the setting resets after the transaction commits. This is critical for connection pool safety.

Now your policies can reference both tenant and user context:

```sql
-- Users can only see their own data within the tenant
CREATE POLICY user_isolation ON user_documents
  FOR ALL
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND owner_id = current_setting('app.current_user_id')::UUID
  );

-- Or more permissive: any user in the tenant can see shared docs
CREATE POLICY tenant_and_shared ON documents
  FOR SELECT
  USING (
    tenant_id = current_setting('app.current_tenant_id')::UUID
    AND (is_shared = true OR owner_id = current_setting('app.current_user_id')::UUID)
  );
```

## Multiple Policies on One Table

Multiple policies on the same table are combined with OR for permissive policies (default) and AND for restrictive policies:

```sql
-- Policy 1: Owner can see their own docs
CREATE POLICY owner_access ON documents
  FOR SELECT
  USING (owner_id = current_setting('app.current_user_id')::UUID);

-- Policy 2: Shared docs visible to tenant members
CREATE POLICY shared_access ON documents
  FOR SELECT
  USING (
    is_shared = true
    AND tenant_id = current_setting('app.current_tenant_id')::UUID
  );

-- A row is visible if EITHER policy is satisfied
```

For restrictive policies (add `AS RESTRICTIVE`), both must pass. Use restrictive policies for hard security constraints that can never be bypassed.

## Performance Gotchas

RLS policies add overhead, but it's manageable if you index correctly.

**Problem:** Without indexes on policy columns, every query forces a full table scan to evaluate the policy.

**Solution:** Index every column used in RLS policies:

```sql
-- Essential indexes for RLS performance
CREATE INDEX idx_projects_tenant_id ON projects (tenant_id);
CREATE INDEX idx_documents_tenant_owner ON documents (tenant_id, owner_id);

-- Partial index for shared docs query pattern
CREATE INDEX idx_documents_shared ON documents (tenant_id)
  WHERE is_shared = true;
```

**Problem:** `current_setting()` calls in policies can't always be inlined by the planner.

**Solution:** Use security definer functions that the planner can optimize:

```sql
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID AS $$
  SELECT current_setting('app.current_tenant_id')::UUID;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Use function in policy instead of direct current_setting()
CREATE POLICY tenant_isolation ON projects
  FOR SELECT
  USING (tenant_id = current_tenant_id());
```

**Always test with EXPLAIN ANALYZE** to verify index usage:

```sql
EXPLAIN ANALYZE
SELECT * FROM projects WHERE status = 'active';
-- Should show Index Scan using idx_projects_tenant_id
-- Not Seq Scan
```

## A Note on Bypassing RLS

Some operations legitimately need to bypass RLS — admin scripts, migrations, reporting queries. Use a role with `BYPASSRLS` privilege and be explicit about it:

```sql
-- Create a privileged role for admin operations
CREATE ROLE app_admin BYPASSRLS;
GRANT app_admin TO your_admin_user;
```

Never bypass RLS from your application's regular connection pool. Keep privileged access to dedicated tools and scripts.

Row Level Security is one of those PostgreSQL features that, once you understand it, becomes a standard tool in your multi-tenant architecture. The upfront investment in policies and indexing pays for itself the first time you catch a missing tenant filter in code review — and realize the database would have caught it anyway.
