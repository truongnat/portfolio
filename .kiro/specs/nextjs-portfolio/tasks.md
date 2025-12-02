# Implementation Plan

- [x] 1. Project initialization and configuration







  - Initialize Next.js 16 project with TypeScript and App Router using Bun
  - Configure Tailwind CSS v3.4+ with custom theme
  - Set up shadcn/ui component library
  - Configure ESLint, Prettier, and TypeScript strict mode
  - Create environment variables template (.env.local.example)
  - Set up project directory structure (app, components, lib, types, hooks)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 15.1, 15.2, 15.3, 15
-

- [x] 2. Database setup and type generation









  - Create Supabase project and obtain credentials
  - Execute schema.sql to create posts, projects, and github_projects tables
  - Configure Row Level Security policies for public read access
  - Generate TypeScript types from Supabase schema
  - Create Supabase client utilities (lib/supabase.ts)
  - Add sample seed data for development

  - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [x] 2.1 Migrate to Drizzle ORM
  - Install Drizzle ORM and Drizzle Kit
  - Define Drizzle schema matching Supabase tables
  - Configure Drizzle client and connection
  - Refactor data fetching to use Drizzle queries
  - Update components to use new query functions
  - _Requirements: User Request_

- [x] 3. Core layout and providers






  - Create root layout with metadata and font configuration
  - Implement Providers component (ThemeProvider, QueryClientProvider)
  - Set up next-themes for dark mode support
  - Configure TanStack Query with default options and error handling
  - Apply bg-background and text-foreground classes to body
  - Create Navigation component with theme toggle
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 7.1_
-




- [x] 4. Utility functions and custom hooks











  - Implement utility functions (cn, formatDate, calculateReadingTime, slugify)
  - Create useIntersectionObserver hook for scroll-triggered animations
  - Create useMediaQuery hook for responsive behavior
  - Create useScrollSpy hook for table of contents
  - Add error boundary component with fallback UI


  - _Requirements: 8.1, 8.5_


- [x] 4.1 Write unit tests for utility functions

  - Test calculateReadingTime with various content lengths
  - Test slugify with special characters and edge cases
  - Test formatDate with different date formats
  - _Requirements: 8.1, 8.5_
-

- [x] 5. Hero section with animations




  - Create Hero component with typing animation effect
  - Implement gradient blob background with CSS/Framer Motion
  - Add staggered fade-in animations for hero elements
  - Create CTA buttons with hover animations
  - Ensure mobile responsiveness without horizontal scroll
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 5.1 Write property test for responsive layout


  - **Property 4: Responsive layout without overflow**

  - **Validates: Requirements 2.4, 3.8, 4.7**

- [x] 6. Skills section with progress rings







  - Create Skills component with two-part layout
  - Implement six circular progress rings using SVG + Framer Motion
  - Add viewport detection to trigger animations from 0% to target
  - Implement glowing effect for completed rings
  - Create skill pills grid with 20+ pills grouped by category
  - Add moving gradient mesh background
  - Implement staggered fade-up animations for skill groups
  - Ensure mobile responsiveness
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 6.1 Write property test for progress ring animation






  - **Property 1: Progress ring animation initialization**
  - **Validates: Requirements 3.1**

- [x] 6.2 Write property test for progress ring glow effect

  - **Property 2: Progress ring glow effect on completion**
  - **Validates: Requirements 3.2**

- [x] 6.3 Write property test for skill pill hover

  - **Property 3: Skill pill hover interactions**
  - **Validates: Requirements 3.5**

- [x] 7. Projects section with filtering
  - Create Projects component with filter tabs (All, AI, Web, Mobile, Open Source)
  - Implement Supabase query to fetch featured projects
  - Create ProjectCard component with screenshot, title, description, tech badges
  - Add hover effects (card lift, image zoom, glowing border)
  - Implement filtering logic with Framer Motion transitions
  - Add conditional rendering for "Live Demo" and "GitHub" buttons
  - Ensure responsive grid layout for mobile
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

- [x] 7.1 Write property test for project card rendering
  - **Property 5: Project card required fields**
  - **Validates: Requirements 4.2**

- [x] 7.2 Write property test for project card hover effects
  - **Property 6: Project card hover effects**
  - **Validates: Requirements 4.3**

- [x] 7.3 Write property test for project filtering
  - **Property 7: Project filtering correctness**
  - **Validates: Requirements 4.4**

- [ ] 7.4 Write property test for conditional button rendering


  - **Property 8: Conditional button rendering**
  - **Validates: Requirements 4.6**


- [x] 7.5 Integrate Projects section into home page

  - Import and add Projects component to app/page.tsx
  - Ensure proper section ordering and spacing
  - _Requirements: 4.1_

- [x] 8. Tools Hub with GitHub integration
  - Create ToolsHub component with TanStack Query
  - Implement GitHub API fetch for top 12 repositories
  - Create API route proxy (/api/github) for rate limiting
  - Add skeleton loading states during data fetch
  - Implement error boundary with retry option
  - Create empty state component for no repositories
  - Display repository cards with name, description, language, stars, forks
  - Configure TanStack Query caching (5 minutes staleTime)
  - Add "Load more" or infinite scroll functionality
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.8_

- [ ] 8.1 Write property test for repository card rendering
  - **Property 9: Repository card required fields**
  - **Validates: Requirements 5.5**

- [ ] 8.2 Write property test for query error handling
  - **Property 14: Query error handling**
  - **Validates: Requirements 7.3**

- [ ] 8.3 Write unit tests for GitHub API integration
  - Test API route with mock GitHub responses
  - Test error handling for rate limiting
  - Test empty repository list handling
  - _Requirements: 5.2, 5.3, 5.4_

- [x] 8.4 Integrate ToolsHub section into home page



  - Import and add ToolsHub component to app/page.tsx with GitHub username
  - Ensure proper section ordering and spacing
  - _Requirements: 5.1_

- [x] 9. Markdown processing utilities


  - Create lib/markdown.ts with markdown processing functions
  - Implement processMarkdown function with rehype-shiki for syntax highlighting
  - Create generateTOC function to extract headings from markdown
  - Add rehype-slug and rehype-autolink-headings for heading links
  - Configure Shiki theme (github-dark)
  - Implement calculateReadingTime utility
  - _Requirements: 6.4, 6.5, 6.10_

- [ ] 9.1 Write property test for table of contents generation
  - **Property 12: Table of contents generation**
  - **Validates: Requirements 6.10**

- [ ] 9.2 Write unit tests for markdown processing
  - Test code block syntax highlighting
  - Test heading extraction for TOC
  - Test edge cases (empty content, no headings)
  - _Requirements: 6.4, 6.5, 6.10_


- [x] 10. Blog list page


  - Create app/blog/page.tsx as Server Component
  - Fetch posts from Supabase using postsQuery.getAll()
  - Create PostCard component displaying title, cover image, excerpt, date, reading time
  - Add pagination component (Client Component)
  - Implement responsive card grid layout
  - Add metadata for SEO
  - _Requirements: 6.1, 6.2, 14.1_

- [ ] 10.1 Write property test for page metadata
  - **Property 23: Page metadata completeness**
  - **Validates: Requirements 14.1**

- [x] 11. Blog post dynamic page


  - Create app/blog/[slug]/page.tsx with generateStaticParams
  - Configure ISR with revalidate: 60
  - Fetch post using postsQuery.getBySlug()
  - Create PostLayout component with hero cover image
  - Display title, metadata, reading time
  - Render markdown content using processMarkdown and MDXRemote
  - Create sticky TableOfContents component with scroll spy
  - Add previous/next post navigation
  - Generate Open Graph and Twitter card metadata
  - _Requirements: 6.3, 6.6, 6.7, 6.8, 6.9, 14.2_

- [ ] 11.1 Write property test for blog post rendering
  - **Property 10: Blog post required elements**
  - **Validates: Requirements 6.3**

- [ ] 11.2 Write property test for code block highlighting
  - **Property 11: Code block syntax highlighting**
  - **Validates: Requirements 6.5**

- [ ] 11.3 Write property test for blog metadata
  - **Property 13: Blog post metadata generation**
  - **Validates: Requirements 6.9, 14.2**

- [ ] 11.4 Write property test for structured data
  - **Property 24: Structured data inclusion**
  - **Validates: Requirements 14.5**


- [x] 12. Contact form with validation

  - Create components/ContactForm.tsx with React Hook Form
  - Define Zod validation schema (name, email, message)
  - Implement form field error display
  - Add loading state during submission
  - Create app/api/contact/route.ts for form submission
  - Display success message and clear form on success
  - Add error handling with user feedback
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 12.1 Write property test for form error display
  - **Property 21: Form field error display**
  - **Validates: Requirements 11.3**

- [ ] 12.2 Write unit tests for contact form
  - Test form validation with invalid inputs
  - Test successful form submission
  - Test error handling on API failure
  - _Requirements: 11.3, 11.4, 11.5_

- [x] 12.3 Integrate Contact section into home page



  - Import and add ContactForm component to app/page.tsx
  - Add section wrapper with proper styling and spacing
  - _Requirements: 11.1_

- [ ] 13. Animation system verification

  - Verify scroll-triggered animations work across all sections
  - Verify prefers-reduced-motion support is working
  - Verify hover feedback on all interactive elements
  - Test smooth transitions between sections
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 13.1 Write property test for viewport-triggered animations


  - **Property 16: Viewport-triggered animations**
  - **Validates: Requirements 8.1**


- [ ] 13.2 Write property test for interactive hover feedback
  - **Property 17: Interactive element hover feedback**
  - **Validates: Requirements 8.3**


- [ ] 13.3 Write property test for reduced motion

  - **Property 18: Reduced motion accessibility**
  - **Validates: Requirements 8.5**

-

- [ ] 14. Theme system verification

  - Verify theme toggle functionality in Navigation
  - Test theme persistence across page reloads
  - Ensure all components use CSS variables correctly
  - Test theme switching smoothness
  - Verify system theme detection on first load
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ] 14.1 Write property test for theme persistence
  - **Property 19: Theme persistence**
  - **Validates: Requirements 9.3**

- [ ] 15. Image optimization verification

  - Verify all images use Next.js Image component
  - Verify next.config.ts has Supabase image domains configured
  - Add proper alt text for accessibility where missing
  - Implement blur placeholders for images
  - _Requirements: 10.4_

- [ ] 15.1 Write property test for image optimization
  - **Property 20: Image optimization**
  - **Validates: Requirements 10.4**

- [ ] 16. Icon library verification

  - Audit all icon usage to ensure Lucide-react consistency
  - Verify proper icon sizing and accessibility
  - _Requirements: 12.1, 12.2_

- [ ] 16.1 Write property test for icon consistency
  - **Property 22: Icon library consistency**
  - **Validates: Requirements 12.2**

- [-] 17. SEO and metadata optimization
  - [x] Create app/sitemap.ts for automatic sitemap generation
  - [x] Create app/robots.ts for robots.txt generation
  - Implement JSON-LD structured data for blog posts and projects
  - Verify all pages have complete metadata
  - Add Open Graph images for social sharing
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

- [x] 18. Home page finalization
  - Verify all sections are integrated in app/page.tsx
  - Implement smooth scroll navigation for anchor links
  - [x] Add scroll-to-top button component
  - Ensure proper section spacing and layout
  - Test complete user journey flow
  - _Requirements: All sections integrated_



- [-] 19. Performance optimization
  - Verify next.config.ts is optimized for production builds
  - [x] Add loading.tsx files for streaming where beneficial
  - Verify font optimization with next/font (already using Inter)
  - Minimize cumulative layout shift (CLS)
  - Add priority loading for above-the-fold content
  - _Requirements: 10.1, 10.3, 10.5, 10.6, 10.7_

- [ ] 19.1 Run Lighthouse audit for performance
  - Verify 100/100 performance score
  - _Requirements: 10.1_

- [ ] 19.2 Run Lighthouse audit for accessibility
  - Verify 100/100 accessibility score
  - _Requirements: 10.2_

- [ ] 20. Accessibility audit and fixes
  - Test keyboard navigation throughout site
  - Verify ARIA labels on interactive elements
  - Check color contrast ratios
  - Ensure focus visible indicators
  - Verify semantic HTML usage
  - _Requirements: 10.2, Accessibility section_

- [ ] 21. Responsive design testing
  - Test on mobile devices (320px - 768px)
  - Test on tablets (768px - 1024px)
  - Test on desktop (1024px+)
  - Verify no horizontal scroll at any breakpoint
  - Test touch interactions on mobile
  - _Requirements: 2.4, 3.8, 4.7, 10.3_

- [ ] 22. Sample content creation
  - Write 2-3 sample blog posts with code examples in Supabase
  - Create sample project entries with screenshots in Supabase
  - Populate all sections with realistic content
  - _Requirements: 6.1, 4.1_

- [ ] 23. Documentation and deployment preparation
  - Update README.md with comprehensive setup instructions
  - Document environment variables setup
  - Add deployment instructions for Vercel
  - Verify .env.local.example has all required variables
  - Document Supabase setup steps
  - _Requirements: 15.4_

- [ ] 24. Final checkpoint - Ensure all tests pass
  - Run all unit tests and verify passing
  - Run all property-based tests and verify passing
  - Fix any failing tests
  - Verify build succeeds without errors
  - Ask the user if questions arise
