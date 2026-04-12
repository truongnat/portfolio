/**
 * Validates Markdown/MDX frontmatter for all content collections against shared Zod schemas.
 * Mirrors glob rules in src/content.config.ts (exclude filenames starting with _).
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';
import { blogSchema, coursesSchema, journalSchema } from '../src/content/schemas';

const ROOT = process.cwd();

function collectMarkdownFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      collectMarkdownFiles(full, out);
    } else if (/\.(md|mdx)$/i.test(e.name) && !e.name.startsWith('_')) {
      out.push(full);
    }
  }
  return out;
}

type CollectionName = 'blog' | 'journal' | 'courses';

const COLLECTIONS: { name: CollectionName; base: string; schema: z.ZodType<unknown> }[] = [
  { name: 'blog', base: path.join(ROOT, 'src/content/blog'), schema: blogSchema },
  { name: 'journal', base: path.join(ROOT, 'src/content/journal'), schema: journalSchema },
  { name: 'courses', base: path.join(ROOT, 'src/content/courses'), schema: coursesSchema },
];

let failed = false;

for (const { name, base, schema } of COLLECTIONS) {
  const files = collectMarkdownFiles(base);
  for (const file of files) {
    const raw = fs.readFileSync(file, 'utf-8');
    const { data } = matter(raw);
    const result = schema.safeParse(data);
    if (!result.success) {
      failed = true;
      console.error(`[content:validate] ${name} — ${path.relative(ROOT, file)}`);
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
  }
}

if (failed) {
  console.error('\ncontent:validate failed: fix frontmatter or schemas.');
  process.exit(1);
}

console.log('content:validate OK (blog, journal, courses).');
