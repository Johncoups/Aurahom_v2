import OpenAI from 'openai';
import { getPhaseExpertPrompt } from '@/lib/phase-specific-prompts';
import { getBuildingCodeRequirements, getInspectionRequirements } from '@/lib/building-codes-richmond-va';
import { getEnhancedTaskBreakdown } from '@/lib/enhanced-task-breakdown';
import type { OnboardingProfile, RoadmapPhase } from '@/lib/roadmap-types';

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
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    console.log('API key found, initializing OpenAI model...');
    console.log('Generating content with prompt length:', prompt.length);
    
    const openai = getOpenAIClient();
    console.log('OpenAI client created, making API call...');
    
    const startTime = Date.now();
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
    
    const endTime = Date.now();
    console.log(`API call completed in ${endTime - startTime}ms`);

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

/**
 * Generate roadmap content using OpenAI
 */
export async function generateRoadmapContent(
  userProfile: {
    role: string;
    experience: string;
    constructionMethod: string;
    currentPhase: string;
    diyPhases: string[];
    weeklyHourlyCommitment: string;
    cityState: string;
    propertyAddress?: string;
    background?: string;
  },
  phaseDetails: string
) {
  // Import the phases to get accurate phase information based on construction method
  const { getPhasesForMethod } = await import('@/lib/roadmap-phases');
  
  // Get phases specific to the construction method
  const constructionPhases = getPhasesForMethod(userProfile.constructionMethod as any);
  
  // Find the current phase and get remaining phases
  const currentPhaseIndex = constructionPhases.findIndex(p => p.id === userProfile.currentPhase);
  const remainingPhases = currentPhaseIndex >= 0 
    ? constructionPhases.slice(currentPhaseIndex).map(p => `${p.order}. ${p.title}`)
    : ['Phase information not available'];
  
  // Get the current phase ID to determine if we need a specialized prompt
  const currentPhase = constructionPhases.find(p => p.id === userProfile.currentPhase);
  const isDIYPhase = userProfile.diyPhases.includes(userProfile.currentPhase);
  
  // Use specialized expert prompt for DIY phases, general expert prompt for others
  const expertPrompt = isDIYPhase ? getPhaseExpertPrompt(userProfile.currentPhase) : 
    `You are a MASTER residential construction expert with 30+ years of experience in ${userProfile.constructionMethod} construction.`;
  
  // Get Richmond City, VA specific building code requirements
  const buildingCodeRequirements = getBuildingCodeRequirements(userProfile.currentPhase);
  const inspectionRequirements = getInspectionRequirements(userProfile.currentPhase);
  
  const prompt = `
${expertPrompt}

You are standing right next to the user, providing EXTREMELY DETAILED, step-by-step guidance that leaves no room for questions.

Based on the user's profile and current phase, provide COMPREHENSIVE, TRADE-SPECIFIC guidance for their construction project.

User Profile:
- Role: ${userProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
         userProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
         "Owner-builder acting as General Contractor (will self-perform some phases)"}
- Construction Method: ${userProfile.constructionMethod === "traditional-frame" ? "Traditional Wood Frame" :
    userProfile.constructionMethod === "post-frame" ? "Post Frame/Pole Barn" :
    userProfile.constructionMethod === "icf" ? "ICF (Insulated Concrete Forms)" :
    userProfile.constructionMethod === "sip" ? "SIP (Structural Insulated Panels)" :
    userProfile.constructionMethod === "modular" ? "Modular/Prefab" :
    userProfile.constructionMethod === "other" ? "Other Construction Method" :
    "Not specified"}
- Experience Level: ${userProfile.experience === "gc_experienced" ? "General contractor" :
    userProfile.experience === "house_builder" ? "Person who has built a house before" :
    userProfile.experience === "trades_familiar" ? "Person in the trades familiar with building process" :
    userProfile.experience === "diy_permitting" ? "DIY enthusiast who has tackled large projects requiring permitting" :
    userProfile.experience === "diy_maintenance" ? "DIY enthusiast who does maintenance tasks but never needed permits" :
    "Complete novice at building houses and using power tools"}
- Current Phase: ${userProfile.currentPhase}
- Weekly Time Commitment: ${userProfile.weeklyHourlyCommitment}
- Location: ${userProfile.cityState}
- Property Address: ${userProfile.propertyAddress || 'Not specified'}
- DIY Phases: ${userProfile.diyPhases.join(', ') || 'None'}
- Additional Background: ${userProfile.background || 'None specified'}

Current Phase Details:
${phaseDetails}

**RICHMOND CITY, VA BUILDING CODE REQUIREMENTS FOR THIS PHASE:**
${buildingCodeRequirements}

**INSPECTION REQUIREMENTS:**
${inspectionRequirements}

Remaining Phases (in order):
${remainingPhases.join('\n')}

For EACH phase, provide EXTREMELY DETAILED guidance including:

1. **EXACT SPECIFICATIONS:**
   - Precise measurements and tolerances (e.g., "2x6 studs 16" on center, not 24")
   - Specific tool requirements (e.g., "Use 18-gauge brad nailer with 2" brads")
   - Material specifications (e.g., "5/8" Type X drywall, not 1/2")
   - Brand recommendations where critical

2. **STEP-BY-STEP BREAKDOWN:**
   - Break each task into 5-10 specific steps
   - Include exact measurements for each step
   - Specify tool settings and techniques
   - Add quality checkpoints after each step

3. **SAFETY REQUIREMENTS:**
   - Required PPE for each task
   - Safety procedures and warnings
   - Emergency procedures
   - Tool safety guidelines

4. **CODE COMPLIANCE:**
   - Specific building code requirements for ${userProfile.cityState}
   - Inspection checkpoints and requirements
   - Common code violations to avoid
   - Permit requirements and timelines

5. **QUALITY CONTROL:**
   - Inspection checklist for each phase
   - Acceptable tolerances and measurements
   - Common mistakes and how to fix them
   - Professional finish standards

6. **TIMELINE BREAKDOWN:**
   - Day-by-day or week-by-week schedule
   - Critical path items
   - Weather-dependent tasks
   - Dependencies between tasks

7. **COST ESTIMATES:**
   - Material costs with quantities
   - Tool rental costs
   - Permit fees
   - Contingency amounts

8. **TRADE-SPECIFIC DETAILS:**
   - Professional techniques and tricks
   - Industry best practices
   - Common shortcuts (safe vs. unsafe)
   - Professional finish standards

**IMPORTANT**: Since this is a DIY phase, provide EXTRA DETAILED guidance that a complete beginner could follow. Include specific measurements, tool requirements, material specifications, and step-by-step procedures that leave no room for interpretation.

Format your response as a COMPREHENSIVE, DETAILED checklist that a professional tradesperson would use. This should be detailed enough that someone could complete the work without asking a single question.
`;

  return generateText(prompt, OPENAI_MODELS.GPT4OMINI, { temperature: 0.3 });
}

// New function for generating detailed DIY phase roadmaps
export async function generateDetailedDIYPhaseRoadmap(
  userProfile: OnboardingProfile,
  phaseId: string
): Promise<RoadmapPhase> {
  const client = getOpenAIClient();
  
  // Get phase-specific expert prompt
  const expertPrompt = getPhaseExpertPrompt(phaseId);
  
  // Get building code requirements for this specific phase
  const buildingCodeRequirements = getBuildingCodeRequirements(phaseId);
  const inspectionRequirements = getInspectionRequirements(phaseId);
  
  // Get enhanced task breakdown for this phase
  const enhancedTasks = getEnhancedTaskBreakdown(phaseId);
  
  const prompt = `
${expertPrompt}

You are standing right next to the user, providing EXTREMELY DETAILED, step-by-step guidance for ${phaseId} that leaves no room for questions.

## USER PROFILE
- Role: ${userProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
         userProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
         "Owner-builder acting as General Contractor (will self-perform some phases)"}
- Experience Level: ${userProfile.experience}
- Construction Method: ${userProfile.constructionMethod}
- Weekly Time Commitment: ${userProfile.weeklyHourlyCommitment} hours
- Location: ${userProfile.cityState}
- Property Address: ${userProfile.propertyAddress || "Not specified"}
- Additional Background: ${userProfile.background || "None provided"}

## PHASE DETAILS
**${phaseId}**
- This is a DIY phase the user will self-perform
- User has ${userProfile.experience} experience level
- Construction method: ${userProfile.constructionMethod}

## RICHMOND CITY, VA BUILDING CODE REQUIREMENTS FOR THIS PHASE:
${buildingCodeRequirements}

## INSPECTION REQUIREMENTS:
${inspectionRequirements}

## ENHANCED TASK BREAKDOWN REFERENCE:
${Object.entries(enhancedTasks).map(([category, tasks]) => 
  `**${category.charAt(0).toUpperCase() + category.slice(1)} Tasks:**\n${(tasks as string[]).map(task => `- ${task}`).join('\n')}`
).join('\n\n')}

## DETAILED REQUIREMENTS

Provide EXTREMELY DETAILED guidance for this specific phase including:

### 1. EXACT SPECIFICATIONS
- Precise measurements, tolerances, and material specifications
- Exact tool requirements and sizes
- Specific material grades and standards

### 2. STEP-BY-STEP BREAKDOWN
- Detailed sequence of operations
- Critical checkpoints and quality control steps
- Safety procedures and PPE requirements

### 3. SAFETY REQUIREMENTS
- Specific safety protocols for each task
- Required safety equipment and training
- Hazard identification and mitigation

### 4. CODE COMPLIANCE
- Richmond City, VA specific requirements
- Inspection checkpoints and documentation
- Common violations to avoid

### 5. QUALITY CONTROL
- Specific quality standards and measurements
- Testing and verification procedures
- Acceptance criteria for each step

### 6. TIMELINE BREAKDOWN
- Detailed time estimates for each task
- Critical path dependencies
- Weather and seasonal considerations

### 7. COST ESTIMATES
- Material costs with current pricing
- Labor time estimates
- Equipment rental costs if applicable

### 8. TRADE-SPECIFIC DETAILS
- Professional techniques and best practices
- Common mistakes and how to avoid them
- Industry standards and expectations

## IMPORTANT NOTES

**IMPORTANT**: Since this is a DIY phase, provide EXTRA DETAILED guidance that a complete beginner could follow. Include specific measurements, tool requirements, material specifications, and step-by-step procedures that leave no room for interpretation.

**Richmond City, VA Specific Requirements:**
- All work must comply with IRC 2021 with local amendments
- Permits required for structural work
- Inspections required at specified checkpoints
- Local building department: Richmond City Building Department

## OUTPUT FORMAT

Format your response as a COMPREHENSIVE, DETAILED checklist for this specific phase. This should be detailed enough that someone could complete the work without asking a single question.

Structure your response as:
1. **Phase Overview** - Brief description and key considerations
2. **Detailed Task Breakdown** - Step-by-step procedures
3. **Quality Control** - Specific standards and checkpoints
4. **Safety & Code Compliance** - Requirements and procedures
5. **Timeline & Cost Estimates** - Realistic expectations
6. **Next Phase Preparation** - What to prepare for the following phase

Each task should include:
- Exact specifications and measurements
- Required tools and materials
- Step-by-step procedures
- Quality control checkpoints
- Safety considerations
- Code compliance requirements
`;

  try {
    console.log(`Generating detailed roadmap for DIY phase: ${phaseId}`);
    const startTime = Date.now();
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a MASTER residential construction expert with 30+ years of experience. Provide extremely detailed, step-by-step guidance that leaves no room for questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.3
    });

    const endTime = Date.now();
    console.log(`DIY phase ${phaseId} generated in ${endTime - startTime}ms`);
    
    const response = completion.choices[0]?.message?.content || "";
    
    // Create a structured phase object from the AI response
    const phase: RoadmapPhase = {
      id: phaseId,
      title: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')}`,
      detailLevel: "high",
      tasks: [
        {
          id: `${phaseId}-main-task`,
          title: `Detailed ${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')} Guide`,
          status: "todo",
          notes: response.substring(0, 200) + (response.length > 200 ? "..." : ""),
          steps: [],
          qaChecks: [],
          vendorQuestions: [],
          vendorNeeds: []
        }
      ]
    };
    
    return phase;
  } catch (error) {
    console.error(`Error generating detailed roadmap for DIY phase ${phaseId}:`, error);
    
          // Return a fallback phase
      const phase: RoadmapPhase = {
        id: phaseId,
        title: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')}`,
        detailLevel: "high",
        tasks: [
          {
            id: `${phaseId}-fallback`,
            title: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')} - AI Generation Failed`,
            status: "todo",
            notes: "AI generation failed. Using baseline data instead.",
            steps: [],
            qaChecks: [],
            vendorQuestions: [],
            vendorNeeds: []
          }
        ]
      };
    
    return phase;
  }
}

// Function to generate detailed roadmap for all DIY phases
export async function generateDetailedDIYPhasesRoadmap(
  userProfile: OnboardingProfile
): Promise<RoadmapPhase[]> {
  console.log(`Generating detailed roadmaps for ${userProfile.diyPhaseIds.length} DIY phases`);
  
  const detailedPhases: RoadmapPhase[] = [];
  
  // Generate detailed roadmap for each DIY phase
  for (const phaseId of userProfile.diyPhaseIds) {
    try {
      const detailedPhase = await generateDetailedDIYPhaseRoadmap(userProfile, phaseId);
      detailedPhases.push(detailedPhase);
      
      // Add a small delay between calls to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate detailed roadmap for phase ${phaseId}:`, error);
      
      // Add fallback phase
      const fallbackPhase: RoadmapPhase = {
        id: phaseId,
        title: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')}`,
        detailLevel: "high",
        tasks: [
          {
            id: `${phaseId}-fallback`,
            title: `${phaseId.charAt(0).toUpperCase() + phaseId.slice(1).replace(/-/g, ' ')} - Generation Failed`,
            status: "todo",
            notes: "AI generation failed for this phase. Using baseline data instead.",
            steps: [],
            qaChecks: [],
            vendorQuestions: [],
            vendorNeeds: []
          }
        ]
      };
      
      detailedPhases.push(fallbackPhase);
    }
  }
  
  console.log(`Generated detailed roadmaps for ${detailedPhases.length} DIY phases`);
  return detailedPhases;
}
