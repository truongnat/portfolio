---
title: "Hardening TypeScript: Safe Parsing and Secure Types"
date: "2024-05-30"
description: "Is your type safety just an illusion? Learn how to safely parse JSON into types, prevent prototype pollution, and use 'unknown' for secure boundaries."
slug: "typescript-security-and-hardening-guide"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening TypeScript: Safe Parsing and Secure Types

Type safety is NOT security. TypeScript is erased at runtime. Here is how to ensure your types actually protect your application.

## 1. The `unknown` Boundary

Never type an API response as `any`.
*   **The Fix:** Type it as `unknown`.
*   **The Rule:** You cannot access any property on `unknown` without first narrowing the type (using `if (typeof ...)` or a Type Guard).

## 2. Safe JSON Parsing (Validation)

**The Pitfall:** `const user: User = JSON.parse(str)`.
**The Risk:** `JSON.parse` returns `any`. If the string is `"{}"`, your code thinks it has a valid User object, leading to runtime crashes.
**The Fix:** Use **Zod**.
```typescript
const UserSchema = z.object({ id: z.string() });
const user = UserSchema.parse(JSON.parse(str)); // Throws error if invalid
```

## 3. Branded Types for Sensitive Data

Prevent "ID Confusion" attacks.
*   **Scenario:** A function `deleteUser(userId: string)`.
*   **The Risk:** Passing an `accountId` instead of a `userId`.
*   **The Fix:** Use **Branded Types**. This makes `UserId` and `AccountId` distinct types even if they are both strings.

## 4. ESLint-Plugin-Security

Use static analysis to catch dangerous patterns.
*   **Catch:** `eval()`, non-literal regex (ReDoS), and unsafe buffer allocations.

## Summary

Security in TypeScript is about **Runtime Verification**. Treat every type that comes from outside your application as `unknown`, and use schema validation to prove it's safe before your logic ever touches it.