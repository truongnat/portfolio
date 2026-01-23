---
title: "Optimizing LangGraph: Speed, Cost, and Parallelism"
date: "2024-03-20"
description: "AI agents can be slow. Learn how to optimize your LangGraph for low-latency execution and efficient state management."
slug: "langgraph-performance-optimization-techniques"
published: true
tags: ["AI/ML", "LangGraph"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Optimizing LangGraph: Speed, Cost, and Parallelism

Because LangGraph often involves cycles and multiple LLM calls, latency can quickly become an issue. Optimization in LangGraph is about **Reducing the Critical Path.**

## 1. Parallel Node Execution

If two nodes don't depend on each other's output, run them in parallel. LangGraph handles this natively if you define multiple edges from the same source.

```python
# This triggers both research_a and research_b in parallel
workflow.add_edge("start", "research_a")
workflow.add_edge("start", "research_b")
```

## 2. Token-Efficient State Management

Every time you enter a new node, the context (state) is sent to the LLM. If your state contains 50 messages, that's a lot of tokens.
*   **The Fix:** Use a `trim_messages` reducer to only keep the last N messages in the state, or use an LLM to "summarize" the history into a single state variable.

## 3. Sub-graph Isolation

By breaking a large graph into sub-graphs, you limit the "State" that needs to be passed around. The sub-graph only receives the specific data it needs, reducing token bloat and improving focus.

## 4. Model Tiering

*   **The Router:** Use a fast, cheap model (GPT-4o-mini) for routing nodes.
*   **The Worker:** Use a high-reasoning model (Claude 3.5 Sonnet) for the complex "Doing" nodes.

## Summary

Optimization in LangGraph is about **Pruning**. Prune your messages, prune your state, and parallelize your tasks to build a system that feels snappy and responsive to the end user.