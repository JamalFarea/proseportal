'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {EnhanceType, EnhanceTypeEnum} from './ai-enhance-types';

const AiEnhanceContentInputSchema = z.object({
  content: z.string().describe('The markdown content to enhance.'),
  enhanceType: EnhanceTypeEnum.describe('The type of enhancement to apply.'),
});

const AiEnhanceContentOutputSchema = z.object({
  enhancedContent: z.string().describe('The enhanced markdown content.'),
  summary: z.string().describe('A brief summary of what changed.'),
});

export type AiEnhanceContentInput = z.infer<typeof AiEnhanceContentInputSchema>;
export type AiEnhanceContentOutput = z.infer<typeof AiEnhanceContentOutputSchema>;

const enhanceInstructions: Record<EnhanceType, string> = {
  'improve-writing': 'Improve the writing by fixing grammar, enhancing clarity, and improving flow while preserving the original meaning and markdown formatting.',
  'fix-grammar': 'Fix all grammar, spelling, and punctuation errors. Preserve the original meaning and markdown formatting.',
  'make-shorter': 'Condense the content to be more brief while preserving key information and markdown formatting.',
  'make-longer': 'Expand the content with more detail, examples, and depth while preserving the original structure and markdown formatting.',
  'change-tone': 'Rewrite in a professional tone. Make it sound polished, authoritative, and suitable for a business audience. Preserve markdown formatting.',
  'translate-arabic': 'Translate the following Markdown content into Arabic. Preserve all markdown formatting and structure.',
  'translate-english': 'Translate the following Markdown content into English. Preserve all markdown formatting and structure.',
};

const AiEnhanceContentPromptInputSchema = z.object({
  content: z.string(),
  enhanceInstructions: z.string(),
});

const aiEnhanceContentPrompt = ai.definePrompt({
  name: 'aiEnhanceContentPrompt',
  input: {schema: AiEnhanceContentPromptInputSchema},
  output: {schema: AiEnhanceContentOutputSchema},
  prompt: `You are an expert content editor.

{{enhanceInstructions}}

Markdown Content:
---
{{{content}}}
---

Respond with a JSON object containing:
- enhancedContent: the resulting markdown
- summary: a brief description of what changed`,
});

const aiEnhanceContentFlow = ai.defineFlow(
  {
    name: 'aiEnhanceContentFlow',
    inputSchema: AiEnhanceContentInputSchema,
    outputSchema: AiEnhanceContentOutputSchema,
  },
  async input => {
    const {output} = await aiEnhanceContentPrompt({
      content: input.content,
      enhanceInstructions: enhanceInstructions[input.enhanceType],
    });
    if (!output) {
      throw new Error('Failed to enhance content.');
    }
    return output;
  }
);

export async function aiEnhanceContent(
  input: AiEnhanceContentInput
): Promise<AiEnhanceContentOutput> {
  return aiEnhanceContentFlow(input);
}
