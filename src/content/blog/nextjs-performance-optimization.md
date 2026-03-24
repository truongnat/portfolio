---
title: "Achieving 90+ Lighthouse Score with Next.js 14: A Practical Guide"
date: "2026-03-24"
description: "The concrete techniques I used to push a Next.js 14 application past 90 on Lighthouse — image optimization, font loading, bundle analysis, Server Components, and lazy loading."
slug: "nextjs-performance-optimization"
published: true
tags: ["Frontend", "Next.js", "Performance"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
---

Performance optimization is one of those topics where the theory is easy and the practice is full of surprises. "Use Server Components, lazy load images, optimize fonts" — you know the principles. But actually getting a real production app above 90 on Lighthouse requires systematically finding and fixing the specific bottlenecks in your specific app. This post documents the techniques that moved the needle for me on a Next.js 14 project, with before/after numbers.

## Start With Measurement

Before touching any code, I run a thorough Lighthouse audit in incognito mode on a real device. The key metrics I track:

- **LCP (Largest Contentful Paint)**: When the largest visible element loads. Target: < 2.5s
- **FID / INP (Interaction to Next Paint)**: How quickly the page responds to interaction. Target: < 200ms
- **CLS (Cumulative Layout Shift)**: How much content jumps around while loading. Target: < 0.1
- **Total Blocking Time**: JavaScript blocking the main thread. Target: < 200ms

My starting point on the project: Performance 62, LCP 4.2s, TBT 680ms, CLS 0.18. Final result: Performance 94, LCP 1.8s, TBT 95ms, CLS 0.02.

Here's what made the difference.

## Image Optimization: The Biggest Win

Images are almost always the biggest LCP culprit on content-rich pages. The first step is always switching from `<img>` to Next.js `<Image>`:

```tsx
// Before — no optimization, causes LCP and CLS issues
<img src="/hero.jpg" className="hero-image" />

// After — automatic WebP conversion, lazy loading, prevents CLS
import Image from "next/image"

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority  // Add this for above-the-fold images (LCP candidates)
  className="hero-image"
/>
```

The `priority` prop is critical for your LCP element. Without it, Next.js lazy loads the image, which pushes your LCP time up. Add `priority` to the hero image, the product image on a product page — anything above the fold that's large.

For dynamically sized images in flexible containers:

```tsx
<div className="relative aspect-video w-full">
  <Image
    src={product.image}
    alt={product.name}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover"
  />
</div>
```

The `sizes` attribute tells Next.js which sizes to generate in its `srcset`. Without it, Next.js generates sizes that might not match your actual layout, leading to unnecessary large image downloads on mobile.

**Impact on my project: LCP dropped from 4.2s to 2.8s just from image fixes.**

## Font Loading: Stop the Flash and the Shift

Custom fonts are a common source of both CLS (text reflow when the font loads) and render-blocking. With Next.js Font:

```tsx
// app/layout.tsx
import { Inter, Fira_Code } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",       // Use system font while loading, swap when ready
  variable: "--font-inter",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
  preload: false,  // Don't preload less-used fonts
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Next.js automatically self-hosts Google Fonts at build time, eliminating the external network request to fonts.googleapis.com. This alone removes a render-blocking resource.

`display: "swap"` prevents invisible text (FOIT) but can cause layout shift (FOUT). The shift is usually acceptable; the invisible text is not. For critical text, consider `display: "optional"` (uses system font if custom font isn't cached) or `display: "block"` (briefly invisible but no shift).

**Impact: CLS from font reflow dropped from 0.18 to 0.04.**

## Bundle Analysis and Reduction

Large JavaScript bundles are the primary cause of high TBT. I use `@next/bundle-analyzer` to visualize what's in my bundles:

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true"
})

module.exports = withBundleAnalyzer({
  // your config
})
```

```bash
ANALYZE=true npm run build
```

This opens a treemap visualization. The usual suspects I find:

1. **Date libraries** — `moment.js` is 200KB. Replace with `date-fns` (tree-shakeable) or native `Intl.DateTimeFormat`.
2. **Icon libraries imported in full** — `import * as Icons from "react-icons/fa"` imports all icons. Import individually: `import { FaUser } from "react-icons/fa"`.
3. **Heavy UI components** — Rich text editors, chart libraries, map components. These should always be lazy loaded.

**Impact: Removing moment.js and fixing icon imports cut my main bundle by 180KB. TBT dropped from 680ms to 210ms.**

## Server Components for Bundle Size

Moving data-fetching and rendering logic to Server Components removes that code from the client bundle entirely. A component that imports a 50KB Markdown parser and renders blog content? If it's a Server Component, that 50KB never ships to the browser.

```tsx
// Before (client component) — markdown parser ships to browser
"use client"
import ReactMarkdown from "react-markdown"  // ~60KB in bundle

export function BlogPost({ content }: { content: string }) {
  return <ReactMarkdown>{content}</ReactMarkdown>
}

// After (server component) — parser runs on server, never in bundle
// No "use client" — this is a Server Component
import ReactMarkdown from "react-markdown"

export async function BlogPost({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug)  // Direct DB/file access
  return <ReactMarkdown>{post.content}</ReactMarkdown>
}
```

I audited every component that was a Client Component for no good reason. Components that only display data (no hooks, no event handlers) are often Client Components by accident — usually because they were written before the App Router. Converting them to Server Components is free performance.

## Lazy Loading: Defer What Users Don't See Immediately

`next/dynamic` for components below the fold or triggered by interaction:

```tsx
import dynamic from "next/dynamic"

// Load this component only when it's needed (e.g., user opens a modal)
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  loading: () => <div className="h-48 animate-pulse bg-gray-100 rounded" />,
  ssr: false  // Rich text editors usually need browser APIs
})

// Use in component — only loads when rendered
function PostEditor() {
  const [editing, setEditing] = useState(false)
  
  return (
    <div>
      <button onClick={() => setEditing(true)}>Edit Post</button>
      {editing && <RichTextEditor />}
    </div>
  )
}
```

For heavy components like chart libraries, code editors, or map components, lazy loading is essential. My project had a Recharts dashboard that was eagerly loading 350KB of chart code on every page. Lazy loading it shaved 200ms off TBT on pages that didn't even show the dashboard.

## The Final Checklist

In order of impact for my project:

1. ✅ Add `priority` to LCP images (+20 Lighthouse points alone)
2. ✅ Switch all images to `next/image` with correct `sizes`
3. ✅ Use `next/font` for all Google Fonts
4. ✅ Run bundle analyzer, eliminate heavy dependencies
5. ✅ Convert unnecessary Client Components to Server Components
6. ✅ Lazy load below-fold heavy components
7. ✅ Add `loading="lazy"` to below-fold `next/image` (it's the default, but verify)
8. ✅ Enable `output: "standalone"` for smaller Docker images in production

From 62 to 94 wasn't magic — it was methodical. Measure, identify the bottleneck, fix, measure again. The tools Next.js 14 provides make most of these optimizations straightforward once you know where to look.
