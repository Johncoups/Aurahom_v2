import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Available models
export const GEMINI_MODELS = {
  PRO: 'gemini-1.5-pro',
  FLASH: 'gemini-1.5-flash',
  PRO_VISION: 'gemini-1.5-pro-vision'
} as const;

export type GeminiModel = typeof GEMINI_MODELS[keyof typeof GEMINI_MODELS];

/**
 * Generate text using Gemini AI
 */
export async function generateText(
  prompt: string,
  model: GeminiModel = GEMINI_MODELS.PRO,
  options?: {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
  }
) {
  try {
    console.log('generateText called with model:', model);
    
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
    }

    console.log('API key found, initializing Gemini model...');
    const geminiModel = genAI.getGenerativeModel({
      model,
      generationConfig: {
        temperature: options?.temperature ?? 0.7,
        topP: options?.topP ?? 0.8,
        topK: options?.topK ?? 40,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    });

    console.log('Generating content with prompt length:', prompt.length);
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Content generated successfully, length:', text.length);
    return text;
  } catch (error) {
    console.error('Error generating text with Gemini:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Gemini API key is invalid or missing. Please check your .env.local file.');
      } else if (error.message.includes('quota')) {
        throw new Error('Gemini API quota exceeded. Please check your Google AI Studio account.');
      } else if (error.message.includes('network')) {
        throw new Error('Network error connecting to Gemini API. Please check your internet connection.');
      } else {
        throw new Error(`Gemini API error: ${error.message}`);
      }
    } else {
      throw new Error(`Failed to generate text: ${String(error)}`);
    }
  }
}

/**
 * Generate structured content (JSON) using Gemini AI
 */
export async function generateStructuredContent<T>(
  prompt: string,
  schema: string,
  model: GeminiModel = GEMINI_MODELS.PRO
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

/**
 * Generate roadmap content using Gemini AI
 */
export async function generateRoadmapContent(
  userProfile: {
    role: string;
    experience: string;
    currentPhase: string;
    diyPhases: string[];
    goals?: string;
  },
  phaseDetails: string
) {
  const prompt = `
You are a construction project management expert. Based on the user's profile and current phase, provide detailed guidance for their construction project.

User Profile:
- Role: ${userProfile.role}
- Experience Level: ${userProfile.experience}
- Current Phase: ${userProfile.currentPhase}
- DIY Phases: ${userProfile.diyPhases.join(', ') || 'None'}
- Additional Goals: ${userProfile.goals || 'None specified'}

Current Phase Details:
${phaseDetails}

Please provide:
1. A detailed breakdown of the current phase with specific tasks
2. Recommended timeline for this phase
3. Key considerations based on their experience level
4. Tips for managing this phase effectively
5. Common pitfalls to avoid

Format your response in a clear, actionable manner suitable for ${userProfile.experience} level users.
`;

  return generateText(prompt, GEMINI_MODELS.PRO, { temperature: 0.3 });
}
