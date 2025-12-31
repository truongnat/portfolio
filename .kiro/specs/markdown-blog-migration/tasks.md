# Implementation Plan: Markdown Blog Migration

## Overview

This plan outlines the implementation steps for migrating from a Supabase-based blog to a local markdown file-based system. The implementation follows a phased approach: first exporting existing content, then building the new markdown system, removing old dependencies, and finally verifying everything works correctly.

## Tasks

- [x] 1. Set up content directory and dependencies
  - Create `content/blog/` directory structure
  - Install new dependencies: `gray-matter`, `remark`, `remark-gfm`, `remark-rehype`, `rehype-highlight`, `rehype-stringify`
  - Install dev dependencies: `fast-check` for property-based testing
  - _Requirements: 1.1, 1.3_

- [-] 2. Create migration script to export existing posts
  - [x] 2.1 Implement Supabase post export script
    - Create `scripts/migrate-posts.ts` to fetch all posts from Supabase
    - Convert post data to markdown format with frontmatter
    - Generate URL-safe filenames from slugs
    - Write markdown files to `content/blog/` directory
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 2.2 Run migration script and verify output
    - Execute migration script to export all posts
    - Manually verify a few exported markdown files
    - Check that all posts were exported successfully
    - _Requirements: 8.5_

- [x] 3. Implement blog utilities module
  - [x] 3.1 Create core blog utility functions
    - Implement `getAllPosts()` to read and parse all markdown files
    - Implement `getPostBySlug()` to retrieve individual posts
    - Implement `getAllSlugs()` for static generation
    - Add frontmatter validation for required fields
    - Handle published/unpublished filtering
    - Sort posts by date descending
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 2.3, 2.5, 3.2, 3.4, 5.3, 6.1_
  
  - [ ]* 3.2 Write property test for file discovery
    - **Property 1: File Discovery and Recognition**
    - **Validates: Requirements 1.2, 1.3, 1.4**
  
  - [ ]* 3.3 Write property test for frontmatter parsing
    - **Property 2: Frontmatter Parsing Completeness**
    - **Validates: Requirements 2.1, 2.2, 2.4**
  
  - [ ]* 3.4 Write property test for invalid frontmatter handling
    - **Property 3: Invalid Frontmatter Handling**
    - **Validates: Requirements 2.3**
  
  - [ ]* 3.5 Write property test for published post filtering
    - **Property 4: Published Post Filtering**
    - **Validates: Requirements 2.5, 3.4**
  
  - [ ]* 3.6 Write property test for date sorting
    - **Property 5: Date Sorting Invariant**
    - **Validates: Requirements 3.2**
  
  - [ ]* 3.7 Write property test for slug-based retrieval
    - **Property 6: Slug-Based Post Retrieval**
    - **Validates: Requirements 4.1, 6.1**
  
  - [ ]* 3.8 Write property test for non-existent slug handling
    - **Property 9: Non-Existent Slug Handling**
    - **Validates: Requirements 4.5**
  
  - [ ]* 3.9 Write property test for URL-safe slug validation
    - **Property 10: URL-Safe Slug Validation**
    - **Validates: Requirements 6.3**
  
  - [ ]* 3.10 Write property test for duplicate slug detection
    - **Property 11: Duplicate Slug Detection**
    - **Validates: Requirements 6.4**
  
  - [ ]* 3.11 Write unit tests for blog utilities
    - Test file discovery with empty directory
    - Test frontmatter parsing edge cases
    - Test slug retrieval with valid and invalid slugs
    - _Requirements: 1.2, 2.1, 2.3, 4.5_

- [x] 4. Implement markdown processing module
  - [x] 4.1 Create markdown to HTML conversion function
    - Implement `markdownToHtml()` using remark/rehype pipeline
    - Configure remark-gfm for GitHub Flavored Markdown
    - Configure rehype-highlight for syntax highlighting
    - Handle conversion errors gracefully
    - _Requirements: 4.2, 4.3, 4.4_
  
  - [ ]* 4.2 Write property test for markdown conversion
    - **Property 7: Markdown to HTML Conversion**
    - **Validates: Requirements 4.2**
  
  - [ ]* 4.3 Write property test for GFM support
    - **Property 8: GitHub Flavored Markdown Support**
    - **Validates: Requirements 4.3, 4.4**
  
  - [ ]* 4.4 Write unit tests for markdown processing
    - Test basic markdown features (headers, lists, links)
    - Test GFM features (tables, strikethrough, code blocks)
    - Test syntax highlighting for various languages
    - _Requirements: 4.2, 4.3, 4.4_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Update blog listing page
  - [x] 6.1 Refactor blog listing to use markdown system
    - Update `app/(landing)/blog/page.tsx` to use `getAllPosts()`
    - Remove Supabase queries
    - Keep existing PostCard component
    - Add empty state for no posts
    - Ensure Server Component (async function)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 6.2 Write integration test for blog listing
    - Test listing page renders with posts
    - Test empty state when no posts
    - _Requirements: 3.1, 3.5_

- [x] 7. Update individual post page
  - [x] 7.1 Refactor post page to use markdown system
    - Update `app/(landing)/blog/[slug]/page.tsx` to use `getPostBySlug()`
    - Implement `generateStaticParams()` using `getAllSlugs()`
    - Add markdown to HTML rendering
    - Add 404 handling with `notFound()`
    - Style content with Tailwind prose classes
    - _Requirements: 4.1, 4.2, 4.5, 5.1, 5.2, 6.1, 6.2_
  
  - [ ]* 7.2 Write property test for static generation
    - **Property 12: Static Generation Completeness**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ]* 7.3 Write property test for build-time file reading
    - **Property 13: Build-Time File Reading**
    - **Validates: Requirements 5.3, 5.5**
  
  - [ ]* 7.4 Write integration test for post page
    - Test post page renders correctly
    - Test 404 for non-existent post
    - _Requirements: 4.1, 4.5_

- [x] 8. Remove Supabase dependencies
  - [x] 8.1 Remove Supabase code and configuration
    - Delete `lib/supabase/` directory
    - Delete `app/(admin)/` directory (login, dashboard, blog editor)
    - Delete `components/admin/PostEditor.tsx`
    - Remove Supabase client initialization code
    - Remove Supabase environment variables from `.env.local.example`
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 8.2 Remove Supabase packages
    - Uninstall `@supabase/supabase-js`
    - Uninstall `@supabase/auth-helpers-nextjs`
    - Remove any other Supabase-related packages
    - _Requirements: 7.5_
  
  - [ ]* 8.3 Verify build succeeds without Supabase
    - Run `npm run build` to ensure no Supabase dependencies remain
    - Check for any import errors or missing modules
    - _Requirements: 7.5_

- [x] 9. Final verification and testing
  - [x] 9.1 Run complete test suite
    - Run all unit tests
    - Run all property-based tests
    - Run all integration tests
    - Ensure 100% pass rate
    - _Requirements: All_
  
  - [x] 9.2 Build and verify static generation
    - Run production build
    - Verify all blog posts are statically generated
    - Check `.next/server/app/(landing)/blog/` for static HTML files
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [x] 9.3 Manual testing
    - Test blog listing page in browser
    - Test individual post pages
    - Test 404 for non-existent posts
    - Verify markdown rendering (headers, lists, code blocks, tables)
    - Verify syntax highlighting works
    - Test navigation between pages
    - _Requirements: 3.1, 4.1, 4.2, 4.3, 4.4, 6.1, 6.2_

- [x] 10. Checkpoint - Final review
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- Migration script should be run before implementing the new system to preserve content
- Supabase removal happens after the new system is working to ensure no data loss
