---
title: "Building a Production CI/CD Pipeline with GitHub Actions"
date: "2026-03-24"
description: "A practical walkthrough of building a production-grade CI/CD pipeline with GitHub Actions — the real workflow I use to deploy my portfolio to AWS Lightsail, including self-hosted runners, secrets management, and branch protection."
slug: "github-actions-ci-cd"
published: true
tags: ["DevOps", "GitHub Actions", "CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&q=80&w=1000"
---

# Building a Production CI/CD Pipeline with GitHub Actions

I automated my portfolio deployment with GitHub Actions about a year ago, and I've iterated on it significantly since then. What started as a simple "build and copy files" script is now a proper pipeline with separate stages, self-hosted runners, environment-specific secrets, and branch protection that prevents me from pushing broken code to production.

This is the real workflow, with the reasoning behind each decision.

## Pipeline Overview

My pipeline has three stages that run sequentially on every push to `main`:

```
Push to main
     ↓
[1] Test & Build  (GitHub-hosted runner: lint, typecheck, unit tests, build)
     ↓
[2] Docker Build  (Self-hosted runner: build + push image to registry)
     ↓
[3] Deploy        (Self-hosted runner on Lightsail: pull + restart container)
```

Stages 2 and 3 use a self-hosted runner running on the same AWS Lightsail instance as the application. This avoids egress costs for the Docker image and keeps deployment fast (image pull from local registry cache, not DockerHub).

## The Full Workflow File

```yaml
# .github/workflows/deploy.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test-and-build:
    name: Test & Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: dist/
          retention-days: 1

  docker-build:
    name: Docker Build & Push
    runs-on: self-hosted
    needs: test-and-build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=sha-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Lightsail
    runs-on: self-hosted
    needs: docker-build
    environment: production

    steps:
      - name: Pull latest image
        run: |
          docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

      - name: Stop existing container
        run: |
          docker stop portfolio-app || true
          docker rm portfolio-app || true

      - name: Start new container
        run: |
          docker run -d \
            --name portfolio-app \
            --restart unless-stopped \
            -p 3000:3000 \
            -e DATABASE_URL=${{ secrets.DATABASE_URL }} \
            -e JWT_SECRET=${{ secrets.JWT_SECRET }} \
            -e NODE_ENV=production \
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

      - name: Health check
        run: |
          sleep 5
          curl -f http://localhost:3000/health || (docker logs portfolio-app && exit 1)

      - name: Clean up old images
        run: docker image prune -f
```

## Self-Hosted Runner Setup

For the Docker build and deploy stages, I use a self-hosted runner on the Lightsail instance. This gives me:

- No egress charges for Docker image transfers
- Access to the production server without SSH key management in CI
- Faster deploys (local image cache)

Setting up the runner takes about 10 minutes. On the Lightsail instance:

```bash
# Create a dedicated user for the runner
sudo useradd -m github-runner
sudo usermod -aG docker github-runner

# Download and configure the runner (get the token from GitHub repo settings)
su - github-runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.317.0/actions-runner-linux-x64-2.317.0.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz
./config.sh --url https://github.com/YOUR_USER/YOUR_REPO --token YOUR_TOKEN

# Install as a service
sudo ./svc.sh install github-runner
sudo ./svc.sh start
```

One important security note: self-hosted runners should only be used for private repositories. Public repos expose the runner to arbitrary code execution from pull requests.

## Secrets Management

I use GitHub's built-in encrypted secrets for sensitive values. For production-specific secrets, I scope them to a GitHub Environment:

- **Repository secrets**: `GITHUB_TOKEN` (automatic), values shared across environments
- **Environment secrets** (in `production` environment): `DATABASE_URL`, `JWT_SECRET`

Environment secrets require an approval gate if configured, giving me a manual checkpoint before production deploys.

```yaml
# Accessing environment secrets
deploy:
  environment: production  # activates environment secrets + protection rules
  steps:
    - run: echo ${{ secrets.DATABASE_URL }}  # never echo real secrets in prod!
```

For non-secret configuration, I use GitHub Variables (unencrypted):

```yaml
env:
  APP_VERSION: ${{ vars.APP_VERSION }}
  FEATURE_FLAGS: ${{ vars.FEATURE_FLAGS }}
```

## Branch Protection Rules

The pipeline is only effective if you can't bypass it. I enforce these rules on `main`:

1. **Require status checks to pass** — `test-and-build` must pass before any merge
2. **Require pull request reviews** — at least 1 approval for personal projects (higher for team projects)
3. **Restrict pushes** — direct pushes to `main` are blocked; everything goes through PRs
4. **Dismiss stale reviews** — re-review required if new commits are pushed after approval

These rules mean I can never accidentally push broken code directly. Even as the sole developer, the discipline is worth it.

## Deployment Verification

The health check step in the deploy job is simple but critical:

```yaml
- name: Health check
  run: |
    sleep 5
    curl -f http://localhost:3000/health || (docker logs portfolio-app && exit 1)
```

If the health check fails, the workflow fails, and I get an immediate notification. The `docker logs` call dumps the container logs into the workflow output, so I can diagnose the failure without SSHing into the server.

My health endpoint:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version,
    uptime: process.uptime(),
  });
});
```

This pipeline runs on every push to main and completes in about 4 minutes — fast enough that I don't lose momentum waiting for deploys. The structure is simple enough to understand at a glance but solid enough to catch real issues before they hit production.
