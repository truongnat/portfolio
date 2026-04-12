import type { APIRoute } from 'astro';
import { z } from 'zod';
import { logApiError } from '@/lib/api-error-response';
import { fetchWithRetry } from '@/lib/api-utils';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid form data',
          details: 'Please check your input and try again',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { name, email, message } = validationResult.data;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      logApiError('POST /api/contact: Telegram credentials not configured', new Error('missing env'));
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Server configuration error: Telegram credentials missing',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const text = `
📩 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}

📝 *Message:*
${message}
    `;

    const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const telegramResponse = await fetchWithRetry(
      telegramUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      logApiError('POST /api/contact: Telegram API error', telegramResult);
      throw new Error('Failed to send message to Telegram');
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message received successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    logApiError('POST /api/contact', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: 'An internal server error occurred while processing your request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
