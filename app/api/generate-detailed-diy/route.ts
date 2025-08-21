import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPhaseExpertPrompt } from '@/lib/phase-specific-prompts';
import { getBuildingCodeRequirements, getInspectionRequirements } from '@/lib/building-codes-richmond-va';
import { getEnhancedTaskBreakdown } from '@/lib/enhanced-task-breakdown';
import type { OnboardingProfile, RoadmapPhase } from '@/lib/roadmap-types';

// Initialize OpenAI client (server-side only)
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  
  return new OpenAI({
    apiKey,
  });
}

// Generate detailed roadmap for a single DIY phase
async function generateDetailedDIYPhaseRoadmap(
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

You are standing right next to the user, providing HIGH-LEVEL project planning guidance for ${phaseId} that helps users understand what they need to plan for, research, and prepare.

## USER PROFILE
- Role: ${userProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
         userProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
         "Owner-builder acting as General Contractor (will self-perform some phases)"}
- Experience Level: ${userProfile.experience}
- Construction Method: ${userProfile.constructionMethod}
- House Size: ${userProfile.houseSize}
- Foundation Type: ${userProfile.foundationType}
- Number of Stories: ${userProfile.numberOfStories}
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

## PROJECT PLANNING REQUIREMENTS

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
1. **Phase Overview** - What this phase accomplishes and key considerations
2. **Planning Checklist** - What to research, decide, and prepare
3. **Quality & Safety** - Standards to understand and requirements to meet
4. **Timeline & Logistics** - **Total time estimate (REQUIRED for every phase)** and what to prepare for next
5. **Professional Guidance** - When to hire vs. DIY and what to look for
6. **Next Phase Preparation** - What to prepare for the following phase

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
       max_tokens: 4000, // Reduced for faster responses
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
            notes: response, // Show the FULL AI response, not truncated
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
async function generateDetailedDIYPhasesRoadmap(
  userProfile: OnboardingProfile
): Promise<RoadmapPhase[]> {
  console.log(`Generating detailed roadmaps for ${userProfile.diyPhaseIds.length} DIY phases`);
  
  // Generate all phases in parallel instead of sequentially
  const phasePromises = userProfile.diyPhaseIds.map(async (phaseId) => {
    try {
      return await generateDetailedDIYPhaseRoadmap(userProfile, phaseId);
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
      
      return fallbackPhase;
    }
  });
  
  // Wait for all phases to complete simultaneously
  const detailedPhases = await Promise.all(phasePromises);
  
  console.log(`Generated detailed roadmaps for ${detailedPhases.length} DIY phases`);
  return detailedPhases;
}

// POST endpoint for generating detailed DIY phases
export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }
    
    console.log('Starting detailed DIY phases generation via API route');
    
    // Generate detailed roadmaps for all DIY phases
    const detailedPhases = await generateDetailedDIYPhasesRoadmap(userProfile);
    
    console.log('Detailed DIY phases generated successfully via API route');
    
    return NextResponse.json({
      success: true,
      phases: detailedPhases
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate detailed DIY phases',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
