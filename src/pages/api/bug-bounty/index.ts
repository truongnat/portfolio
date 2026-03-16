import type { APIRoute } from 'astro';
import { hallOfFameData, bugBountyStats, knownQuirks } from '@/lib/bug-bounty-data';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/bug-bounty/hall-of-fame
  if (pathname.endsWith('/hall-of-fame')) {
    return new Response(
      JSON.stringify({
        success: true,
        hallOfFame: hallOfFameData,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/bug-bounty/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: bugBountyStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/bug-bounty/quirks
  if (pathname.endsWith('/quirks')) {
    return new Response(
      JSON.stringify({
        success: true,
        quirks: knownQuirks,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
