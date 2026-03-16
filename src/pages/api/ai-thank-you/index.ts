import type { APIRoute } from 'astro';
import { fortuneCookies, sshMessages, generatedCodeExamples, asciiArtExamples, aiStats } from '@/lib/ai-thank-you-data';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const pathname = url.pathname;

  // GET /api/ai-thank-you/fortune
  if (pathname.endsWith('/fortune')) {
    return new Response(
      JSON.stringify({
        success: true,
        fortunes: fortuneCookies,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/ai-thank-you/ssh
  if (pathname.endsWith('/ssh')) {
    return new Response(
      JSON.stringify({
        success: true,
        messages: sshMessages,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/ai-thank-you/code
  if (pathname.endsWith('/code')) {
    return new Response(
      JSON.stringify({
        success: true,
        examples: generatedCodeExamples,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/ai-thank-you/ascii
  if (pathname.endsWith('/ascii')) {
    return new Response(
      JSON.stringify({
        success: true,
        art: asciiArtExamples,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // GET /api/ai-thank-you/stats
  if (pathname.endsWith('/stats')) {
    return new Response(
      JSON.stringify({
        success: true,
        stats: aiStats,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Not found', { status: 404 });
};
