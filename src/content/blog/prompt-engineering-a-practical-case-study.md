---
title: "Prompt Engineering in Production: Optimizing E-commerce Copy"
date: "2023-11-18"
description: "How we increased click-through rates by 15% using systematic prompt engineering. A case study in moving from 'Zero-Shot' to 'Few-Shot' prompting."
slug: "prompt-engineering-a-practical-case-study"
published: true
tags: ["AI/ML", "Prompt Engineering"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
---

# Prompt Engineering in Production: Optimizing E-commerce Copy

Many developers treat prompts as magic spells—they tweak words randomly until it "feels right." This case study shows how we applied engineering rigor to prompt design for an e-commerce platform.

## The Challenge: Generic Descriptions

We needed to generate SEO-friendly descriptions for 50,000 products.
*   **Initial Prompt:** *"Write a description for this product."*
*   **Result:** Generic, repetitive fluff. *"This high-quality widget is perfect for your needs."*

## The Solution: Systematic Iteration

We moved through three phases of optimization.

### Phase 1: Role & Constraints (System Prompt)
We gave the model a persona.
> *"You are a senior copywriter for a luxury lifestyle brand. Use active voice. Avoid clichés like 'game-changer' or 'must-have'."*

### Phase 2: Few-Shot Prompting
We provided 3 examples of "Golden Descriptions" that our best human writers had created. This taught the model the *style* implicitly.

### Phase 3: Chain-of-Thought
We asked the model to identify the *Unique Selling Point (USP)* first, and then write the copy based on that USP.

## Results

| Metric | Zero-Shot | Few-Shot + CoT |
| :--- | :--- | :--- |
| **SEO Ranking** | Page 3 | Page 1 |
| **Click-Through Rate** | 2.1% | 2.4% (+15%) |
| **Hallucinations** | Frequent | Rare |

## Conclusion

Prompt Engineering is not art; it's engineering. By providing examples (Few-Shot) and structure (CoT), you can turn a generic model into a specialized expert.