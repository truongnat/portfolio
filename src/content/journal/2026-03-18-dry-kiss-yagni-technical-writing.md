---
title: "DRY, KISS, YAGNI: When to Apply and When Not, Technical Writing & Documentation"
date: 2026-03-18
type: "day"
summary: "Day 2/100 of #100DaysArchitect and #100DaysLeader covering DRY/KISS/YAGNI principles, the danger of premature abstraction, and the art of technical documentation."
tags: ["Architecture", "Leadership", "Documentation", "BestPractices", "CodeQuality", "TechnicalWriting"]
---

Today focused on fundamental architectural principles (DRY, KISS, YAGNI) and the critical leadership skill of technical writing and documentation.

## What I did

### 1. #100DaysArchitect — Day 2: DRY, KISS, YAGNI

**DRY (Don't Repeat Yourself)**
- Every piece of knowledge must have a single, unambiguous, authoritative representation
- Applies to config, schema, docs, business logic—not just code
- **The trap**: Premature DRY (abstraction too early) is worse than duplication
- **Rule of Three**: Wait until the 3rd occurrence before merging

**KISS (Keep It Simple, Stupid)**
- Simple solutions beat clever solutions every time
- Complexity is a tax you pay every time you read, debug, or maintain
- **KISS ≠ naive**: Simple ≠ Easy. Finding simple solutions for complex problems requires deep understanding

**YAGNI (You Ain't Gonna Need It)**
- Don't build features/abstractions for hypothetical futures
- Cost of wrong abstraction > cost of refactoring later
- **Architect trap**: "Future-proofing" temptation leads to over-engineering for non-existent scale

**The correct order**: Make it work → Make it right → Make it fast
- KISS chooses simple
- YAGNI avoids excess
- DRY eliminates duplication
- **This order matters—don't reverse it**

**TypeScript Examples**:

❌ **YAGNI violation** — Over-engineering for non-existent provider switching:
```typescript
// Too many abstractions: Registry, Factory, Interface...
// Reality: Only one email provider, no plan to switch
class EmailProviderRegistry { ... }
```

✅ **KISS done right**:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string, name: string) {
  await resend.emails.send({
    from: 'noreply@truongdq.com',
    to,
    subject: `Welcome, ${name}!`,
    html: `<p>Hi ${name}, welcome aboard!</p>`,
  });
}
// Simple, direct, refactor when truly needed
```

✅ **DRY done right** — Single source of truth with Zod:
```typescript
import { z } from 'zod';

// Single source of truth for email validation
export const EmailSchema = z.string().email().min(5);

// Reuse everywhere: form, API, DB layer
// When rules change → fix in one place only
```

**Key insight from Sandi Metz**: *"Duplication is far cheaper than the wrong abstraction."*

After 4 years of coding, you naturally apply DRY. But as an Architect, you review others' code more—and the biggest trap is accepting abstractions because they "look pro."

A wrong abstraction spreads, creates hidden coupling, and eventually needs a rewrite—10x more expensive than keeping the original duplication.

**Mental model**: Don't ask "is this code duplicated?"—ask "if requirement A changes, should B change too?" If yes → DRY justified. If no → coincidental similarity, keep them independent.

### 2. #100DaysLeader — Day 2: Technical Writing & Documentation

**Core concepts**:

1. **Doc is code** — Bad technical documentation = invisible technical debt. A PR missing context costs reviewers 20 minutes × 100 PRs/month = 33+ hours wasted.

2. **Audience-first writing** — Always ask: "Who is reading this? Junior dev? PM? CTO?" Each audience needs different detail levels.

3. **Structure beats prose** — Bullet points, headers, code blocks > long paragraphs. Engineers skim, they don't read thoroughly.

4. **Decision records (ADR)** — Every architectural decision needs the *why* documented, not just the *what*. Your future self will thank you in 6 months.

5. **Living docs** — Documentation that isn't updated = documentation that lies. Attach doc review to sprint cycles.

**Real scenario**: Just completed REST → GraphQL migration. PM asks "why?", Junior dev asks "how?", CTO asks "what's the impact?"

Three questions, three readers, three types of documentation:
- **ADR for PM/CTO**: "Chose GraphQL because X, Y, Z. Trade-offs are A, B."
- **API Guide for devs**: Endpoints, query examples, error handling
- **Executive Summary for CTO**: 2-3 lines on impact (performance +30%, bundle size -20%)

Without these three docs → you'll answer the same questions repeatedly every week.

**ADR Template** (to practice):
```markdown
# ADR-001: [Decision Name]

**Date:** YYYY-MM-DD  
**Status:** Accepted | Proposed | Deprecated

## Context
[What problem is happening? Why is this decision needed?]

## Decision
[What did we decide to do?]

## Rationale
- ✅ Reason 1
- ✅ Reason 2
- ❌ Accepted trade-offs

## Alternatives Considered
- Option A — Rejected because...
- Option B — Rejected because...

## Consequences
- Short-term impact
- Long-term impact
```

**Leader insight**: *"A great Tech Lead isn't the person who codes the most on the team—it's the person who makes the entire team code more effectively. Documentation is that lever. Every hour spent writing good docs saves 10 hours of onboarding, 5 hours of explanation meetings, and countless 'why is the code like this?' moments at 11 PM."*

Start small: commit 1 ADR per sprint. After 3 months, your codebase will have a decision history that not every team has.

## Challenges & Solutions

**Challenge**: Distinguishing between "healthy duplication" and "DRY violation" during code reviews
**Solution**: Use the business meaning test—if two similar pieces serve different business concepts, they're coincidentally similar, not DRY violations

**Challenge**: Balancing future-proofing with YAGNI
**Solution**: Ask for concrete use cases, not hypothetical scenarios. If there's no real need now, defer the abstraction

## Result

- DRY, KISS, YAGNI principles reviewed with practical examples ✓
- Understood the danger of premature abstraction ✓
- Technical writing principles documented ✓
- ADR template ready for practice ✓
- Action item: Perform DRY/KISS audit on real project code (30-60 min exercise)
- Action item: Write 1 ADR for a recent technical decision (15-20 min exercise)

---
"Duplication is far cheaper than the wrong abstraction. Documentation is the lever that makes teams effective."
