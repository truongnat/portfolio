import type { APIRoute } from 'astro';
import { roadmapFeatures, roadmapStats, topBackers, milestones } from '@/lib/roadmap-voting-data';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/roadmap/features
  if (pathname.endsWith('/features')) {
    return new Response(
      JSON.stringify({
        success: true,
        features: roadmapFeatures,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/roadmap/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: roadmapStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/roadmap/backers
  if (pathname.endsWith('/backers')) {
    return new Response(
      JSON.stringify({
        success: true,
        backers: topBackers,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/roadmap/milestones
  if (pathname.endsWith('/milestones')) {
    return new Response(
      JSON.stringify({
        success: true,
        milestones: milestones,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
