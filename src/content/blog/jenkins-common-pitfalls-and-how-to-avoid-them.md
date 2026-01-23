---
title: "Jenkins Pitfalls: Plugin Bloat and Groovy Sandboxes"
date: "2023-12-20"
description: "Why your Jenkins is slow and insecure. We discuss plugin dependency hell, the Groovy sandbox limits, and how to avoid the 'Restart from Stage' trap."
slug: "jenkins-common-pitfalls-and-how-to-avoid-them"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?auto=format&fit=crop&q=80&w=1000"
---

# Jenkins Pitfalls: Plugin Bloat and Groovy Sandboxes

Jenkins is easy to start but hard to maintain.

## 1. Plugin Bloat

**The Pitfall:** Installing every plugin that looks cool.
**The Reality:** Plugins have dependencies. Updating "Git Plugin" might break "Blue Ocean."
**The Fix:** Use **Configuration as Code (JCasC)**. Define your plugins in a YAML file and rebuild the Jenkins Master container daily. If it breaks, you know exactly which plugin update caused it.

## 2. Groovy Sandbox `RejectedAccessException`

**The Pitfall:** Writing complex Java/Groovy code in your `Jenkinsfile`.
**The Result:** The build fails with "Scripts not permitted to use method...".
**The Fix:** Put complex logic in a **Shared Library**. Libraries run outside the sandbox (Trusted), while the Jenkinsfile runs inside it (Untrusted).

## 3. The "Restart from Stage" Trap

**The Pitfall:** Relying on restarting a pipeline from Stage 3.
**The Risk:** The workspace is often wiped between restarts. You might not have the artifacts from Stage 1 & 2.
**The Fix:** Use **Stash/Unstash** or external artifact storage (S3/Artifactory) to persist data between stages.

## 4. Master Node Execution

**The Pitfall:** Running builds on the Master node (`agent any` defaulting to master).
**The Risk:** `rm -rf /` on the master destroys your Jenkins server.
**The Fix:** Set the Master to **0 executors**. Force all builds to run on agent nodes.

## Summary

Jenkins is powerful but dangerous. Restrict what runs on the master, restrict plugins, and restrict Groovy access to keep it stable.