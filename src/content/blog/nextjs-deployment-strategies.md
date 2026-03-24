---
title: "Deploying Next.js: Vercel vs Self-Hosted vs Edge — A Real Comparison"
date: "2026-03-24"
description: "I've deployed Next.js on Vercel, self-hosted on AWS Lightsail with Nginx and PM2, and experimented with edge deployment — here's what I actually learned about costs, tradeoffs, and when to choose what."
slug: "nextjs-deployment-strategies"
published: true
tags: ["Frontend", "Next.js", "DevOps", "Deployment"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
---

Where you deploy a Next.js app isn't a technical question — it's a business question. The right answer depends on your team's DevOps maturity, your budget, your traffic patterns, and how much operational control you need. I've run Next.js projects on all three major strategies: Vercel (the first-party platform), self-hosted on AWS Lightsail with Nginx + PM2, and edge deployment with Cloudflare Workers. This is the honest comparison.

## Vercel: Easy, Fast, and Expensive at Scale

Vercel is the developer experience benchmark. You push to GitHub, Vercel builds and deploys automatically. Preview deployments for every PR. Edge network with automatic CDN. Zero-config image optimization. Built-in analytics. The developer experience is genuinely excellent, and it's the fastest path from code to production.

For small-to-medium projects, Vercel's free and Pro tiers are competitive. Where it gets painful is scale.

**Vercel's pricing model** charges by function invocations and bandwidth. In the Pro plan, you get 1 million function invocations per month. Sounds like a lot until you realize every Server Component render, every API route call, and every ISR revalidation is an invocation. An e-commerce site with 10,000 daily active users can easily exceed this.

Real numbers from a project I worked on:
- Traffic: ~15,000 monthly active users
- Monthly function invocations: ~3.2 million (over the Pro limit)
- Overage costs: $40-60/month on top of $20 Pro plan
- Total: ~$60-80/month for a moderately trafficked app

That's not catastrophic, but it's $700-900/year for infrastructure that a $20/month Lightsail instance could handle. The math changes when you scale further.

**When Vercel makes sense:**
- Early-stage products where speed to market matters more than cost
- Teams without DevOps experience
- Projects where preview deployments per PR are genuinely valuable (design-heavy projects, agencies)
- Apps with spiky, unpredictable traffic (Vercel scales automatically)

**Vercel configuration I always use:**

```json
// vercel.json
{
  "functions": {
    "app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

## Self-Hosted on AWS Lightsail: Full Control, Lower Cost

My portfolio site and a few client projects run on AWS Lightsail — a $20/month VPS with 4GB RAM, 2 vCPUs, and 80GB SSD. The stack: Ubuntu 24.04, Node.js, PM2 for process management, Nginx as a reverse proxy, and Let's Encrypt for SSL.

The setup takes a few hours the first time. After that, deployments are a `git pull && npm run build && pm2 restart app` away — automated with a simple GitHub Actions workflow.

**The deployment pipeline:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Lightsail

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.LIGHTSAIL_HOST }}
          username: ubuntu
          key: ${{ secrets.LIGHTSAIL_SSH_KEY }}
          script: |
            cd /var/www/portfolio
            git pull origin main
            npm ci --production
            npm run build
            pm2 restart portfolio --update-env
```

**Nginx configuration for Next.js:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Static files served directly by Nginx (faster than Node)
    location /_next/static/ {
        alias /var/www/portfolio/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Nginx serving `/_next/static/` directly bypasses Node.js for static assets — this is a significant performance improvement. Let Nginx handle static files; let Node.js handle dynamic rendering.

**PM2 configuration:**

```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "portfolio",
    script: "node_modules/.bin/next",
    args: "start",
    instances: "max",        // One process per CPU core
    exec_mode: "cluster",    // Cluster mode for load balancing
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    max_memory_restart: "1G"
  }]
}
```

PM2 cluster mode runs one Node.js process per CPU, which on a 2-core Lightsail instance means 2 processes. PM2 load-balances across them. On a $20/month instance, this handles several hundred concurrent users comfortably.

**Real cost comparison for my portfolio:**
- Lightsail $20/month plan: handles the same traffic for $20/month flat
- Estimated Vercel cost for same traffic: ~$30-45/month (Pro + overages)
- Annual savings: $120-300

For higher-traffic apps, the gap widens significantly.

**When self-hosting makes sense:**
- Predictable traffic with a clear upper bound
- Team comfortable with basic Linux/DevOps
- Budget sensitivity at scale
- Need for custom server configuration (WebSockets, specific headers, etc.)
- Running other services (databases, APIs) on the same infra

## Edge Deployment: Fast Globally, Limited Capabilities

Edge deployment (Cloudflare Workers, Vercel Edge Functions, Netlify Edge) runs your code at CDN nodes globally — literally next to your users. Latency can be 20-50ms instead of 200ms+ to a distant origin server. For geographically distributed users, this is meaningful.

The catch: edge runtimes are restricted. No Node.js APIs, limited file system access, no native modules. Most Next.js middleware works fine at the edge (it's designed for this), but Server Components and API routes that use database clients, file systems, or Node.js-specific packages don't.

My pragmatic hybrid: I deploy middleware and simple API routes to the edge, while keeping data-heavy routes on the main server (either Vercel or self-hosted). Next.js makes this explicit:

```ts
// This runs at the edge — fast, globally distributed
export const runtime = "edge"

export async function middleware(request: NextRequest) {
  // Auth checks, redirects, header modifications
  // These are fast and don't need Node.js
}

// This runs on the server (Node.js runtime)
// export const runtime = "nodejs"  // default
export async function GET() {
  const data = await db.query(...)  // Database — needs Node.js
  return Response.json(data)
}
```

## My Decision Framework

**Choose Vercel if:** You're a solo developer or small team, you're launching a new product, or your app has unpredictable traffic spikes. The operational simplicity is worth the premium at small scale.

**Choose self-hosted if:** Your traffic is predictable and growing, you have basic DevOps skills, or you're running at a scale where Vercel's per-invocation costs become significant. The $20-40/month for a Lightsail instance is hard to beat for moderate-traffic apps.

**Add edge for:** Middleware (auth checks, redirects, A/B testing) and globally distributed users where latency matters. This isn't a separate deployment strategy — it's a layer you can add on top of either approach.

The cleanest setup I've landed on for projects that need to scale economically: self-hosted Node.js server for the main app, Cloudflare CDN in front for static assets and DDoS protection, edge middleware for auth and routing. Total monthly cost: $20-30. Total capability: production-grade.
