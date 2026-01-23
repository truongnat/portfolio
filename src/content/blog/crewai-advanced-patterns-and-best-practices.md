---
title: "Advanced CrewAI: Custom Tools, Memory, and Hierarchical Processes"
date: "2023-12-04"
description: "Master the advanced features of CrewAI. Learn how to build custom tools, implement short-term memory, and use the Hierarchical Process for complex projects."
slug: "crewai-advanced-patterns-and-best-practices"
published: true
tags: ["AI/ML", "CrewAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

# Advanced CrewAI: Custom Tools, Memory, and Hierarchical Processes

Once you've mastered sequential tasks in CrewAI, the next step is building truly autonomous systems that can think, remember, and manage themselves. This article dives into the advanced patterns required for enterprise-grade AI agents.

## 1. Building Custom Tools

Standard search tools are rarely enough. For high-fidelity agents, you need tools that interface with your specific business data.

```python
from crewai_tools import BaseTool

class RevenueDataTool(BaseTool):
    name: str = "revenue_tracker"
    description: str = "Fetches the current Q4 revenue data from the internal SQL database."

    def _run(self, department: str) -> str:
        # Custom logic to query your database
        return f"Revenue for {department}: $4.2M"

# Assign to an Agent
financial_analyst = Agent(
    role='CFO Assistant',
    goal='Analyze Q4 performance',
    tools=[RevenueDataTool()]
)
```

## 2. Long-Term and Short-Term Memory

CrewAI supports **Memory**, allowing agents to remember previous interactions and share knowledge across tasks.
*   **Short-term:** Remembers context within a single execution.
*   **Long-term:** Persists data across different kickoffs (requires an embedder like OpenAI).

```python
crew = Crew(
    agents=[...],
    tasks=[...],
    memory=True, # Enables memory systems
    verbose=True
)
```

## 3. The Hierarchical Process

In a **Sequential** process, Task A leads to Task B. In a **Hierarchical** process, you designate a "Manager" LLM that delegates tasks to agents based on their roles.

*   **When to use:** Complex projects where the order of operations depends on intermediate findings (e.g., Software Engineering or Legal Discovery).

## 4. Manager LLM Configuration

```python
from langchain_openai import ChatOpenAI

manager_llm = ChatOpenAI(model="gpt-4-turbo")

crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.hierarchical,
    manager_llm=manager_llm
)
```

## Summary

Advanced CrewAI is about **Agentic Orchestration**. By giving your agents the ability to use custom tools, remember their successes, and manage their own workflows, you transition from "AI as a tool" to "AI as a colleague."