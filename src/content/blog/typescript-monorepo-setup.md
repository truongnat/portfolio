---
title: "TypeScript Monorepo: Sharing Types Between Next.js Frontend and NestJS Backend"
date: "2026-03-24"
description: "How I set up a TypeScript monorepo with Turborepo and Bun workspaces, shared a Zod validation schema package between Next.js and NestJS, and configured CI/CD for the whole thing."
slug: "typescript-monorepo-setup"
published: true
tags: ["Frontend", "Backend", "TypeScript", "Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&q=80&w=1000"
---

# TypeScript Monorepo: Sharing Types Between Next.js Frontend and NestJS Backend

Every full-stack TypeScript project eventually hits the same problem: you define a `User` type in your NestJS backend, then define *roughly the same* `User` type in your Next.js frontend, and then spend the next year making sure they stay in sync. They never do. An API response changes shape, the frontend's type doesn't update, and you get a subtle runtime bug that only shows up in production.

The fix is a monorepo with a shared types package. Here's how I set one up using **Turborepo** and **Bun workspaces**, and why Zod ended up being the real hero of the story.

## Repository Structure

```
my-project/
├── apps/
│   ├── web/          # Next.js 14 App Router
│   └── api/          # NestJS
├── packages/
│   ├── types/        # Shared TypeScript types
│   ├── schemas/      # Zod validation schemas (the important one)
│   └── config/       # Shared ESLint, TypeScript config
├── turbo.json
├── package.json      # Workspace root
└── bun.lockb
```

## Setting Up Bun Workspaces

At the workspace root `package.json`:

```json
{
  "name": "my-project",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0"
  }
}
```

Run `bun install` at the root and Bun links all workspace packages. The `packages/schemas` package becomes available as `@my-project/schemas` in both `apps/web` and `apps/api`.

## The Shared Schemas Package

This is where the real value lives. Instead of sharing raw TypeScript types, I share **Zod schemas** — because a schema can validate at runtime *and* derive TypeScript types. One source of truth for both.

```typescript
// packages/schemas/src/user.schema.ts
import { z } from 'zod';

export const UserRoleSchema = z.enum(['admin', 'manager', 'user']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  role: UserRoleSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type User = z.infer<typeof UserSchema>;

// For API responses with pagination
export const PaginatedUsersSchema = z.object({
  data: z.array(UserSchema),
  meta: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export type PaginatedUsers = z.infer<typeof PaginatedUsersSchema>;

// Create/Update DTOs
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;
```

The `packages/schemas/package.json`:

```json
{
  "name": "@my-project/schemas",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch"
  },
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

I use `tsup` for building the shared package because it handles CJS/ESM dual format with a single command.

## Using Schemas in NestJS

NestJS + Zod works beautifully with `nestjs-zod`:

```typescript
// apps/api/src/users/users.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateUserSchema, UpdateUserSchema, PaginatedUsers } from '@my-project/schemas';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateUserSchema)) dto: CreateUserDTO
  ) {
    return this.usersService.create(dto);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20'
  ): Promise<PaginatedUsers> {
    return this.usersService.paginate(Number(page), Number(limit));
  }
}
```

The `ZodValidationPipe` uses the same `CreateUserSchema` from the shared package to validate incoming request bodies. If validation fails, NestJS returns a 400 with Zod's detailed error messages.

## Using Schemas in Next.js

On the frontend, I use the schemas for two purposes: typing API responses and validating form inputs.

```typescript
// apps/web/src/lib/api/users.ts
import { PaginatedUsersSchema, PaginatedUsers } from '@my-project/schemas';

export async function fetchUsers(page: number): Promise<PaginatedUsers> {
  const response = await fetch(`/api/users?page=${page}`);
  const json = await response.json();

  // Runtime validation — if the API response shape changes,
  // this throws immediately instead of silently failing
  return PaginatedUsersSchema.parse(json);
}
```

For forms using React Hook Form:

```typescript
// apps/web/src/components/CreateUserForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema, CreateUserDTO } from '@my-project/schemas';

export function CreateUserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateUserDTO>({
    resolver: zodResolver(CreateUserSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
}
```

The exact same schema validates the form on the frontend and the request body on the backend.

## Turborepo Configuration

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    }
  }
}
```

The `"dependsOn": ["^build"]` means apps only build after their package dependencies are built. Turborepo handles the dependency graph automatically.

## CI/CD for the Monorepo

With GitHub Actions and Turborepo's remote cache:

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build
        run: bunx turbo run build
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}

      - name: Lint
        run: bunx turbo run lint

      - name: Test
        run: bunx turbo run test
```

Turborepo's remote cache (`TURBO_TOKEN`) means builds that haven't changed are restored from cache in seconds. In practice, a PR that only touches the frontend skips the backend build entirely.

## Path Aliases

To avoid `../../../../packages/schemas` imports, I configure path aliases in each app's `tsconfig.json`:

```json
// apps/web/tsconfig.json
{
  "extends": "@my-project/config/tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@schemas/*": ["../../packages/schemas/src/*"]
    }
  }
}
```

For runtime resolution in Next.js, add the paths to `next.config.js` using `transpilePackages`:

```javascript
// apps/web/next.config.js
module.exports = {
  transpilePackages: ['@my-project/schemas', '@my-project/config'],
};
```

## The Payoff

The monorepo setup has a real upfront cost — about a day to configure properly. But the dividends are immediate and compound over time:

- **Type safety end-to-end**: Change a field in `UserSchema` and both the NestJS controller *and* the Next.js component will show TypeScript errors immediately.
- **Single source of validation truth**: No more frontend and backend validation logic drifting apart.
- **Turborepo caching**: CI runs that hit the cache complete in under 2 minutes instead of 8.
- **Developer ergonomics**: `bun dev` at the repo root starts all apps simultaneously.

If you're building a TypeScript full-stack app and not using a monorepo yet, this setup is worth the investment.
