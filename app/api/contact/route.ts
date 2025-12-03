import { NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema matching the frontend
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid form data',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = validationResult.data;

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramBotToken || !telegramChatId) {
      console.error('Telegram credentials not configured');
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error: Telegram credentials missing',
        },
        { status: 500 }
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

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });

    const telegramResult = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', telegramResult);
      throw new Error('Failed to send message to Telegram');
    }

    return NextResponse.json({
      success: true,
      message: 'Message received successfully',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
