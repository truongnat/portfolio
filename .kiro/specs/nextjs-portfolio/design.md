# Design Document

## Overview

The Portfolio System is a production-ready Next.js 16 application leveraging the App Router architecture with Server Components as the default rendering strategy. The system implements a modern, performant developer portfolio featuring dynamic content management through Supabase, sophisticated animations via Framer Motion, and optimal data fetching patterns using TanStack Query v5.

The architecture prioritizes performance (targeting 100/100 Lighthouse scores), accessibility, and developer experience through TypeScript strict mode, shadcn/ui component library, and Tailwind CSS v3.4+. The system uses a hybrid rendering approach: Server Components for static content, Client Components for interactive features, and ISR (Incremental Static Regeneration) for blog posts.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Next.js 16 App                        │
│                      (App Router)                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Server     │  │   Client     │  │   API        │      │
│  │  Components  │  │  Components  │  │   Routes     │      │
│  │              │  │              │  │              │      │
│  │ • Layout     │  │ • Hero       │  │ • Contact    │      │
│  │ • Blog List  │  │ • Skills     │  │ • GitHub     │      │
│  │ • Blog Post  │  │ • Projects   │  │   Proxy      │      │
│  │ • Metadata   │  │ • Theme      │  │              │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
├────────────────────────────┼─────────────────────────────────┤
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────────┐ │
│  │              Data Layer                                 │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │ │
│  │  │  TanStack    │  │   Supabase   │  │   GitHub    │  │ │
│  │  │   Query      │  │    Client    │  │     API     │  │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Rendering Strategy

1. **Server Components (Default)**
   - Layout components
   - Blog post content rendering
   - Static sections (About, initial content)
   - Metadata generation

2. **Client Components**
   - Interactive animations (Framer Motion)
   - Form handling (React Hook Form)
   - Theme toggle (next-themes)
   - Data fetching UI (TanStack Query)
   - Scroll-triggered animations

3. **Hybrid Approach**
   - Server Components fetch initial data
   - Client Components handle interactivity
   - Streaming for progressive enhancement

### Technology Stack

**Core Framework:**
- Next.js 16 (App Router)
- React 18+ (Server Components)
- TypeScript 5+ (strict mode)

**Styling:**
- Tailwind CSS v3.4+
- shadcn/ui components
- CSS Variables for theming
- Framer Motion for animations

**Data Layer:**
- Supabase (PostgreSQL database, Auth, Storage)
- TanStack Query v5 (client-side data fetching)
- Zod (runtime validation)

**Content:**
- next-mdx-remote (Markdown rendering)
- rehype-shiki (syntax highlighting)
- gray-matter (frontmatter parsing)

**Forms:**
- React Hook Form
- Zod validation schemas

**Icons & Assets:**
- Lucide-react
- Next.js Image optimization

## Components and Interfaces

### Component Hierarchy

```
app/
├── layout.tsx (Root Layout - Server Component)
│   ├── Providers (Client - Theme, Query)
│   └── Navigation (Client - interactive)
│
├── page.tsx (Home - Server Component)
│   ├── Hero (Client - animations)
│   ├── About (Server)
│   ├── Skills (Client - animations, viewport detection)
│   ├── Projects (Client - filtering, data fetching)
│   ├── ToolsHub (Client - GitHub API, TanStack Query)
│   ├── BlogPreview (Server - initial data)
│   └── Contact (Client - form handling)
│
├── blog/
│   ├── page.tsx (Blog List - Server Component)
│   │   ├── PostCard (Server)
│   │   └── Pagination (Client)
│   │
│   └── [slug]/
│       └── page.tsx (Blog Post - Server Component)
│           ├── PostHero (Server)
│           ├── TableOfContents (Client - sticky, scroll spy)
│           ├── MDXContent (Server)
│           └── PostNavigation (Server)
│
└── api/
    ├── contact/route.ts
    └── github/route.ts (proxy for rate limiting)
```

### Core Component Interfaces

```typescript
// Hero Component
interface HeroProps {
  title: string;
  subtitle: string;
  typingPhrases: string[];
  ctaButtons: CTAButton[];
}

interface CTAButton {
  label: string;
  href: string;
  variant: 'primary' | 'secondary';
}

// Skills Component
interface SkillsProps {
  expertiseRings: ExpertiseRing[];
  skillPills: SkillPill[];
}

interface ExpertiseRing {
  id: string;
  label: string;
  percentage: number;
  color: string;
}

interface SkillPill {
  id: string;
  name: string;
  icon: LucideIcon;
  category: SkillCategory;
}

type SkillCategory = 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Tools';

// Projects Component
interface ProjectsProps {
  initialProjects: Project[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  screenshot: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: ProjectCategory;
  featured: boolean;
}

type ProjectCategory = 'All' | 'AI' | 'Web' | 'Mobile' | 'Open Source';

// Tools Hub Component
interface ToolsHubProps {
  initialRepos?: GitHubRepo[];
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
}

// Blog Components
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage: string;
  publishedAt: Date;
  readingTime: number;
  tags: string[];
}

interface PostCardProps {
  post: Omit<BlogPost, 'content'>;
}

interface PostLayoutProps {
  post: BlogPost;
  tableOfContents: TOCItem[];
  previousPost?: Pick<BlogPost, 'title' | 'slug'>;
  nextPost?: Pick<BlogPost, 'title' | 'slug'>;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Form Components
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
```

### Shared Utilities and Hooks

```typescript
// Custom Hooks
useIntersectionObserver(ref, options) // Scroll-triggered animations
useMediaQuery(query) // Responsive behavior
useScrollSpy(ids) // TOC active section tracking
useTheme() // from next-themes

// Utility Functions
cn(...classes) // Class name merger (clsx + tailwind-merge)
formatDate(date) // Consistent date formatting
calculateReadingTime(content) // Estimate reading time
generateTOC(content) // Extract headings from markdown
slugify(text) // Generate URL-safe slugs
```

## Data Models

### Supabase Schema

```sql
-- Posts Table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  screenshot TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  live_url TEXT,
  github_url TEXT,
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;
CREATE INDEX idx_projects_display_order ON projects(display_order);

-- GitHub Projects Table (for synced repos)
CREATE TABLE github_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_id INTEGER UNIQUE NOT NULL,
  repo_name TEXT NOT NULL,
  description TEXT,
  language TEXT,
  language_color TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  url TEXT NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_github_projects_stars ON github_projects(stars DESC);
CREATE INDEX idx_github_projects_synced_at ON github_projects(synced_at DESC);

-- Row Level Security Policies (Public Read Access)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for posts" ON posts
  FOR SELECT USING (published_at <= NOW());

CREATE POLICY "Public read access for projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read access for github_projects" ON github_projects
  FOR SELECT USING (true);

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### TypeScript Type Definitions

```typescript
// Database Types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          cover_image: string | null;
          published_at: string;
          reading_time: number | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          screenshot: string | null;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          category: string;
          featured: boolean;
          display_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      github_projects: {
        Row: {
          id: string;
          repo_id: number;
          repo_name: string;
          description: string | null;
          language: string | null;
          language_color: string | null;
          stars: number;
          forks: number;
          url: string;
          synced_at: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['github_projects']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['github_projects']['Insert']>;
      };
    };
  };
}

// Application Types
export type Post = Database['public']['Tables']['posts']['Row'];
export type Project = Database['public']['Tables']['projects']['Row'];
export type GitHubProject = Database['public']['Tables']['github_projects']['Row'];

// Form Validation Schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several properties can be consolidated to avoid redundancy:

- Responsive design properties (2.4, 3.8, 4.7) can be combined into a single comprehensive responsive layout property
- Hover interaction properties (3.5, 4.3, 8.3) share similar patterns and can be validated together
- Metadata generation properties (6.9, 14.1, 14.2) all test that metadata exists for content
- Component rendering properties (4.2, 5.5, 6.3) all verify required fields are displayed

### Universal Properties

**Property 1: Progress ring animation initialization**
*For any* progress ring in the skills section, when the section enters the viewport, the ring SHALL animate from 0% to its target percentage value.
**Validates: Requirements 3.1**

**Property 2: Progress ring glow effect on completion**
*For any* progress ring that reaches 100% of its target value, the system SHALL apply a glowing visual effect to that ring.
**Validates: Requirements 3.2**

**Property 3: Skill pill hover interactions**
*For any* skill pill, when hovered, the system SHALL apply both a scale transformation and a background gradient shift.
**Validates: Requirements 3.5**

**Property 4: Responsive layout without overflow**
*For any* viewport width from 320px to 2560px, all sections SHALL display without horizontal scrollbar or content overflow.
**Validates: Requirements 2.4, 3.8, 4.7**

**Property 5: Project card required fields**
*For any* project card displayed, the rendered output SHALL contain screenshot, title, description, tech stack badges, and action links.
**Validates: Requirements 4.2**

**Property 6: Project card hover effects**
*For any* project card, when hovered, the system SHALL apply card lift, image zoom, and glowing border effects simultaneously.
**Validates: Requirements 4.3**

**Property 7: Project filtering correctness**
*For any* selected category filter, all displayed projects SHALL match that category, and no projects from other categories SHALL be visible.
**Validates: Requirements 4.4**

**Property 8: Conditional button rendering**
*For any* project with a live_url or github_url, the corresponding "Live Demo" or "GitHub" button SHALL be rendered; for projects without these URLs, the buttons SHALL not appear.
**Validates: Requirements 4.6**

**Property 9: Repository card required fields**
*For any* GitHub repository card displayed, the rendered output SHALL contain repo name, description, language color dot, stars count, and forks count.
**Validates: Requirements 5.5**

**Property 10: Blog post required elements**
*For any* blog post accessed via /blog/[slug], the rendered page SHALL contain hero cover image, title, metadata, reading time, and rendered markdown content.
**Validates: Requirements 6.3**

**Property 11: Code block syntax highlighting**
*For any* code block within markdown content, the rendered output SHALL include syntax highlighting with language-appropriate color tokens.
**Validates: Requirements 6.5**

**Property 12: Table of contents generation**
*For any* markdown content containing heading elements (h1-h6), the system SHALL generate a table of contents with entries matching the heading text and hierarchy level.
**Validates: Requirements 6.10**

**Property 13: Blog post metadata generation**
*For any* blog post page, the system SHALL generate metadata including title, description, Open Graph tags, and Twitter card tags.
**Validates: Requirements 6.9, 14.2**

**Property 14: Query error handling**
*For any* TanStack Query that fails, the system SHALL catch the error and display user-facing feedback with retry capability.
**Validates: Requirements 7.3**

**Property 15: Cache invalidation on mutation**
*For any* mutation operation, the system SHALL invalidate all queries that depend on the mutated data.
**Validates: Requirements 7.5**

**Property 16: Viewport-triggered animations**
*For any* element with scroll-triggered animation, when the element enters the viewport, the animation SHALL be triggered using Framer Motion and Intersection Observer.
**Validates: Requirements 8.1**

**Property 17: Interactive element hover feedback**
*For any* interactive element (buttons, links, cards), hovering SHALL trigger immediate visual feedback through CSS or animation changes.
**Validates: Requirements 8.3**

**Property 18: Reduced motion accessibility**
*For any* animation, when the user's system has prefers-reduced-motion enabled, the animation SHALL be disabled or replaced with a simpler transition.
**Validates: Requirements 8.5**

**Property 19: Theme persistence**
*For any* theme change (light to dark or dark to light), the preference SHALL be persisted to storage and restored on subsequent page loads.
**Validates: Requirements 9.3**

**Property 20: Image optimization**
*For any* image rendered in the application, the system SHALL use the Next.js Image component with automatic optimization.
**Validates: Requirements 10.4**

**Property 21: Form field error display**
*For any* form field that fails validation, the system SHALL display a clear error message adjacent to or below the field.
**Validates: Requirements 11.3**

**Property 22: Icon library consistency**
*For any* icon displayed in the application, the system SHALL use the Lucide-react library exclusively.
**Validates: Requirements 12.2**

**Property 23: Page metadata completeness**
*For any* page in the application, the system SHALL include meta tags for title, description, viewport, and charset at minimum.
**Validates: Requirements 14.1**

**Property 24: Structured data inclusion**
*For any* page with structured content (blog posts, projects), the system SHALL include JSON-LD structured data in the page head.
**Validates: Requirements 14.5**

## Error Handling

### Client-Side Error Handling

**TanStack Query Error Handling:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      onError: (error) => {
        console.error('Query error:', error);
        toast.error('Failed to load data. Please try again.');
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('Operation failed. Please try again.');
      },
    },
  },
});
```

**Error Boundaries:**
- Root error boundary for catastrophic failures
- Component-level error boundaries for isolated failures
- Fallback UI with retry mechanisms

```typescript
// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

### Server-Side Error Handling

**API Route Error Handling:**
```typescript
// Standardized error response
export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Process request
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

**Supabase Error Handling:**
```typescript
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .eq('slug', slug)
  .single();

if (error) {
  console.error('Supabase error:', error);
  throw new Error(`Failed to fetch post: ${error.message}`);
}

if (!data) {
  notFound(); // Next.js 404 page
}
```

### Form Validation Errors

**Zod Schema Validation:**
```typescript
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// React Hook Form integration
const form = useForm({
  resolver: zodResolver(contactFormSchema),
  mode: 'onBlur',
});
```

### Loading States

- Skeleton loaders for data fetching
- Suspense boundaries for async components
- Loading spinners for mutations
- Progressive enhancement with streaming

## Testing Strategy

### Dual Testing Approach

The Portfolio System employs both unit testing and property-based testing to ensure comprehensive correctness validation. Unit tests verify specific examples and edge cases, while property tests verify universal properties hold across all inputs. Together, they provide complete coverage: unit tests catch concrete bugs, property tests verify general correctness.

### Property-Based Testing

**Library:** fast-check (for TypeScript/JavaScript)

**Configuration:**
- Minimum 100 iterations per property test
- Each property test must reference its corresponding design document property
- Tag format: `**Feature: nextjs-portfolio, Property {number}: {property_text}**`

**Example Property Test:**
```typescript
import fc from 'fast-check';

/**
 * Feature: nextjs-portfolio, Property 7: Project filtering correctness
 * For any selected category filter, all displayed projects SHALL match that category
 */
test('project filtering shows only matching categories', () => {
  fc.assert(
    fc.property(
      fc.array(projectArbitrary), // Generate random projects
      fc.constantFrom('All', 'AI', 'Web', 'Mobile', 'Open Source'), // Random category
      (projects, category) => {
        const filtered = filterProjects(projects, category);
        
        if (category === 'All') {
          expect(filtered).toEqual(projects);
        } else {
          filtered.forEach(project => {
            expect(project.category).toBe(category);
          });
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

**Property Test Coverage:**
- Property 1-3: Skills section animations and interactions
- Property 4: Responsive layout (viewport width generator)
- Property 5-8: Project card rendering and filtering
- Property 9: Repository card rendering
- Property 10-13: Blog post rendering and metadata
- Property 14-15: Query error handling and cache invalidation
- Property 16-18: Animation triggers and accessibility
- Property 19: Theme persistence (localStorage round-trip)
- Property 20-24: Image optimization, forms, icons, metadata

### Unit Testing

**Framework:** Vitest + React Testing Library

**Unit Test Coverage:**
- Component rendering (Hero, Skills, Projects, Blog)
- User interactions (clicks, hovers, form submissions)
- Data fetching hooks (TanStack Query)
- Utility functions (formatDate, calculateReadingTime, generateTOC)
- Form validation (Zod schemas)
- Markdown parsing (MDX rendering)

**Example Unit Tests:**
```typescript
describe('Hero Component', () => {
  it('renders typing animation on load', () => {
    render(<Hero {...mockProps} />);
    expect(screen.getByTestId('typing-animation')).toBeInTheDocument();
  });

  it('displays CTA buttons with correct links', () => {
    render(<Hero {...mockProps} />);
    const primaryCTA = screen.getByRole('link', { name: /view projects/i });
    expect(primaryCTA).toHaveAttribute('href', '#projects');
  });
});

describe('calculateReadingTime', () => {
  it('calculates reading time for average content', () => {
    const content = 'word '.repeat(200); // 200 words
    expect(calculateReadingTime(content)).toBe(1); // ~1 minute
  });

  it('handles empty content', () => {
    expect(calculateReadingTime('')).toBe(0);
  });
});
```

### Integration Testing

**Scope:**
- Page-level rendering (app/page.tsx, app/blog/page.tsx)
- API routes (contact form submission)
- Supabase integration (data fetching)
- Navigation flows (home → blog → post)

### End-to-End Testing

**Framework:** Playwright

**E2E Test Scenarios:**
- Complete user journey (landing → projects → blog → contact)
- Theme switching persistence
- Form submission flow
- Mobile responsive behavior
- Performance metrics (Lighthouse CI)

### Performance Testing

**Lighthouse CI:**
- Automated Lighthouse audits on every deployment
- Performance budget enforcement
- Core Web Vitals monitoring (LCP, FID, CLS)

**Metrics Targets:**
- Performance: 100/100
- Accessibility: 100/100
- Best Practices: 100/100
- SEO: 100/100
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## Implementation Notes

### Animation Performance

**Framer Motion Optimization:**
- Use `layout` prop for automatic layout animations
- Leverage `useReducedMotion` hook for accessibility
- Implement `viewport` prop for scroll-triggered animations
- Use `transform` and `opacity` for GPU-accelerated animations

```typescript
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
```

### Data Fetching Patterns

**Server Components (Default):**
```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  const posts = await getPosts(); // Direct database query
  return <PostList posts={posts} />;
}
```

**Client Components with TanStack Query:**
```typescript
// components/ToolsHub.tsx
'use client';

export function ToolsHub() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['github-repos'],
    queryFn: fetchGitHubRepos,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorState error={error} />;
  return <RepoGrid repos={data} />;
}
```

### Markdown Processing Pipeline

```typescript
// lib/markdown.ts
import { serialize } from 'next-mdx-remote/serialize';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export async function processMarkdown(content: string) {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        [rehypeShiki, { theme: 'github-dark' }],
      ],
    },
  });

  return mdxSource;
}

export function generateTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TOCItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = slugify(text);
    toc.push({ id, text, level });
  }

  return toc;
}
```

### Theme Implementation

```typescript
// app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

### Supabase Client Setup

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side client (for Server Components)
export async function getServerSupabase() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
```

### File Structure

```
portfolio/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── api/
│   │   ├── contact/
│   │   │   └── route.ts
│   │   └── github/
│   │       └── route.ts
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── ui/ (shadcn components)
│   ├── Hero.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── ToolsHub.tsx
│   ├── BlogPreview.tsx
│   ├── PostCard.tsx
│   ├── PostLayout.tsx
│   ├── TableOfContents.tsx
│   ├── ContactForm.tsx
│   ├── ThemeToggle.tsx
│   └── Navigation.tsx
├── lib/
│   ├── supabase.ts
│   ├── markdown.ts
│   ├── utils.ts
│   └── queries.ts
├── types/
│   ├── database.ts
│   └── index.ts
├── hooks/
│   ├── useIntersectionObserver.ts
│   ├── useMediaQuery.ts
│   └── useScrollSpy.ts
├── public/
│   ├── images/
│   └── fonts/
├── supabase/
│   ├── schema.sql
│   └── seed.sql
├── .github/
│   └── workflows/
│       └── sync-github-repos.yml
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local.example
```

## Deployment Considerations

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub (for Tools Hub)
GITHUB_TOKEN=your_github_personal_access_token

# Contact Form (optional)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com
```

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

module.exports = nextConfig;
```

### Vercel Deployment

- Automatic deployments from main branch
- Preview deployments for pull requests
- Environment variables configured in Vercel dashboard
- ISR revalidation handled automatically
- Edge functions for API routes (optional)

## Security Considerations

1. **Supabase RLS:** All tables have Row Level Security enabled with public read-only access
2. **API Rate Limiting:** GitHub API proxy implements rate limiting
3. **Input Validation:** All form inputs validated with Zod schemas
4. **XSS Prevention:** React's built-in XSS protection + sanitized markdown rendering
5. **CORS:** API routes configured with appropriate CORS headers
6. **Environment Variables:** Sensitive keys stored securely, never committed to git

## Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML throughout
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible indicators
- Reduced motion support
- Color contrast ratios meet standards
- Screen reader tested
