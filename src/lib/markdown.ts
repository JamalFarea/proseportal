import { marked, Renderer } from 'marked';

// Custom renderer: escape mermaid code blocks so they can be rendered client-side
function createRenderer(): Renderer {
  const renderer = new Renderer();
  const originalCode = renderer.code.bind(renderer);

  renderer.code = (token) => {
    const lang = (token.lang || '').match(/^\S*/)?.[0].toLowerCase();
    if (lang !== 'mermaid') {
      return originalCode(token);
    }
    // Escape the raw diagram source so DOMPurify won't strip it
    const escaped = token.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return `<pre class="mermaid">${escaped}</pre>\n`;
  };

  return renderer;
}

const renderer = createRenderer();

export async function parseMarkdown(content: string): Promise<string> {
  const html = await marked.parse(content, {
    renderer,
    // headerIds / mangle removed – deprecated in marked v15
  });

  // Sanitize in browser env only (DOMPurify requires window/DOM)
  if (typeof window !== 'undefined') {
    const DOMPurify = (await import('dompurify')).default;
    return DOMPurify.sanitize(html);
  }
  return html;
}

export function isRTL(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
}
