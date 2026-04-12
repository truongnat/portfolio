import { z } from 'zod';

/** Shared with `scripts/validate-content.ts` — keep in sync with loaders in `content.config.ts`. */
export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
});

export const journalSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  type: z.enum(['day', 'week', 'month', 'quarter', 'year', 'cycle']),
  summary: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const coursesSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration: z.string().optional(),
  status: z.string().optional(),
  price: z.string().optional(),
  modules: z
    .array(
      z.object({
        title: z.string(),
        lessons: z.array(z.string()),
      })
    )
    .optional(),
  videos: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
        lesson: z.number().optional(),
      })
    )
    .optional(),
});
