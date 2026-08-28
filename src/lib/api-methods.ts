/** Return a consistent response for methods an endpoint does not implement. */
export function methodNotAllowed(allowedMethods: string): Response {
  return new Response(
    JSON.stringify({ success: false, error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        Allow: allowedMethods,
        'Content-Type': 'application/json',
      },
    },
  );
}
