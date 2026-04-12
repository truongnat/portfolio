import type { APIRoute } from 'astro';
import { stubUnavailableInProduction } from '@/lib/production-stub-guard';
import { z } from 'zod';

const donationSchema = z.object({
  skillId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  donatorName: z.string().min(1),
  donatorEmail: z.string().email().optional(),
  paymentMethod: z.enum(['stripe', 'crypto', 'paypal', 'manual']),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const blocked = stubUnavailableInProduction('/api/donations');
    if (blocked) return blocked;
    const body = await request.json();
    const validatedData = donationSchema.parse(body);

    // TODO: Integrate with actual payment gateway
    // For now, we'll create a mock donation record
    
    const donation = {
      id: crypto.randomUUID(),
      ...validatedData,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactionId: null,
      badgeEarned: null,
    };

    // TODO: Save to database
    // await db.insert('donations').values(donation);

    // TODO: Trigger payment processing
    // - Stripe: Create payment intent
    // - Crypto: Generate wallet address/QR code
    // - PayPal: Create order

    return new Response(
      JSON.stringify({
        success: true,
        donation,
        message: 'Donation created. Redirecting to payment...',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.error('Donation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
