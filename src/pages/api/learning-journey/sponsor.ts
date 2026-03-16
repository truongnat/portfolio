import type { APIRoute } from 'astro';
import { z } from 'zod';

export const prerender = false;

const sponsorSessionSchema = z.object({
  sessionId: z.string(),
  sponsorName: z.string().min(2),
  sponsorEmail: z.string().email().optional(),
  amount: z.number().positive(),
  hours: z.number().positive(),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
  paymentMethod: z.enum(['stripe', 'crypto', 'manual']),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData = sponsorSessionSchema.parse(body);

    // TODO: Save to database
    // TODO: Update session sponsored hours
    // TODO: Send confirmation email

    const sponsorship = {
      id: `sponsor_${Date.now()}`,
      ...validatedData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        sponsorship,
        message: 'Sponsorship created. Complete payment to confirm.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: error.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Sponsorship error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to create sponsorship' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
