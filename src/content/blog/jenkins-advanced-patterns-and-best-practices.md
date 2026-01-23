---
title: "Advanced Jenkins: Shared Libraries and Kubernetes Agents"
date: "2023-11-25"
description: "Going beyond the basics. Learn how to write Shared Libraries in Groovy, choose between Scripted vs. Declarative pipelines, and run ephemeral agents on K8s."
slug: "jenkins-advanced-patterns-and-best-practices"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1607799275518-d6c43953e6b0?auto=format&fit=crop&q=80&w=1000"
---

# Advanced Jenkins: Shared Libraries and Kubernetes Agents

Jenkins is infinitely extensible, which is both its strength and its weakness. To use it effectively at scale, you need advanced patterns.

## 1. Kubernetes Agents

Stop maintaining static EC2 build agents.
*   **The Plugin:** `kubernetes-plugin`.
*   **The Logic:** When a build starts, Jenkins spins up a Pod in your K8s cluster. It runs the build, then deletes the Pod.
*   **Benefit:** Massive parallelism and clean environments.

## 2. Shared Libraries (Global Variables)

Don't copy-paste Groovy code.
*   **Structure:**
    ```
    (root)
    +- vars
       +- deployToK8s.groovy
       +- runTests.groovy
    ```
*   **Usage:** In `Jenkinsfile`: `deployToK8s(env: 'prod')`.

## 3. Scripted vs. Declarative

*   **Declarative:** `pipeline { agent any ... }`. Rigid, readable, better for 90% of use cases.
*   **Scripted:** `node { ... }`. Full Groovy power. Use this *inside* Shared Libraries for complex logic, but keep the user-facing `Jenkinsfile` Declarative.

## 4. Replaying Pipelines

Jenkins allows you to "Replay" a build with modified Groovy script *without* committing code.
*   **Use Case:** Rapidly debugging a broken pipeline step.

## Summary

Advanced Jenkins is about **Platform Engineering**. You build the primitives (Shared Libs, Agents) that allow product teams to ship code without needing to know how Jenkins works.