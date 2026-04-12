import type { APIRoute } from 'astro';
import { jsonErrorResponse } from '@/lib/api-error-response';
import { z } from 'zod';

const createPaymentSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  amount: z.number().positive(),
  currency: z.string().default('usd'),
  donatorName: z.string().min(1),
  donatorEmail: z.string().email(),
  isAnonymous: z.boolean().default(false),
});

/**
 * Create Stripe Payment Intent
 * 
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Stripe secret key
 * - STRIPE_WEBHOOK_SECRET: For webhook verification
 * - PUBLIC_STRIPE_PUBLISHABLE_KEY: Client-side key
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validatedData = createPaymentSchema.parse(body);

    // Check if Stripe is configured
    const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      if (import.meta.env.PROD) {
        return jsonErrorResponse(503, {
          success: false,
          error: 'This feature is not enabled in production.',
        });
      }
      // Mock payment intent for local development only
      return new Response(
        JSON.stringify({
          success: true,
          mode: 'mock',
          paymentIntent: {
            id: 'pi_mock_' + Date.now(),
            client_secret: 'mock_secret_' + Date.now(),
            amount: validatedData.amount * 100, // Convert to cents
            currency: validatedData.currency,
          },
          message: 'Stripe not configured. Running in mock mode.',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Stripe (using fetch API for Stripe)
    const stripeApiUrl = 'https://api.stripe.com/v1/payment_intents';
    
    const response = await fetch(stripeApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: String(Math.round(validatedData.amount * 100)), // Convert to cents
        currency: validatedData.currency,
        description: `Skill Tree Donation - ${validatedData.skillName}`,
        metadata: JSON.stringify({
          skillId: validatedData.skillId,
          skillName: validatedData.skillName,
          donatorName: validatedData.donatorName,
          donatorEmail: validatedData.donatorEmail,
          isAnonymous: String(validatedData.isAnonymous),
          type: 'skill_tree_donation',
        }),
        receipt_email: validatedData.donatorEmail,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment intent');
    }

    const paymentIntent = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        mode: 'live',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Stripe payment error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: 'Please check your payment details' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'An unexpected error occurred during payment processing'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
