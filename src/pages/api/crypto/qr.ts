import type { APIRoute } from 'astro';
import { z } from 'zod';

const qrSchema = z.object({
  data: z.string(),
  size: z.string().default('256'),
});

/**
 * Generate QR code for crypto payment
 */
export const GET: APIRoute = async ({ url }) => {
  try {
    const params = Object.fromEntries(url.searchParams);
    const validatedData = qrSchema.parse(params);

    const qrSize = parseInt(validatedData.size, 10);

    // Use Google Charts API for QR code generation (simple, no dependencies)
    // In production, use a library like qrcode or qr-image
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(validatedData.data)}`;

    // Fetch the QR code image
    const response = await fetch(qrCodeUrl);
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid parameters', { status: 400 });
    }

    console.error('QR code generation error:', error);
    return new Response('Error generating QR code', { status: 500 });
  }
};
