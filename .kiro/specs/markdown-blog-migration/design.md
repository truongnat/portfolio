# Design Document: Markdown Blog Migration

## Overview

This design outlines the migration from a Supabase-based blog system to a local markdown file-based approach. The new architecture leverages Next.js App Router's static generation capabilities with markdown files stored in a `content/blog` directory. Each post is a markdown file with YAML frontmatter containing metadata. The system uses `gray-matter` for parsing frontmatter, `remark` and `rehype` for markdown processing, and Next.js `generateStaticParams` for static page generation at build time.

## Architecture

### High-Level Architecture

```
content/blog/           # Markdown files
    ├── post-1.md
    ├── post-2.mdx
    └── ...

lib/blog.ts            # Blog utilities (read, parse, list)

app/(landing)/blog/
    ├── page.tsx       # Blog listing (Server Component)
    └── [slug]/
        └── page.tsx   # Individual post (Server Component)
```

### Data Flow

1. **Build Time**: Next.js reads all markdown files from `content/blog/`
2. **Parsing**: `gray-matter` extracts frontmatter and content
3. **Static Generation**: `generateStaticParams` creates routes for all posts
4. **Rendering**: `remark` and `rehype` convert markdown to HTML
5. **Serving**: Static HTML pages served directly (no runtime queries)

### Key Design Decisions

**Decision 1: Use `content/blog/` directory**
- Rationale: Separates content from code, easy to manage, version-controlled
- Alternative considered: `public/posts/` - rejected because public folder is for static assets

**Decision 2: Support both `.md` and `.mdx` files**
- Rationale: `.md` for simple posts, `.mdx` for posts needing React components
- Implementation: File extension detection in blog utilities

**Decision 3: Use `gray-matter` for frontmatter parsing**
- Rationale: Industry standard, supports YAML/JSON/TOML, well-maintained
- Source: [Multiple Next.js blog tutorials](https://www.milanmeurrens.com/guides/how-to-create-a-blog-using-next-js-and-mdx)

**Decision 4: Server Components for all blog pages**
- Rationale: No client-side JavaScript needed for content display, better performance
- Implementation: Default App Router behavior, no 'use client' directive

## Components and Interfaces

### Blog Utilities Module (`lib/blog.ts`)

```typescript
interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  published: boolean;
  tags?: string[];
  author?: string;
  coverImage?: string;
  content: string;
}

interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  published: boolean;
  tags?: string[];
  author?: string;
  coverImage?: string;
}

// Get all post metadata (for listings)
function getAllPosts(): BlogPostMetadata[]

// Get single post with content
function getPostBySlug(slug: string): BlogPost | null

// Get all slugs for static generation
function getAllSlugs(): string[]
```

**Implementation Details**:
- Use Node.js `fs` module to read files from `content/blog/`
- Filter files by `.md` and `.mdx` extensions
- Parse each file with `gray-matter`
- Sort posts by date (descending)
- Filter out unpublished posts in `getAllPosts()`
- Cache results during build for performance

### Blog Listing Page (`app/(landing)/blog/page.tsx`)

```typescript
export default async function BlogPage() {
  const posts = getAllPosts();
  
  return (
    <div>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => (
          <PostCard key={post.slug} post={post} />
        ))
      )}
    </div>
  );
}
```

**Features**:
- Server Component (async function)
- Displays all published posts
- Shows empty state when no posts
- Uses existing `PostCard` component

### Individual Post Page (`app/(landing)/blog/[slug]/page.tsx`)

```typescript
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map(slug => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  
  if (!post) {
    notFound();
  }
  
  const htmlContent = await markdownToHtml(post.content);
  
  return (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </article>
  );
}
```

**Features**:
- Static generation via `generateStaticParams`
- 404 handling for non-existent posts
- Markdown to HTML conversion
- Metadata display (title, date)

### Markdown Processing (`lib/markdown.ts`)

```typescript
async function markdownToHtml(markdown: string): Promise<string>
```

**Implementation**:
- Use `remark` to parse markdown AST
- Use `remark-gfm` for GitHub Flavored Markdown (tables, strikethrough, etc.)
- Use `remark-rehype` to convert to HTML AST
- Use `rehype-highlight` for syntax highlighting
- Use `rehype-stringify` to generate HTML string

**Pipeline**: `markdown → remark → remark-gfm → remark-rehype → rehype-highlight → rehype-stringify → HTML`

## Data Models

### Frontmatter Schema

```yaml
---
title: "Post Title"              # Required
date: "2024-01-15"               # Required (YYYY-MM-DD)
description: "Brief summary"     # Required
slug: "post-title"               # Required (URL-safe)
published: true                  # Required (boolean)
tags: ["nextjs", "react"]        # Optional
author: "Author Name"            # Optional
coverImage: "/images/cover.jpg"  # Optional
---
```

**Validation Rules**:
- `title`: Non-empty string
- `date`: Valid ISO date string (YYYY-MM-DD)
- `description`: Non-empty string
- `slug`: Lowercase, hyphenated, URL-safe
- `published`: Boolean (default: false if missing)
- `tags`: Array of strings (optional)
- `author`: String (optional)
- `coverImage`: String path (optional)

### File Naming Convention

**Recommended**: Use slug as filename
- Example: `my-first-post.md` for slug "my-first-post"
- Rationale: Easy to locate files, prevents slug conflicts

**Slug Conflict Resolution**:
- If filename slug differs from frontmatter slug, use frontmatter slug
- If duplicate slugs detected, log warning and use first occurrence
- Recommendation: Validate unique slugs in CI/CD

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: File Discovery and Recognition
*For any* valid markdown file (`.md` or `.mdx`) with proper frontmatter placed in the content directory, the system should recognize it and include it in the list of available posts.
**Validates: Requirements 1.2, 1.3, 1.4**

### Property 2: Frontmatter Parsing Completeness
*For any* markdown file with valid frontmatter containing required and optional fields, parsing should extract all fields correctly into the BlogPost data structure.
**Validates: Requirements 2.1, 2.2, 2.4**

### Property 3: Invalid Frontmatter Handling
*For any* markdown file with missing or invalid required frontmatter fields, the system should handle it gracefully without crashing (either skip the file or use defaults).
**Validates: Requirements 2.3**

### Property 4: Published Post Filtering
*For any* collection of posts where some have `published: false`, the getAllPosts function should return only posts where `published: true`.
**Validates: Requirements 2.5, 3.4**

### Property 5: Date Sorting Invariant
*For any* collection of blog posts, the getAllPosts function should return them sorted by date in descending order (newest first).
**Validates: Requirements 3.2**

### Property 6: Slug-Based Post Retrieval
*For any* valid slug that exists in the content directory, getPostBySlug should return the corresponding post with all its content and metadata.
**Validates: Requirements 4.1, 6.1**

### Property 7: Markdown to HTML Conversion
*For any* valid markdown content, the markdownToHtml function should convert markdown syntax (headers, lists, links, bold, italic) to proper HTML tags.
**Validates: Requirements 4.2**

### Property 8: GitHub Flavored Markdown Support
*For any* markdown content containing GFM features (tables, strikethrough, task lists, code blocks), the rendering should preserve these features in the HTML output.
**Validates: Requirements 4.3, 4.4**

### Property 9: Non-Existent Slug Handling
*For any* slug that does not correspond to an existing markdown file, getPostBySlug should return null.
**Validates: Requirements 4.5**

### Property 10: URL-Safe Slug Validation
*For any* slug in frontmatter, it should be URL-safe (lowercase, hyphenated, no special characters except hyphens).
**Validates: Requirements 6.3**

### Property 11: Duplicate Slug Detection
*For any* collection of markdown files, if two or more files have the same slug, the system should detect the conflict and handle it consistently (use first occurrence or log error).
**Validates: Requirements 6.4**

### Property 12: Static Generation Completeness
*For any* published post in the content directory, generateStaticParams should include its slug in the returned array for static page generation.
**Validates: Requirements 5.1, 5.2**

### Property 13: Build-Time File Reading
*For any* blog operation during build time, the system should use File_System_API to read markdown files and not make runtime database queries.
**Validates: Requirements 5.3, 5.5**


## Error Handling

### File System Errors

**Scenario**: Content directory doesn't exist or is inaccessible
- **Handling**: Check if directory exists before reading, create if missing
- **Fallback**: Return empty array from `getAllPosts()`, log warning
- **User Impact**: Blog page shows empty state

**Scenario**: Individual markdown file is corrupted or unreadable
- **Handling**: Catch file read errors, skip the file, log error with filename
- **Fallback**: Continue processing other files
- **User Impact**: Specific post won't appear in listings

### Frontmatter Parsing Errors

**Scenario**: Invalid YAML syntax in frontmatter
- **Handling**: Catch `gray-matter` parsing errors, skip the file
- **Fallback**: Log error with filename and line number
- **User Impact**: Post won't appear in listings

**Scenario**: Missing required frontmatter fields
- **Handling**: Validate required fields (title, date, description, slug, published)
- **Fallback**: Skip file or use defaults (published: false by default)
- **User Impact**: Post won't appear in listings if skipped

**Scenario**: Invalid date format in frontmatter
- **Handling**: Validate date string, attempt parsing with Date constructor
- **Fallback**: Use file modification date or skip post
- **User Impact**: Post may have incorrect date or be skipped

### Markdown Processing Errors

**Scenario**: Markdown contains invalid syntax
- **Handling**: `remark` is fault-tolerant, will render best-effort HTML
- **Fallback**: Render as plain text if conversion fails completely
- **User Impact**: Content may not render as expected but won't crash

**Scenario**: Code block syntax highlighting fails
- **Handling**: Render code block without highlighting
- **Fallback**: Plain `<pre><code>` tags
- **User Impact**: Code appears without syntax colors

### Routing Errors

**Scenario**: User navigates to non-existent post slug
- **Handling**: `getPostBySlug()` returns null, call Next.js `notFound()`
- **Fallback**: Display Next.js 404 page
- **User Impact**: Standard 404 experience

**Scenario**: Slug contains invalid characters
- **Handling**: Validate slug format, sanitize if needed
- **Fallback**: Return 404 if slug can't be matched
- **User Impact**: Post not found

### Build-Time Errors

**Scenario**: No markdown files found in content directory
- **Handling**: Allow build to succeed with empty blog
- **Fallback**: Display empty state on blog page
- **User Impact**: Blog page shows "No posts yet" message

**Scenario**: Duplicate slugs detected
- **Handling**: Log warning with conflicting filenames
- **Fallback**: Use first occurrence, skip duplicates
- **User Impact**: Only first post with slug is accessible

## Testing Strategy

### Unit Tests

Unit tests will verify specific examples, edge cases, and error conditions for the blog utilities and markdown processing.

**Test File**: `lib/blog.test.ts`

**Test Cases**:
1. **File Discovery**
   - Test reading markdown files from content directory
   - Test filtering by `.md` and `.mdx` extensions
   - Test handling empty directory

2. **Frontmatter Parsing**
   - Test parsing valid frontmatter with all fields
   - Test parsing with only required fields
   - Test handling missing required fields
   - Test handling invalid YAML syntax

3. **Post Filtering**
   - Test filtering unpublished posts
   - Test empty result when no published posts

4. **Date Sorting**
   - Test posts sorted newest first
   - Test handling posts with same date

5. **Slug Retrieval**
   - Test getting post by valid slug
   - Test returning null for non-existent slug
   - Test handling duplicate slugs

**Test File**: `lib/markdown.test.ts`

**Test Cases**:
1. **Markdown Conversion**
   - Test basic markdown (headers, paragraphs, lists)
   - Test links and images
   - Test bold and italic text

2. **GFM Features**
   - Test tables
   - Test strikethrough
   - Test task lists
   - Test code blocks with language

3. **Syntax Highlighting**
   - Test code blocks get highlighted
   - Test multiple languages (JavaScript, Python, etc.)

### Property-Based Tests

Property-based tests will verify universal properties across all inputs using a PBT library. We'll use **fast-check** for TypeScript/JavaScript property-based testing.

**Configuration**: Minimum 100 iterations per property test

**Test File**: `lib/blog.property.test.ts`

**Property Tests**:

1. **Property 1: File Discovery and Recognition**
   - Generate: Random markdown files with valid frontmatter
   - Test: All generated files appear in getAllPosts() result
   - Tag: `Feature: markdown-blog-migration, Property 1: File Discovery and Recognition`

2. **Property 2: Frontmatter Parsing Completeness**
   - Generate: Random frontmatter with various field combinations
   - Test: All fields correctly extracted into BlogPost structure
   - Tag: `Feature: markdown-blog-migration, Property 2: Frontmatter Parsing Completeness`

3. **Property 3: Invalid Frontmatter Handling**
   - Generate: Markdown files with missing/invalid required fields
   - Test: System doesn't crash, handles gracefully
   - Tag: `Feature: markdown-blog-migration, Property 3: Invalid Frontmatter Handling`

4. **Property 4: Published Post Filtering**
   - Generate: Random mix of published and unpublished posts
   - Test: getAllPosts() returns only published posts
   - Tag: `Feature: markdown-blog-migration, Property 4: Published Post Filtering`

5. **Property 5: Date Sorting Invariant**
   - Generate: Random collection of posts with various dates
   - Test: Result is sorted by date descending
   - Tag: `Feature: markdown-blog-migration, Property 5: Date Sorting Invariant`

6. **Property 6: Slug-Based Post Retrieval**
   - Generate: Random posts with unique slugs
   - Test: getPostBySlug(slug) returns correct post
   - Tag: `Feature: markdown-blog-migration, Property 6: Slug-Based Post Retrieval`

7. **Property 7: Markdown to HTML Conversion**
   - Generate: Random valid markdown content
   - Test: Output contains proper HTML tags
   - Tag: `Feature: markdown-blog-migration, Property 7: Markdown to HTML Conversion`

8. **Property 8: GitHub Flavored Markdown Support**
   - Generate: Markdown with GFM features
   - Test: Features preserved in HTML output
   - Tag: `Feature: markdown-blog-migration, Property 8: GitHub Flavored Markdown Support`

9. **Property 9: Non-Existent Slug Handling**
   - Generate: Random slugs not in content directory
   - Test: getPostBySlug() returns null
   - Tag: `Feature: markdown-blog-migration, Property 9: Non-Existent Slug Handling`

10. **Property 10: URL-Safe Slug Validation**
    - Generate: Random slugs from frontmatter
    - Test: All slugs are lowercase, hyphenated, URL-safe
    - Tag: `Feature: markdown-blog-migration, Property 10: URL-Safe Slug Validation`

11. **Property 11: Duplicate Slug Detection**
    - Generate: Collections with duplicate slugs
    - Test: System handles consistently (first occurrence or error)
    - Tag: `Feature: markdown-blog-migration, Property 11: Duplicate Slug Detection`

12. **Property 12: Static Generation Completeness**
    - Generate: Random published posts
    - Test: All slugs included in generateStaticParams() output
    - Tag: `Feature: markdown-blog-migration, Property 12: Static Generation Completeness`

13. **Property 13: Build-Time File Reading**
    - Generate: Various blog operations
    - Test: No runtime database queries, only file system reads
    - Tag: `Feature: markdown-blog-migration, Property 13: Build-Time File Reading`

### Integration Tests

**Test File**: `app/(landing)/blog/blog.integration.test.ts`

**Test Cases**:
1. Test blog listing page renders with posts
2. Test individual post page renders correctly
3. Test 404 for non-existent post
4. Test empty state when no posts
5. Test navigation between listing and post pages

### Testing Balance

- **Unit tests**: Focus on specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across many generated inputs
- Both approaches are complementary and necessary for comprehensive coverage
- Property tests handle broad input coverage, unit tests catch concrete bugs

## Migration Strategy

### Phase 1: Export Existing Posts

Create a migration script to export posts from Supabase:

```typescript
// scripts/migrate-posts.ts
async function migratePostsFromSupabase() {
  // 1. Fetch all posts from Supabase
  // 2. For each post, create markdown file
  // 3. Generate frontmatter from post metadata
  // 4. Write content to file with slug-based filename
  // 5. Log success/failure for each post
}
```

### Phase 2: Remove Supabase Dependencies

1. Remove Supabase client initialization (`lib/supabase/`)
2. Remove admin authentication pages (`app/(admin)/`)
3. Remove blog editor component (`components/admin/PostEditor.tsx`)
4. Remove database query functions
5. Remove Supabase environment variables from `.env.local`
6. Remove Supabase packages from `package.json`

### Phase 3: Implement Markdown System

1. Create `content/blog/` directory
2. Implement blog utilities (`lib/blog.ts`)
3. Implement markdown processing (`lib/markdown.ts`)
4. Update blog listing page
5. Update individual post page
6. Add tests

### Phase 4: Verification

1. Run all tests (unit + property + integration)
2. Build project and verify static generation
3. Manually test blog listing and individual posts
4. Verify all migrated posts are accessible
5. Check for broken links or missing content

## Dependencies

### New Dependencies

```json
{
  "gray-matter": "^4.0.3",
  "remark": "^15.0.1",
  "remark-gfm": "^4.0.0",
  "remark-rehype": "^11.1.0",
  "rehype-highlight": "^7.0.0",
  "rehype-stringify": "^10.0.0"
}
```

### Dev Dependencies

```json
{
  "fast-check": "^3.15.0",
  "@types/node": "^20.0.0"
}
```

### Dependencies to Remove

```json
{
  "@supabase/supabase-js": "remove",
  "@supabase/auth-helpers-nextjs": "remove"
}
```

## Performance Considerations

**Build Time**:
- Reading markdown files is fast (< 1ms per file)
- Parsing frontmatter is fast (< 1ms per file)
- Markdown to HTML conversion is fast (< 10ms per file)
- Expected build time for 100 posts: < 2 seconds

**Runtime Performance**:
- Zero database queries (all static)
- No client-side JavaScript for content rendering
- Optimal Core Web Vitals (LCP, FID, CLS)
- Instant page loads from CDN

**Caching**:
- Consider caching parsed posts during build
- Use Next.js built-in caching for static pages
- No need for runtime caching (everything is static)

## Security Considerations

**Content Security**:
- Markdown files are version-controlled (audit trail)
- No user-generated content (admin writes locally)
- No XSS risk (markdown sanitized by remark/rehype)

**Access Control**:
- No authentication needed (static content)
- Content editing requires file system access (developer-only)
- No admin interface to secure

**Build Security**:
- Validate frontmatter to prevent injection
- Sanitize slugs to prevent path traversal
- Use trusted markdown processing libraries
