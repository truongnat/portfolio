---
title: "Security in Agile: Shift Left and DevSecOps"
date: "2023-07-25"
description: "Security cannot be an afterthought. Learn how to integrate 'Shift Left' security practices, automated vulnerability scanning, and Threat Modeling into your Agile sprints."
slug: "agile-scrum-security-and-hardening-guide"
published: true
tags: ["Leadership", "Agile/Scrum"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Security in Agile: Shift Left and DevSecOps

In the old Waterfall days, "Security" was a gatekeeper that appeared at the end of the project to say "No." In Agile, this doesn't work. If you release daily, you cannot wait weeks for a security audit.

## The Concept: Shift Left

"Shift Left" means moving security testing earlier in the timeline (to the left on the Gantt chart).

1.  **Design Phase:** Threat Modeling.
2.  **Coding Phase:** IDE plugins (SonarLint).
3.  **Build Phase:** SAST (Static Analysis).
4.  **Deploy Phase:** DAST (Dynamic Analysis).

## Agile Threat Modeling

You don't need a 50-page security document. Add a **"Security Section"** to your ticket template.

*   **Question:** "How could an attacker abuse this feature?"
*   **Example:** If building a file upload, consider: "What if they upload a 10GB file? What if they upload a `.exe`?"

## Automated Tooling (DevSecOps)

Security must be automated to keep up with Agile velocity.

### 1. Dependency Scanning (SCA)

80% of your code is open source libraries. Use tools to watch them.
*   **Tools:** Dependabot (GitHub), Renovate, Snyk.
*   **Workflow:** Automated PRs when a vulnerability is found.

### 2. Static Analysis (SAST)

Catch SQL injection and XSS before the code leaves the developer's machine.
*   **Tools:** SonarQube, CodeQL.

### 3. Secrets Management

Never commit API keys.
*   **Tools:** git-secrets, Vault, AWS Secrets Manager.

## Example: Secure CI Pipeline

```yaml
name: DevSecOps Pipeline

on: [push]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
          
      - name: Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
```

## Conclusion

DevSecOps is the alignment of Security with IT and DevOps. By automating the boring stuff and making security a shared responsibility, we can move fast *without* breaking things.