---
title: "Mastering Gemini 1.5: Context Caching and Controlled Generation"
date: "2024-06-01"
description: "Advanced techniques for Gemini 1.5 Pro. Learn how to use Context Caching for massive cost savings and JSON Mode for reliable integrations."
slug: "gemini-advanced-patterns-and-best-practices"
published: true
tags: ["AI/ML", "Gemini"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

# Mastering Gemini 1.5: Context Caching and Controlled Generation

Gemini 1.5 Pro's 2-million token context window is a superpower, but managing that much data requires advanced patterns to keep costs low and responses reliable.

## 1. Context Caching (The Cost Killer)

If you are repeatedly querying the same large dataset (e.g., a 1000-page PDF manual or a massive codebase), you shouldn't pay to send those tokens every time.
*   **Context Caching:** Store the "pre-computed" tokens on Google's servers.
*   **Impact:** Reduces input token costs by up to 90% for repeated queries.

```bash
# Example: Creating a cache for a large documentation set
curl -X POST "https://generativelanguage.googleapis.com/v1beta/cachedContents" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "models/gemini-1.5-pro-002",
      "contents": [{ "parts": [{ "file_data": { "file_uri": "...", "mime_type": "application/pdf" } }] }],
      "ttl": "3600s"
    }'
```

## 2. Controlled Output (JSON Schema)

For production integrations, you cannot rely on "Please return JSON." Gemini now supports **Response Schema** to enforce strict structure.

```typescript
const schema = {
  type: "object",
  properties: {
    sentiment: { type: "string", enum: ["positive", "negative"] },
    confidence: { type: "number" },
  },
  required: ["sentiment"],
};

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  generationConfig: { responseMimeType: "application/json", responseSchema: schema },
});
```

## 3. Grounding with Google Search

Gemini can now "Ground" its answers in real-time Google Search results to reduce hallucinations and provide citations.
*   **Pattern:** Enable `google_search_retrieval` as a tool.

## 4. Fine-tuning with Vertex AI

When prompts aren't enough, Gemini allows you to fine-tune the model on your specific brand voice or specialized technical domain using the Google Cloud Vertex AI platform.

## Summary

Gemini 1.5 Pro is more than just a large window; it's a developer-first platform. By utilizing **Context Caching** for efficiency and **Response Schemas** for reliability, you can build enterprise AI applications that are both powerful and cost-effective.