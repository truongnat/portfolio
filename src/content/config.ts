import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		date: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		coverImage: z.string().optional(),
		published: z.boolean().default(false),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const journal = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		type: z.enum(['day', 'week', 'month', 'quarter', 'year', 'cycle']),
		summary: z.string().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, journal };
