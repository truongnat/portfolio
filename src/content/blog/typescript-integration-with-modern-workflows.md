---
title: "The TypeScript Modern Stack: Bun, Zod, and tRPC"
date: "2024-02-25"
description: "Building production apps at warp speed. How to use Bun for lightning-fast execution, Zod for schema validation, and tRPC for end-to-end type safety."
slug: "typescript-integration-with-modern-workflows"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# The TypeScript Modern Stack: Bun, Zod, and tRPC

The TypeScript ecosystem has evolved beyond simple `tsc` compilation. Modern workflows focus on speed, runtime safety, and **End-to-End Type Safety**.

## 1. Bun (The Speed Demon)

**Bun** is a fast all-in-one JavaScript runtime that runs TypeScript natively.
*   **Zero-Config:** No need for `ts-node` or `esbuild`. Just `bun run index.ts`.
*   **Performance:** Bun's package manager is 10x faster than npm, and its runtime is optimized for low-latency I/O.

## 2. Zod: The Single Source of Truth

Stop defining your interfaces twice (once for TS, once for validation).
*   **The Workflow:** Define a Zod schema. Infer the TS type from it.
```typescript
const UserSchema = z.object({ id: z.string() });
type User = z.infer<typeof UserSchema>;
```
*   **Benefit:** You guarantee that the data in your app actually matches the type definitions at runtime.

## 3. tRPC: End-to-End Type Safety

Why use REST and swagger? **tRPC** allows you to share your backend types directly with your frontend without generating code.
*   **The Magic:** If you rename a database column in the backend, your frontend `useQuery` call will immediately show a red squiggle.

## 4. Path Aliases

Stop using `../../../utils`.
*   **The Fix:** Use path aliases in `tsconfig.json`.
```json
"paths": {
  "@/*": ["./src/*"]
}
```

## Summary

Modern TypeScript integration is about **Eliminating Boundaries**. By sharing types between frontend and backend with tRPC and using Zod for runtime verification, you build a single, cohesive type-safe system.