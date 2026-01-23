---
title: "Migrating from Jenkins to GitHub Actions: A Case Study"
date: "2023-10-20"
description: "How we reduced CI/CD maintenance by 80% by moving from a Jenkins monolith to ephemeral GitHub Actions runners. A guide to YAML migration and cost savings."
slug: "github-actions-a-practical-case-study"
published: true
tags: ["DevOps", "GitHub Actions"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000"
---

# Migrating from Jenkins to GitHub Actions: A Case Study

Jenkins has been the workhorse of CI/CD for a decade, but maintaining a "Jenkins Master" server is a full-time job. This case study details our migration to GitHub Actions.

## The Challenge: "The Jenkins Tax"

Our Jenkins server required weekly patching, plugin updates, and manual scaling of build agents.
*   **Downtime:** 2 hours/month for maintenance.
*   **Queue Times:** Developers waited 20+ minutes for a build agent during peak hours.

## The Solution: GitHub Actions (SaaS)

We moved to GitHub Actions to eliminate the infrastructure burden.

### 1. The Matrix Strategy
Instead of 10 different Jenkins jobs for different Node versions, we used a single GHA workflow with a **Matrix Strategy**.

```yaml
strategy:
  matrix:
    node-version: [14.x, 16.x, 18.x]
```

### 2. Dependency Caching
We implemented `actions/cache` to store `node_modules` and `pip` caches.
*   **Result:** `npm install` time dropped from 3 minutes to 15 seconds.

### 3. Ephemeral Runners
Every job runs in a fresh, clean container. No more "workspace pollution" where a previous build's artifacts break the current build.

## Results

| Metric | Jenkins | GitHub Actions |
| :--- | :--- | :--- |
| **Maintenance** | 10 hrs/month | 0 hrs/month |
| **Build Time** | 12 mins | 4 mins (Parallelism) |
| **Cost** | Fixed EC2 ($500/mo) | Pay-per-use ($150/mo) |

## Conclusion

GitHub Actions isn't just a CI tool; it's a productivity multiplier. By keeping the CI config right next to the code (in `.github/workflows`), developers took ownership of their own pipelines.