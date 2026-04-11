import * as lancedb from '@lancedb/lancedb';
import {
  jsonErrorResponse,
  logApiError,
  SEARCH_UNAVAILABLE_BODY,
} from '@/lib/api-error-response';
import { pipeline } from '@xenova/transformers';
import path from 'path';

export const prerender = false;

const DB_PATH = path.resolve(process.cwd(), 'data/lancedb');
let embedder: any = null;
let db: any = null;

async function initAI() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  if (!db) {
    db = await lancedb.connect(DB_PATH);
  }
  return { embedder, db };
}

export async function GET({ url }: { url: URL }) {
  const query = url.searchParams.get('q');
  if (!query) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  try {
    const { embedder, db } = await initAI();
    
    // 1. Generate embedding for the query
    const output = await embedder(query, { pooling: 'mean', normalize: true });
    const vector = Array.from(output.data);

    // 2. Search LanceDB
    const table = await db.openTable('content');
    const results = await table.vectorSearch(vector).limit(8).toArray() as any[];
    
    // 3. Deduplicate by title/ref_id and map to expected format
    const uniqueResults = new Map();
    results.forEach(r => {
        if (!uniqueResults.has(r.ref_id)) {
            uniqueResults.set(r.ref_id, {
                id: r.ref_id,
                title: r.title,
                type: r.type,
                excerpt: r.text.substring(0, 150) + '...',
                score: r._distance // Lower is better in vector search usually
            });
        }
    });

    return new Response(JSON.stringify(Array.from(uniqueResults.values())), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    logApiError('[Search API]', error);
    return jsonErrorResponse(500, { ...SEARCH_UNAVAILABLE_BODY });
  }
}
