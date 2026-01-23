---
title: "Inside GPT-4: RLHF and the Assistants State Machine"
date: "2024-01-18"
description: "How does OpenAI make its models 'safe'? A look at RLHF, PPO, and the internal state management of the Assistants API."
slug: "openai-deep-dive-into-core-internals"
published: true
tags: ["AI/ML", "OpenAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
---

# Inside GPT-4: RLHF and the Assistants State Machine

Two things set OpenAI apart: their alignment training (RLHF) and their stateful API architecture.

## 1. RLHF (Reinforcement Learning from Human Feedback)

GPT-4 isn't just "autocomplete." It's "autocomplete that tries to make you happy."
*   **Step 1:** Supervised Fine-Tuning (SFT) on good examples.
*   **Step 2:** Reward Modeling (RM). Humans rank outputs (A is better than B).
*   **Step 3:** PPO (Proximal Policy Optimization). The model learns to maximize the Reward Model's score.
*   **The Impact:** This is why GPT-4 refuses to build a bomb but is happy to write a poem about bombs.

## 2. The Assistants API State Machine

Unlike the stateless Chat Completion API, the Assistants API manages state on OpenAI's servers.
*   **Threads:** Persistent conversation history (stored by OpenAI).
*   **Runs:** The execution object. A Run moves through states: `queued` -> `in_progress` -> `requires_action` -> `completed`.
*   **Implication:** You don't need to manage your own vector database or chat history database; OpenAI does it for you.

## Summary

Understanding RLHF helps you understand the model's biases. Understanding the Assistants API helps you decide if you want to build your own backend (Chat API) or outsource it (Assistants API).