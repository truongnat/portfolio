/**
 * Generic JSON error responses for API routes (SEC-03).
 * Log details server-side; never echo Error.message to clients.
 */

export const SEARCH_UNAVAILABLE_BODY = {
  error: 'Search is temporarily unavailable',
} as const;

export function logApiError(context: string, error: unknown): void {
  console.error(`${context}`, error);
}

export function jsonErrorResponse(
  status: number,
  body: Record<string, unknown>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
