---
title: "Advanced Prompting: Tree of Thoughts and Self-Consistency"
date: "2023-12-12"
description: "Going beyond the basics. Learn how to use Tree of Thoughts (ToT), Self-Consistency, and Prompt Chaining to solve complex reasoning problems."
slug: "prompt-engineering-advanced-patterns-and-best-practices"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Prompting: Tree of Thoughts and Self-Consistency

Standard prompting works for simple tasks. For complex logic, you need algorithms that structure the model's thinking process.

## 1. Self-Consistency (Majority Voting)

LLMs are probabilistic. If you ask a hard math question once, it might get it wrong.
*   **The Technique:** Ask the same question 5 times (with a non-zero temperature).
*   **The Result:** Take the most common answer. This simple trick improves math and logic performance by 10-20%.

## 2. Tree of Thoughts (ToT)

Instead of generating one linear answer, ask the model to explore multiple "paths."
*   **Step 1:** Generate 3 possible next steps.
*   **Step 2:** Evaluate each step (Good/Bad).
*   **Step 3:** Discard the bad ones and continue from the best one.
*   **Use Case:** Strategic planning, coding architecture, or creative writing.

## 3. Prompt Chaining

Don't ask for a miracle in one prompt. Break it down.
*   **Chain:** Input -> [Summarizer] -> [Analyzer] -> [Critique] -> [Final Editor] -> Output.
*   **Benefit:** Each step is simpler and easier to debug.

## Summary

Advanced prompting treats the LLM as a **Search Engine for Thoughts**. By exploring multiple possibilities and breaking down tasks, you can achieve reasoning capabilities that far exceed the raw model's baseline.