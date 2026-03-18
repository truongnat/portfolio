---
title: "Technical Communication, SOLID Principles, and Validation Edge Cases"
date: 2026-03-17
type: "day"
summary: "Lessons on effective technical communication, deep dive into SOLID principles, and a critical validation lesson from cloud deployment."
tags: ["Communication", "SOLID", "Security", "Cloud", "Validation", "Engineering"]
---

Today focused on the art of technical communication, reinforcing SOLID principles, and learning a hard lesson about validation edge cases in cloud environments.

## What I did

### 1. Technical Communication Mastery

**Giao tiếp kỹ thuật ≠ nói nhiều** — A great Tech Lead knows how to be selective: right person, right time, right level of detail.

Key principles:

- **Audience-first mindset**:
  - Devs need technical context
  - PMs need timeline & risk
  - CTO needs impact & trade-offs

- **The Pyramid Principle**: Start with the conclusion, then explain. Don't tell a long story before getting to the point.

- **Writing well = Thinking well**: If you can't explain something clearly in writing, you don't truly understand the problem.

- **Async-first**: Clear documentation saves dozens of unnecessary meetings.

**Lesson:** Communication is not about talking more—it's about delivering the right signal to the right receiver.

### 2. SOLID Principles Deep Dive

Reinforced understanding of SOLID principles with practical insights:

**S — Single Responsibility Principle**
- A class should have only one reason to change
- Not just "do one thing"—but "be responsible to a single actor"

**O — Open/Closed Principle**
- Open for extension, closed for modification
- Use abstraction to add new behavior without modifying old code

**L — Liskov Substitution Principle**
- Subtypes must be substitutable for supertypes without breaking behavior
- Violations often show up as `instanceof` checks or overrides that throw errors

**I — Interface Segregation Principle**
- Many small, specialized interfaces are better than one "fat interface"

**D — Dependency Inversion Principle**
- High-level modules should not depend on low-level modules
- Both depend on abstractions—the foundation of DI

**When NOT to apply rigidly:**
- Small scripts, prototypes, throw-away code
- Over-engineering SOLID into code that rarely changes is waste

### 3. Error Handling & Validation Lessons

**Error messages should be precise:**
- Provide meaningful messages for developers
- Avoid exposing non-meaningful errors to end users

**Critical validation lesson learned:**
- Today's issue: validation was too strict
- Didn't anticipate the case where domain resolution points to internal IPs in cloud environments
- Result: system deployment failed when running inside cloud infrastructure

**Root cause:** Overly tight validation rules that didn't account for cloud networking realities (e.g., internal DNS resolution, private IP ranges).

## Challenges & Solutions

**Challenge:** Validation logic rejected legitimate cloud-internal traffic due to domain resolving to private IPs
**Solution:** Need to relax validation rules to account for cloud deployment scenarios—distinguish between malicious SSRF attempts and legitimate internal routing

## Result

- Technical communication principles documented and reinforced ✓
- SOLID principles reviewed with practical context ✓
- Critical validation edge case identified for cloud deployments ✓
- Action item: Review and update validation logic to handle cloud networking patterns

---
"Clear writing is clear thinking. Over-engineering is waste. And always anticipate the environment your code will run in."
