---
title: "Modern Jenkins: JCasC, Docker, and Webhooks"
date: "2024-02-28"
description: "Bringing Jenkins into the modern era. How to use Jenkins Configuration as Code (JCasC), Docker pipelines, and generic webhooks."
slug: "jenkins-integration-with-modern-workflows"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# Modern Jenkins: JCasC, Docker, and Webhooks

Jenkins can feel legacy, but with the right tools, it fits into a GitOps workflow.

## 1. Jenkins Configuration as Code (JCasC)

Stop clicking in the UI.
*   **The Tool:** The `configuration-as-code` plugin.
*   **The Config:** A single `jenkins.yaml` file defines the system message, number of executors, cloud configuration, and security settings.
*   **Benefit:** You can spin up a production-ready Jenkins server in 2 minutes.

## 2. Docker Pipeline Integration

Don't install tools on the agent. Use Docker.
```groovy
pipeline {
    agent {
        docker { image 'node:18-alpine' }
    }
    stages {
        stage('Build') {
            steps { sh 'npm ci' }
        }
    }
}
```
This runs the steps *inside* the container.

## 3. Generic Webhooks

Jenkins isn't just for Git. You can trigger it from anywhere.
*   **Use Case:** A Slack slash command (`/deploy`) sends a POST request to Jenkins with parameters (`env=prod`). Jenkins parses the JSON and starts the job.

## Summary

Modern Jenkins is **Ephemeral** and **Configured as Code**. By using JCasC and Docker, you remove the "Pet Server" problem and make Jenkins a stateless workflow engine.