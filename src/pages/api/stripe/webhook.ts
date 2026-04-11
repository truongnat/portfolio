import type { APIRoute } from 'astro';
import Stripe from 'stripe';

/**
 * Stripe Webhook Handler
 *
 * Verifies `Stripe-Signature` with `stripe.webhooks.constructEvent` before handling events.
 *
 * Environment:
 * - STRIPE_WEBHOOK_SECRET — Dashboard → Developers → Webhooks → endpoint → Signing secret
 * - STRIPE_SECRET_KEY — Required to construct the Stripe client used for `webhooks.constructEvent`
 *
 * Missing webhook secret → 400 (Webhook not configured).
 * Webhook secret set but API key missing → 503 (server misconfiguration).
 */
export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecretKey = import.meta.env.STRIPE_SECRET_KEY;

  if (!webhookSecret?.trim()) {
    return new Response('Webhook not configured', { status: 400 });
  }

  if (!stripeSecretKey?.trim()) {
    return new Response('Stripe API key not configured', { status: 503 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: Stripe.API_VERSION,
  });

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      console.error('Stripe webhook signature verification failed');
      return new Response('Invalid signature', { status: 400 });
    }
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const metadata = paymentIntent.metadata;

    console.log('Payment succeeded:', {
      skillId: metadata.skillId,
      amount: paymentIntent.amount / 100,
      donator: metadata.donatorName,
    });

    // TODO: Update database
    // 1. Mark donation as completed
    // 2. Update skill totalDonated and progress
    // 3. Check if skill is fully funded
    // 4. Generate certificate
    // 5. Check badge eligibility
    // 6. Send confirmation email
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
