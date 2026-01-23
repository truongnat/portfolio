---
title: "Interviewing for Quality: Finding the Engineering Craftsman"
date: "2024-06-30"
description: "How to tell if a candidate actually cares about quality. We look at testing signals and the 'Maintainability' interview."
slug: "technical-interviewing-testing-and-quality-assurance"
published: true
tags: ["Leadership", "Technical Interviewing"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Interviewing for Quality: Finding the Engineering Craftsman

Anyone can write code that works once. An elite engineer writes code that works *forever* and is easy for others to change. This is what we call **Quality**.

## 1. The "Debugging" Interview

Instead of building something new, give the candidate a 500-line file with a subtle bug (e.g., a race condition or a memory leak).
*   **What to look for:** Do they use `console.log` or a debugger? Do they write a failing test first? Do they fix the *root cause* or just the symptom?

## 2. The "Test Design" Question

"I have a service that calculates tax for 50 states. How would you test this?"
*   **Good Signal:** They mention mocking the external API, boundary testing, and data-driven tests.

## 3. Reviewing Their Code for Quality

Look at the PRs they've submitted (or their take-home).
*   **Signs of Quality:** Meaningful variable names, small functions, clear error handling, and comprehensive READMEs.

## Summary

Quality is a habit. If they don't show it in the interview (when they are trying their hardest), they certainly won't show it on a Friday afternoon when a deadline is looming.