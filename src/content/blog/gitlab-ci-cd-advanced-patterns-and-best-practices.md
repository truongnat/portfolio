---
title: "Advanced GitLab CI: Parent-Child Pipelines and Dynamic Generation"
date: "2023-11-20"
description: "Master the `.gitlab-ci.yml`. Learn how to use Parent-Child pipelines for monorepos, generate pipelines dynamically, and optimize caching."
slug: "gitlab-ci-cd-advanced-patterns-and-best-practices"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1607799275518-d6c43953e6b0?auto=format&fit=crop&q=80&w=1000"
---

# Advanced GitLab CI: Parent-Child Pipelines and Dynamic Generation

As your repository grows, a single 2000-line YAML file becomes unmanageable. GitLab offers powerful primitives to decompose complexity.

## 1. Parent-Child Pipelines

Don't run every job for every commit.
*   **The Concept:** A "Parent" pipeline detects which folders changed (e.g., `services/api` vs `frontend/web`).
*   **The Action:** It triggers a "Child" pipeline that *only* contains the jobs relevant to that folder.
*   **Syntax:**
    ```yaml
    trigger:
      include: services/api/.gitlab-ci.yml
      strategy: depend
    ```

## 2. Dynamic Pipeline Generation

For truly complex scenarios, you can write a script that *generates* the YAML on the fly.
*   **Workflow:**
    1.  Job A runs a Python script to scan the repo.
    2.  Script generates `generated-ci.yml`.
    3.  Job B triggers a child pipeline using that artifact.

## 3. The `rules` Keyword

Stop using `only` and `except`.
*   **Power:** `rules` allows for complex logic (AND/OR/IF).
    ```yaml
    rules:
      - if: $CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE == "push"
        when: always
    ```

## 4. Caching Strategy

GitLab's distributed cache is powerful but tricky.
*   **Key:** Use `${CI_COMMIT_REF_SLUG}` for branch-specific caches, but fall back to `default` keys for master branch caches.

## Summary

Advanced GitLab CI is about **Modularity**. Break your monolithic pipeline into small, composable, and conditional units to keep your feedback loop fast.