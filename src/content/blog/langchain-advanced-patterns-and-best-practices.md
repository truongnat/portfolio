---
title: "Mastering LCEL: Advanced Patterns in LangChain"
date: "2023-12-01"
description: "Move beyond simple chains. Learn how to use LangChain Expression Language (LCEL) to build complex, streaming, and parallel AI workflows."
slug: "langchain-advanced-patterns-and-best-practices"
published: true
tags: ["AI/ML", "LangChain"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

# Mastering LCEL: Advanced Patterns in LangChain

The introduction of **LangChain Expression Language (LCEL)** marked a paradigm shift in how we build LLM applications. It provides a declarative way to compose chains, offering built-in support for streaming, batching, and async execution.

## 1. The Power of Pipe (`|`)

LCEL allows you to "pipe" different components together like a Unix terminal.

```typescript
// A simple LCEL chain
const chain = prompt.pipe(model).pipe(outputParser);

// Parallel execution with RunnableMap
const mapChain = RunnableMap.from({
  context: retriever.pipe(formatDocumentsAsString),
  question: new RunnablePassthrough(),
}).pipe(prompt).pipe(model);
```

## 2. Dynamic Routing

Using `RunnableBranch`, you can route inputs to different chains based on logic (e.g., routing a user query to a "Technical" chain or a "General" chain).

## 3. Self-Querying Retrievers

Standard vector search only uses semantic similarity. A **Self-Querying Retriever** uses an LLM to extract metadata filters from the user's query, enabling complex filtered searches (e.g., "Find documents about 'Security' written in 2023").

## 4. Custom Tool Callbacks

For production systems, you need to track exactly what your agents are doing. LangChain's callback system allows you to hook into every start, end, and error of a tool call.

## Summary

Advanced LangChain is about **Composition**. By mastering LCEL and the Runnable interface, you can build AI systems that are not just series of prompts, but robust, streaming, and observable software architectures.