import { marked } from 'marked';

export async function parseMarkdown(content: string): Promise<string> {
  // marked is sync by default but can be async with extensions
  return marked.parse(content);
}

export function isRTL(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text);
}
