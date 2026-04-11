import type { APIRoute } from 'astro';
import { jsonErrorResponse, logApiError } from '@/lib/api-error-response';
import { computeCertificateSignatureHex } from '@/lib/certificate-signature';
import { z } from 'zod';

/**
 * Dev-only: returns a signed `/api/certificate` path+query for local admin/testing.
 * Disabled in production builds — mint signed URLs via a trusted server path or tooling.
 */
const bodySchema = z.object({
  donatorName: z.string(),
  skillName: z.string(),
  amount: z.string(),
  date: z.string(),
  certificateId: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
  if (import.meta.env.PROD) {
    return new Response(null, { status: 404 });
  }

  const secret = import.meta.env.CERTIFICATE_SIGNING_SECRET;
  if (!secret?.trim()) {
    logApiError(
      '[certificate-issue]',
      new Error('Certificate signing secret not configured')
    );
    return jsonErrorResponse(503, { error: 'Service unavailable' });
  }

  try {
    const json = await request.json();
    const fields = bodySchema.parse(json);
    const sig = computeCertificateSignatureHex(secret, fields);
    const u = new URL('/api/certificate', request.url);
    u.searchParams.set('donatorName', fields.donatorName);
    u.searchParams.set('skillName', fields.skillName);
    u.searchParams.set('amount', fields.amount);
    u.searchParams.set('date', fields.date);
    u.searchParams.set('certificateId', fields.certificateId);
    u.searchParams.set('sig', sig);
    return new Response(JSON.stringify({ url: `${u.pathname}${u.search}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid parameters', { status: 400 });
    }
    logApiError('[certificate-issue]', error);
    return jsonErrorResponse(500, { error: 'An unexpected error occurred' });
  }
};
