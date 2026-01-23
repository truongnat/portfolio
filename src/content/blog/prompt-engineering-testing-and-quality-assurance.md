---
title: "Testing Prompts: Fuzzing, Regression, and Golden Sets"
date: "2024-06-25"
description: "How to know if your prompt is 'good'. We explore automated fuzz testing, golden datasets, and semantic similarity metrics."
slug: "prompt-engineering-testing-and-quality-assurance"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Testing Prompts: Fuzzing, Regression, and Golden Sets

Writing a prompt is easy. Maintaining it over 12 months is hard.

## 1. Fuzz Testing

Throw random, messy, and malicious data at your prompt.
*   **Tool:** Use a library like **Promptfoo**.
*   *Input:* Empty strings, emojis, 10,000 characters of "A", SQL injection attempts.
*   *Pass Condition:* The model should fail gracefully (e.g., "I cannot answer that") rather than crashing or hallucinating.

## 2. Semantic Similarity

You can't do `assert output == expected` with LLMs.
*   **The Metric:** Use **Cosine Similarity**. If the output vector is >0.9 similar to the "Golden Answer," it passes.

## 3. The "Golden Set" Lifecycle

Every time a user reports a bad answer, add that query to your Golden Set.
*   **Impact:** Your test suite grows with your failures. Your prompt becomes antifragile.

## Summary

Testing prompts moves you from "Alchemy" to "Engineering." It allows you to refactor your prompts with the confidence that you haven't broken existing functionality.