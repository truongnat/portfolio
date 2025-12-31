import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

/**
 * Converts markdown content to HTML using the remark/rehype pipeline.
 * 
 * Pipeline: markdown → remark → remark-gfm → remark-rehype → rehype-highlight → rehype-stringify → HTML
 * 
 * Features:
 * - GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
 * - Syntax highlighting for code blocks
 * - Graceful error handling
 * 
 * @param markdown - The markdown content to convert
 * @returns Promise resolving to HTML string
 * @throws Returns original markdown wrapped in <pre> if conversion fails
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const result = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support
      .use(remarkRehype) // Convert markdown AST to HTML AST
      .use(rehypeHighlight) // Syntax highlighting for code blocks
      .use(rehypeStringify) // Convert HTML AST to string
      .process(markdown);

    return result.toString();
  } catch (error) {
    // Graceful error handling: return markdown as plain text if conversion fails
    console.error('Error converting markdown to HTML:', error);
    return `<pre>${escapeHtml(markdown)}</pre>`;
  }
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
