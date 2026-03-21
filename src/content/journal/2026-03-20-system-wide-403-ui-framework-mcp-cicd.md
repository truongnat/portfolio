---
title: "System-wide 403 Handling, UI Framework Evangelism, and Production-Ready CI/CD"
date: 2026-03-20
type: "day"
summary: "Refining security boundaries with global 403 handling, launching a landing page and MCP for a React Native UI framework, and hardening production CI/CD for Lịch Lạc Hồng."
tags: ["Security", "ReactNative", "CI/CD", "Architecture", "MCP", "DevOps"]
---

Today was a mix of foundational architecture, developer experience (DX) tooling, and production-grade DevOps. I focused on tightening security loops and ensuring that the initial setup of my projects is robust enough to scale without incurring massive refactoring costs later.

## What I Did

### 1. Global 403 Forbidden Handling: The Importance of Foundations

I implemented a centralized system for handling 403 Forbidden errors across the entire ecosystem. 

**The Insight**: Setting up core infrastructure—like error handling, authentication flows, and logging—at the very beginning of a project is critical. As a project grows, the "gravity" of existing code makes it exponentially harder to change these foundational elements. 
- **Effort vs. Time**: Changing a global error handler in a 1-month-old project takes hours; doing it in a 2-year-old project with hundreds of endpoints can take weeks of regression testing and refactoring.
- **Consistency**: Centralized handling ensures that users get a predictable experience and developers don't have to reinvent the wheel for every new feature.

### 2. React Native UI Framework: Landing Page & MCP

I've been working on a custom UI framework for React Native designed for high-performance and aesthetic consistency. Today, I reached two major milestones:

- **Landing Page**: Designed and launched a dedicated landing page to showcase the framework's capabilities, component library, and ease of use. The goal is to make the "vibe" of the framework immediately apparent.
- **MCP (Model Context Protocol)**: I wrote an MCP definition for the framework. This allows AI coding assistants (like Gemini or Claude) to "understand" the library's specific components, props, and design tokens natively. This is a game-changer for DX, as it enables the AI to generate pixel-perfect code that adheres to the framework's specific constraints.

### 3. CI/CD Hardening for Lịch Lạc Hồng (Backend Production)

Configured the production CI/CD pipeline for the **Lịch Lạc Hồng** app backend. 

**Key Features**:
- **Automated Deployments**: Using GitHub Actions to trigger deployments to the production environment upon successful merge to the main branch.
- **Safety Gates**: Integrated automated testing and linting to ensure that no "breaking" code reaches production.
- **Environment Management**: Securely handling production secrets and environment variables to maintain a clean separation between staging and live environments.

## Challenges & Solutions

**Challenge**: Making the React Native UI framework "discoverable" for AI agents.
**Solution**: The MCP was the answer. By providing a structured schema of the component library, I moved from "guessing" patterns to providing a "source of truth" that agents can query during the development process.

## Results

- System-wide 403 handling is now consistent and centralized ✓
- React Native UI framework landing page is live ✓
- MCP for the UI framework is ready for integration ✓
- Lịch Lạc Hồng backend now has a robust production CI/CD pipeline ✓

---
"The cost of fixing foundations grows exponentially with time. Set it up right, or pay the price later."
