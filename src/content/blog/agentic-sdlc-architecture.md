---
title: "Designing a Deterministic AI Workflow Runtime in Rust"
date: "2026-03-24"
description: "Why I built the Agentic SDLC runtime in Rust, how I achieved deterministic execution with trace IDs and an LLM replay store, and what 183 passing tests taught me about AI reliability."
slug: "agentic-sdlc-architecture"
published: true
tags: ["AI/ML", "Rust", "Architecture", "Systems Design"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000"
---

AI agents are inherently non-deterministic. Given the same input, an LLM might produce a different output each time. Temperature, sampling randomness, and model version drift all contribute. For a demo chatbot, that's fine — even desirable. For a production workflow runtime that's supposed to execute the same SDLC pipeline reliably, it's a nightmare.

This is the problem I set out to solve when designing the Rust runtime for Agentic SDLC. The goal was a workflow executor that behaves predictably, can be audited, and can survive crashes without losing work. Here's how I built it and what I learned.

## Why Non-Determinism Kills AI Agents in Production

Imagine an agent that generates a database schema, then hands it to another agent that writes the migration code, then to a third that writes the tests. If the schema agent produces slightly different column names on a retry (because of temperature or a model update), the downstream agents receive inconsistent inputs. The migration code references columns that don't exist in the schema. The tests fail. You have no idea why, because each agent ran "successfully."

This cascading inconsistency is the core problem. In a pure LLM pipeline, you can't reason about failures the way you would in traditional software, because the inputs and outputs are fuzzy. My solution was to treat the LLM calls as an **external, unreliable side-effect** — just like a network call — and build determinism around them.

## Why Rust?

I chose Rust for the workflow runtime for a few reasons. First, correctness guarantees. Rust's ownership model and type system eliminate entire classes of bugs: null pointer dereferences, data races, use-after-free. When you're building a system that coordinates multiple async AI agents, thread safety is not optional. Second, performance. The runtime needs to manage potentially hundreds of concurrent workflow executions with minimal overhead. Third, and most importantly for this use case: **Rust forces you to handle every error explicitly**. There are no exceptions that silently propagate. Every failure path is in the type system.

## Trace IDs: The Foundation of Observability

Every workflow execution in the Agentic SDLC runtime starts with a `TraceId` — a UUID that propagates through every step, every LLM call, every tool invocation.

```rust
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct TraceId(Uuid);

impl TraceId {
    pub fn new() -> Self {
        Self(Uuid::new_v4())
    }
    
    pub fn as_str(&self) -> &str {
        // Returns string representation for logging
        self.0.to_string().leak()
    }
}

pub struct WorkflowExecution {
    pub trace_id: TraceId,
    pub workflow_id: String,
    pub started_at: DateTime<Utc>,
    pub steps: Vec<StepResult>,
    pub status: ExecutionStatus,
}
```

Every log line, every LLM call record, every error includes the `TraceId`. When something fails, I can pull all records for that trace and reconstruct exactly what happened. Without this, debugging a multi-step AI workflow is like detective work in the dark.

## The LLM Replay Store: Record/Replay for AI Calls

This is the most unconventional part of the design. Inspired by systems like VCR.py (for HTTP) and Hermetic Test environments, I built an LLM Replay Store that can operate in two modes: **record mode** captures real LLM responses and stores them indexed by a deterministic hash of the prompt. **Replay mode** returns the stored response instead of hitting the LLM API.

```rust
pub struct LlmReplayStore {
    store: HashMap<PromptHash, StoredResponse>,
    mode: ReplayMode,
}

#[derive(Debug, Clone)]
pub enum ReplayMode {
    Record,    // Hit real API, save responses
    Replay,    // Return stored responses
    PassThrough, // Always hit real API
}

impl LlmReplayStore {
    pub async fn complete(&mut self, prompt: &str, params: &LlmParams) -> Result<String> {
        let hash = PromptHash::from(prompt, params);
        
        match self.mode {
            ReplayMode::Replay => {
                self.store.get(&hash)
                    .map(|r| r.content.clone())
                    .ok_or_else(|| anyhow!("No stored response for hash {:?}", hash))
            }
            ReplayMode::Record => {
                let response = self.call_real_api(prompt, params).await?;
                self.store.insert(hash, StoredResponse::new(response.clone()));
                Ok(response)
            }
            ReplayMode::PassThrough => {
                self.call_real_api(prompt, params).await
            }
        }
    }
}
```

This is how I got to 183 passing tests without spending hundreds of dollars on API calls during CI. The test suite records real LLM responses once, commits them to the repo (encrypted, since they may contain sensitive data), and replays them deterministically in every subsequent test run.

The hash includes the model name, temperature, and full prompt. If any of those change, the hash changes and the test fails — which is exactly what you want. It forces intentional changes to LLM behavior.

## Policy Guardrails

Not every workflow should be allowed to do everything. The Agentic SDLC runtime has a policy layer that sits between the workflow executor and the tool system. Before any tool invocation (file write, API call, shell command), the executor checks the policy:

```rust
pub struct PolicyEngine {
    rules: Vec<Box<dyn PolicyRule>>,
}

pub trait PolicyRule: Send + Sync {
    fn evaluate(&self, action: &AgentAction, context: &ExecutionContext) -> PolicyDecision;
}

pub enum PolicyDecision {
    Allow,
    Deny(String),          // Deny with reason
    RequireApproval(String), // Pause and wait for human approval
}
```

Example rules I implemented: a file-write rule that restricts writes to the project directory; a shell-command rule that blocks dangerous commands like `rm -rf`; a budget rule that tracks cumulative API costs and pauses execution if the budget is exceeded.

The `RequireApproval` decision was important for the "checkpoint" pattern I mentioned in my LangChain post. Some actions — like pushing code to a repository — should always pause and wait for a human to approve. The runtime serializes the execution state, emits a webhook, and resumes when it receives a confirmation.

## Crash Recovery

The runtime persists execution state to disk after every step. The state includes the `TraceId`, the current step index, all step results so far, and the pending LLM responses from the replay store. If the process crashes or the machine restarts, the next execution with the same `WorkflowId` picks up from the last persisted state.

```rust
pub struct ExecutionCheckpoint {
    pub trace_id: TraceId,
    pub workflow_id: String,
    pub completed_steps: Vec<StepResult>,
    pub replay_store_snapshot: HashMap<PromptHash, StoredResponse>,
    pub checkpointed_at: DateTime<Utc>,
}
```

Combined with the replay store, this means crash recovery doesn't re-invoke LLM APIs for already-completed steps. It uses the recorded responses. This is both cost-efficient and ensures consistency across retries.

## What 183 Tests Taught Me

Getting to 183 passing tests wasn't about quantity — it was about coverage of the failure modes. I tested each policy rule independently, each retry path, each state serialization round-trip, and each replay store hash collision edge case. The test suite runs in under 10 seconds because nothing hits a real API.

The most valuable tests were the **integration tests** that run a full workflow in replay mode with intentionally broken states: a corrupted checkpoint file, an unexpected LLM response format, a policy denial mid-workflow. These tests caught real bugs that unit tests would never surface.

Determinism in AI systems isn't about making the LLM behave predictably — that's a losing battle. It's about building a runtime that treats LLM calls as untrusted, side-effectful operations and wraps them with enough structure, validation, and persistence to make the overall system reliable. Rust gave me the tools to make that structure airtight.
