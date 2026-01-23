---
title: "Strict TypeScript in Production: A Reliability Case Study"
date: "2023-10-10"
description: "How we moved a 50k-line JavaScript codebase to 'Strict' TypeScript, reducing production runtime errors by 90% and improving developer velocity."
slug: "typescript-a-practical-case-study"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=1000"
---

# Strict TypeScript in Production: A Reliability Case Study

Transitioning from JavaScript to TypeScript is common, but moving to `strict: true` is where the real value—and the real challenge—lies. This case study details our migration of a core banking service to strict TypeScript.

## The Challenge: "The Type-Any Virus"

Our initial TypeScript adoption was "loose."
*   **Problem:** Developers used `any` or `as any` whenever they hit a complex type error.
*   **Result:** Runtime crashes like `Cannot read property 'id' of undefined` were still making it to production.
*   **Tech Debt:** 30% of our types were inaccurate, leading to a false sense of security.

## The Solution: The "Strict" Mandate

We implemented a 3-month plan to enforce type correctness.

### 1. NoImplicitAny & StrictNullChecks
We enabled these two flags first. It forced us to handle the `undefined` case for every API response.
*   **Pattern:** Instead of `user.id`, we were forced to write `user?.id` or implement proper null guards.

### 2. Branding (Nominal Typing)
For critical data like `Currency` or `UserId`, we used **Branded Types**.
*   **Benefit:** Prevented accidentally passing a `string` (like an email) into a function expecting a `UserId`.

```typescript
type Brand<K, T> = T & { __brand: K };
type UserId = Brand<'UserId', string>;

function sendInvoice(id: UserId) { ... }
// Error: sendInvoice("not-an-id")
```

### 3. Zod for Schema Validation
We integrated **Zod** to validate data at the network boundary.
*   **Result:** TypeScript types were automatically inferred from our runtime validation schemas, ensuring our code and the database were always in sync.

## Results

| Metric | Loose TS (Old) | Strict TS (Modern) |
| :--- | :--- | :--- |
| **Production Crashes** | 12 / Month | 1 / Quarter |
| **Time Spent Debugging** | 15 hrs / week | 3 hrs / week |
| **Code Documentation** | Manual / Outdated | The Types ARE the Docs |

## Conclusion

Strict TypeScript is an investment in **Maintainability**. While the initial migration is difficult, the result is a codebase that is self-documenting, easy to refactor, and extremely resilient to the most common classes of software bugs.