/**
 * Block demo/stub API routes in production (DATA-01) — no fake persistence success.
 */
import { jsonErrorResponse, logApiError } from '@/lib/api-error-response';

const STUB_UNAVAILABLE_BODY = {
  success: false,
  error: 'This feature is not enabled in production.',
} as const;

/** Returns a 503 Response in production; otherwise null. */
export function stubUnavailableInProduction(routeLabel: string): Response | null {
  if (!import.meta.env.PROD) return null;
  logApiError(`[${routeLabel}]`, new Error('stub route invoked in production'));
  return jsonErrorResponse(503, { ...STUB_UNAVAILABLE_BODY });
}
