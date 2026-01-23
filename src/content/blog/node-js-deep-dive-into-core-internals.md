---
title: "Under the Hood: V8, Libuv, and the Node.js Event Loop"
date: "2024-01-20"
description: "What is Node.js actually? A technical deep dive into the V8 JavaScript engine, the Libuv thread pool, and how the Event Loop really works."
slug: "node-js-deep-dive-into-core-internals"
published: true
tags: ["Backend", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood: V8, Libuv, and the Node.js Event Loop

Node.js is not a language; it's a runtime that orchestrates three main components to achieve high-performance I/O.

## 1. V8: The Compiler

Written by Google, V8 compiles JavaScript into machine code (JIT) rather than interpreting it.
*   **The Hidden Classes:** V8 optimizes objects into "Hidden Classes" to make property access as fast as a C++ struct.
*   **Garbage Collection:** V8 uses a Generational GC (Young vs Old generation) to keep pauses short.

## 2. Libuv: The Muscle

JavaScript is single-threaded, but the OS is not. **Libuv** is a C library that manages:
*   **Thread Pool:** A default pool of 4 threads for "heavy" operations like File I/O and DNS lookups.
*   **The Event Loop:** The famous loop that handles timers, network callbacks, and I/O.

## 3. The Event Loop Phases

1.  **Timers:** `setTimeout` and `setInterval`.
2.  **Pending Callbacks:** System errors (e.g., connection refused).
3.  **Poll:** Fetch new I/O events.
4.  **Check:** `setImmediate`.
5.  **Close Callbacks:** `socket.on('close', ...)`.

## 4. The C++ Bridge

How does JS talk to C++?
*   **Node-API:** A stable interface that allows C++ modules to survive Node.js version updates.
*   **Wrappers:** When you call `fs.readFile`, you are actually calling a C++ function that Libuv executes on a background thread.

## Summary

Node.js's power comes from **Asynchronous Offloading**. By using V8 for speed and Libuv for non-blocking I/O, it allows a single JavaScript thread to coordinate thousands of concurrent operations efficiently.