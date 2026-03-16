import type { APIRoute } from 'astro';
import { currentSessions, completedSessions, topSponsors, learningStats, recentJournal } from '@/lib/learning-journey-data';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/learning-journey/sessions
  if (pathname.endsWith('/sessions')) {
    return new Response(
      JSON.stringify({
        success: true,
        current: currentSessions,
        completed: completedSessions,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/learning-journey/sponsors
  if (pathname.endsWith('/sponsors')) {
    return new Response(
      JSON.stringify({
        success: true,
        sponsors: topSponsors,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/learning-journey/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: learningStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/learning-journey/journal
  if (pathname.endsWith('/journal')) {
    return new Response(
      JSON.stringify({
        success: true,
        journal: recentJournal,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
