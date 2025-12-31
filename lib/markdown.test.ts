import { describe, it, expect } from 'vitest';
import { markdownToHtml } from './markdown';

describe('markdownToHtml', () => {
  it('should convert basic markdown to HTML', async () => {
    const markdown = '# Hello World\n\nThis is a paragraph.';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<h1>Hello World</h1>');
    expect(html).toContain('<p>This is a paragraph.</p>');
  });

  it('should support bold and italic text', async () => {
    const markdown = '**bold** and *italic*';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<em>italic</em>');
  });

  it('should support links', async () => {
    const markdown = '[Link text](https://example.com)';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<a href="https://example.com">Link text</a>');
  });

  it('should support lists', async () => {
    const markdown = '- Item 1\n- Item 2\n- Item 3';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>Item 1</li>');
    expect(html).toContain('<li>Item 2</li>');
  });

  it('should support GitHub Flavored Markdown tables', async () => {
    const markdown = `| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`;
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<table>');
    expect(html).toContain('<thead>');
    expect(html).toContain('<th>Header 1</th>');
    expect(html).toContain('<td>Cell 1</td>');
  });

  it('should support strikethrough', async () => {
    const markdown = '~~strikethrough~~';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<del>strikethrough</del>');
  });

  it('should support task lists', async () => {
    const markdown = '- [ ] Unchecked\n- [x] Checked';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('checked=""');
  });

  it('should support code blocks with syntax highlighting', async () => {
    const markdown = '```javascript\nconst x = 42;\n```';
    const html = await markdownToHtml(markdown);
    
    expect(html).toContain('<code');
    expect(html).toContain('const x = 42;');
  });

  it('should handle empty markdown', async () => {
    const markdown = '';
    const html = await markdownToHtml(markdown);
    
    expect(html).toBe('');
  });

  it('should handle markdown with only whitespace', async () => {
    const markdown = '   \n\n   ';
    const html = await markdownToHtml(markdown);
    
    // Should return empty or minimal HTML
    expect(html.trim()).toBe('');
  });
});
