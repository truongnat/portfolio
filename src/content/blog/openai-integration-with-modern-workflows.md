---
title: "The OpenAI Stack: Next.js, Supabase, and Real-time Voice"
date: "2024-02-28"
description: "How to build a modern AI app. Integrating OpenAI with Vercel's AI SDK, storing vectors in Supabase, and using the new Real-time Voice API."
slug: "openai-integration-with-modern-workflows"
published: true
tags: ["AI/ML", "OpenAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# The OpenAI Stack: Next.js, Supabase, and Real-time Voice

The modern "AI Stack" is emerging. It centers on low-latency data and high-speed inference.

## 1. Vercel AI SDK + OpenAI

The standard for frontend AI.
*   **useChat:** A React hook that handles the message history, streaming, and UI updates automatically.
*   **Tool Calling:** The SDK automatically renders UI components (like a "Stock Chart") when the model calls a specific tool.

## 2. Supabase (pgvector) for Memory

Don't use a separate vector DB. Use **pgvector** inside your Postgres database.
*   **Benefit:** You can join your "Embeddings" with your "User Table" in a single SQL query. No data synchronization issues.

## 3. The Real-time API (Voice)

OpenAI's new WebSocket API allows for low-latency (<300ms) voice-to-voice conversations.
*   **The Shift:** Moving from "Text-First" interfaces to "Voice-First" experiences for mobile and customer support apps.

## Summary

Integration is about **User Experience**. By using the AI SDK for streaming and the Real-time API for voice, you reduce the friction between the user's intent and the AI's action.