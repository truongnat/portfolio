---
title: "Under the Hood: CPython, Bytecode, and PyObject"
date: "2024-01-15"
description: "How does Python execute your code? A technical deep dive into the CPython interpreter, bytecode compilation, and the 'Everything is an Object' philosophy."
slug: "python-deep-dive-into-core-internals"
published: true
tags: ["Backend", "Python"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: CPython, Bytecode, and PyObject

Python is a high-level language, but the CPython interpreter is a complex piece of C engineering.

## 1. Everything is a `PyObject`

In CPython, every integer, string, and function is a C struct called a `PyObject`.
*   **The Cost:** This is why Python is slower than C. A single integer doesn't just store bits; it stores a reference count, a type pointer, and the value.

## 2. Compilation to Bytecode

Python code is not interpreted line-by-line.
*   **Step 1:** Tokenizing & Parsing into an AST (Abstract Syntax Tree).
*   **Step 2:** Compiling into `.pyc` Bytecode.
*   **Step 3:** The Virtual Machine executes the bytecode.
*   **The Command:** Use `dis.dis(my_function)` to see the raw bytecode instructions.

## 3. Reference Counting vs. Garbage Collection

Python uses two systems to manage memory:
1.  **Reference Counting:** When an object's reference count hits 0, it's deleted instantly.
2.  **Cyclic GC:** Periodically scans for "Circular References" (A points to B, B points to A) that ref counting missed.

## 4. The Interning Mechanism

Python optimizes memory by reusing small integers (-5 to 256) and short strings.
*   **The Benefit:** Calling `x = 100` multiple times always points to the same object in memory.

## Summary

CPython is a **Stack-Based Virtual Machine**. Understanding the object model and the compilation lifecycle allows you to write code that works with the interpreter's strengths rather than against them.