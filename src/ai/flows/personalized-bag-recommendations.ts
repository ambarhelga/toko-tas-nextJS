// A personalized bag recommendation AI agent.
//
// - personalizedBagRecommendations - A function that handles the personalized bag recommendation process.
// - PersonalizedBagRecommendationsInput - The input type for the personalizedBagRecommendations function.
// - PersonalizedBagRecommendationsOutput - The return type for the personalizedBagRecommendations function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedBagRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history, including viewed bags, categories, and brands.'),
  preferences: z.string().describe('The user preferences, such as style, color, and price range.'),
});
export type PersonalizedBagRecommendationsInput = z.infer<typeof PersonalizedBagRecommendationsInputSchema>;

const PersonalizedBagRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('A list of bag recommendations based on the user browsing history and preferences.'),
});
export type PersonalizedBagRecommendationsOutput = z.infer<typeof PersonalizedBagRecommendationsOutputSchema>;

export async function personalizedBagRecommendations(input: PersonalizedBagRecommendationsInput): Promise<PersonalizedBagRecommendationsOutput> {
  return personalizedBagRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedBagRecommendationsPrompt',
  input: {schema: PersonalizedBagRecommendationsInputSchema},
  output: {schema: PersonalizedBagRecommendationsOutputSchema},
  prompt: `You are a personal shopping assistant specializing in bag recommendations.

  Based on the user's browsing history and preferences, recommend bags that the user is likely to be interested in.

  Browsing History: {{{browsingHistory}}}
  Preferences: {{{preferences}}}

  Recommendations:`,
});

const personalizedBagRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedBagRecommendationsFlow',
    inputSchema: PersonalizedBagRecommendationsInputSchema,
    outputSchema: PersonalizedBagRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
