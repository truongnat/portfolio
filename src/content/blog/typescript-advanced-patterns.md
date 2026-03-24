---
title: "TypeScript Advanced Patterns: Generics, Conditional Types, and Mapped Types"
date: "2026-03-24"
description: "A deep dive into the advanced TypeScript patterns I use in production: generic repositories, conditional response types, mapped API contracts, and template literal types."
slug: "typescript-advanced-patterns"
published: true
tags: ["Backend", "TypeScript", "Advanced"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# TypeScript Advanced Patterns: Generics, Conditional Types, and Mapped Types

After four years of TypeScript in production, I've accumulated a set of patterns that I reach for again and again. These aren't academic exercises — they're patterns that solved real problems in real codebases. Let me walk through the ones I find most valuable.

## Pattern 1: Generic Repository

The repository pattern gives you a clean data access layer, but implementing it for each entity is tedious without generics. Here's the base repository I use in every NestJS project:

```typescript
// lib/base.repository.ts
import { EntityManager, EntityTarget, FindManyOptions, FindOneOptions } from 'typeorm';

export abstract class BaseRepository<T extends { id: string }> {
  constructor(
    protected readonly entity: EntityTarget<T>,
    protected readonly manager: EntityManager
  ) {}

  async findById(id: string, options?: FindOneOptions<T>): Promise<T | null> {
    return this.manager.findOne(this.entity, {
      ...options,
      where: { id } as any,
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.manager.find(this.entity, options);
  }

  async save(entity: Partial<T>): Promise<T> {
    return this.manager.save(this.entity, entity as any);
  }

  async delete(id: string): Promise<void> {
    await this.manager.delete(this.entity, { id });
  }

  // Paginated query with typed result
  async paginate(
    page: number,
    limit: number,
    options?: FindManyOptions<T>
  ): Promise<PaginatedResult<T>> {
    const [items, total] = await this.manager.findAndCount(this.entity, {
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

Concrete repositories extend this with domain-specific queries:

```typescript
// repositories/user.repository.ts
@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(manager: EntityManager) {
    super(User, manager);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findById(email, {
      where: { email } as any,
    });
  }
}
```

## Pattern 2: Conditional Response Types

APIs often return different shapes based on query parameters — for example, a list endpoint can return paginated or non-paginated results. Conditional types let us express this at the type level:

```typescript
// types/api.ts

type Paginated = { paginated: true };
type NonPaginated = { paginated?: false };

type ApiListResponse<T, P extends Paginated | NonPaginated> =
  P extends Paginated
    ? { data: T[]; meta: PaginationMeta }
    : T[];

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Usage: TypeScript knows the exact return shape
async function getUsers(options: Paginated): Promise<ApiListResponse<User, Paginated>>;
async function getUsers(options?: NonPaginated): Promise<ApiListResponse<User, NonPaginated>>;
async function getUsers(options?: any): Promise<any> {
  if (options?.paginated) {
    return { data: await fetchUsers(), meta: await fetchUsersMeta() };
  }
  return fetchUsers();
}

// Call sites get correct types without casting
const paginated = await getUsers({ paginated: true });
paginated.data; // ✅ User[]
paginated.meta; // ✅ PaginationMeta

const list = await getUsers();
list[0]; // ✅ User (not { data, meta })
```

## Pattern 3: Mapped Types for API Contracts

One of the most powerful uses of mapped types is keeping API request/response types in sync with your domain models. Here's a pattern I use for defining DTO (Data Transfer Object) types from entity types:

```typescript
// types/dto.ts

// Make all properties optional for update operations
type UpdateDTO<T> = {
  [K in keyof T as K extends 'id' | 'createdAt' | 'updatedAt' ? never : K]?: T[K];
};

// Make specified fields required for create operations
type CreateDTO<T, Required extends keyof T = never> =
  Omit<UpdateDTO<T>, Required> & Pick<T, Required>;

// Example usage
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

type CreateUserDTO = CreateDTO<User, 'email' | 'displayName'>;
// Result: { email: string; displayName: string; role?: 'admin' | 'user'; }

type UpdateUserDTO = UpdateDTO<User>;
// Result: { email?: string; displayName?: string; role?: 'admin' | 'user'; }
```

This approach means your DTO types are always derived from the source of truth (the entity), so they update automatically when you add or remove fields.

## Pattern 4: Template Literal Types for Event Systems

I use this pattern extensively in event-driven architectures. Template literal types let you define a type-safe event bus:

```typescript
// events/types.ts

type EntityName = 'user' | 'order' | 'product';
type EventAction = 'created' | 'updated' | 'deleted';

// Generates: "user.created" | "user.updated" | "user.deleted" | "order.created" | ...
type EventName = `${EntityName}.${EventAction}`;

// Map each event to its payload type
interface EventPayloads {
  'user.created': { userId: string; email: string };
  'user.updated': { userId: string; changes: Partial<User> };
  'user.deleted': { userId: string };
  'order.created': { orderId: string; userId: string; total: number };
  'order.updated': { orderId: string; status: OrderStatus };
  'order.deleted': { orderId: string };
  'product.created': { productId: string; name: string };
  'product.updated': { productId: string; changes: Partial<Product> };
  'product.deleted': { productId: string };
}

// Type-safe event emitter
class TypedEventEmitter {
  emit<E extends EventName>(
    event: E,
    payload: EventPayloads[E]
  ): void {
    // emit logic
  }

  on<E extends EventName>(
    event: E,
    handler: (payload: EventPayloads[E]) => void
  ): void {
    // subscribe logic
  }
}

// Usage — fully type-checked
const emitter = new TypedEventEmitter();

emitter.emit('user.created', { userId: '123', email: 'hi@example.com' }); // ✅
emitter.emit('user.created', { userId: '123' }); // ❌ TypeScript error: missing 'email'
emitter.emit('user.magic' as any, {}); // Would be a TS error without cast
```

## Pattern 5: `satisfies` for Config Objects

Added in TypeScript 4.9, `satisfies` is underused. It validates that an object matches a type without widening the inferred type. This is perfect for config objects:

```typescript
type RouteConfig = {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  auth: boolean;
};

// With 'as RouteConfig[]', TypeScript widens to RouteConfig[] 
// and you lose the specific string literal types
const routes = [
  { path: '/users', method: 'GET', auth: true },
  { path: '/users', method: 'POST', auth: true },
  { path: '/health', method: 'GET', auth: false },
] satisfies RouteConfig[];

// 'method' is still 'GET' | 'POST', not string
const firstMethod = routes[0].method; // type: 'GET' (not string)
```

## Pattern 6: Discriminated Unions for State Management

This is the pattern I wish I'd learned earlier. Instead of having optional fields on a state object, use discriminated unions to model state machines explicitly:

```typescript
// Before: unclear what fields are valid in what states
interface FetchState<T> {
  loading: boolean;
  data?: T;
  error?: string;
}

// After: discriminated union — each state has exactly the right fields
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

// In a component or reducer
function renderContent(state: AsyncState<User[]>) {
  switch (state.status) {
    case 'idle':
      return null;
    case 'loading':
      return <Spinner />;
    case 'success':
      return <UserList users={state.data} />; // ✅ TypeScript knows data exists
    case 'error':
      return <ErrorMessage message={state.error} />; // ✅ TypeScript knows error exists
  }
}
```

TypeScript's exhaustiveness checking will warn you if you add a new status variant and forget to handle it — an incredibly useful safety net in long-lived codebases.

These patterns collectively make TypeScript feel less like a type-annotation chore and more like a design tool. The discriminated union pattern in particular has changed how I think about modeling state, even when not writing TypeScript.
