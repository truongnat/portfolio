import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const executeCommandSchema = z.object({
  command: z.string(),
  args: z.array(z.string()).optional(),
  sessionId: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    executeCommandSchema.parse(body);

    // TODO: Execute command and return output
    // For now, return mock response
    
    return new Response(
      JSON.stringify({
        success: true,
        output: 'Command executed',
        duration: 12, // ms
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Command execution failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
