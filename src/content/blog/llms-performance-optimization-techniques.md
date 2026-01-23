---
title: "Optimizing Inference: Quantization, vLLM, and Speculative Decoding"
date: "2024-03-12"
description: "How to serve 70B parameter models with low latency. A guide to GPU optimization, 4-bit quantization, and batching strategies."
slug: "llms-performance-optimization-techniques"
published: true
tags: ["AI/ML", "LLMs"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Optimizing Inference: Quantization, vLLM, and Speculative Decoding

Serving LLMs is expensive. Here is how to make it fast and cheap.

## 1. Quantization (4-bit / 8-bit)

Models are trained in FP16 (16-bit floating point).
*   **The Trick:** Convert weights to 4-bit integers (GPTQ/AWQ).
*   **The Impact:** Reduces VRAM usage by 75% with negligible accuracy loss. You can run Llama-3-70B on a single consumer GPU instead of a cluster.

## 2. vLLM and PagedAttention

Standard serving engines waste memory due to fragmentation.
*   **vLLM:** Uses "PagedAttention" (like OS virtual memory) to manage KV cache efficiently.
*   **Result:** 24x higher throughput than HuggingFace Transformers.

## 3. Speculative Decoding

A small "Draft Model" guesses the next 5 tokens cheaply. The big model validates them in parallel.
*   **Result:** 2-3x speedup in token generation.

## Summary

Inference optimization is an **Engineering** problem. By understanding the hardware constraints, you can serve massive models at a fraction of the standard cloud cost.