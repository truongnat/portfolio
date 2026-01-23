---
title: "PromptOps: Version Control and Registries for Prompts"
date: "2024-02-25"
description: "Treating prompts as code. How to use Prompt Registries (like LangChain Hub) to version, test, and deploy prompts without redeploying code."
slug: "prompt-engineering-integration-with-modern-workflows"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# PromptOps: Version Control and Registries for Prompts

Hard-coding prompts in your Python files is an anti-pattern. It makes it impossible for non-engineers to iterate on the copy.

## 1. The Prompt Registry (CMS for Prompts)

Use a tool like **LangSmith Hub** or **Portkey**.
*   **Workflow:** The Product Manager edits the prompt in a UI. They save it as `v2`. The API automatically fetches `latest` without a code deploy.

## 2. Structured Variables

Don't use f-strings (`f"Hello {name}"`). Use structured templates.
*   **Reason:** It prevents injection attacks and allows the registry to validate that all required variables are present.

## 3. A/B Testing Prompts

Just like code, prompts should be tested in production.
*   **The Setup:** Route 10% of traffic to `v2-experimental`. Compare the user feedback (thumbs up/down) to `v1-stable`.

## Summary

Prompts are **Assets**. They should be managed with the same rigor as your database schemas or your frontend components.