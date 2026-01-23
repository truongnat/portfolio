---
title: "Advanced TypeScript: Type Gymnastics and Domain Modeling"
date: "2023-11-15"
description: "Master the type system. Learn how to use Mapped Types, Template Literals, and Discriminated Unions to build bulletproof domain models."
slug: "typescript-advanced-patterns-and-best-practices"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000"
---

# Advanced TypeScript: Type Gymnastics and Domain Modeling

To build elite libraries or complex enterprise systems, you must treat TypeScript as a functional programming language that operates on **Types** rather than values.

## 1. Discriminated Unions (The "Secret" to State)

Stop using multiple boolean flags (`isLoading`, `isError`).
*   **The Power:** Use a single `status` string to define a union of states.
*   **Benefit:** TypeScript "guards" your logic. You cannot access `data` if the status is `error`.

```typescript
type UIState = 
  | { status: 'loading' }
  | { status: 'success', data: string[] }
  | { status: 'error', message: string };
```

## 2. Template Literal Types (TS 4.1+)

Need a type that represents all combinations of CSS positions?
*   **Syntax:** `` `${'top' | 'bottom'}-${'left' | 'right'}` ``
*   **Result:** `top-left | top-right | bottom-left | bottom-right`.

## 3. Mapped Types and `infer`

*   **Mapped Types:** Create new types based on an existing interface (e.g., making all properties `readonly` or `optional`).
*   **Infer:** The most powerful keyword in TS. Use it to extract the return type of a function or the type of a Promise's result.

```typescript
type GetPromiseType<T> = T extends Promise<infer U> ? U : T;
```

## 4. Opaque / Branded Types

TypeScript is **Structurally Typed** (if it looks like a duck, it's a duck).
*   **Advanced Pattern:** Create "Opaque" types to distinguish between two strings (e.g., `Email` vs `PasswordHash`) at the type level.

## Summary

Advanced TypeScript is about **Exclusion**. Your goal is to write types so precise that it is *mathematically impossible* to represent an invalid state in your code.