---
title: "Multi-Agent Orchestration with CrewAI: Roles, Tasks, and Delegation"
date: "2026-03-24"
description: "Why single AI agents hit a wall on complex tasks, and how I used CrewAI to build a multi-agent system for the Agentic SDLC project with clear roles, task delegation, and shared memory."
slug: "multi-agent-orchestration-crewai"
published: true
tags: ["AI/ML", "CrewAI", "Agents", "Architecture"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

There's a moment when building AI agents where you realize a single agent just can't do it all. For the Agentic SDLC project, I initially tried to stuff everything into one LangChain agent: gather requirements, design architecture, write code, review it, generate tests, and produce documentation. The agent context bloated, the reasoning quality degraded, and the whole thing became unpredictable. That's when I turned to multi-agent orchestration with CrewAI.

## Why Single Agents Fail at Complex Workflows

A single agent handling an end-to-end SDLC workflow runs into several problems. First, the context window fills up fast. By the time the agent gets to writing code, it's carrying the full history of requirement analysis and architecture decisions — most of which is noise for the current task. Second, focus suffers. An agent asked to "gather requirements AND write production code AND review the code" context-switches in the same way a developer would if asked to do three jobs simultaneously. Quality drops across the board. Third, specialization is impossible. Good code review and good code generation require different mental models, different prompting strategies, and potentially different models.

The multi-agent answer is the same as the human answer: assign specialized roles, break work into tasks, and let agents delegate to each other.

## CrewAI's Mental Model: Crew, Agents, Tasks

CrewAI structures everything around three core concepts. An **Agent** has a role, a goal, and a backstory — these shape how the LLM reasons and responds. A **Task** has a description, an expected output, and an assigned agent. A **Crew** coordinates the agents and tasks, either sequentially or with a manager agent that can delegate.

```python
from crewai import Agent, Task, Crew, Process

requirements_analyst = Agent(
    role="Senior Requirements Analyst",
    goal="Gather and structure clear, testable software requirements from project briefs",
    backstory="""You are an experienced business analyst who has worked on dozens of
    enterprise software projects. You know how to ask the right questions and translate
    vague ideas into precise, developer-friendly requirement specs.""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0.2)
)

architect = Agent(
    role="Software Architect",
    goal="Design clean, scalable system architectures based on requirements",
    backstory="""You are a seasoned software architect with expertise in distributed systems,
    API design, and cloud infrastructure. You produce architecture decision records (ADRs)
    that development teams can act on immediately.""",
    verbose=True,
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0.1)
)
```

Notice that each agent has a distinct personality encoded in the backstory. This isn't just flavor text — it meaningfully shapes the agent's behavior. The requirements analyst will ask clarifying questions; the architect will produce structured decision records. I experimented with flat, minimal backstories early on and the outputs were much less consistent.

## Defining Tasks with Clear Outputs

Tasks in CrewAI need an explicit expected output. This is critical — the agent uses it to self-evaluate whether the task is complete.

```python
analyze_requirements = Task(
    description="""Analyze the following project brief and produce a structured requirements document.
    Project Brief: {project_brief}
    
    Focus on: functional requirements, non-functional requirements, constraints, and open questions.""",
    expected_output="""A structured requirements document in Markdown with sections:
    1. Functional Requirements (as numbered user stories)
    2. Non-Functional Requirements (performance, security, scalability)
    3. Constraints and Assumptions
    4. Open Questions for stakeholders""",
    agent=requirements_analyst
)

design_architecture = Task(
    description="""Based on the requirements document produced, design a system architecture.
    Include component diagrams, API contracts, and technology choices with rationale.""",
    expected_output="""An Architecture Decision Record (ADR) with:
    1. Context and requirements summary
    2. System components and their responsibilities
    3. Technology stack with justification
    4. Key API contracts (OpenAPI-style)
    5. Risks and mitigations""",
    agent=architect,
    context=[analyze_requirements]  # This task receives output from the previous one
)
```

The `context` parameter is how task chaining works. The architect's task automatically receives the requirements analyst's output — no manual passing needed. CrewAI handles the context propagation.

## Agent Delegation and the Manager Pattern

For the SDLC workflow, I used a hierarchical process where a manager agent can reassign tasks:

```python
project_manager = Agent(
    role="AI Project Manager",
    goal="Coordinate the SDLC workflow, ensuring quality at each stage and delegating effectively",
    backstory="You are an experienced technical project manager who orchestrates development teams.",
    allow_delegation=True,
    llm=ChatOpenAI(model="gpt-4-turbo", temperature=0)
)

crew = Crew(
    agents=[requirements_analyst, architect, developer, reviewer],
    tasks=[analyze_requirements, design_architecture, write_code, review_code],
    process=Process.hierarchical,
    manager_agent=project_manager,
    verbose=2
)

result = crew.kickoff(inputs={"project_brief": brief_text})
```

With `Process.hierarchical`, the manager agent can observe task outputs and decide to re-delegate if quality is insufficient. This is where multi-agent systems start to feel genuinely intelligent — the manager can say "the code review found critical issues, send back to the developer."

## Shared Memory Across Agents

One thing I had to solve early was shared knowledge across agents. By default, each agent only sees its own conversation history and any task context explicitly passed via `context=[]`. For SDLC, there were cross-cutting concerns — like the agreed technology stack — that every agent needed to know.

I solved this with a shared memory store: a simple in-memory dictionary backed by a ChromaDB vector store for semantic retrieval. Each agent gets a tool to read from and write to this shared store. When the architect writes "we're using FastAPI + PostgreSQL," the developer can retrieve it later without it being explicitly passed in every task chain.

## Lessons From the Real System

A few hard-won lessons from building this in Agentic SDLC:

**Temperature matters per role.** The requirements analyst benefits from slightly higher temperature (more exploratory questions). The code generator should be at 0 — you want deterministic output, not creative code.

**Don't over-delegate.** Early on, I had agents delegating to sub-agents for trivial decisions. Every delegation is another LLM call. Keep delegation paths short and meaningful.

**Test each agent in isolation first.** Before assembling the crew, test each agent independently with representative inputs. A buggy agent in a crew is hard to debug because its bad output silently propagates to the next task.

**Log everything.** CrewAI's verbose mode helps during development. In production, I pipe agent outputs to a structured log store. When something goes wrong in a 20-step workflow, you need to know exactly which agent at which step introduced the problem.

Multi-agent orchestration with CrewAI genuinely changed how I think about AI system design. The shift is from "how do I write one smart prompt" to "how do I design a team of AI specialists that can collaborate effectively." It's a harder problem, but the results at scale are dramatically better.
