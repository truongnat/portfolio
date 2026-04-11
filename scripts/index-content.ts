import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import * as lancedb from '@lancedb/lancedb';
import { pipeline } from '@xenova/transformers';

const BLOG_DIR = path.resolve(process.cwd(), 'src/content/blog');
const JOURNAL_DIR = path.resolve(process.cwd(), 'src/content/journal');
const DB_PATH = path.resolve(process.cwd(), 'data/lancedb');

async function main() {
  console.log('Initializing embedding pipeline (Xenova/all-MiniLM-L6-v2)...');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('Connecting to LanceDB...');
  const db = await lancedb.connect(DB_PATH);

  const entries: any[] = [];

  // Read Blogs
  if (fs.existsSync(BLOG_DIR)) {
    const blogDirs = fs.readdirSync(BLOG_DIR, { withFileTypes: true });
    for (const entry of blogDirs) {
        if (entry.isDirectory()) {
            const indexFile = path.join(BLOG_DIR, entry.name, 'index.md');
            const mdxFile = path.join(BLOG_DIR, entry.name, 'index.mdx');
            const filePath = fs.existsSync(indexFile) ? indexFile : (fs.existsSync(mdxFile) ? mdxFile : null);
            
            if (filePath) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const { data, content: body } = matter(content);
                entries.push({
                    id: `blog-${entry.name}`,
                    title: data.title,
                    type: 'blog',
                    content: body
                });
            }
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            const content = fs.readFileSync(path.join(BLOG_DIR, entry.name), 'utf-8');
            const { data, content: body } = matter(content);
            entries.push({
                id: `blog-${entry.name.replace(/\.mdx?$/, '')}`,
                title: data.title,
                type: 'blog',
                content: body
            });
        }
    }
  }

  // Read Journals
  if (fs.existsSync(JOURNAL_DIR)) {
    const journalFiles = fs.readdirSync(JOURNAL_DIR).filter(f => f.endsWith('.md'));
    for (const file of journalFiles) {
      const content = fs.readFileSync(path.join(JOURNAL_DIR, file), 'utf-8');
      const { data, content: body } = matter(content);
      entries.push({
        id: file.replace(/\.md$/, ''),
        title: data.title,
        type: 'journal',
        content: body
      });
    }
  }

  const dataToInsert: any[] = [];

  console.log(`Processing ${entries.length} entries...`);
  for (const entry of entries) {
    // Chunking: 800 chars for search granularity
    const chunks = chunkText(entry.content, 800);
    for (let i = 0; i < chunks.length; i++) {
      const text = `Title: ${entry.title}\nType: ${entry.type}\nContent: ${chunks[i]}`;
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      const vector = Array.from(output.data);
      
      dataToInsert.push({
        vector,
        text: chunks[i],
        title: entry.title,
        type: entry.type,
        ref_id: entry.id
      });
    }
  }

  console.log(`Inserting ${dataToInsert.length} chunks into LanceDB...`);
  try {
    const tableNames = await db.tableNames();
    if (tableNames.includes('content')) {
        await db.dropTable('content');
    }
    await db.createTable('content', dataToInsert);
  } catch {
    await db.createTable('content', dataToInsert, { mode: 'overwrite' });
  }
  
  console.log('Indexing complete!');
}

function chunkText(text: string, size: number): string[] {
  const chunks: string[] = [];
  const cleanText = text.replace(/!\[.*?\]\(.*?\)/g, '').replace(/\[.*?\]\(.*?\)/g, '$1');
  for (let i = 0; i < cleanText.length; i += size) {
    chunks.push(cleanText.slice(i, i + size));
  }
  return chunks;
}

main().catch(console.error);
