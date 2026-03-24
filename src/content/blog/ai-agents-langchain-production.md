---
title: "Building Production AI Agents with LangChain: Memory, Tools, and Reliability"
date: "2026-03-24"
description: "How I built a real AI agent system for the Agentic SDLC project using LangChain, covering vector-based memory, tool integration, and reliability patterns that actually hold up in production."
slug: "ai-agents-langchain-production"
published: true
tags: ["AI/ML", "LangChain", "Agents"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=1000"
---

When I first started building the Agentic SDLC project — an AI-powered software development lifecycle framework — I thought wrapping a few LLM calls in Python would be enough. Spoiler: it wasn't. Getting an AI agent to reliably perform multi-step tasks in production is a completely different challenge from getting it to work in a Jupyter notebook demo. This post covers what I actually learned building a production-grade agent system with LangChain, OpenAI, and Anthropic.

## Why LangChain?

LangChain gets a lot of criticism for being over-abstracted. I partially agree — you should understand what's happening under the hood. But for Agentic SDLC, LangChain gave us a solid foundation: a unified interface across OpenAI and Anthropic, a composable chain/agent abstraction, and a rich ecosystem of integrations for memory, tools, and retrievers. The key is using it deliberately, not as a black box.

## Vector-Based Memory That Actually Works

The first thing I got wrong was agent memory. Naive approaches either dump the entire conversation history into every prompt (expensive, hits context limits) or forget everything (useless). The solution is vector-based semantic memory.

In LangChain, I used `Chroma` as the vector store and `OpenAIEmbeddings` to encode prior interactions. Each significant agent action — a requirement gathered, a decision made, a file written — gets stored with metadata and a timestamp.

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.memory import VectorStoreRetrieverMemory

embedding = OpenAIEmbeddings()
vectorstore = Chroma(
    collection_name="sdlc_agent_memory",
    embedding_function=embedding,
    persist_directory="./memory_store"
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
memory = VectorStoreRetrieverMemory(retriever=retriever)
```

When the agent needs context, it queries the vector store for the top-5 most semantically relevant memories instead of replaying the full history. This keeps token usage bounded and the agent focused on what's actually relevant to the current task.

One critical lesson: **memory keys matter**. I store memories with explicit keys like `"requirement_analysis"` or `"architecture_decision"` so the retrieval stays structured. Dumping raw text without metadata leads to noisy, unfocused context.

## Tool Integration: The Real Power

An agent without tools is just an expensive text predictor. In Agentic SDLC, our agents needed to read and write files, run shell commands, call external APIs, and query a codebase. LangChain's `@tool` decorator made this straightforward:

```python
from langchain.tools import tool

@tool
def write_code_file(filepath: str, content: str) -> str:
    """Writes content to a file at the given filepath. Use this to create or update source code files."""
    with open(filepath, "w") as f:
        f.write(content)
    return f"File written: {filepath}"

@tool
def run_tests(test_path: str) -> str:
    """Runs pytest on the given path and returns the result output."""
    import subprocess
    result = subprocess.run(
        ["pytest", test_path, "--tb=short"],
        capture_output=True, text=True, timeout=60
    )
    return result.stdout + result.stderr
```

The docstring is the tool's description — it's what the LLM reads to decide when to use it. Write clear, specific descriptions. Vague descriptions lead to the agent misusing tools or calling them at the wrong time.

## Reliability Patterns: Retries and Fallbacks

LLM APIs fail. Rate limits, timeouts, model hiccups — they all happen. I built a retry wrapper that handles these gracefully:

```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def run_agent_with_retry(agent, input_text: str):
    return agent.run(input_text)
```

But retries alone aren't enough. I also implemented **model fallback**: if OpenAI GPT-4 is unavailable or returns an error, we fall back to Anthropic Claude. This is easy with LangChain's unified interface:

```python
def get_llm_with_fallback():
    try:
        llm = ChatOpenAI(model="gpt-4-turbo", temperature=0)
        llm.predict("ping")  # Cheap health check
        return llm
    except Exception:
        return ChatAnthropic(model="claude-3-sonnet-20240229", temperature=0)
```

Another reliability pattern I found essential: **structured output validation**. When an agent produces a structured response (JSON, code, a schema), validate it immediately. If validation fails, re-prompt with the error. I used Pydantic models for this:

```python
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel

class RequirementSpec(BaseModel):
    title: str
    description: str
    acceptance_criteria: list[str]

parser = PydanticOutputParser(model=RequirementSpec)
```

## Cost Optimization

Running GPT-4 for every agent step gets expensive fast. My strategies:

1. **Route simple tasks to cheaper models.** Classification, summarization, and intent detection go to `gpt-3.5-turbo` or `claude-haiku`. Only complex reasoning and code generation use GPT-4.

2. **Cache deterministic tool calls.** If the agent asks for the same file twice, serve it from cache — no LLM call needed.

3. **Limit tool call depth.** Set a `max_iterations` on your agent executor. An agent stuck in a loop burns tokens fast.

```python
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=10,
    early_stopping_method="generate",
    verbose=True
)
```

4. **Prune memory aggressively.** Only store high-signal memories. Don't embed every tool call result — only the meaningful outcomes.

## What I'd Do Differently

Looking back at Agentic SDLC, I'd be more conservative about what the agent decides autonomously. The agent would sometimes make architectural decisions mid-task that introduced inconsistency. I fixed this by adding a "checkpoint" pattern — before taking any irreversible action (writing a file, calling an external API), the agent logs the intended action to a decision store, and a separate policy layer validates it. That led directly to the Rust runtime I built later.

The other big lesson: **observability first**. Add LangSmith or your own logging from day one. Debugging a multi-step agent failure without traces is painful.

Building production agents with LangChain is absolutely viable — the framework is mature enough. The hard part isn't the code; it's the design. Think carefully about what the agent knows, what it can do, and when it should stop and ask a human.
