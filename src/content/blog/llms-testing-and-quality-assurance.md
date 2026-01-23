---
title: "Evaluating Intelligence: Benchmarks and Human Review"
date: "2024-06-30"
description: "How do you measure 'smart'? We explore MMLU, HumanEval, and the emerging standard of 'LLM-as-a-Judge'."
slug: "llms-testing-and-quality-assurance"
published: true
tags: ["AI/ML", "LLMs"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Evaluating Intelligence: Benchmarks and Human Review

"Does it work?" is a hard question for AI. A model might write great poetry but fail at basic math.

## 1. Academic Benchmarks

*   **MMLU:** Massive Multitask Language Understanding (General knowledge).
*   **HumanEval:** Coding problems.
*   **GSM8K:** Grade school math.
*   **The Trap:** Models often "overfit" to these benchmarks (they memorize the answers). Don't trust them blindly.

## 2. LLM-as-a-Judge

Using GPT-4 to grade the output of Llama 3.
*   **The Workflow:** "Rate this answer on a scale of 1-5 for accuracy and helpfulness."
*   **Correlation:** Studies show this correlates highly with human preferences (80%+).

## 3. The "Vibe Check" (Elo Ratings)

The **LMSYS Chatbot Arena** uses crowdsourced pairwise comparisons ("Which answer is better: A or B?"). This is currently the gold standard for "feeling" which model is best.

## Summary

Evaluation is continuous. Don't just test once. Implement a pipeline where every pull request runs a subset of your "Golden Questions" against the model to detect regression.