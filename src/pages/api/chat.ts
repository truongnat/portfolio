import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getCollection } from 'astro:content';

export const prerender = false;

export async function POST({ request }: { request: Request }) {
  const { messages } = await request.json();

  // Fetch all content for RAG (Simple version for small site)
  const blogPosts = await getCollection('blog');
  const journalPosts = await getCollection('journal');
  
  const contentContext = [
    ...blogPosts.map(p => `Blog [${p.data.title}]: ${p.body.substring(0, 1000)}`),
    ...journalPosts.map(p => `Journal [${p.data.title}]: ${p.body.substring(0, 1000)}`)
  ].join('\n\n');

  const systemPrompt = `
    You are an AI Assistant for Dao Quang Truong's Portfolio. 
    You answer questions based on the provided content from his blog and engineering logs.
    If the answer is not in the context, say you don't know and offer to connect with Truong.
    Be professional, concise, and technical. Use JetBrains Mono font aesthetic in your tone.
    
    Context:
    ${contentContext}
  `;

  const result = streamText({
    model: google('gemini-1.5-pro'),
    messages,
    system: systemPrompt,
  });

  return result.toDataStreamResponse();
}
