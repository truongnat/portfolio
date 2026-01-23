---
title: "Agile Quality Assurance: The Testing Pyramid in Practice"
date: "2023-08-30"
description: "Why 'finding bugs' is not the goal. Discover the Agile Testing Pyramid, the shift from QA to Quality Engineering, and strategies for maintaining a healthy test suite."
slug: "agile-scrum-testing-and-quality-assurance"
published: true
tags: ["Leadership", "Agile/Scrum"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000"
---

# Agile Quality Assurance: The Testing Pyramid in Practice

In traditional models, testing was a phase. In Agile, testing is an activity that happens continuously. But simply running manual tests faster isn't the answer. We need a strategy.

## The Testing Pyramid

Mike Cohn's Testing Pyramid is the mental model for Agile quality.

1.  **Unit Tests (The Base):** Fast, cheap, isolated. Test individual functions. (70% of tests).
2.  **Integration Tests (The Middle):** Test how modules interact (e.g., API + Database). (20% of tests).
3.  **E2E Tests (The Tip):** Slow, brittle, expensive. Test the full user flow (e.g., Cypress/Playwright). (10% of tests).

**Anti-Pattern:** The "Ice Cream Cone" (Lots of manual/E2E tests, few unit tests). This leads to slow builds and flaky feedback.

## QA vs. QE

High-performing teams are shifting from **Quality Assurance (QA)** to **Quality Engineering (QE)**.

*   **QA Role:** "I find bugs manually."
*   **QE Role:** "I build the tools and frameworks so developers can write their own tests."

## Handling Flaky Tests

A flaky test (fails 10% of the time) is worse than no test. It destroys trust in the deployment pipeline.

**Strategy:**
1.  **Quarantine:** Move flaky tests to a separate "non-blocking" pipeline immediately.
2.  **Fix or Delete:** Don't ignore them. If it's not worth fixing, it's not worth having.

## Contract Testing (Microservices)

When Team A breaks Team B's API, you have an integration problem. **Consumer-Driven Contract Testing (CDCT)** solves this.

*   **Tool:** Pact.
*   **Concept:** The "Consumer" defines what they need (the Contract). The "Provider" ensures they fulfill it.

```javascript
// Example: Pact Consumer Test
describe('API Contract', () => {
  it('returns a user when valid ID is provided', async () => {
    await provider.addInteraction({
      state: 'user exists',
      uponReceiving: 'a request for user',
      withRequest: {
        method: 'GET',
        path: '/user/1',
      },
      willRespondWith: {
        status: 200,
        body: { id: 1, name: 'Alice' },
      },
    });
  });
});
```

## Conclusion

Quality is everyone's responsibility. By pushing testing down the pyramid (more unit, less E2E) and empowering developers to own their quality, we create a sustainable delivery pace.