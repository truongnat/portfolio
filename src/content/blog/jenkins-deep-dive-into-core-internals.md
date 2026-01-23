---
title: "Under the Hood of Jenkins: Remoting, JNLP, and the JVM"
date: "2024-01-30"
description: "How does the Jenkins Master control the Agents? A deep dive into the Java Remoting Protocol, the file system layout, and ClassLoaders."
slug: "jenkins-deep-dive-into-core-internals"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood of Jenkins: Remoting, JNLP, and the JVM

Jenkins is a Java application that has evolved over 15 years. Its architecture is unique.

## 1. The Master-Slave Architecture

*   **Master:** The brain. Stores config, schedules builds, serves the UI.
*   **Agent (Slave):** The muscle.
*   **The Protocol:** They communicate via **Jenkins Remoting** (usually over TCP or JNLP). This allows the Master to execute Java methods on the Agent *as if they were local*.

## 2. JNLP (Java Network Launch Protocol)

For cloud agents, the Master doesn't SSH into them. The Agent connects *back* to the Master.
*   **The Flow:** The Agent downloads a `.jar` file from the Master and opens a persistent TCP connection. This works through firewalls.

## 3. The File System (`JENKINS_HOME`)

Jenkins stores *everything* as XML files on disk.
*   `jobs/my-job/config.xml`: The job definition.
*   `users/users.xml`: User database.
*   **Implication:** Backing up Jenkins is as simple as backing up this directory.

## 4. ClassLoaders

Each Plugin runs in its own ClassLoader to prevent dependency conflicts (e.g., two plugins needing different versions of Guava). However, this "Uber ClassLoader" architecture is complex and often the source of memory leaks.

## Summary

Understanding the JVM and Remoting layer helps you debug the dreaded `ChannelClosedException` and optimize your agent connectivity.