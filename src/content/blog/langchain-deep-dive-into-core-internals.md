---
title: "Under the Hood of LangChain: The Runnable Interface and Callbacks"
date: "2024-01-10"
description: "A technical deep dive into the core abstractions of LangChain. Learn how the Runnable interface and Callback Manager enable a modular AI ecosystem."
slug: "langchain-deep-dive-into-core-internals"
published: true
tags: ["AI/ML", "LangChain"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood of LangChain: The Runnable Interface and Callbacks

To truly master LangChain, you must understand the two core abstractions that make it work: the **Runnable Interface** and the **Callback Manager**.

## 1. The Runnable Interface: The "Unified Theory"

Almost everything in LangChain—Prompts, Models, Output Parsers, and Chains—implements the **Runnable** interface. This interface defines four standard methods:
*   `invoke`: Standard call.
*   `batch`: Efficiently run multiple inputs.
*   `stream`: Stream the response in real-time.
*   `astream_log`: Stream the internal steps (extremely useful for debugging).

This uniformity is what allows for the powerful piping syntax (`|`) in LCEL.

## 2. The Callback Manager: Decoupled Observability

LangChain uses a sophisticated callback system that allows you to hook into events without cluttering your logic.
*   `on_llm_start`: Triggers when the prompt is sent.
*   `on_tool_start`: Triggers when an agent calls a tool.
*   `on_chain_error`: Triggers when a step in your chain fails.

This is how **LangSmith** can trace your applications with almost zero configuration.

## 3. Serialization with LangChain Hub

LangChain provides a centralized hub for sharing and versioning prompts. This allows you to decouple your prompt engineering from your application code, similar to how we manage environment variables.

## Summary

LangChain isn't just a collection of utilities; it's a **Framework** that enforces modularity through the Runnable interface and observability through the Callback system.