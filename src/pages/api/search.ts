import { jsonErrorResponse, SEARCH_UNAVAILABLE_BODY } from '@/lib/api-error-response';

export const prerender = false;

// LanceDB plus the local embedding model need a filesystem and native addons.
// That cannot run inside a Cloudflare Worker. The command palette treats a
// non-array body as "no semantic hits" and keeps the static commands.
export function GET() {
  return jsonErrorResponse(503, { ...SEARCH_UNAVAILABLE_BODY });
}
