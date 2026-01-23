---
title: "Modern CI/CD: Integrating GHA with AWS, Vercel, and Slack"
date: "2024-02-25"
description: "Stop using long-lived secrets. Learn how to deploy to AWS using OIDC, trigger Vercel builds, and send rich Slack notifications."
slug: "github-actions-integration-with-modern-workflows"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Modern CI/CD: Integrating GHA with AWS, Vercel, and Slack

A pipeline that runs in isolation is useless. It needs to talk to the world.

## 1. AWS Deployment (OIDC)

Stop rotating ACCESS_KEY_ID every 90 days.
*   **The Setup:** Configure an IAM Role in AWS that trusts your GitHub Repo.
*   **The Action:** `aws-actions/configure-aws-credentials`. It exchanges the GHA JWT for a temporary AWS session token.

## 2. SlackOps (Rich Notifications)

Don't just email logs. Send a message to Slack with buttons.
*   **The Workflow:** On failure, send a Block Kit message with a "Re-run" button and a link to the specific failed step.

## 3. Vercel & Netlify

While Vercel has its own CI, sometimes you need more control (e.g., running E2E tests before deploy).
*   **The Pattern:** Use the Vercel CLI in GHA to trigger a "Preview Deployment," wait for the URL, run Cypress against that URL, and *then* promote to production.

## Summary

Integration is about **Connectivity**. Your CI pipeline is the central nervous system of your engineering team; ensure it connects to all your vital organs (Cloud, Chat, Testing).