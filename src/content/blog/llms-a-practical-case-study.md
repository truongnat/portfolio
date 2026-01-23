---
title: "Enterprise LLMs: A Case Study in Self-Hosting Llama 3"
date: "2023-11-05"
description: "Why we moved from GPT-4 to a self-hosted Llama 3 for our internal legal assistant. A deep dive into privacy, cost, and fine-tuning."
slug: "llms-a-practical-case-study"
published: true
tags: ["AI/ML", "LLMs"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000"
---

# Enterprise LLMs: A Case Study in Self-Hosting Llama 3

For many enterprises, sending sensitive legal or financial data to a public API is a non-starter. This case study details how we deployed a fine-tuned **Llama 3 70B** model on internal infrastructure to create a secure Legal Assistant.

## The Challenge: Data Sovereignty

Our legal team needed an AI to summarize contracts, but our compliance policy strictly forbade sending client data to OpenAI or Anthropic.
*   **The Constraint:** All inference must happen within our VPC.
*   **The Goal:** GPT-4 level reasoning on legal texts.

## The Solution: Self-Hosted Llama 3

We chose Meta's **Llama 3 70B** for its balance of high reasoning capability and permissive license.

### 1. Infrastructure
We deployed the model on **AWS SageMaker** using `g5.12xlarge` instances (4x A10G GPUs).
*   **Engine:** vLLM for high-throughput serving.

### 2. Fine-Tuning (QLoRA)
We didn't just use the base model. We fine-tuned it on a dataset of 5,000 internal legal contracts using **QLoRA** (Quantized Low-Rank Adaptation).
*   **Cost:** ~$400 in compute time.
*   **Result:** The model learned our specific "Legal Dialect" and internal formatting standards.

## Results & Impact

| Metric | GPT-4 (API) | Self-Hosted Llama 3 |
| :--- | :--- | :--- |
| **Privacy** | Non-Compliant | 100% Private |
| **Cost per 1k Tokens** | $0.03 | $0.004 (at utilization) |
| **Legal Accuracy** | 88% | 94% (after fine-tuning) |

## Conclusion

The era of "one model to rule them all" is ending. By self-hosting open weights models, enterprises can achieve better privacy, lower costs, and higher accuracy for domain-specific tasks.