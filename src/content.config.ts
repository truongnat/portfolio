import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, coursesSchema, journalSchema } from './content/schemas';

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
	schema: blogSchema,
});

const journal = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/journal" }),
	schema: journalSchema,
});

const courses = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/courses" }),
	schema: coursesSchema,
});

export const collections = { blog, journal, courses };
