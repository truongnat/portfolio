---
title: "Taming the Jenkins Monolith: A Migration Case Study"
date: "2023-10-30"
description: "How we migrated 500 legacy Freestyle jobs to declarative Jenkinsfiles. A case study in 'Pipeline as Code' and immutable infrastructure."
slug: "jenkins-a-practical-case-study"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000"
---

# Taming the Jenkins Monolith: A Migration Case Study

For years, Jenkins "Freestyle Jobs" were the standard. But managing them via the UI is unscalable and untrackable. This case study details our migration to **Pipelines as Code**.

## The Challenge: "ClickOps" Nightmare

We had 500 jobs configured manually in the UI.
*   **Drift:** Prod build configuration didn't match Staging.
*   **Disaster Recovery:** If the server died, we lost the config.
*   **Review:** No code review for build script changes.

## The Solution: Jenkinsfile (Declarative Pipeline)

We mandated that every repo must contain a `Jenkinsfile`.

### 1. The Shared Library
We created a **Shared Library** to standardize common steps.
*   `vars/standardBuild.groovy`: Encapsulated `npm install`, `test`, and `docker build`.
*   **Result:** Developers just added `standardBuild()` to their Jenkinsfile.

### 2. Job DSL Plugin
We used the **Job DSL Plugin** to automatically scan our GitHub Organization and create Jenkins jobs for every repo that had a Jenkinsfile.
*   **Result:** Zero manual job creation.

## Results

| Metric | Freestyle Jobs | Jenkinsfile |
| :--- | :--- | :--- |
| **Config Visibility** | Hidden in XML | Git Versioned |
| **Onboarding Time** | 2 Days | 10 Mins |
| **Bus Factor** | 1 (The Jenkins Admin) | High (Any Dev) |

## Conclusion

Moving to "Pipeline as Code" transformed Jenkins from a fragile pet into a robust platform. By treating build logic as software, we applied the same quality standards to our CI/CD as we did to our product.