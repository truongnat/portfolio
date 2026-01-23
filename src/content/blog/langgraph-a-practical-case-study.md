---
title: "Building Stateful AI Agents with LangGraph: A Support Case Study"
date: "2023-11-20"
description: "How we used LangGraph to build a persistent, cyclical customer support agent that can handle complex multi-step workflows and human-in-the-loop approvals."
slug: "langgraph-a-practical-case-study"
published: true
tags: ["AI/ML", "LangGraph"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
---

# Building Stateful AI Agents with LangGraph: A Support Case Study

While LangChain is excellent for linear chains, real-world agentic workflows are often cyclical and stateful. This case study explores how we built a "Refund & Dispute" agent that requires high reliability, persistence, and human oversight.

## The Challenge: The "Infinite Loop" and Persistence

Our previous agent often got stuck in loops or lost context if the user took too long to respond.
*   **The Workflow:** Identify intent -> Check Database -> Calculate Refund -> **Wait for Manager Approval** -> Execute Refund.
*   **The Problem:** Traditional chains couldn't "pause" and wait for a human, nor could they easily recover from a database error without starting over.

## The Solution: LangGraph State Machines

We modeled the agent as a **State Graph**.

### 1. The State Schema
We defined a strict `AgentState` that tracks the user query, database results, and the approval status.

### 2. Cyclical Correction
If the "Database Check" node fails, the graph routes back to the "Input Analysis" node with the error message, allowing the agent to refine its query.

### 3. Human-in-the-loop (Checkpoints)
Using LangGraph's **Checkpointer**, we could "interrupt" the graph execution at the `approval` node. The state is saved to a database, and the execution only resumes when a human UI trigger is received.

## Implementation Example (Python)

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated

class AgentState(TypedDict):
    query: str
    refund_amount: float
    is_approved: bool

def process_refund(state: AgentState):
    # Logic to calculate refund
    return {"refund_amount": 50.0}

def human_approval(state: AgentState):
    # This node is a placeholder for the UI interrupt
    pass

# Define the Graph
workflow = StateGraph(AgentState)

workflow.add_node("calculate", process_refund)
workflow.add_node("approve", human_approval)

workflow.set_entry_point("calculate")
workflow.add_edge("calculate", "approve")

# Interrupt before approval
app = workflow.compile(interrupt_before=["approve"])

# Kickoff
thread = {"configurable": {"thread_id": "user_123"}}
app.invoke({"query": "I want a refund for order #1"}, thread)
```

## Results & Impact

| Metric | Linear Chain | LangGraph |
| :--- | :--- | :--- |
| **Reliability** | 65% | 98% (due to error loops) |
| **Human Oversight** | Ad-hoc / Risky | Native / Auditable |
| **Persistence** | None (Session-only) | Full (DB-backed) |

## Conclusion

LangGraph transformed our AI from a "chatbot" into a "reliable workflow engine." By treating the agent as a state machine, we achieved the level of control and durability required for financial transactions.