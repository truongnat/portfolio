---
title: "Under the Hood of GitLab Runner: Executors and Scheduling"
date: "2024-01-25"
description: "How does GitLab manage jobs? A technical deep dive into the Runner Executors, job polling, and artifact handling."
slug: "gitlab-ci-cd-deep-dive-into-core-internals"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood of GitLab Runner: Executors and Scheduling

GitLab CI is a client-server architecture. The server manages the state; the runner does the work.

## 1. The Runner Executors

The Runner is a Go binary that supports multiple "Executors."
*   **Shell:** Runs directly on the host machine. Fast, but insecure and messy.
*   **Docker:** Runs in a container. Clean, standard.
*   **Kubernetes:** The enterprise standard. Creates a Pod for the job, a container for the steps, and sidecars for services (Postgres/Redis).

## 2. The Polling Mechanism

Runners don't listen; they poll.
*   **Request:** `POST /api/v4/jobs/request`. "Do you have work for my tags?"
*   **Response:** "Yes, here is the job payload (scripts + vars)."
*   **Scale:** This polling model allows you to put runners behind NATs or firewalls without opening inbound ports.

## 3. Predefined Variables

How does the runner know the branch name?
*   **Injection:** The GitLab Server injects hundreds of variables (`CI_COMMIT_SHA`, `CI_JOB_ID`) as environment variables into the shell session before executing your script.

## 4. Artifact Handling

When you define `artifacts`, the runner zips the specified paths and uploads them to the GitLab Coordinator (Server) via an internal API. This zip is then downloaded by the next runner in the chain.

## Summary

Understanding the Runner allows you to optimize your infrastructure. Running a heavy Java build? Use the Kubernetes executor with resource requests. Running a simple bash script? The Docker executor is fine.