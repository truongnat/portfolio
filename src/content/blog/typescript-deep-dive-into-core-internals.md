---
title: "Under the Hood: Structural Typing and Variance in TypeScript"
date: "2024-01-20"
description: "How does the TS compiler think? A technical deep dive into Structural Typing, Variance (Covariance vs Contravariance), and the Language Service architecture."
slug: "typescript-deep-dive-into-core-internals"
published: true
tags: ["Backend", "TypeScript"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: Structural Typing and Variance in TypeScript

TypeScript is not just "JS with types." It's a complex mathematical engine that implements a **Structural Type System**.

## 1. Structural vs. Nominal Typing

*   **Nominal (Java/C#):** Two classes are different even if they have the same fields.
*   **Structural (TS):** If an object has the required properties of a type, it *is* that type.
*   **The Metaphor:** Java checks your Passport (Name). TypeScript checks your physical appearance (Structure).

## 2. The Language Service

Ever wonder how VS Code shows you errors in milliseconds?
*   **Architecture:** The TS compiler is split into two parts:
    1.  **The Compiler:** Generates `.js` and `.d.ts` files.
    2.  **The Language Service:** A separate process that provides autocomplete, refactoring, and error checking to IDEs. It uses an incremental update system to avoid re-parsing the entire project.

## 3. Variance (The Hardest Concept in TS)

*   **Covariance:** If `Dog` is a sub-type of `Animal`, is `List<Dog>` a sub-type of `List<Animal>`? (Usually yes).
*   **Contravariance:** What about functions? Is `(a: Animal) => void` a sub-type of `(d: Dog) => void`? (Surprisingly, yes).
*   **Why?** A function that can handle *any* animal can definitely handle a dog. This is the logic behind TS's function parameter checking.

## 4. Declaration Merging

TS allows you to define multiple interfaces with the same name across different files.
*   **The Power:** This is how plugins can add methods to the global `Window` object or to a library like `express` without modifying the original source.

## Summary

Understanding **Structural Typing** and **Variance** allows you to predict how TS will react to complex generic transformations. You move from "fighting the compiler" to "architecting with the compiler."