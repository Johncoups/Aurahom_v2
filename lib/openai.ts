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
    houseSize?: string;
    foundationType?: string;
    numberOfStories?: string;
    targetStartDate?: string;
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
    ? constructionPhases.slice(currentPhaseIndex)
    : [];
  
  // Get the current phase ID to determine if we need a specialized prompt
  const currentPhase = constructionPhases.find(p => p.id === userProfile.currentPhase);
  const isDIYPhase = userProfile.diyPhases.includes(userProfile.currentPhase);
  
  // Use specialized expert prompt for DIY phases, general expert prompt for others
  const expertPrompt = isDIYPhase ? getPhaseExpertPrompt(userProfile.currentPhase) : 
    `You are a MASTER residential construction expert with 30+ years of experience in residential construction.`;
  
  // Get Richmond City, VA specific building code requirements
  const buildingCodeRequirements = getBuildingCodeRequirements(userProfile.currentPhase);
  const inspectionRequirements = getInspectionRequirements(userProfile.currentPhase);
  
  // Timeline estimates are now handled separately by the context
  // No need to call timeline API here
  
  const prompt = `
${expertPrompt}

You are standing right next to the user, providing HIGH-LEVEL project planning guidance that helps users understand what they need to plan for, research, and prepare.

Based on the user's profile and current phase, provide COMPREHENSIVE, TRADE-SPECIFIC guidance for their construction project.

**PROJECT CONTEXT FOR ESTIMATING:**
- Construction Method: ${userProfile.constructionMethod === "traditional-frame" ? "Traditional Wood Frame" :
    userProfile.constructionMethod === "post-frame" ? "Post Frame/Pole Barn" :
    userProfile.constructionMethod === "icf" ? "ICF (Insulated Concrete Forms)" :
    userProfile.constructionMethod === "sip" ? "SIP (Structural Insulated Panels)" :
    userProfile.constructionMethod === "modular" ? "Modular/Prefab" :
    userProfile.constructionMethod === "other" ? "Other Construction Method" :
    "Not specified"}
- Foundation Type: ${userProfile.foundationType === "slab-on-grade" ? "Slab on Grade" :
    userProfile.foundationType === "crawlspace" ? "Crawlspace" :
    userProfile.foundationType === "full-basement" ? "Full Basement" :
    userProfile.foundationType === "partial-basement" ? "Partial Basement" :
    userProfile.foundationType === "pier-and-beam" ? "Pier and Beam" :
    userProfile.foundationType === "other" ? "Other Foundation Type" :
    "Not specified"}
- House Size: ${userProfile.houseSize || "Not specified"}
- Number of Stories: ${userProfile.numberOfStories === "1-story" ? "1 Story" :
    userProfile.numberOfStories === "1.5-story" ? "1.5 Story (Split Level)" :
    userProfile.numberOfStories === "2-story" ? "2 Story" :
    userProfile.numberOfStories === "2.5-story" ? "2.5 Story" :
    userProfile.numberOfStories === "3-story" ? "3 Story" :
    userProfile.numberOfStories === "other" ? "Other" :
    "Not specified"}
- Target Start Date: ${userProfile.targetStartDate ? new Date(userProfile.targetStartDate).toLocaleDateString() : "Not specified"}

User Profile:
- Role: ${userProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
         userProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
         "Owner-builder acting as General Contractor (will self-perform some phases)"}
- Experience Level: ${userProfile.experience === "gc_experienced" ? "General contractor" :
    userProfile.experience === "house_builder" ? "Person who has built a house before" :
    userProfile.experience === "trades_familiar" ? "Person in the trades familiar with building process" :
    userProfile.experience === "diy_permitting" ? "DIY enthusiast who has tackled large projects requiring permitting" :
    userProfile.experience === "diy_maintenance" ? "DIY enthusiast who does maintenance tasks but never needed permits" :
    "Complete novice with tools and building"}
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
${remainingPhases.map(p => `${p.order}. ${p.title}`).join('\n')}

**INDIVIDUAL PHASE TIMELINE ESTIMATES:**
${remainingPhases.map(p => `${p.order}. ${p.title}: Timeline estimates will be provided separately`).join('\n')}

**OVERALL PROJECT TIMELINE ESTIMATE:**
Provide a HIGH-LEVEL estimate of the total project duration from current phase to completion, considering:
- Total estimated time for all remaining phases
- Critical path and dependencies between phases
- Seasonal considerations and weather impacts
- Buffer time for unexpected delays

For EACH phase, provide HIGH-LEVEL project planning guidance including:

1. **PHASE OVERVIEW:**
   - What this phase accomplishes and why it's important
   - Key decisions that need to be made
   - What to consider before starting

2. **PLANNING CONSIDERATIONS:**
   - What to research and learn about
   - Key questions to ask professionals
   - Important factors to consider for your specific project

3. **SAFETY & CODE COMPLIANCE:**
   - High-level safety considerations
   - Specific building code requirements for ${userProfile.cityState}
   - Inspection checkpoints and requirements
   - Common code violations to avoid

4. **QUALITY STANDARDS:**
   - What quality looks like for this phase
   - Key things to watch out for
   - When to call in professionals

5. **TIMELINE & LOGISTICS:**
   - **Total time estimate for the entire phase** (REQUIRED for ALL phases)
   - Critical path dependencies
   - Weather and seasonal considerations
   - Seasonal timing recommendations

6. **PROFESSIONAL GUIDANCE:**
   - When to hire professionals vs. DIY
   - What to look for when hiring
   - Questions to ask contractors

7. **NEXT PHASE PREPARATION:**
   - What to prepare for the following phase

**IMPORTANT**: Since this is a DIY phase, provide HIGH-LEVEL project planning guidance that helps users understand what they need to plan for, research, and prepare. Focus on planning considerations and quality control tasks, but avoid detailed step-by-step execution procedures.

Format your response as a COMPREHENSIVE PROJECT PLANNING GUIDE that helps users understand what they need to plan for each phase. Focus on high-level planning, not detailed execution steps.

Structure your response as:
1. **OVERALL PROJECT TIMELINE** - High-level estimate from current phase to completion
2. **INDIVIDUAL PHASE TIMELINES** - Use the provided timeline estimates for each phase
3. **Phase Overview** - What this phase accomplishes and key considerations
4. **Planning Checklist** - What to research, decide, and prepare
5. **Quality & Safety** - Standards to understand and requirements to meet
6. **Timeline & Logistics** - **Total time estimate (REQUIRED for every phase)**, weather considerations, and seasonal timing
7. **Professional Guidance** - When to hire vs. DIY and what to look for
8. **Next Phase Preparation** - What to prepare for the following phase

**CRITICAL**: Every single phase must include a total time estimate. For contractor phases, provide total time estimate in weeks/months.

**IMPORTANT**: Timeline estimates for each phase will be provided separately based on your specific project details including construction method, foundation type, house size, number of stories, and target start date.
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

**PROJECT CONTEXT FOR ESTIMATING:**
- Construction Method: ${userProfile.constructionMethod === "traditional-frame" ? "Traditional Wood Frame" :
    userProfile.constructionMethod === "post-frame" ? "Post Frame/Pole Barn" :
    userProfile.constructionMethod === "icf" ? "ICF (Insulated Concrete Forms)" :
    userProfile.constructionMethod === "sip" ? "SIP (Structural Insulated Panels)" :
    userProfile.constructionMethod === "modular" ? "Modular/Prefab" :
    userProfile.constructionMethod === "other" ? "Other Construction Method" :
    "Not specified"}
- Foundation Type: ${userProfile.foundationType === "slab-on-grade" ? "Slab on Grade" :
    userProfile.foundationType === "crawlspace" ? "Crawlspace" :
    userProfile.foundationType === "full-basement" ? "Full Basement" :
    userProfile.foundationType === "partial-basement" ? "Partial Basement" :
    userProfile.foundationType === "pier-and-beam" ? "Pier and Beam" :
    userProfile.foundationType === "other" ? "Other Foundation Type" :
    "Not specified"}
- House Size: ${userProfile.houseSize || "Not specified"}
- Number of Stories: ${userProfile.numberOfStories === "1-story" ? "1 Story" :
    userProfile.numberOfStories === "1.5-story" ? "1.5 Story (Split Level)" :
    userProfile.numberOfStories === "2-story" ? "2 Story" :
    userProfile.numberOfStories === "2.5-story" ? "2.5 Story" :
    userProfile.numberOfStories === "3-story" ? "3 Story" :
    userProfile.numberOfStories === "other" ? "Other" :
    "Not specified"}
- Target Start Date: ${userProfile.targetStartDate ? new Date(userProfile.targetStartDate).toLocaleDateString() : "Not specified"}

## USER PROFILE
- Role: ${userProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
         userProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
         "Owner-builder acting as General Contractor (will self-perform some phases)"}
- Experience Level: ${userProfile.experience}
- Weekly Time Commitment: ${userProfile.weeklyHourlyCommitment} hours
- Location: ${userProfile.cityState}
- Property Address: ${userProfile.propertyAddress || "Not specified"}
- Additional Background: ${userProfile.background || "None provided"}

## PHASE DETAILS
**${phaseId}**
- This is a DIY phase the user will self-perform
- User has ${userProfile.experience} experience level

## RICHMOND CITY, VA BUILDING CODE REQUIREMENTS FOR THIS PHASE:
${buildingCodeRequirements}

## INSPECTION REQUIREMENTS:
${inspectionRequirements}

## PROJECT PLANNING REQUIREMENTS

**OVERALL PROJECT TIMELINE CONTEXT:**
Provide a HIGH-LEVEL estimate of the total project duration from this phase to completion, considering:
- Total estimated time for all remaining phases after this one
- Critical path and dependencies between phases
- Seasonal considerations and weather impacts
- Buffer time for unexpected delays

Provide HIGH-LEVEL project planning guidance for this specific phase including:

### 1. PHASE OVERVIEW
- What this phase accomplishes and why it's important
- Key decisions that need to be made
- What to consider before starting

### 2. PLANNING CONSIDERATIONS
- What to research and learn about
- Key questions to ask professionals
- Important factors to consider for your specific project

### 3. SAFETY & CODE COMPLIANCE
- High-level safety considerations
- Richmond City, VA specific requirements
- Inspection checkpoints and documentation needed

### 4. QUALITY STANDARDS
- What quality looks like for this phase
- Key things to watch out for
- When to call in professionals

### 5. TIMELINE & LOGISTICS
- **Total time estimate for the entire phase** (REQUIRED for ALL phases)
- **For DIY phases**: Convert hours to weeks based on user's weekly commitment
- Critical path dependencies
- **Weather and seasonal considerations** (how Richmond weather affects this phase)
- **Seasonal timing recommendations** (best/worst times to start this phase)

### 6. PROFESSIONAL GUIDANCE
- When to hire professionals vs. DIY
- What to look for when hiring
- Questions to ask contractors

## IMPORTANT NOTES

**IMPORTANT**: Since this is a DIY phase, provide HIGH-LEVEL project planning guidance that helps users understand what they need to plan for, research, and prepare. Focus on planning considerations and quality control tasks, but avoid detailed step-by-step execution procedures.

**Richmond City, VA Specific Requirements:**
- All work must comply with IRC 2021 with local amendments
- Permits required for structural work
- Inspections required at specified checkpoints
- Local building department: Richmond City Building Department

## OUTPUT FORMAT

Format your response as a COMPREHENSIVE PROJECT PLANNING GUIDE that helps users understand what they need to plan for each phase. Focus on high-level planning, not detailed execution steps.

Structure your response as:
1. **OVERALL PROJECT TIMELINE** - High-level estimate from this phase to completion
2. **Phase Overview** - What this phase accomplishes and key considerations
3. **Planning Checklist** - What to research, decide, and prepare
4. **Quality & Safety** - Standards to understand and requirements to meet
5. **Timeline & Logistics** - **Total time estimate (REQUIRED for every phase)**, weather considerations, and seasonal timing
6. **Professional Guidance** - When to hire vs. DIY and what to look for
7. **Next Phase Preparation** - What to prepare for the following phase

**CRITICAL**: Every single phase must include a total time estimate. For DIY phases, show both hours AND weeks based on the user's weekly commitment.

Each phase should include:
- High-level understanding of what's involved
- Key decisions that need to be made
- What to research and learn about
- **Total time estimate (REQUIRED)** - For DIY phases: show both hours AND weeks
- Timeline expectations with weather considerations
- When to call in professionals
- Richmond City, VA specific requirements
- Seasonal timing recommendations
`;

  try {
    console.log(`Generating detailed roadmap for DIY phase: ${phaseId}`);
    const startTime = Date.now();
    
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a MASTER residential construction expert with 30+ years of experience. Provide HIGH-LEVEL project planning guidance that helps users understand what they need to plan for, research, and prepare."
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
