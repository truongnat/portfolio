import type { APIRoute } from 'astro';
import { auctionSlots, leaderboardData, auctionStats } from '@/lib/code-review-auction-data';

// Disable prerendering for API routes
export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/auction/slots
  if (pathname.endsWith('/slots')) {
    return new Response(
      JSON.stringify({
        success: true,
        slots: auctionSlots,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/auction/leaderboard
  if (pathname.endsWith('/leaderboard')) {
    return new Response(
      JSON.stringify({
        success: true,
        leaderboard: leaderboardData,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/auction/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: auctionStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
