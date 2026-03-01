// src/ai/flows/generate-poem.ts
'use server';
/**
 * @fileOverview Generates a unique poem inspired by a user-uploaded photo.
 *
 * - generatePoem - A function that handles the poem generation process.
 * - GeneratePoemInput - The input type for the generatePoem function.
 * - GeneratePoemOutput - The return type for the generatePoem function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePoemInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the generated poem.'),
  mood: z.string().describe('The desired mood for the poem.'),
});
export type GeneratePoemInput = z.infer<typeof GeneratePoemInputSchema>;

const GeneratePoemOutputSchema = z.object({
  poem: z.string().describe('A unique poem inspired by the photo.'),
});
export type GeneratePoemOutput = z.infer<typeof GeneratePoemOutputSchema>;

export async function generatePoem(input: GeneratePoemInput): Promise<GeneratePoemOutput> {
  return generatePoemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePoemPrompt',
  input: { schema: GeneratePoemInputSchema },
  output: { schema: GeneratePoemOutputSchema },
  prompt: `You are a poet laureate, skilled at creating evocative and meaningful poems based on visual inspiration.

  Please analyze the image provided and write a poem in {{{language}}} that captures its essence, emotions, and key elements. The poem should be unique, insightful, and artistically crafted to reflect a {{{mood}}} mood.

  Image: {{media url=photoDataUri}}`,
});

const generatePoemFlow = ai.defineFlow(
  {
    name: 'generatePoemFlow',
    inputSchema: GeneratePoemInputSchema,
    outputSchema: GeneratePoemOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
