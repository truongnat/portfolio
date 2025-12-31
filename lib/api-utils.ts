/**
 * API utility functions for retry logic and error handling
 * Requirements: 14.6
 */

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
}

/**
 * Fetch with exponential backoff retry logic
 * Automatically retries failed requests with increasing delays
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
  } = retryOptions;

  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Only retry on 5xx errors or network errors
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // If it's a server error and we have retries left, continue
      if (attempt < maxRetries) {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      } else {
        return response; // Return the error response on last attempt
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < maxRetries) {
        console.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
      } else {
        throw lastError; // Throw on last attempt
      }
    }

    // Wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Exponential backoff with max delay cap
    delay = Math.min(delay * backoffMultiplier, maxDelay);
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Check if response should be compressed
 */
export function shouldCompress(data: any): boolean {
  const jsonString = JSON.stringify(data);
  // Compress if response is larger than 1KB
  return jsonString.length > 1024;
}

/**
 * Get compression headers for API responses
 */
export function getCompressionHeaders(contentLength: number): HeadersInit {
  if (contentLength > 1024) {
    return {
      'Content-Encoding': 'gzip',
      'Vary': 'Accept-Encoding',
    };
  }
  return {};
}
