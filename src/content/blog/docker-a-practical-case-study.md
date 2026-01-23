---
title: "Dockerizing a Legacy Monolith: A Migration Case Study"
date: "2023-10-15"
description: "How we moved a 10-year-old Node.js monolith into Docker. A step-by-step guide to writing the Dockerfile, handling legacy dependencies, and reducing image size by 80%."
slug: "docker-a-practical-case-study"
published: true
tags: ["DevOps", "Docker"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1000"
---

# Dockerizing a Legacy Monolith: A Migration Case Study

Moving a "works on my machine" application to a containerized environment is a rite of passage for every DevOps engineer. This case study details the journey of Dockerizing a complex Node.js/Python hybrid app.

## The Challenge: "Dependency Hell"

Our legacy app required Node.js 14, Python 2.7, and a specific version of `libc`.
*   **Onboarding Time:** 2 days (installing dependencies manually).
*   **The Goal:** `docker compose up` and it just works.

## The Solution: Multi-Stage Builds

We used Docker's multi-stage build feature to separate the "Build Environment" from the "Runtime Environment."

### Stage 1: The Builder
We used a heavy image (`node:14-buster`) to compile the native C++ modules and Python dependencies.

### Stage 2: The Runtime (Distroless)
We copied only the compiled artifacts into a Google Distroless image.
*   **Benefit:** The final image has no shell, no package manager, and is extremely secure.

## Implementation (Dockerfile)

```dockerfile
# Stage 1: Build
FROM node:14-buster AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/server.js"]
```

## Results

| Metric | VM Deployment | Docker Image |
| :--- | :--- | :--- |
| **Image Size** | N/A | 1.2 GB -> 150 MB |
| **Startup Time** | 5 mins | 3 seconds |
| **Security Vulns** | 450+ | 2 (Low severity) |

## Conclusion

Docker isn't just about deployment; it's about **Reproducibility**. By codifying the environment, we eliminated "it works on my machine" forever.