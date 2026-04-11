import type { APIRoute } from 'astro';
import { timingSafeEqual } from 'node:crypto';
import { generateCertificatePng } from '@/lib/certificate-generator';
import {
  computeCertificateSignatureHex,
  type CertificateSignFields,
} from '@/lib/certificate-signature';
import { z } from 'zod';

/**
 * GET /api/certificate — PNG certificate image
 *
 * Requires query param `sig` = hex HMAC-SHA256 over the canonical five fields (see
 * `buildCertificateCanonicalMessage` in `@/lib/certificate-signature`) using
 * CERTIFICATE_SIGNING_SECRET. Produce `sig` only server-side (e.g. after verified payment,
 * internal tooling, or dev-only POST /api/certificate-issue).
 *
 * Environment: CERTIFICATE_SIGNING_SECRET (required for issuance)
 */

const querySchema = z.object({
  donatorName: z.string(),
  skillName: z.string(),
  amount: z.string(),
  date: z.string(),
  certificateId: z.string(),
  sig: z.string().min(1),
});

function hexToBuffer(hex: string): Buffer | null {
  if (hex.length % 2 !== 0) return null;
  if (!/^[0-9a-fA-F]+$/.test(hex)) return null;
  try {
    return Buffer.from(hex, 'hex');
  } catch {
    return null;
  }
}

export const GET: APIRoute = async ({ request }) => {
  const secret = import.meta.env.CERTIFICATE_SIGNING_SECRET;
  if (!secret?.trim()) {
    return new Response('Service unavailable', { status: 503 });
  }

  try {
    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams);
    const validated = querySchema.parse(params);

    const fields: CertificateSignFields = {
      donatorName: validated.donatorName,
      skillName: validated.skillName,
      amount: validated.amount,
      date: validated.date,
      certificateId: validated.certificateId,
    };

    const expectedHex = computeCertificateSignatureHex(secret, fields);
    const providedBuf = hexToBuffer(validated.sig);
    const expectedBuf = hexToBuffer(expectedHex);
    if (!providedBuf || !expectedBuf || providedBuf.length !== expectedBuf.length) {
      return new Response('Unauthorized', { status: 401 });
    }
    if (!timingSafeEqual(providedBuf, expectedBuf)) {
      return new Response('Unauthorized', { status: 401 });
    }

    const pngBuffer = await generateCertificatePng({
      donatorName: fields.donatorName,
      skillName: fields.skillName,
      amount: Number(fields.amount),
      date: fields.date,
      certificateId: fields.certificateId,
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
