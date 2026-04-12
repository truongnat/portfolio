import type { APIRoute } from 'astro';
import { stubUnavailableInProduction } from '@/lib/production-stub-guard';
import { z } from 'zod';

export const prerender = false;

const voteSchema = z.object({
  featureId: z.string(),
  amount: z.number().positive(),
  voterName: z.string().min(2),
  voterEmail: z.string().email().optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(['stripe', 'crypto', 'manual']),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const blocked = stubUnavailableInProduction('/api/roadmap/vote');
    if (blocked) return blocked;
    const body = await request.json();
    const validatedData = voteSchema.parse(body);

    // TODO: Save vote to database
    // TODO: Update feature funding progress
    // TODO: Send confirmation

    const vote = {
      id: `vote_${Date.now()}`,
      ...validatedData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        vote,
        message: 'Vote recorded. Complete payment to confirm.',
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

    console.error('Vote error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to record vote' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
