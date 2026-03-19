import type { APIRoute } from 'astro';
import { generateCertificatePng } from '@/lib/certificate-generator';
import { z } from 'zod';

const querySchema = z.object({
  donatorName: z.string(),
  skillName: z.string(),
  amount: z.string(),
  date: z.string(),
  certificateId: z.string(),
});

export const GET: APIRoute = async ({ url }) => {
  try {
    const params = Object.fromEntries(url.searchParams);
    const validatedData = querySchema.parse(params);

    const pngBuffer = await generateCertificatePng({
      donatorName: validatedData.donatorName,
      skillName: validatedData.skillName,
      amount: Number(validatedData.amount),
      date: validatedData.date,
      certificateId: validatedData.certificateId,
    });

    return new Response(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid parameters', { status: 400 });
    }

    console.error('Certificate generation error:', error);
    return new Response('Error generating certificate', { status: 500 });
  }
};
