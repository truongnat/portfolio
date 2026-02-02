import { fetchWithRetry } from '@/lib/api-utils';



export const sendContactMessage = async (name: string, email: string, message: string) => {
    try {
        const { PUBLIC_TELEGRAM_BOT_TOKEN, PUBLIC_TELEGRAM_CHAT_ID } = import.meta.env;

        const telegramBotToken = PUBLIC_TELEGRAM_BOT_TOKEN;
        const telegramChatId = PUBLIC_TELEGRAM_CHAT_ID;

        if (!telegramBotToken || !telegramChatId) {
            console.error('Telegram credentials not configured');
            throw new Error('Server configuration error: Telegram credentials missing');
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
            console.error('Telegram API error:', telegramResult);
            throw new Error('Failed to send message to Telegram');
        }

        return true;
    } catch (error) {
        console.error('Contact form error:', error);
        return false;
    }
};
