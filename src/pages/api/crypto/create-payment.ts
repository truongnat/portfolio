import type { APIRoute } from 'astro';
import { stubUnavailableInProduction } from '@/lib/production-stub-guard';
import { z } from 'zod';

const cryptoPaymentSchema = z.object({
  skillId: z.string(),
  skillName: z.string(),
  amount: z.number().positive(),
  currency: z.enum(['BTC', 'ETH', 'USDT', 'USDC']),
  donatorName: z.string().min(1),
  donatorEmail: z.string().email(),
  isAnonymous: z.boolean().default(false),
});

/**
 * Generate crypto payment address/QR code
 * 
 * For production, integrate with:
 * - Coinbase Commerce
 * - BitPay
 * - Crypto.com Pay
 * - Or direct wallet integration
 */
export const POST: APIRoute = async ({ request }) => {
  try {
    const blocked = stubUnavailableInProduction('/api/crypto/create-payment');
    if (blocked) return blocked;
    const body = await request.json();
    const validatedData = cryptoPaymentSchema.parse(body);

    // Mock wallet addresses (replace with real integration)
    const walletAddresses: Record<string, string> = {
      BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      USDT: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // ERC-20
      USDC: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', // ERC-20
    };

    // Approximate crypto amounts (in production, use real-time rates)
    const cryptoRates: Record<string, number> = {
      BTC: 0.000023, // ~$43,000 per BTC
      ETH: 0.00045,  // ~$2,200 per ETH
      USDT: 1,       // 1:1 with USD
      USDC: 1,       // 1:1 with USD
    };

    const cryptoAmount = (validatedData.amount * cryptoRates[validatedData.currency]).toFixed(8);
    const walletAddress = walletAddresses[validatedData.currency];

    // Generate payment record
    const paymentRecord = {
      id: crypto.randomUUID(),
      type: 'crypto',
      status: 'pending',
      skillId: validatedData.skillId,
      skillName: validatedData.skillName,
      amountUsd: validatedData.amount,
      cryptoCurrency: validatedData.currency,
      cryptoAmount,
      walletAddress,
      donatorName: validatedData.donatorName,
      donatorEmail: validatedData.donatorEmail,
      isAnonymous: validatedData.isAnonymous,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour to pay
      qrCodeData: `${validatedData.currency}:${walletAddress}?amount=${cryptoAmount}`,
    };

    // TODO: Save to database
    // await db.insert('crypto_payments').values(paymentRecord);

    return new Response(
      JSON.stringify({
        success: true,
        payment: paymentRecord,
        instructions: {
          title: `Send ${cryptoAmount} ${validatedData.currency}`,
          address: walletAddress,
          amount: cryptoAmount,
          qrCodeUrl: `/api/crypto/qr?data=${encodeURIComponent(paymentRecord.qrCodeData)}`,
          expiresAt: paymentRecord.expiresAt,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Crypto payment error:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid input', details: error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Payment generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
