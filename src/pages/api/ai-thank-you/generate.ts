import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const generateMessageSchema = z.object({
  donatorName: z.string().min(2),
  donationAmount: z.number().positive(),
  messageType: z.enum(['fortune', 'ssh-banner', 'code', 'ascii-art', 'poem', 'quote']),
  customInstructions: z.string().optional(),
  language: z.enum(['en', 'vi', 'both']).default('en'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData = generateMessageSchema.parse(body);

    // TODO: Integrate with AI API (Google Generative AI, OpenAI, etc.)
    // For now, return mock generated content
    
    const message = {
      id: `msg_${Date.now()}`,
      ...validatedData,
      content: 'Generated content here...',
      generationTime: 2.3, // seconds
      createdAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message,
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

    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to generate message' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
