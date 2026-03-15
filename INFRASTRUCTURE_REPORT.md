# Infrastructure & Migration Report: Portfolio 2026

This document summarizes the major architectural changes, the migration to Astro 6, and the new deployment strategy implemented for the portfolio project.

## 1. Technical Stack Overview
- **Framework:** Astro 6.0.4 (Latest)
- **Runtime:** Node.js 22+ (Required for Astro 6)
- **Package Manager:** Bun
- **Deployment:** AWS Lightsail (Self-hosted Runner)
- **Process Management:** PM2
- **Web Server:** Nginx (Reverse Proxy)
- **Output Mode:** Hybrid (Static Pre-rendering + Dynamic API Routes)

## 2. Astro 6 Migration Details
The project was successfully migrated from Astro 4/5 to Astro 6, involving several breaking changes:

### Content Layer API
- **Configuration:** Moved `src/content/config.ts` to `src/content.config.ts`.
- **Loaders:** Implemented `glob` loaders for `blog` and `journal` collections.
- **Data Fetching:** Updated all queries to use `id` instead of `slug` (Astro 6 standard).
- **Rendering:** Replaced legacy `entry.render()` with the new `render(entry)` helper from `astro:content`.

### Clean URLs Strategy
- **Configuration:** Set `trailingSlash: "always"` and `build.format: "directory"`.
- **Refactoring:** Performed a global search-and-replace to remove all `/index.html` suffixes from internal links, RSS feeds, and the Knowledge Graph.
- **Result:** URLs are now clean and SEO-friendly (e.g., `/blog/my-post/` instead of `/blog/my-post/index.html`).

## 3. Deployment Architecture (AWS Lightsail)
The deployment has been moved from S3/CloudFront to a self-hosted model for better control over dynamic features (AI Chat & Contact Form).

### GitHub Actions Workflow (`deploy.yml`)
- **Runner:** Uses `runs-on: self-hosted` to execute directly on the Lightsail instance.
- **Environment:** Explicitly loads NVM to ensure Node.js 22 is available.
- **Optimization:** Added `paths-ignore` for journal logs to prevent unnecessary builds/deploys when only daily logs are updated.
- **Automation:** 
    1. Installs dependencies with Bun.
    2. Builds the project (generating `dist/client` and `dist/server`).
    3. Deploys static files to Nginx root (`/var/www/html/`).
    4. Restarts the Astro server using PM2 on port `4321`.

### Server Configuration
- **PM2:** Manages the `dist/server/entry.mjs` process.
- **Nginx:** Acts as a reverse proxy, serving static files directly and forwarding `/api/*` requests to the local PM2 process.

## 4. Environment Variables (Action Items)
The following secrets must be configured in a `.env` file at the project root on your Lightsail server:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_key
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_id
NODE_ENV=production
HOST=127.0.0.1
PORT=4321
```

## 5. Maintenance & Future-Proofing
- **Node.js Deprecation:** The workflow is opted-in to Node.js 24 for GitHub Actions (`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`) to avoid upcoming deprecation warnings.
- **Weekly Summary Agent:** Configured with `contents: write` and `pull-requests: write` permissions to autonomously manage journal summaries via Pull Requests.

---
**Status:** ✅ Migration Complete | ✅ Deployment Optimized | ✅ Documentation Updated
