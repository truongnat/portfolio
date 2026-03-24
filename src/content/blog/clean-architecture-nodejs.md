---
title: "Clean Architecture with TypeScript and Node.js: A Practical Guide"
date: "2026-03-24"
description: "A ground-up guide to implementing Clean Architecture in a TypeScript Node.js project — real folder structure, dependency inversion, repository pattern, and use cases that actually make sense."
slug: "clean-architecture-nodejs"
published: true
tags: ["Architecture", "TypeScript", "Node.js", "Best Practices"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=1000"
---

# Clean Architecture with TypeScript and Node.js: A Practical Guide

I've restructured enough Node.js codebases to know what a codebase looks like before Clean Architecture and after. Before: controllers that call the ORM directly, business logic scattered across route handlers, tests that require a running database. After: layered, testable, portable code where changing your database means updating one file.

This is the practical guide I wish I'd had when I first encountered Uncle Bob's Clean Architecture. Less theory, more TypeScript.

## The Four Layers

Clean Architecture organizes code into concentric circles, where inner layers know nothing about outer layers. Dependencies point inward.

```
Presentation  (Express routes, REST controllers)
     ↓
Application   (Use cases, orchestration)
     ↓
Domain        (Entities, business rules, interfaces)
     ↑
Infrastructure (DB, external APIs, implementations)
```

The **Domain layer** is the heart. It contains your entities and business rules — pure TypeScript, no framework dependencies, no database imports.

The **Application layer** contains use cases. Each use case is a single business operation: `CreateUser`, `PlaceOrder`, `SendInvoice`. Use cases depend on domain interfaces, not implementations.

The **Infrastructure layer** implements those interfaces. Your PostgreSQL repository, your SendGrid email service, your S3 file storage — all live here.

The **Presentation layer** handles HTTP. Controllers take requests, call use cases, return responses. They know nothing about databases.

## Folder Structure

Here's the structure I use in production projects:

```
src/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   └── Order.ts
│   ├── repositories/
│   │   ├── IUserRepository.ts
│   │   └── IOrderRepository.ts
│   └── services/
│       └── IEmailService.ts
├── application/
│   └── use-cases/
│       ├── CreateUser.ts
│       ├── GetUser.ts
│       └── PlaceOrder.ts
├── infrastructure/
│   ├── database/
│   │   ├── PostgresUserRepository.ts
│   │   └── migrations/
│   ├── services/
│   │   └── SendGridEmailService.ts
│   └── container.ts   ← dependency injection
└── presentation/
    ├── routes/
    │   ├── userRoutes.ts
    │   └── orderRoutes.ts
    └── controllers/
        ├── UserController.ts
        └── OrderController.ts
```

## The Domain Layer: Pure TypeScript

Entities are classes (or plain objects) that encapsulate business rules. They don't extend any ORM base class. They're just TypeScript.

```typescript
// domain/entities/User.ts
export class User {
  readonly id: string;
  private _email: string;
  private _passwordHash: string;
  private _createdAt: Date;

  constructor(props: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
  }) {
    this.id = props.id;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt ?? new Date();
  }

  get email(): string {
    return this._email;
  }

  canChangeEmail(newEmail: string): boolean {
    return newEmail !== this._email && newEmail.includes('@');
  }
}
```

Repository interfaces live in the domain layer too — they define *what* persistence operations exist without caring *how* they're implemented:

```typescript
// domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

## The Application Layer: Use Cases

Each use case is a class with a single `execute` method. It receives its dependencies through the constructor (dependency injection), so it's fully testable without any real infrastructure.

```typescript
// application/use-cases/CreateUser.ts
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IEmailService } from '../../domain/services/IEmailService';
import { User } from '../../domain/entities/User';
import { hashPassword } from '../utils/crypto';
import { v4 as uuid } from 'uuid';

interface CreateUserInput {
  email: string;
  password: string;
}

export class CreateUser {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already registered');
    }

    const user = new User({
      id: uuid(),
      email: input.email,
      passwordHash: await hashPassword(input.password),
    });

    await this.userRepo.save(user);
    await this.emailService.sendWelcome(user.email);

    return user;
  }
}
```

Testing this is simple — just pass in mock implementations:

```typescript
it('throws if email already exists', async () => {
  const mockRepo: IUserRepository = {
    findByEmail: jest.fn().mockResolvedValue(existingUser),
    findById: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };
  const mockEmail: IEmailService = { sendWelcome: jest.fn() };

  const useCase = new CreateUser(mockRepo, mockEmail);
  await expect(useCase.execute({ email: 'a@b.com', password: '...' }))
    .rejects.toThrow('Email already registered');
});
```

No database. No HTTP. No framework. Pure logic.

## The Infrastructure Layer: Implementations

Here's where the real database lives. The PostgreSQL repository implements the interface defined in the domain:

```typescript
// infrastructure/database/PostgresUserRepository.ts
import { Pool } from 'pg';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class PostgresUserRepository implements IUserRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    if (!result.rows[0]) return null;
    return this.toDomain(result.rows[0]);
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, email, password_hash, created_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET email = $2`,
      [user.id, user.email, user.passwordHash, user.createdAt]
    );
  }

  private toDomain(row: any): User {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      createdAt: row.created_at,
    });
  }
}
```

## Wiring It Together: Dependency Injection

I use a simple container file (no DI framework needed for most projects):

```typescript
// infrastructure/container.ts
import { Pool } from 'pg';
import { PostgresUserRepository } from './database/PostgresUserRepository';
import { SendGridEmailService } from './services/SendGridEmailService';
import { CreateUser } from '../application/use-cases/CreateUser';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const userRepo = new PostgresUserRepository(pool);
export const emailService = new SendGridEmailService(process.env.SENDGRID_KEY!);
export const createUser = new CreateUser(userRepo, emailService);
```

The controller is thin — it translates HTTP to use case input and back:

```typescript
// presentation/controllers/UserController.ts
export class UserController {
  constructor(private readonly createUser: CreateUser) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.createUser.execute(req.body);
      res.status(201).json({ id: user.id, email: user.email });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}
```

## Why It's Worth the Upfront Investment

Clean Architecture adds some boilerplate. You write interfaces you wouldn't write otherwise. But the return on that investment compounds:

- **Test coverage becomes trivial.** Use cases are pure functions over interfaces.
- **Swapping databases is surgical.** Switch from PostgreSQL to DynamoDB? Write a new repository. Nothing else changes.
- **Onboarding new engineers is faster.** The structure tells you where things live before you read a line of code.
- **Business logic survives framework upgrades.** When you migrate from Express to Fastify, your domain and application layers don't change.

I've been using this structure for two years across projects of different sizes. It consistently produces codebases that are easier to maintain, test, and extend. That's the only metric that matters.
