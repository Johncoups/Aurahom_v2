import { OpenAI } from 'openai';

// Ensure environment variables are loaded
if (typeof window === 'undefined') {
  require('dotenv').config({ path: '.env.local' });
}

// Available models
export const OPENAI_MODELS = {
  GPT4: 'gpt-4',
  GPT35: 'gpt-3.5-turbo',
  GPT4O: 'gpt-4o',
  GPT4OMINI: 'gpt-4o-mini'
} as const;

export type OpenAIModel = typeof OPENAI_MODELS[keyof typeof OPENAI_MODELS];

/**
 * Get OpenAI client instance
 */
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: process.env.NODE_ENV === 'test', // Allow in test environment
  });
}

/**
 * Generate text using OpenAI
 */
export async function generateText(
  prompt: string,
  model: OpenAIModel = OPENAI_MODELS.GPT4OMINI,
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
) {
  try {
    console.log('generateText called with model:', model);
    console.log('API key found, initializing OpenAI model...');
    console.log('Generating content with prompt length:', prompt.length);
    
    const openai = getOpenAIClient();
    console.log('OpenAI client created, making API call...');
    
    const startTime = process.hrtime.bigint();
    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2048,
    });
    
    const endTime = process.hrtime.bigint();
    const durationMs = Number(endTime - startTime) / 1_000_000;
    console.log(`API call completed in ${durationMs.toFixed(0)}ms`);

    const text = completion.choices[0]?.message?.content || '';
    console.log('Content generated successfully, length:', text.length);
    return text;
  } catch (error) {
    console.error('Error generating text with OpenAI:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is invalid or missing. Please check your .env.local file.');
      } else if (error.message.includes('quota') || error.message.includes('billing')) {
        throw new Error('OpenAI API quota exceeded or billing issue. Please check your OpenAI account.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error connecting to OpenAI API. Please check your internet connection.');
      } else {
        throw new Error(`OpenAI API error: ${error.message}`);
      }
    } else {
      throw new Error(`Failed to generate text: ${String(error)}`);
    }
  }
}

/**
 * Generate structured content (JSON) using OpenAI
 */
export async function generateStructuredContent<T>(
  prompt: string,
  schema: string,
  model: OpenAIModel = OPENAI_MODELS.GPT4OMINI
): Promise<T> {
  try {
    const structuredPrompt = `
${prompt}

Please respond with valid JSON that matches this schema:
${schema}

Ensure the response is ONLY valid JSON with no additional text or formatting.
`;

    const response = await generateText(structuredPrompt, model, { temperature: 0.1 });
    
    // Try to parse the response as JSON
    try {
      return JSON.parse(response) as T;
    } catch (parseError) {
      // If parsing fails, try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as T;
      }
      throw new Error('Failed to parse structured response as JSON');
    }
  } catch (error) {
    console.error('Error generating structured content:', error);
    throw error;
  }
}
