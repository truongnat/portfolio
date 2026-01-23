---
title: "TypeScript Pitfalls: Any, Enums, and Type Assertions"
date: "2023-12-10"
description: "Is TypeScript making you slower? We explore the top anti-patterns: the 'Any' escape hatch, runtime dangers of Enums, and why Type Assertions hide bugs."
slug: "typescript-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# TypeScript Pitfalls: Any, Enums, and Type Assertions

TypeScript's greatest enemy is the developer's desire to "just make the error go away." Here are the traps that turn TypeScript into a burden.

## 1. The `any` Addiction

**The Pitfall:** Using `any` to skip a complex generic type.
**The Result:** You lose all the benefits of TypeScript. It becomes "invisible" JavaScript that might crash at any moment.
**The Fix:** Use `unknown`. It forces you to perform a type check (Type Guard) before you can use the variable.

## 2. Type Assertions (`as T`)

**The Pitfall:** `const user = response.data as User;`
**The Risk:** You are lying to the compiler. If the API changes and returns an object without an `id`, TypeScript won't warn you, but your code will crash.
**The Fix:** Use **Type Guards** or **Schema Validation (Zod)**. Verify at runtime that the data actually matches the type.

## 3. The Enums Disaster

**The Pitfall:** Using standard `enum Status { A, B }`.
**The Reality:** Enums in TS are "weird." They generate real JS code (objects) and have strange numeric indexing issues.
**The Fix:** Use **Union of Strings** or `const enum`.
*   *Better:* `type Status = 'active' | 'inactive';` (Zero runtime overhead, much cleaner).

## 4. `Non-null Assertion` (!.)

**The Pitfall:** `user!.profile!.email`.
**The Risk:** The "Billion Dollar Mistake." If any of those are null, your app dies.
**The Fix:** Use **Optional Chaining** (`?.`) and handle the null case explicitly with a default value (`??`).

## Summary

Success with TypeScript is about **Honesty**. Don't lie to the compiler with `any` or `as`. Use `unknown`, Union types, and Type Guards to build a codebase that is as safe as it is readable.