---
title: "Native Multi-modality: The Architecture of Gemini 1.5"
date: "2024-07-01"
description: "Why Gemini is different. We explore native multi-modal training, Mixture-of-Experts (MoE) architecture, and the tech behind the 2M token window."
slug: "gemini-deep-dive-into-core-internals"
published: true
tags: ["AI/ML", "Gemini"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
---

# Native Multi-modality: The Architecture of Gemini 1.5

Most AI models are "Frankenstein" systems: a text model bolted onto an image encoder. Gemini is different. It was trained from the ground up to be **Natively Multi-modal**.

## 1. Multi-modal Training vs. Tooling

*   **GPT-4 Vision:** Often uses a separate vision encoder (like CLIP) to translate images into tokens the text model understands.
*   **Gemini:** The same neural network was trained on text, images, audio, video, and code simultaneously. It doesn't "translate"; it natively understands pixels and waveforms.

## 2. Mixture-of-Experts (MoE) Efficiency

Gemini 1.5 uses a **Mixture-of-Experts** architecture. Instead of activating all 1 trillion+ parameters for every word, it only activates the most relevant "experts" (sub-networks).
*   **The Result:** Gemini 1.5 Pro performs like a massive dense model but has the speed and cost profile of a much smaller one.

## 3. The 2-Million Token Window (The Secret Sauce)

How does Gemini manage 2M tokens without exploding the compute cost?
*   **Ring Attention & Transformer Optimizations:** Google implemented specialized attention mechanisms that allow for linear (rather than quadratic) scaling of context.
*   **TPUv5 Infrastructure:** Gemini is optimized for Google's latest custom AI hardware, the TPUv5, which is designed specifically for long-context workloads.

## 4. Flash vs. Pro: The Performance Gap

| Feature | Gemini 1.5 Flash | Gemini 1.5 Pro |
| :--- | :--- | :--- |
| **Primary Use** | Speed / Cost | Reasoning / Quality |
| **Context** | 1M Tokens | 2M Tokens |
| **Architecture** | Small MoE | Large MoE |

## Conclusion

Gemini isn't just a response to GPT-4; it's a new architectural direction. By moving to **Native Multi-modality** and **MoE efficiency**, Google has created a model that is uniquely suited for the "Video and Big Data" era of AI.