---
title: "Agentic Ops with LangGraph: FastAPI, Persistence, and UIs"
date: "2024-02-25"
description: "How to deploy stateful agents to production. We look at FastAPI for long-running workflows and building human-in-the-loop UIs."
slug: "langgraph-integration-with-modern-workflows"
published: true
tags: ["AI/ML", "LangGraph"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Agentic Ops with LangGraph: FastAPI, Persistence, and UIs

A LangGraph application is essentially a long-running background process. This requires a different integration strategy than a standard "stateless" API.

## 1. Async Workflows with FastAPI

For tasks that might take minutes (like a research agent), don't keep the HTTP connection open.
*   **The Pattern:** POST starts the graph execution -> Returns a `thread_id` -> Frontend polls a GET endpoint for the current state.

## 2. Graph Visualization in LangSmith

LangGraph is hard to debug in a console. **LangSmith** provides a native graph view.
*   **The Benefit:** You can see exactly which path the agent took through the graph, where it looped, and where it failed. It's like a "Chrome DevTools" for AI agents.

## 3. Building Human-in-the-loop UIs

The "Approval" step in a graph needs a UI.
*   **The Workflow:** 
    1.  Graph hits `interrupt_before`.
    2.  Frontend displays the "Proposed Action" from the state.
    3.  Human clicks "Approve."
    4.  Backend calls `app.invoke(None, config)` to resume the graph.

## 4. Managed Persistence (Postgres)

In production, use **PostgresSaver**. It allows you to handle thousands of concurrent threads with full transactional integrity, ensuring no state is ever lost during a server restart.

## Summary

Production LangGraph requires moving from "local scripts" to **"Managed State Systems."** By using Postgres for persistence and LangSmith for visualization, you can build agentic workflows that are both robust and observable.