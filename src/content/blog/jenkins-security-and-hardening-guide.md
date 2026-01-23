---
title: "Securing the Butler: RBAC, CSRF, and Agent Security"
date: "2024-05-28"
description: "Jenkins is a prime target for attackers. Learn how to lock it down with Matrix Authorization, Agent-to-Master security, and CSRF protection."
slug: "jenkins-security-and-hardening-guide"
published: true
tags: ["DevOps", "Jenkins"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Securing the Butler: RBAC, CSRF, and Agent Security

A compromised Jenkins server is RCE (Remote Code Execution) on your entire infrastructure.

## 1. Matrix Authorization Strategy

The default "Logged-in users can do anything" is dangerous.
*   **The Fix:** Use **Matrix Authorization**.
*   **Permissions:** Give `Overall/Read` to everyone. Give `Job/Configure` only to the specific team that owns the folder.

## 2. Agent-to-Master Security Subsystem

By default, agents can run commands on the master.
*   **The Fix:** Enable **Agent-to-Master Security**. This prevents a compromised agent from reading secrets stored on the master.

## 3. Script Security Plugin

Groovy is powerful. Too powerful.
*   **Approval Process:** Any script that uses non-whitelisted Java methods must be manually approved by an admin. Never disable this.

## 4. CSRF Protection (Crumb Issuer)

Ensure "Prevent Cross Site Request Forgery exploits" is checked. This requires API clients to request a "Crumb" token before making POST requests.

## Summary

Jenkins security is about **Least Privilege**. Restrict what users can do, restrict what scripts can run, and restrict what agents can access.