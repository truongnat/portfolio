---
title: "Modernizing Legacy Pipelines: A GitLab CI/CD Migration Story"
date: "2023-10-25"
description: "How we consolidated 20 disparate Jenkins servers into a single, scalable GitLab CI/CD instance. A case study in simplifying DevOps infrastructure."
slug: "gitlab-ci-cd-a-practical-case-study"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000"
---

# Modernizing Legacy Pipelines: A GitLab CI/CD Migration Story

Maintaining a sprawling Jenkins infrastructure is a full-time job. This case study details how we migrated a mid-sized engineering organization to GitLab CI/CD, reducing build times by 40% and maintenance overhead by 90%.

## The Challenge: "Plugin Hell"

Our Jenkins setup was a house of cards.
*   **Version Conflicts:** Updating one plugin often broke three others.
*   **Security:** Managing user access across 20 servers was a nightmare.
*   **Visibility:** Developers had no idea why their build failed without SSHing into the build agent.

## The Solution: Unified CI/CD

We moved to GitLab CI/CD because it offers a "Single Pane of Glass"—code, issues, and pipelines in one place.

### 1. The `.gitlab-ci.yml` Revolution
We replaced complex Groovy scripts with declarative YAML.
*   **Benefit:** Developers could read and edit their own pipelines without learning a new language.

### 2. Auto-Scaling Runners
We deployed **GitLab Runner** on Kubernetes (EKS).
*   **Mechanism:** When a job starts, a new Pod spins up. When it finishes, the Pod dies.
*   **Result:** Zero "dirty workspace" issues.

### 3. Pipeline Efficiency
We used **Directed Acyclic Graphs (DAG)** (`needs` keyword) instead of simple stages.
*   **Impact:** The frontend build didn't have to wait for the backend tests to finish. They ran in parallel.

## Results

| Metric | Jenkins | GitLab CI |
| :--- | :--- | :--- |
| **Pipeline Config** | Stored in DB (Opaque) | Stored in Repo (Versioned) |
| **Avg. Queue Time** | 15 Mins | < 1 Min |
| **DevOps Tickets** | 20/week | 2/week |

## Conclusion

The migration wasn't just a tool swap; it was a culture shift. By moving the pipeline definition into the repo, we empowered developers to own their delivery process.