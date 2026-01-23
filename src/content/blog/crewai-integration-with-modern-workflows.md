---
title: "Agentic Ops: Integrating CrewAI with FastAPI and LangSmith"
date: "2024-03-20"
description: "How to deploy CrewAI agents to production. We cover API integration with FastAPI, observability with LangSmith, and CI/CD for agents."
slug: "crewai-integration-with-modern-workflows"
published: true
tags: ["AI/ML", "CrewAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Agentic Ops: Integrating CrewAI with FastAPI and LangSmith

Building a script is easy; building a production service is hard. "Agentic Ops" is the practice of deploying, monitoring, and scaling AI agent crews.

## 1. Deploying as a REST API (FastAPI)

Don't run your crew in a CLI. Wrap it in an asynchronous API so your frontend or other microservices can trigger it.

```python
from fastapi import FastAPI
from my_crew import MyResearchCrew

app = FastAPI()

@app.post("/research")
async def start_research(topic: str):
    crew = MyResearchCrew().crew()
    # Run in background to avoid timeout
    result = crew.kickoff(inputs={'topic': topic})
    return {"status": "success", "result": result}
```

## 2. Observability with LangSmith

Multi-agent systems are black boxes. **LangSmith** allows you to see the full trace of every agent "thought" and tool call.
*   **Debug:** Find exactly which agent hallucinated or which tool failed.
*   **Evaluate:** Measure the latency and token cost of each step in the crew.

## 3. Human-in-the-loop (HITL)

Modern workflows require human approval for critical steps (e.g., sending an email or spending money).
*   **Pattern:** Task 1 (Research) -> Task 2 (Draft) -> **Human Approval** -> Task 3 (Execute).

## Summary

Production CrewAI requires moving from "Scripts" to "Systems." By using FastAPI for connectivity and LangSmith for visibility, you can build agentic workflows that are reliable enough for enterprise use.