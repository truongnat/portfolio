import { db } from '@/db';
import { posts, projects, githubProjects } from '@/db/schema';
import { desc, asc, eq, lte, sql, arrayContains } from 'drizzle-orm';

// Posts queries
export const postsQuery = {
    getAll: async () => {
        return db.query.posts.findMany({
            where: lte(posts.published_at, new Date().toISOString()),
            orderBy: [desc(posts.published_at)],
        });
    },

    getBySlug: async (slug: string) => {
        return db.query.posts.findFirst({
            where: (posts, { and, eq, lte }) =>
                and(eq(posts.slug, slug), lte(posts.published_at, new Date().toISOString())),
        });
    },

    getPaginated: async (page: number = 1, pageSize: number = 10) => {
        const offset = (page - 1) * pageSize;

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(posts)
            .where(lte(posts.published_at, new Date().toISOString()));

        const count = Number(countResult[0]?.count || 0);

        // Get data
        const data = await db.query.posts.findMany({
            where: lte(posts.published_at, new Date().toISOString()),
            orderBy: [desc(posts.published_at)],
            limit: pageSize,
            offset: offset,
        });

        return { data, count };
    },

    getByTag: async (tag: string) => {
        return db.query.posts.findMany({
            where: (posts, { and, lte }) =>
                and(
                    arrayContains(posts.tags, [tag]),
                    lte(posts.published_at, new Date().toISOString())
                ),
            orderBy: [desc(posts.published_at)],
        });
    },
};

// Projects queries
export const projectsQuery = {
    getAll: async () => {
        return db.query.projects.findMany({
            orderBy: [asc(projects.display_order), desc(projects.created_at)],
        });
    },

    getFeatured: async () => {
        return db.query.projects.findMany({
            where: eq(projects.featured, true),
            orderBy: [asc(projects.display_order)],
        });
    },

    getByCategory: async (category: string) => {
        if (category === 'All') {
            return projectsQuery.getAll();
        }
        return db.query.projects.findMany({
            where: eq(projects.category, category),
            orderBy: [asc(projects.display_order)],
        });
    },
};

// GitHub projects queries
export const githubProjectsQuery = {
    getAll: async () => {
        return db.query.githubProjects.findMany({
            orderBy: [desc(githubProjects.stars)],
        });
    },

    getTop: async (limit: number = 12) => {
        return db.query.githubProjects.findMany({
            orderBy: [desc(githubProjects.stars)],
            limit: limit,
        });
    },

    upsert: async (project: typeof githubProjects.$inferInsert) => {
        return db
            .insert(githubProjects)
            .values(project)
            .onConflictDoUpdate({
                target: githubProjects.repo_id,
                set: project,
            });
    },
};
