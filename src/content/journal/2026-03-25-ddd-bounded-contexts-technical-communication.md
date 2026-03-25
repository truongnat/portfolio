---
title: "DDD Bounded Contexts, Context Mapping, and the Art of Technical Communication"
date: 2026-03-25
type: "day"
summary: "Day 9: Bounded Contexts made sense of the chaos I used to call 'a big codebase.' And I finally have a framework for explaining architecture decisions without losing non-technical stakeholders in the first 30 seconds."
tags: ["DDD", "Bounded Contexts", "Context Mapping", "Architecture", "TypeScript", "Technical Communication", "Leadership", "Soft Skills"]
---

Today connected two things I'd been treating as separate worlds: deep technical thinking and the ability to communicate it to people who don't write code.

## Architect Day 9 — DDD: Bounded Contexts & Context Mapping

### From Aggregates to Bounded Contexts — The Natural Next Step

Yesterday (Day 8) I spent time with Aggregates — those clusters of objects that protect their own invariants and always stay internally consistent. I kept running into this question: *"Consistent according to whom?"*

That's the crack where Bounded Contexts walk in.

An Aggregate enforces rules *within* itself. A Bounded Context defines *which model* those rules belong to. Same entity, different meaning depending on where you are. A `Customer` in the Sales context is a prospect pipeline with conversion stages. A `Customer` in the Shipping context is a delivery address with order history. Same word, totally different model, different team, different database schema. That's the aha moment for me.

Before today I would have built one giant `Customer` model and tried to stuff everything in. Then wondered why every change to the Sales flow broke something in Shipping. **Bounded Contexts say: stop fighting that. They're *supposed* to be separate.**

### Context Mapping — How Contexts Talk to Each Other

This is where it gets practically useful. Once you accept that contexts are separate, you need patterns for how they integrate. Today I went through all seven:

- **Partnership** — two teams evolve together, tight coordination. Great in theory, risky in practice if teams drift.
- **Shared Kernel** — share a small common model that both contexts agree to maintain together. Works only with discipline and small surface area.
- **Customer/Supplier** — upstream context (Supplier) publishes, downstream context (Customer) consumes. The downstream team has to negotiate with upstream for changes. Classic BE service → FE pattern.
- **Conformist** — downstream just accepts the upstream model as-is. No negotiation. Works when the upstream is big and you have no leverage (third-party APIs, legacy systems).
- **Anti-Corruption Layer (ACL)** — downstream translates the upstream model into its own terms. This is the one I keep reaching for and didn't have a name for until today.
- **Open Host Service** — upstream defines a clean, stable protocol that multiple downstreams can consume. Think: a public API with versioning.
- **Published Language** — shared, well-documented interchange format (JSON schema, Protobuf, OpenAPI). Often pairs with Open Host Service.

### Real Example in TypeScript

Here's how I'd apply ACL in a real project. Suppose we're integrating a payment gateway (Stripe) into our Order context. Stripe's model bleeds in everywhere if you let it:

```typescript
// Without ACL — Stripe leaks into your domain
const order = await createOrder({ stripePaymentIntentId: '...' });

// With ACL — translate at the boundary
class PaymentGatewayAdapter {
  async confirmPayment(orderId: string): Promise<PaymentResult> {
    const intent = await stripe.paymentIntents.confirm(externalId);
    // Translate Stripe's model into OUR PaymentResult
    return {
      status: intent.status === 'succeeded' ? 'completed' : 'failed',
      transactionRef: intent.id,
      paidAt: new Date(intent.created * 1000),
    };
  }
}
```

Your domain never knows it's talking to Stripe. If we switch payment providers tomorrow, only the adapter changes. The rest of the codebase is untouched. That's the ACL pattern paying off.

---

## Leader Day 9 — Technical Communication

### The Real Problem: We Explain How, Not Why

Developers (myself included) default to explaining the *how* when non-technical stakeholders need the *why*. We show diagrams with 14 boxes and 27 arrows and call it "the architecture." Then we wonder why leadership doesn't understand why the migration takes 6 weeks.

The framework I'm committing to — I'm calling it **Context → Decision → Impact**:

1. **Context** — What problem are we solving? (1-2 sentences, no jargon)
2. **Decision** — What are we doing? (1 sentence, plain English)
3. **Impact** — What changes for the business? What's the risk of *not* doing it?

Applied to today's topic: "Our codebase treats all customer data as one system. When Sales makes a change, it accidentally breaks how Shipping displays customer addresses. We're separating these into independent modules. This means new features in Sales won't risk breaking the order delivery flow — and teams can ship faster without stepping on each other."

That's an architecture decision explained in 3 sentences. No diagram needed.

### When to Use Diagrams vs. When Text Is Enough

**Use a diagram when:** there are spatial or flow relationships that are genuinely hard to describe in words. Data flows, system boundaries, state transitions. If you'd say "and then it goes over *here*" while talking — draw it.

**Text is enough when:** you're explaining a decision, a tradeoff, or a timeline. Diagrams add noise here. A well-structured paragraph communicates hierarchy better than a box with arrows.

The common mistake I've seen (and made): reaching for a diagram as a *substitute* for clear thinking instead of as a *supplement* to it. If you can't explain it in a sentence first, the diagram won't save you.

### The Biggest Dev Presentation Mistake

Skipping the "so what." We present the technical change and stop. We don't connect it to what the audience actually cares about: reliability, velocity, cost, risk. Every architecture decision has a business consequence — it's our job to say it explicitly, not expect people to infer it.

---

## Connecting the Two

Bounded Contexts taught me that different people in the same organisation use the same words to mean different things — and that's not a bug, it's reality. Technical Communication is the same insight applied to people instead of code: your mental model of the system and your stakeholder's mental model are in *different contexts*. Your job isn't to force them into yours. It's to build an ACL — a translation layer — between your technical world and their business world.

An architect who can think in Bounded Contexts but can't communicate across context boundaries is only half done.

Tomorrow: **Domain Events & Event Sourcing** on the Architect side, and **Stakeholder Management** on the Leader side. Starting to see how these two tracks are going to converge in interesting ways.

---
*"The best architecture decision is one the whole team — technical and non-technical alike — can understand well enough to defend."*
