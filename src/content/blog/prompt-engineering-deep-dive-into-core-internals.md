---
title: "The Science of Prompting: In-Context Learning and Induction Heads"
date: "2024-01-20"
description: "Why does 'Few-Shot' prompting work? We dive into the research on In-Context Learning and how Induction Heads allow models to copy patterns."
slug: "prompt-engineering-deep-dive-into-core-internals"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
---

# The Science of Prompting: In-Context Learning and Induction Heads

Prompt Engineering isn't just voodoo; it's exploiting specific mechanisms inside the Transformer architecture.

## 1. In-Context Learning (ICL)

When you provide 3 examples (Few-Shot), you aren't "training" the model. You are locating a specific "Task Vector" in the model's high-dimensional latent space.
*   **The Metaphor:** The prompt is a coordinate system that points the model to the "French Translation" region of its brain.

## 2. Induction Heads

Mechanistic Interpretability researchers have found "Induction Heads"—circuits that look for patterns like `[A] [B] ... [A] -> [B]`.
*   **Why it matters:** This is why giving examples works. The model literally copies the *pattern* of the reasoning, not just the content.

## 3. The Role of Formatting

Why does Markdown or XML tags help?
*   **Signposting:** Clear delimiters (like `### Instruction`) act as strong attention anchors, helping the model separate instructions from data.

## Summary

Understanding **ICL** and **Induction Heads** moves you from "guessing" to "designing." You realize that prompts are code that programs the model's attention.