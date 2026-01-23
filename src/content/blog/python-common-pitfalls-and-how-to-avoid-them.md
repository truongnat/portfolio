---
title: "Python Pitfalls: Mutable Defaults and the GIL"
date: "2023-12-05"
description: "Why is your list growing unexpectedly? We explore the top Python traps: mutable default arguments, the Global Interpreter Lock (GIL), and circular import hell."
slug: "python-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["Backend", "Python"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Python Pitfalls: Mutable Defaults and the GIL

Python is easy to learn, but it has some "Gotchas" that can lead to catastrophic production bugs.

## 1. Mutable Default Arguments (The #1 Trap)

**The Pitfall:** `def add_to_list(val, my_list=[])`.
**The Result:** `my_list` is created ONCE when the function is defined. Every call sharing the default will append to the SAME list.
**The Fix:** Always use `None` as the default.
```python
def add_to_list(val, my_list=None):
    if my_list is None:
        my_list = []
```

## 2. The Global Interpreter Lock (GIL)

**The Pitfall:** Trying to use `threading` for CPU-intensive tasks.
**The Reality:** The GIL prevents multiple threads from executing Python bytecode at once. 10 threads on a 10-core machine will still only use 1 core.
**The Fix:** Use `multiprocessing` for CPU work and `asyncio` or `threading` for I/O-bound work.

## 3. Circular Imports

**The Pitfall:** `a.py` imports `b.py`, and `b.py` imports `a.py`.
**The Result:** `ImportError`.
**The Fix:** Move the shared logic to a third file `c.py`, or move the import inside the function that needs it (Lazy Import).

## 4. `is` vs `==`

**The Pitfall:** Using `if x is 10`.
**The Rule:** `==` checks for **Equality** (value). `is` checks for **Identity** (memory address). Only use `is` for `None`, `True`, and `False`.

## Summary

Success with Python is about **Internalizing the Data Model**. By understanding how objects are created and how the interpreter manages threads, you can avoid the subtle bugs that plague junior Python codebases.