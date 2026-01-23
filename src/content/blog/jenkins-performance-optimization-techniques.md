---
title: "Tuning the Engine: Optimizing Jenkins Performance"
date: "2024-03-20"
description: "Is your Jenkins slow? We cover JVM Garbage Collection tuning, build discarder strategies, and offloading artifacts to S3."
slug: "jenkins-performance-optimization-techniques"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
---

# Tuning the Engine: Optimizing Jenkins Performance

A slow Jenkins server slows down the entire company.

## 1. JVM Tuning (Garbage Collection)

Jenkins is memory-hungry.
*   **The Flags:** Use G1GC. `-XX:+UseG1GC -XX:+UseStringDeduplication`.
*   **Heap Size:** Ensure your heap (`-Xmx`) is smaller than the container's RAM limit to avoid OOM kills.

## 2. Build Discarders

Jenkins keeps build history forever by default.
*   **The Problem:** Thousands of old builds clog the file system (`JENKINS_HOME`), making disk I/O crawl.
*   **The Fix:** Enforce a "Global Build Discarder" policy: Keep only the last 20 builds.

## 3. Artifact Offloading

Don't store `war` or `jar` files on the Jenkins master.
*   **The Strategy:** Use the **Artifact Manager S3** plugin.
*   **Benefit:** Artifacts stream directly from the Agent to S3. The Master never touches the heavy data, saving CPU and bandwidth.

## 4. Lazy Loading of Jobs

If you have 5,000 jobs, Jenkins takes 10 minutes to start.
*   **Feature:** Multi-branch pipelines scan lazily. Only load the job configuration into memory when it's triggered.

## Summary

Optimization is about **Resource Management**. Protect the Master node's CPU and Disk at all costs. Offload everything else to Agents or S3.