---
title: "Prompting Pitfalls: Why 'Do Not' Instructions Fail"
date: "2023-12-28"
description: "Why telling an LLM what *not* to do is a bad idea. We explore negative constraints, the 'Pink Elephant' problem, and how to fix ambiguous prompts."
slug: "prompt-engineering-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=1000"
---

# Prompting Pitfalls: Why 'Do Not' Instructions Fail

LLMs operate on attention. When you say "Do not think of a pink elephant," the model attends to the words "Pink Elephant."

## 1. The Negative Constraint Trap

**The Bad Prompt:** "Do not be lengthy. Do not use jargon."
**The Result:** The model often ignores these or gets confused.
**The Fix:** Use **Positive Constraints**. "Be concise. Use simple, plain English." Tell the model what TO do, not what to avoid.

## 2. Ambiguity ("Make it pop")

**The Bad Prompt:** "Write a blog post that pops."
**The Result:** The model overuses emojis and exclamation marks.
**The Fix:** Be specific. "Write a blog post with a controversial opening hook and short, punchy sentences."

## 3. The Reversal Curse

Models learn "A is B" but not necessarily "B is A."
*   *Q:* "Who is Tom Cruise's mother?" -> *A:* "Mary Lee Pfeiffer."
*   *Q:* "Who is Mary Lee Pfeiffer's son?" -> *A:* (Model might struggle).
*   **The Fix:** Provide context in both directions if bi-directional recall is needed.

## Summary

Prompting is about **Clarity**. If a human intern would be confused by your instructions, the LLM will be too. Be positive, specific, and direct.