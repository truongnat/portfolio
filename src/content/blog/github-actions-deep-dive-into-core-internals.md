---
title: "Under the Hood of GitHub Actions: Runners and the Event Bus"
date: "2024-01-20"
description: "How does GHA actually work? A technical deep dive into the Runner application, the Action Runner Controller (ARC), and OIDC authentication."
slug: "github-actions-deep-dive-into-core-internals"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood of GitHub Actions: Runners and the Event Bus

GitHub Actions is essentially a distributed event bus connected to a fleet of worker nodes.

## 1. The Runner Application

The runner is a .NET application that polls GitHub for jobs.
*   **Hosted:** ephemeral VMs managed by GitHub (Azure).
*   **Self-Hosted:** You install the agent on your own server. It creates a long-polling HTTPS connection to GitHub (no inbound firewall ports needed).

## 2. The Event Bus

Every interaction (Push, PR, Star, Issue) generates a JSON payload.
*   **Filtering:** The workflow YAML acts as a filter. `on: push: branches: [main]` tells the bus to only dispatch events matching that criteria.

## 3. OIDC (OpenID Connect)

How does GHA talk to AWS without secrets?
*   **The Mechanism:** GitHub acts as an Identity Provider (IdP).
*   **The Flow:** The job requests a JWT. GitHub signs it. AWS verifies the signature and the `sub` claim (repo name).
*   **Result:** Temporary credentials without storing long-lived keys.

## Summary

Understanding the Runner and OIDC architecture allows you to build secure, scalable pipelines that integrate natively with your cloud provider.