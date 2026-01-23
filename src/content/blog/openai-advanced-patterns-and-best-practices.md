---
title: "Mastering the OpenAI API: Structured Outputs and Function Calling"
date: "2023-12-08"
description: "How to get reliable JSON from GPT-4. We explore the new 'Structured Outputs' feature, function calling for tool use, and multi-modal vision patterns."
slug: "openai-advanced-patterns-and-best-practices"
published: true
tags: ["AI/ML", "OpenAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000"
---

# Mastering the OpenAI API: Structured Outputs and Function Calling

The difference between a demo and a product is **Reliability**. You cannot build software on "maybe."

## 1. Structured Outputs (Strict Mode)

OpenAI's latest update allows you to enforce a strict JSON schema.
*   **The Guarantee:** The model will *always* return data matching your Zod/Pydantic schema, or it will refuse the request. No more regex parsing errors.

```javascript
const completion = await openai.chat.completions.create({
  model: "gpt-4o-2024-08-06",
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "order_extraction",
      schema: {
        type: "object",
        properties: {
          product_id: { type: "string" },
          quantity: { type: "integer" }
        },
        required: ["product_id", "quantity"],
        additionalProperties: false
      },
      strict: true
    }
  }
});
```

## 2. Function Calling as a Router

Don't ask the model to generate text. Ask it to generate *actions*.
*   **Pattern:** Pass a list of 50 possible tools. The model becomes a **Classifier**, deciding which tool (if any) matches the user's intent.

## 3. Vision for Data Entry

Use GPT-4o to "read" images of receipts or invoices.
*   **Best Practice:** Combine Vision with Structured Outputs to turn a messy photo of a crumpled receipt into a perfect JSON object for your expense system.

## Summary

OpenAI is moving from "Generative Text" to "Generative Interface." By using Structured Outputs, you treat the model as a messy-data-to-clean-data converter.