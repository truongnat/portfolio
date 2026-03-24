---
title: "Why I Built a Deterministic AI Workflow Runtime in Rust"
date: "2026-03-24"
description: "An honest account of building the Agentic SDLC runtime in Rust — the non-determinism problem in AI systems, key design decisions, and why 183 tests weren't enough until they were."
slug: "rust-deterministic-runtime-design"
published: true
tags: ["Architecture", "Rust", "AI/ML", "Systems Design"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1000"
---

# Why I Built a Deterministic AI Workflow Runtime in Rust

Last year I built something I didn't fully expect to build: a deterministic AI workflow runtime in Rust. It supports 6 LLM providers, runs on Tokio for async execution, persists state to SQLite, and has 183 tests that I ran obsessively during development. This is the story of why it exists, the decisions I made, and what I'd do differently.

## The Non-Determinism Problem

AI systems have a fundamental tension with software engineering: language models are probabilistic. Same input, different output. That's a feature for creative tasks and a nightmare for reliable software.

When I started building Agentic SDLC — an automated software development lifecycle tool — I ran into this immediately. An agent would plan a task correctly one run and hallucinate a completely different approach the next. Debugging was torture. You couldn't reproduce failures. You couldn't write deterministic tests. You couldn't reason about system behavior.

The deeper problem was that my early prototype was just a chain of async LLM calls with no execution model. There was no record of what happened, no way to replay a workflow from a checkpoint, no policy enforcement between steps. It was a script pretending to be a system.

I needed a runtime — something with real semantics around execution, state, and recovery.

## Why Rust

I'm primarily a JavaScript developer. Choosing Rust for this project was a deliberate bet, and not an obvious one.

**Safety first.** AI workflows can run for minutes or hours. In Node.js I've fought enough async bugs — unhandled promise rejections, race conditions in concurrent operations, silent failures in long-running processes. Rust's ownership model and type system catch entire classes of these bugs at compile time. If the code compiles and the tests pass, I trust it in a way I simply don't with JavaScript for systems-level work.

**Performance where it matters.** The runtime itself — the scheduler, the replay store, the policy evaluator — needed to be fast. Not because LLM calls are fast (they're not), but because overhead in the control plane is waste. Rust gave me predictable, low-latency execution without a GC pause in the middle of a critical section.

**Tokio for async.** Rust's async story is excellent with Tokio. I could write concurrent LLM calls that look almost like JavaScript's `async/await` but with real resource bounds:

```rust
use tokio::task::JoinSet;

async fn run_parallel_agents(tasks: Vec<AgentTask>) -> Vec<AgentResult> {
    let mut set = JoinSet::new();

    for task in tasks {
        set.spawn(async move {
            execute_agent(task).await
        });
    }

    let mut results = Vec::new();
    while let Some(result) = set.join_next().await {
        results.push(result.expect("agent task panicked"));
    }
    results
}
```

## Core Design Decisions

### The Replay Store

The first thing I built was a replay store backed by SQLite. Every workflow step — every LLM call, every tool invocation, every decision point — gets written to the database before execution and updated after.

```rust
#[derive(Debug, Clone, sqlx::FromRow)]
pub struct WorkflowStep {
    pub id: String,
    pub trace_id: String,
    pub step_type: String,
    pub input_hash: String,
    pub output: Option<String>,
    pub status: StepStatus,
    pub created_at: DateTime<Utc>,
}
```

This gave me three things: reproducibility (I can replay any workflow from any checkpoint), debuggability (I have a complete audit trail), and resumability (if a long workflow crashes halfway through, it picks up where it left off, not at step one).

The input hash is important. When replaying, I hash the inputs and compare. If the inputs changed (model updated, prompt changed), it's a new execution, not a replay. This prevents stale cached results from polluting live runs.

### Trace IDs Everywhere

Every execution gets a `trace_id` that propagates through all sub-operations. Every log line, every database record, every error includes it. This sounds obvious, but actually implementing it consistently in an async system requires discipline.

In Rust, I used a `task_local!` macro to thread trace IDs through async contexts without passing them explicitly everywhere:

```rust
tokio::task_local! {
    static TRACE_ID: String;
}

async fn some_deep_function() {
    let trace = TRACE_ID.with(|id| id.clone());
    tracing::info!(trace_id = %trace, "doing something important");
}
```

This made debugging distributed async workflows dramatically easier.

### Policy Guardrails

One non-obvious component is the policy layer. Before any LLM call executes, it passes through a policy evaluator that can block, modify, or log the request. This handles things like: rate limiting per provider, token budget enforcement, prompt injection detection, and PII scrubbing.

```rust
pub trait Policy: Send + Sync {
    fn evaluate(&self, request: &LlmRequest) -> PolicyDecision;
}

pub enum PolicyDecision {
    Allow,
    Deny { reason: String },
    Modify { request: LlmRequest },
}
```

The composable policy chain pattern came from studying Axum's middleware design. Policies are just structs implementing a trait, stacked in order. Clean, testable, extensible.

## Test Strategy: 183 Tests and Why

The test count sounds impressive but the strategy behind it matters more. I organized tests into three tiers:

**Unit tests** for pure logic: the policy evaluator, the input hasher, the step status machine. These are fast and deterministic.

**Integration tests** for the replay store and SQLite operations. I use an in-memory SQLite instance per test case to keep them isolated and parallelizable.

**Scenario tests** for end-to-end workflow behavior. These use a mock LLM provider that returns scripted responses, so I can test the control flow without hitting real APIs.

```rust
#[tokio::test]
async fn test_workflow_resumes_from_checkpoint() {
    let db = test_db().await;
    let mock_llm = MockLlmProvider::new()
        .with_response("step1", "plan created")
        .fail_on("step2"); // simulate crash mid-workflow

    let runtime = WorkflowRuntime::new(db.clone(), mock_llm);
    let result = runtime.execute(sample_workflow()).await;

    assert!(result.is_err()); // crashed at step2

    // Now resume with a fixed mock
    let mock_llm2 = MockLlmProvider::new()
        .with_response("step2", "code written");
    let runtime2 = WorkflowRuntime::new(db, mock_llm2);
    let result2 = runtime2.execute(sample_workflow()).await;

    assert!(result2.is_ok());
    assert_eq!(result2.unwrap().completed_steps, 2);
}
```

## Reflection

Building this in Rust forced me to think more carefully about system design than I ever had in Node.js. The type system demanded I be explicit about failure modes, ownership, and concurrency. Things I'd previously glossed over with `try/catch` and `async/await` sugar.

Would I use Rust for everything? No. For CRUD APIs, TypeScript with Express is faster to ship and easier to maintain for most teams. But for a runtime with correctness requirements, long-running processes, and complex state management? Rust was the right call, and I'd make it again.

The project taught me that determinism is an engineering choice, not a property of the problem. You build it in, or you don't have it.
