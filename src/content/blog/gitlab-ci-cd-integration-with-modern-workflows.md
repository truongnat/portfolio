---
title: "The All-in-One DevOps Platform: GitLab Registry and Terraform"
date: "2024-02-28"
description: "GitLab is more than just code. Learn how to use the built-in Container Registry, Package Registry, and Terraform State backend."
slug: "gitlab-ci-cd-integration-with-modern-workflows"
published: true
tags: ["DevOps", "GitLab CI/CD"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000"
---

# The All-in-One DevOps Platform: GitLab Registry and Terraform

The killer feature of GitLab is that you don't need S3, Artifactory, or Docker Hub. It's all included.

## 1. The Container Registry

*   **Workflow:**
    1.  `docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .`
    2.  `docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA`
*   **Security:** The CI job automatically gets a temporary token (`CI_REGISTRY_PASSWORD`) to push, so you don't need to manage static credentials.

## 2. Terraform State Backend

Stop putting your Terraform state in S3 buckets with manually configured locking.
*   **GitLab Managed State:** GitLab provides a native HTTP backend for Terraform.
*   **Config:** `terraform init -backend-config="address=https://gitlab.com/api/v4/projects/.../terraform/state/prod"`
*   **Benefit:** Built-in locking and versioning tied to your user permissions.

## 3. Package Registry (NPM/Maven/NuGet)

If you are building an internal library, publish it to your Project's Package Registry.
*   **Integration:** Your downstream projects can `npm install` directly from GitLab using an Auth Token.

## Summary

Integration in GitLab is about **Consolidation**. By using the built-in registries and state backends, you reduce the "Tool Sprawl" and simplify your security model.