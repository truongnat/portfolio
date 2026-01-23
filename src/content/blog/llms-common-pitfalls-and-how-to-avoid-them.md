---
title: "LLM Pitfalls: Why Your Chatbot Is Hallucinating"
date: "2023-12-15"
description: "Common mistakes in building with LLMs. We explore the 'Lost in the Middle' phenomenon, context window abuse, and the limits of few-shot prompting."
slug: "llms-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["AI/ML", "LLMs"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=1000"
---

# LLM Pitfalls: Why Your Chatbot Is Hallucinating

Building a demo is easy. Building a reliable production app is hard. Here are the traps that catch most developers.

## 1. The "Lost in the Middle" Phenomenon

Researchers have found that LLMs are great at remembering the beginning and the end of a prompt, but terrible at remembering the middle.
*   **The Fix:** Put your most critical instructions (like "Output JSON only") at the **very end** of the prompt.

## 2. Trying to "Fix" the Model with Prompts

**The Trap:** Writing a 2,000-word system prompt to force a general model to act like a niche expert.
**The Fix:** **Fine-tuning.** If you need a model to speak SQL or Medical Latin perfectly, 50 examples in a fine-tuning set are worth 5,000 words of prompting.

## 3. Ignoring Token Cost

**The Trap:** Sending the entire conversation history (50k tokens) for every simple user query.
**The Fix:** Implement a **Context Window Manager**. Summarize older messages and only keep the last 5 turns raw.

## 4. Blind Trust in "Reasoning"

LLMs are probabilistic, not logical. They don't "know" that 2+2=4; they just know that "4" is the most likely next token.
**The Fix:** For math or logic, use **Tool Use**. Make the LLM write Python code to calculate the answer rather than guessing it.

## Summary

Treat LLMs as **stochastic engines**, not databases. Design your system to handle failure, validate outputs, and manage context rigorously.