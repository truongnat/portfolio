import type { APIRoute } from 'astro';
import { stubUnavailableInProduction } from '@/lib/production-stub-guard';
import { z } from 'zod';

// Disable prerendering for API routes
export const prerender = false;

const createBidSchema = z.object({
  slotId: z.string(),
  packageId: z.enum(['standard', 'premium', 'enterprise']),
  bidderName: z.string().min(2),
  bidderEmail: z.string().email(),
  bidAmount: z.number().positive(),
  repoUrl: z.string().url().optional(),
  repoDescription: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['stripe', 'crypto', 'manual']),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const blocked = stubUnavailableInProduction('/api/auction/create-bid');
    if (blocked) return blocked;
    const body = await request.json();
    const validatedData = createBidSchema.parse(body);

    const bid = {
      id: `bid_${Date.now()}`,
      ...validatedData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        bid,
        message: 'Bid placed successfully. Complete payment to secure your slot.',
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

    console.error('Create bid error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to place bid' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
