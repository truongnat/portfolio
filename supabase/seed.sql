-- Sample Seed Data for Development
-- This file contains sample data for posts, projects, and github_projects tables

-- Clear existing data (optional - comment out if you want to preserve data)
-- TRUNCATE posts, projects, github_projects CASCADE;

-- Sample Blog Posts
INSERT INTO posts (title, slug, content, cover_image, published_at, reading_time, tags) VALUES
(
  'Building a Modern Portfolio with Next.js 16',
  'building-modern-portfolio-nextjs-16',
  '# Building a Modern Portfolio with Next.js 16

## Introduction

In this post, we''ll explore how to build a production-ready portfolio using Next.js 16 with the App Router, Server Components, and modern best practices.

## Why Next.js 16?

Next.js 16 brings several improvements:
- Enhanced App Router with better streaming
- Improved Server Components performance
- Better TypeScript support
- Optimized image loading

## Getting Started

```typescript
// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <h1>Welcome to my portfolio</h1>
    </main>
  );
}
```

## Key Features

1. **Server Components by Default**: Faster initial page loads
2. **Streaming**: Progressive rendering for better UX
3. **ISR**: Keep content fresh without rebuilding

## Conclusion

Next.js 16 provides an excellent foundation for building modern web applications with great performance and developer experience.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630',
  NOW() - INTERVAL '7 days',
  5,
  ARRAY['Next.js', 'React', 'Web Development']
),
(
  'Mastering TypeScript: Advanced Patterns',
  'mastering-typescript-advanced-patterns',
  '# Mastering TypeScript: Advanced Patterns

## Introduction

TypeScript has become essential for building scalable applications. Let''s explore some advanced patterns.

## Generic Constraints

```typescript
interface HasId {
  id: string;
}

function findById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}
```

## Conditional Types

Conditional types allow you to create types that depend on other types:

```typescript
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

## Mapped Types

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type ReadonlyUser = Readonly<User>;
```

## Conclusion

These patterns help you write more type-safe and maintainable code.',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630',
  NOW() - INTERVAL '14 days',
  8,
  ARRAY['TypeScript', 'Programming', 'Best Practices']
),
(
  'Optimizing React Performance with Profiler',
  'optimizing-react-performance-profiler',
  '# Optimizing React Performance with Profiler

## Introduction

Performance optimization is crucial for great user experience. Let''s explore React Profiler.

## Using the Profiler

```typescript
import { Profiler } from ''react'';

function onRenderCallback(
  id: string,
  phase: "mount" | "update",
  actualDuration: number
) {
  console.log(`${id} took ${actualDuration}ms to ${phase}`);
}

export default function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <YourComponent />
    </Profiler>
  );
}
```

## Common Performance Issues

1. **Unnecessary Re-renders**: Use React.memo and useMemo
2. **Large Lists**: Implement virtualization
3. **Heavy Computations**: Move to Web Workers

## Best Practices

- Profile before optimizing
- Focus on user-perceived performance
- Use production builds for accurate measurements

## Conclusion

The React Profiler is a powerful tool for identifying and fixing performance bottlenecks.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630',
  NOW() - INTERVAL '3 days',
  6,
  ARRAY['React', 'Performance', 'Optimization']
);

-- Sample Projects
INSERT INTO projects (title, description, screenshot, tech_stack, live_url, github_url, category, featured, display_order) VALUES
(
  'AI-Powered Code Assistant',
  'An intelligent code completion and suggestion tool powered by GPT-4. Features real-time code analysis, bug detection, and automated refactoring suggestions.',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600',
  ARRAY['Python', 'OpenAI', 'FastAPI', 'React', 'TypeScript'],
  'https://code-assistant-demo.vercel.app',
  'https://github.com/yourusername/ai-code-assistant',
  'AI',
  true,
  1
),
(
  'E-Commerce Platform',
  'Full-stack e-commerce solution with payment processing, inventory management, and admin dashboard. Built with modern web technologies for optimal performance.',
  'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600',
  ARRAY['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
  'https://shop-demo.vercel.app',
  'https://github.com/yourusername/ecommerce-platform',
  'Web',
  true,
  2
),
(
  'Mobile Fitness Tracker',
  'Cross-platform mobile app for tracking workouts, nutrition, and health metrics. Includes social features and AI-powered workout recommendations.',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600',
  ARRAY['React Native', 'TypeScript', 'Firebase', 'TensorFlow'],
  'https://apps.apple.com/app/fitness-tracker',
  'https://github.com/yourusername/fitness-tracker',
  'Mobile',
  true,
  3
),
(
  'Real-Time Chat Application',
  'Scalable chat application with WebSocket support, end-to-end encryption, and rich media sharing. Supports group chats and video calls.',
  'https://images.unsplash.com/photo-1611606063065-ee7946f0787a?w=800&h=600',
  ARRAY['Node.js', 'Socket.io', 'React', 'MongoDB', 'WebRTC'],
  'https://chat-demo.vercel.app',
  'https://github.com/yourusername/realtime-chat',
  'Web',
  false,
  4
),
(
  'Open Source UI Library',
  'Comprehensive React component library with 50+ accessible components. Fully customizable with Tailwind CSS and TypeScript support.',
  'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&h=600',
  ARRAY['React', 'TypeScript', 'Tailwind CSS', 'Storybook'],
  'https://ui-library-docs.vercel.app',
  'https://github.com/yourusername/ui-library',
  'Open Source',
  true,
  5
),
(
  'Machine Learning Pipeline',
  'Automated ML pipeline for data preprocessing, model training, and deployment. Includes experiment tracking and model versioning.',
  'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=600',
  ARRAY['Python', 'TensorFlow', 'Docker', 'Kubernetes', 'MLflow'],
  NULL,
  'https://github.com/yourusername/ml-pipeline',
  'AI',
  false,
  6
);

-- Sample GitHub Projects
INSERT INTO github_projects (repo_id, repo_name, description, language, language_color, stars, forks, url, synced_at) VALUES
(
  123456789,
  'awesome-typescript-utils',
  'A collection of useful TypeScript utility types and helper functions',
  'TypeScript',
  '#3178c6',
  1250,
  89,
  'https://github.com/yourusername/awesome-typescript-utils',
  NOW()
),
(
  987654321,
  'react-performance-toolkit',
  'Tools and utilities for optimizing React application performance',
  'JavaScript',
  '#f1e05a',
  856,
  67,
  'https://github.com/yourusername/react-performance-toolkit',
  NOW()
),
(
  456789123,
  'nextjs-starter-template',
  'Production-ready Next.js starter with TypeScript, Tailwind, and best practices',
  'TypeScript',
  '#3178c6',
  2340,
  234,
  'https://github.com/yourusername/nextjs-starter-template',
  NOW()
),
(
  789123456,
  'python-data-science-toolkit',
  'Essential tools and notebooks for data science projects',
  'Python',
  '#3572A5',
  678,
  45,
  'https://github.com/yourusername/python-data-science-toolkit',
  NOW()
);

-- Verify data insertion
SELECT 'Posts inserted:' as info, COUNT(*) as count FROM posts
UNION ALL
SELECT 'Projects inserted:', COUNT(*) FROM projects
UNION ALL
SELECT 'GitHub projects inserted:', COUNT(*) FROM github_projects;
