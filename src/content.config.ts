import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		coverImage: z.string().optional(),
		published: z.boolean().default(false),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const journal = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/journal" }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		type: z.enum(['day', 'week', 'month', 'quarter', 'year', 'cycle']),
		summary: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, journal };
