---
title: "Mentoring for Quality: Teaching the Art of Testing"
date: "2024-05-30"
description: "How to guide junior engineers from 'I hate writing tests' to 'I can't ship without them'."
slug: "team-mentoring-testing-and-quality-assurance"
published: true
tags: ["Leadership", "Team Mentoring"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Mentoring for Quality: Teaching the Art of Testing

Many junior engineers see testing as a chore that slows them down. A mentor's job is to show them that testing is what allows them to move fast *forever*.

## 1. TDD Pairing Sessions

Test-Driven Development (TDD) is a skill best learned through pairing.
*   **The Game:** You write the test (Red). They write the code (Green). Then swap.

## 2. Reviewing the Test, Not just the Code

If a PR comes in with 100 lines of code and 0 tests, don't just ask for tests. Explain *which* edge cases are most risky and ask the mentee to design a test for those.

## 3. The "Legacy Code" Challenge

Give a mentee a piece of untested legacy code and ask them to add a feature. When they struggle (because it's not testable), use it as a teaching moment for **Dependency Injection** and **Clean Architecture**.

## Conclusion

Quality is a mindset. When an engineer feels the "safety net" of their own test suite, they become more daring and more productive.