---
title: "AI Workflow, Dependency Compatibility, and The Cost of Carelessness"
date: 2026-03-11
type: "day"
summary: "Attempted to optimize project context using LangGraph, LEANN, and LanceDB (Ollama local RAM issue). Revisited lessons on dependency versioning, local host environment management, and the discipline of self-review after a second revert in two weeks."
tags: ["LangGraph", "LanceDB", "Ollama", "AI", "Dependency", "Windows", "Debugging", "Self-Review"]
---

Today was a day of high-level experimentation mixed with some fundamental lessons in discipline and environment management.

## 1. AI Workflow & Local Optimization
I explored using **LangGraph**, **LEANN**, and **LanceDB** to optimize project context. The goal was to speed up information retrieval and context awareness for the local assistant.
- **Outcome:** Ollama local consumed a massive amount of RAM and the processing time was extremely slow. It's not quite "workable" for a smooth local workflow yet. 
- **Lesson:** Sometimes "cutting-edge" requires "heavy-duty" hardware that isn't always efficient for a fast-paced development loop.

## 2. Environment & Dependencies (The "Old-New" Lessons)
Two points of friction today reminded me that basics are non-negotiable:
- **Dependency Versioning:** I fell into the "always latest" trap again. I need to prioritize **compatible versions** rather than just the latest ones. Compatibility is the foundation of stability.
- **The Windows `hosts` Incident:** I spent way too long debugging a domain issue only to realize I hadn't reverted my own changes to the `hosts` file from a previous test. 
- **Mental Note:** *Always clean up your testing environment immediately.*

## 3. Discipline in Self-Review
This is the most critical takeaway for today: **Self-review is not an option; it's a responsibility.**
- For the second time in two weeks, I had to **revert a commit** due to sloppy review before pushing. 
- **Refinement:** Speed should never come at the cost of correctness. I need to be more rigorous and meticulous with my own code before it ever hits the main branch.

---
"Better to spend 5 minutes reviewing than 50 minutes debugging and reverting."
