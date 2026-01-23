---
title: "Hardening Containers: Read-Only Roots and Capability Dropping"
date: "2024-05-25"
description: "Going beyond non-root. Learn how to run containers with a Read-Only filesystem, drop Linux capabilities, and use Seccomp profiles."
slug: "docker-security-and-hardening-guide"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80&w=1000"
---

# Hardening Containers: Read-Only Roots and Capability Dropping

A container is only as secure as its configuration. Default Docker settings are too permissive.

## 1. Read-Only Filesystem

If an attacker compromises your app, stop them from downloading a rootkit.
*   **Flag:** `--read-only`.
*   **Impact:** The attacker cannot write to `/bin` or `/usr`. You must explicitly mount volumes for `/tmp` or logs if needed.

## 2. Dropping Capabilities

Root inside a container has "Capabilities" (like `CHOWN`, `NET_BIND_SERVICE`).
*   **The Strategy:** Drop ALL capabilities, then add back only what is needed.
*   **Command:** `--cap-drop=ALL --cap-add=NET_BIND_SERVICE`.

## 3. No New Privileges

Prevent a process from escalating its own privileges (e.g., using `sudo`).
*   **Flag:** `--security-opt=no-new-privileges`.

## 4. Seccomp Profiles

Limit which System Calls the container can make to the Kernel.
*   **Default:** Docker blocks dangerous calls (like `mount`).
*   **Advanced:** Create a custom profile that only allows the 50 syscalls your Node.js app actually uses.

## Summary

Container security is **Isolation**. By stripping away permissions, capabilities, and write access, you turn your container into a prison that an attacker cannot escape.