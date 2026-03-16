import type { APIRoute } from 'astro';
import { terminalCommands, terminalStats } from '@/lib/terminal-takeover-data';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/terminal/commands
  if (pathname.endsWith('/commands')) {
    return new Response(
      JSON.stringify({
        success: true,
        commands: terminalCommands,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/terminal/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: terminalStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
