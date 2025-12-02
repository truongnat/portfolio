import { pgTable, uuid, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const posts = pgTable('posts', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    content: text('content').notNull(),
    cover_image: text('cover_image'),
    published_at: timestamp('published_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    reading_time: integer('reading_time'),
    tags: text('tags').array().default(sql`'{}'::text[]`).notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    screenshot: text('screenshot'),
    tech_stack: text('tech_stack').array().default(sql`'{}'::text[]`).notNull(),
    live_url: text('live_url'),
    github_url: text('github_url'),
    category: text('category').notNull(),
    featured: boolean('featured').default(false).notNull(),
    display_order: integer('display_order'),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const githubProjects = pgTable('github_projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    repo_id: integer('repo_id').notNull().unique(),
    repo_name: text('repo_name').notNull(),
    description: text('description'),
    language: text('language'),
    language_color: text('language_color'),
    stars: integer('stars').default(0),
    forks: integer('forks').default(0),
    url: text('url').notNull(),
    synced_at: timestamp('synced_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
