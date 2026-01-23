---
title: "Securing the API: Key Rotation and Content Moderation"
date: "2024-05-30"
description: "Best practices for securing your OpenAI integration. API key vaults, the Moderation API, and handling PII."
slug: "openai-security-and-hardening-guide"
published: true
tags: ["AI/ML", "OpenAI"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Securing the API: Key Rotation and Content Moderation

Your OpenAI API key is a blank check. Treat it like a root password.

## 1. Key Management

*   **Never** commit keys to git.
*   **Project-Scoped Keys:** Don't use a "User Key." Create a "Project Key" restricted to specific endpoints (e.g., only `chat.completions`, not `models.delete`).
*   **Budget Limits:** Set a "Hard Limit" of $50/month on your dev environment keys to prevent accidental bankruptcy loops.

## 2. The Moderation API (Free)

Before sending *any* user input to GPT-4, send it to the `/moderations` endpoint.
*   **Why?** It's free and fast. It catches hate speech and harassment instantly.
*   **Benefit:** Prevents your account from being banned for generating violating content.

## 3. Output Validation

Never trust the AI to be safe.
*   **Filter:** Run the AI's output through a "PII Filter" to ensure it didn't hallucinate a fake phone number or leak a real one.

## Summary

Security is **Hygiene**. Rotate your keys, set your budgets, and filter your inputs. It's boring, but it keeps you in business.