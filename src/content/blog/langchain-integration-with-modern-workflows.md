---
title: "Modern AI Workflows: LangServe, Vercel, and LangSmith"
date: "2024-02-20"
description: "How to deploy and monitor your LangChain apps. We explore LangServe for API deployment and LangSmith for performance monitoring."
slug: "langchain-integration-with-modern-workflows"
published: true
tags: ["AI/ML", "LangChain"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Modern AI Workflows: LangServe, Vercel, and LangSmith

Building a great AI feature is only 20% of the battle. The remaining 80% is deployment, observability, and maintenance.

## 1. LangServe: Chains as APIs

**LangServe** allows you to take any LangChain Runnable and deploy it as a high-performance REST API with one line of code. It automatically provides:
*   Standard endpoints for `invoke`, `batch`, and `stream`.
*   A built-in playground for testing your chains.

## 2. Vercel AI SDK Integration

For frontend developers, LangChain integrates seamlessly with the **Vercel AI SDK**. This allows you to stream responses directly to your React components, providing that "typewriter" effect that users expect from modern AI apps.

## 3. LangSmith: The CI/CD for LLMs

**LangSmith** is the most critical tool for production LangChain.
*   **Tracing:** See every step of your chain and where the time/cost is being spent.
*   **Evaluation:** Create datasets and run "Evals" to ensure your model's accuracy doesn't regress when you change a prompt.

## Summary

Modern AI development requires a shift from "Chatbots" to "Engines." By using **LangServe** to expose your logic and **LangSmith** to monitor it, you can build AI applications that are as stable and predictable as any other part of your tech stack.