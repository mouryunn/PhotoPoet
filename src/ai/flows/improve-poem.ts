// src/ai/flows/improve-poem.ts
'use server';

/**
 * @fileOverview A flow for refining generated poems using GenAI to adjust the tone, style, or length.
 *
 * - improvePoem - A function that refines the generated poem based on user feedback.
 * - ImprovePoemInput - The input type for the improvePoem function.
 * - ImprovePoemOutput - The return type for the improvePoem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePoemInputSchema = z.object({
  poem: z.string().describe('The poem to be improved.'),
  feedback: z.string().describe('The feedback on the poem, including desired tone, style, or length adjustments.'),
});
export type ImprovePoemInput = z.infer<typeof ImprovePoemInputSchema>;

const ImprovePoemOutputSchema = z.object({
  improvedPoem: z.string().describe('The improved poem based on the user feedback.'),
});
export type ImprovePoemOutput = z.infer<typeof ImprovePoemOutputSchema>;

export async function improvePoem(input: ImprovePoemInput): Promise<ImprovePoemOutput> {
  return improvePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePoemPrompt',
  input: {schema: ImprovePoemInputSchema},
  output: {schema: ImprovePoemOutputSchema},
  prompt: `You are an expert poet, skilled at refining poems based on user feedback.

  Original Poem: {{{poem}}}
  Feedback: {{{feedback}}}

  Please improve the poem based on the feedback, while maintaining its original theme and essence.
  Return the improved poem.
  `, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const improvePoemFlow = ai.defineFlow(
  {
    name: 'improvePoemFlow',
    inputSchema: ImprovePoemInputSchema,
    outputSchema: ImprovePoemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
