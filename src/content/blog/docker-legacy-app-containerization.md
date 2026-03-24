---
title: "Containerizing a Legacy Node.js App with Docker: Lessons Learned"
date: "2026-03-24"
description: "Hard-won lessons from containerizing a legacy Node.js application — multi-stage builds, shrinking image size by 80%, handling legacy dependencies, and setting up docker-compose for local development."
slug: "docker-legacy-app-containerization"
published: true
tags: ["DevOps", "Docker", "Node.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=1000"
---

# Containerizing a Legacy Node.js App with Docker: Lessons Learned

Containerizing a greenfield app is easy. Containerizing an old Node.js app that was "never meant to run in Docker" — with native modules, hardcoded paths, and a `node_modules` folder older than some of our junior developers — is a different sport entirely.

I've done this migration several times now. Here's what I've learned about making it work without breaking production.

## Start with the Obvious: A Naive Dockerfile

Before optimizing, get something that works:

```dockerfile
FROM node:18

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "src/index.js"]
```

Run it. Fix the errors. Then optimize. The initial errors will tell you what the app actually needs.

Common first-run problems in legacy apps:
- Missing system libraries for native npm modules (bcrypt, sharp, canvas)
- Hardcoded absolute paths (`/home/ubuntu/uploads/...`)
- Env vars loaded from a `.env` file that isn't in the container
- Scripts that assume a writable filesystem at unexpected paths

Fix these first. Once the app runs, optimize.

## Multi-Stage Builds: The Most Impactful Change

Multi-stage builds are where you get the biggest gains. The idea: use one stage with full build tools, and copy only the runtime artifacts to a clean final stage.

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first (cache layer)
COPY package.json package-lock.json ./

# Install ALL dependencies including devDependencies
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# Stage 2: Production runtime
FROM node:18-alpine AS production

WORKDIR /app

# Only copy what's needed to run
COPY package.json package-lock.json ./
RUN npm ci --omit=dev  # production deps only

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

This alone cut our image from 1.4GB to 280MB — an 80% reduction. The builder stage has TypeScript compiler, test runners, and dev tools. The production stage has none of that.

## Handling Legacy Native Dependencies

Native modules (those with `binding.gyp`) need build tools at compile time. In alpine-based images, that means:

```dockerfile
FROM node:18-alpine AS builder

# Install build dependencies for native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci  # will compile native modules during install
```

If you have a module that's particularly stubborn, check if there's a pre-built binary option:

```bash
# bcrypt → use bcryptjs (pure JS, no native compilation)
npm uninstall bcrypt && npm install bcryptjs

# sharp → has pre-built binaries for common platforms
npm install sharp --platform=linuxmusl --arch=x64
```

For truly unavoidable native dependencies, stick with `node:18` (Debian-based) instead of alpine to get glibc compatibility:

```dockerfile
FROM node:18-slim AS production  # Debian slim, smaller than full but has glibc
```

## .dockerignore: Don't Copy the Junk

A missing or incomplete `.dockerignore` silently wrecks your build cache and bloats your context. Create this before running any builds:

```
node_modules
.git
.gitignore
*.log
.env
.env.*
dist
coverage
.nyc_output
.DS_Store
Thumbs.db
README.md
docs/
tests/
*.test.ts
*.spec.ts
.github/
docker-compose*.yml
Dockerfile*
```

The `node_modules` entry is critical. Without it, Docker copies your entire local `node_modules` into the build context on every build, even when you immediately run `npm ci` and replace it. On a large project with 500MB of `node_modules`, this adds 10-30 seconds to every build.

## Environment Variable Management

Legacy apps often have environment variable anti-patterns: hardcoded defaults in code, `.env` files committed to the repo, or env vars loaded inconsistently. Docker forces you to confront this.

My approach:

```dockerfile
# In Dockerfile: declare expected env vars with sensible defaults
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info

# Never embed secrets in the Dockerfile
# Use --env-file or Docker secrets at runtime
```

```bash
# Development
docker run --env-file .env.local myapp

# Production (secrets from environment)
docker run \
  -e DATABASE_URL=$DATABASE_URL \
  -e JWT_SECRET=$JWT_SECRET \
  myapp
```

For local development, I use a `.env.local` file that's in `.gitignore` and `.dockerignore`. Production secrets come from the deployment environment (GitHub Actions secrets, AWS Secrets Manager, etc.).

## Docker Compose for Local Development

The final piece is a `docker-compose.yml` that lets any developer run the full stack with one command:

```yaml
# docker-compose.yml
version: '3.9'

services:
  app:
    build:
      context: .
      target: builder  # Use builder stage for dev (has devDeps)
    command: npm run dev  # nodemon/ts-node-dev for hot reload
    ports:
      - "3000:3000"
    volumes:
      - .:/app               # Mount source for hot reload
      - /app/node_modules    # Don't override container's node_modules
    env_file:
      - .env.local
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 3s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

The key detail: `volumes: - /app/node_modules` prevents the host `node_modules` from overriding the container's. Without this anonymous volume, the mounted source directory (`.:/app`) would shadow the container's `node_modules`, breaking native modules compiled for Linux when developing on macOS.

## The Payoff

After containerization, our team stopped hearing "it works on my machine." New developers run `docker compose up` and have a working environment in minutes, not hours. The image size reduction meant faster CI builds and cheaper ECR storage. And we finally had a consistent, documented definition of what the app needs to run.

The legacy parts that fought hardest were the most valuable to fix — they were the undocumented assumptions that had been silently causing environment-specific bugs for years.
