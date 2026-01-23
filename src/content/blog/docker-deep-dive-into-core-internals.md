---
title: "Under the Hood of Docker: Namespaces, Cgroups, and OverlayFS"
date: "2024-01-15"
description: "Docker isn't magic; it's Linux features. A technical deep dive into how Namespaces isolate processes and how Cgroups limit resources."
slug: "docker-deep-dive-into-core-internals"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1606166187734-a433e1038254?auto=format&fit=crop&q=80&w=1000"
---

# Under the Hood of Docker: Namespaces, Cgroups, and OverlayFS

What is a container? It's not a VM. It's a standard Linux process with a special view of the world.

## 1. Namespaces (Isolation)

Namespaces lie to the process.
*   **PID Namespace:** The process thinks its ID is `1` (init), even if it's `14052` on the host.
*   **Network Namespace:** The process sees its own `eth0` and IP address.
*   **Mount Namespace:** The process sees a unique file system root.

## 2. Cgroups (Resource Control)

Control Groups (cgroups) limit what the process can use.
*   **Memory:** "You can only use 512MB of RAM. If you use more, OOM Kill."
*   **CPU:** "You only get 0.5 CPU shares."

## 3. OverlayFS (The Layer System)

How can 10 containers share the same `ubuntu` base image without duplicating disk space?
*   **Copy-on-Write (CoW):** The base image is Read-Only. When a container writes a file, it copies it up to a thin "Upper Layer."
*   **OverlayFS:** Merges these layers into a single view.

## 4. The Container Runtime (runc)

Docker doesn't actually run containers. It talks to `containerd`, which uses `runc` to interface with the Linux kernel. This is the **OCI (Open Container Initiative)** standard.

## Summary

Understanding these internals is critical for debugging. When you see "Permission Denied," it's likely a Namespace issue. When you see "Killed," it's likely a Cgroup limit.