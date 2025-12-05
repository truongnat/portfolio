# Caching Strategy Documentation

This document outlines the caching strategy implemented across the portfolio application.

## Overview

The application uses Next.js 14's caching mechanisms to optimize performance and reduce database queries:

1. **Data Cache** - Using `unstable_cache` for database queries
2. **Full Route Cache** - Using ISR (Incremental Static Regeneration)
3. **On-Demand Revalidation** - Using tags and paths for cache invalidation

## Cache Configuration

### 1. Data Layer Caching (`lib/queries.ts`)

All database queries are wrapped with `unstable_cache` for automatic caching:

```typescript
// Example: Posts query with 60-second revalidation
export const postsQuery = {
    getAll: unstable_cache(
        async () => { /* query logic */ },
        ['posts-get-all'],
        { tags: ['posts'], revalidate: 60 }
    ),
};
```

**Cache Keys:**
- `posts-get-all` - All published posts
- `posts-get-by-slug-{slug}` - Individual post by slug
- `projects-get-all` - All projects
- `projects-get-featured` - Featured projects only
- `github-projects-get-all` - All GitHub projects

**Cache Tags:**
- `posts` - All post-related data
- `post-{slug}` - Specific post data
- `projects` - All project-related data
- `category-{category}` - Projects by category
- `github-projects` - GitHub repository data

**Revalidation Times:**
- Posts: 60 seconds
- Projects: 3600 seconds (1 hour)
- GitHub Projects: 3600 seconds (1 hour)

### 2. Page-Level Caching

#### Landing Page (`app/(landing)/page.tsx`)
```typescript
export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static';
```

#### Blog List Page (`app/(landing)/blog/page.tsx`)
```typescript
export const revalidate = 60; // 1 minute
export const dynamic = 'force-static';
```

#### Blog Post Page (`app/(landing)/blog/[slug]/page.tsx`)
```typescript
export const revalidate = 60; // 1 minute
export const dynamicParams = true; // Allow new posts without rebuild
export const dynamic = 'force-static';
```

### 3. On-Demand Revalidation

#### Revalidation API (`app/api/revalidate/route.ts`)

Endpoint for manual cache invalidation:

```typescript
POST /api/revalidate
Body: {
  tags?: string[],    // Cache tags to revalidate
  paths?: string[]    // Paths to revalidate
}
```

#### Usage in Admin Components

**After Creating a Post:**
```typescript
await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ 
        tags: ['posts'], 
        paths: ['/blog'] 
    }),
});
```

**After Updating a Post:**
```typescript
await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ 
        tags: ['posts', `post-${slug}`], 
        paths: ['/blog', `/blog/${slug}`] 
    }),
});
```

**After Deleting a Post:**
```typescript
await fetch('/api/revalidate', {
    method: 'POST',
    body: JSON.stringify({ 
        tags: ['posts', `post-${slug}`], 
        paths: ['/blog', `/blog/${slug}`] 
    }),
});
```

## Cache Invalidation Helpers

Use the helper functions in `lib/revalidate.ts`:

```typescript
import { revalidatePostsCache, revalidatePostCache } from '@/lib/revalidate';

// Revalidate all posts
await revalidatePostsCache();

// Revalidate specific post
await revalidatePostCache('my-post-slug');
```

## Best Practices

1. **Use Appropriate Revalidation Times:**
   - Frequently changing data (posts): 60 seconds
   - Rarely changing data (projects): 3600 seconds
   - Static data: No revalidation needed

2. **Tag Your Caches:**
   - Use descriptive tags for easy invalidation
   - Include both general tags (`posts`) and specific tags (`post-{slug}`)

3. **Revalidate After Mutations:**
   - Always revalidate after create/update/delete operations
   - Revalidate both list and detail pages

4. **Monitor Cache Performance:**
   - Check Next.js build output for cache statistics
   - Monitor server logs for cache hits/misses

## Cache Flow Diagram

```
User Request
    ↓
Next.js Router
    ↓
Check Full Route Cache
    ↓ (miss)
Server Component
    ↓
Check Data Cache (unstable_cache)
    ↓ (miss)
Database Query
    ↓
Cache Result
    ↓
Render Page
    ↓
Cache Page (ISR)
    ↓
Return to User
```

## Troubleshooting

### Cache Not Updating

1. Check if revalidation is being called after mutations
2. Verify cache tags match between queries and revalidation
3. Check revalidation time hasn't expired
4. Clear `.next` cache and rebuild: `rm -rf .next && bun run build`

### Stale Data

1. Reduce revalidation time for frequently changing data
2. Use on-demand revalidation instead of time-based
3. Check if `dynamic = 'force-static'` is appropriate

### Performance Issues

1. Increase revalidation times for stable data
2. Use more specific cache tags to avoid over-invalidation
3. Consider using React Query for client-side caching

## Future Improvements

1. Implement Redis for distributed caching
2. Add cache warming for popular pages
3. Implement stale-while-revalidate pattern
4. Add cache analytics and monitoring
5. Implement cache versioning for breaking changes
