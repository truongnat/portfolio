---
title: "Next.js App Router: Server Components, Streaming, and the Mental Model Shift"
date: "2026-03-24"
description: "How migrating an e-commerce project to the Next.js App Router changed my mental model of React, doubled page load speeds, and pushed Lighthouse scores past 90."
slug: "nextjs-app-router-patterns"
published: true
tags: ["Frontend", "Next.js", "React"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?auto=format&fit=crop&q=80&w=1000"
---

When Next.js 13 introduced the App Router, I was skeptical. The Pages Router worked well. I knew it deeply. The new model seemed more complex — a new directory structure, a new data fetching paradigm, Server Components that nobody fully understood yet. Then I had a real reason to switch: an e-commerce client with slow load times and a Lighthouse score in the 60s. The migration doubled page load speed and pushed Lighthouse past 90. Here's what actually changed and how I think about the App Router now.

## The Pages Router Mental Model

In the Pages Router, every component is a React component rendered on the client. You have a few escape hatches: `getServerSideProps` for server-side rendering (SSR), `getStaticProps` for static generation, and `getInitialProps` for SSR with class components. Data fetching is attached to page components via these special functions.

The mental model is: **pages are React components, data fetching hooks are page-level side effects**.

This works, but it has a fundamental limitation. Data fetching is colocated with pages, not components. If a deeply nested component needs data from the server, it either receives it as props (drilling pain) or fetches it on the client (waterfall pain). There's no clean way to "just fetch data" inside a component without a client-side effect.

## The App Router Mental Model Shift

The App Router changes the mental model fundamentally: **components decide where they run**. A Server Component runs on the server, has direct access to databases and file systems, and sends HTML (not JavaScript) to the client. A Client Component runs in the browser (or is hydrated there) and handles interactivity.

The shift I had to internalize: **the default is server**. In the App Router, all components are Server Components by default. You opt into client-side rendering with `"use client"` at the top of the file.

```tsx
// app/products/page.tsx — Server Component (default)
// This runs on the server. No useEffect, no fetch-on-client.
import { getProducts } from "@/lib/db"

export default async function ProductsPage() {
  // Directly awaiting async data — no useEffect needed
  const products = await getProducts()
  
  return (
    <div>
      <h1>Products</h1>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}
```

```tsx
// components/AddToCartButton.tsx — Client Component
"use client"

import { useState } from "react"

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  
  async function handleClick() {
    setLoading(true)
    await addToCart(productId)
    setLoading(false)
  }
  
  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  )
}
```

The `ProductsPage` is a Server Component — it fetches data directly, produces HTML, sends zero JavaScript for the product list. The `AddToCartButton` is a Client Component — it needs `useState` and event handlers, so it runs in the browser.

## When to Use Server vs Client Components

This is the decision I make dozens of times in an App Router project:

**Use Server Components when:**
- Fetching data from a database or API
- Accessing server-side resources (file system, secrets)
- Rendering large content that doesn't need interactivity
- You want to reduce client-side JavaScript

**Use Client Components when:**
- Using React hooks (`useState`, `useEffect`, `useContext`)
- Adding event listeners (`onClick`, `onChange`)
- Using browser APIs (`localStorage`, `window`)
- Using third-party libraries that assume browser environment

The most common mistake I see (and made myself): marking entire feature components as `"use client"` because one small part needs interactivity. Push the client boundary as deep as possible. A page can be 95% Server Component with a small interactive island.

```tsx
// WRONG: Entire component is client-side because of one button
"use client"
export default async function ProductPage({ id }: { id: string }) {
  const product = await getProduct(id)  // Can't do this in client component!
  ...
}

// RIGHT: Server component wraps a small client component
// app/products/[id]/page.tsx
import { AddToCartButton } from "@/components/AddToCartButton"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      {/* Only this small piece is client-side */}
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

## Streaming with Suspense

The other big App Router feature that improved our e-commerce performance: Streaming. Instead of waiting for all data to load before sending any HTML, the server streams partial HTML to the browser as each section of data becomes ready.

```tsx
import { Suspense } from "react"

export default function CategoryPage() {
  return (
    <div>
      <h1>Shop by Category</h1>
      
      {/* This loads instantly — static content */}
      <CategoryNav />
      
      {/* This streams in when products are ready */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      
      {/* This streams in separately when recommendations are ready */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <Recommendations />
      </Suspense>
    </div>
  )
}
```

The impact on perceived performance was immediate. Users see the page structure and navigation instantly. Products appear as they load. The Lighthouse Time to First Byte and First Contentful Paint scores jumped significantly. Our actual measurements showed page load time cut roughly in half compared to the SSR approach in Pages Router.

## Data Fetching Patterns

App Router's data fetching is built on the `fetch` API with extended caching options:

```tsx
// Cached (static by default)
const data = await fetch("https://api.example.com/products")

// Always fresh (opt-out of caching)
const data = await fetch("https://api.example.com/products", {
  cache: "no-store"
})

// Revalidate every 60 seconds
const data = await fetch("https://api.example.com/products", {
  next: { revalidate: 60 }
})
```

For database queries where you don't go through `fetch`, Next.js provides `unstable_cache` (now `cache` in newer versions):

```tsx
import { cache } from "react"

// Deduplicated across a single render pass
export const getProduct = cache(async (id: string) => {
  return db.product.findUnique({ where: { id } })
})
```

React's `cache` function memoizes the result per render, so even if multiple components call `getProduct(id)` with the same ID, the database is only queried once.

## Common Mistakes I've Made

1. **Mixing async/await with client components.** Server Components can be async; Client Components cannot. This crashes in confusing ways.

2. **Passing non-serializable props from Server to Client Components.** You can't pass a database model instance or a function directly. Serialize data to plain objects first.

3. **Using `cookies()` or `headers()` in cached components.** These make a component dynamic. If you need cookies, ensure the component isn't statically cached.

4. **Forgetting that `"use client"` propagates down.** Once a component is marked `"use client"`, all its children are also treated as client components.

The App Router genuinely improved our e-commerce project's performance and our codebase structure. It took a few weeks to internalize the mental model, but once it clicks, the pattern of "server by default, client only when needed" leads to faster, leaner applications. The 2x load improvement and 90+ Lighthouse score weren't from tricks — they were the natural result of sending less JavaScript to the browser.
