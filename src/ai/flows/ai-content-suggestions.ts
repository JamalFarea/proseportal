'use server';
/**
 * @fileOverview An AI agent that suggests titles and summaries for Markdown content.
 *
 * - aiContentSuggestions - A function that handles the AI content suggestions process.
 * - AiContentSuggestionsInput - The input type for the aiContentSuggestions function.
 * - AiContentSuggestionsOutput - The return type for the aiContentSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiContentSuggestionsInputSchema = z.object({
  markdownContent: z
    .string()
    .describe('The Markdown content for which to suggest a title and summary.'),
});
export type AiContentSuggestionsInput = z.infer<
  typeof AiContentSuggestionsInputSchema
>;

const AiContentSuggestionsOutputSchema = z.object({
  title: z.string().describe('A suggested title for the Markdown document.'),
  summary: z.string().describe('A concise summary of the Markdown document.'),
});
export type AiContentSuggestionsOutput = z.infer<
  typeof AiContentSuggestionsOutputSchema
>;

export async function aiContentSuggestions(
  input: AiContentSuggestionsInput
): Promise<AiContentSuggestionsOutput> {
  return aiContentSuggestionsFlow(input);
}

const aiContentSuggestionsPrompt = ai.definePrompt({
  name: 'aiContentSuggestionsPrompt',
  input: {schema: AiContentSuggestionsInputSchema},
  output: {schema: AiContentSuggestionsOutputSchema},
  prompt: `You are an expert content analyzer. Based on the provided Markdown content, generate a concise and descriptive title and a brief summary.

Markdown Content:
---
{{{markdownContent}}}
---

Respond with a JSON object containing a 'title' and a 'summary' field.`,
});

const aiContentSuggestionsFlow = ai.defineFlow(
  {
    name: 'aiContentSuggestionsFlow',
    inputSchema: AiContentSuggestionsInputSchema,
    outputSchema: AiContentSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await aiContentSuggestionsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate title and summary.');
    }
    return output;
  }
);
