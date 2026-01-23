---
title: "Inside the Transformer: Attention, Tokens, and Embeddings"
date: "2024-01-10"
description: "How do LLMs actually work? A technical deep dive into the Attention Mechanism, Tokenization, and the vector space of Embeddings."
slug: "llms-deep-dive-into-core-internals"
published: true
tags: ["AI/ML", "LLMs"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
---

# Inside the Transformer: Attention, Tokens, and Embeddings

To debug an LLM, you must understand what it is: a massive statistical function predicting the next token.

## 1. Tokenization: The Language of Machines

LLMs don't read words; they read tokens.
*   "Hamburger" might be one token.
*   "Ham" + "bur" + "ger" might be three.
*   **The Trap:** This is why LLMs struggle with word games like "Reverse the letters in 'Lollipop'." They see the token ID `19234`, not the letters L-o-l-l-i-p-o-p.

## 2. Embeddings: Meaning as Math

An embedding is a vector (a list of 1536 numbers) that represents the "meaning" of a piece of text.
*   **The Magic:** In this high-dimensional space, the math works: `King - Man + Woman = Queen`. This is what powers RAG.

## 3. The Attention Mechanism

**Self-Attention** allows the model to look at every token in the context simultaneously and decide which ones are relevant to the current prediction.
*   *Example:* In "The animal didn't cross the street because **it** was too tired," the model learns that "it" refers to "animal," not "street."

## 4. Temperature and Sampling

*   **Greedy (Temp 0):** Always pick the most likely next token. Good for coding.
*   **Sampling (Temp 0.7):** Pick randomly from the top K tokens. Good for creativity.

## Summary

LLMs aren't magic; they are linear algebra. Understanding tokens and attention helps you write better prompts and build better retrieval systems.