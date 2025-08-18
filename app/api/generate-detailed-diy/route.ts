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

You are standing right next to the user, providing EXTREMELY DETAILED, step-by-step guidance for ${phaseId} that leaves no room for questions.

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
- Total time estimate for the entire phase
- Detailed time estimates for each task
- Critical path dependencies
- Weather and seasonal considerations

### 7. TRADE-SPECIFIC DETAILS
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
5. **Timeline Breakdown** - Total time estimate and task-by-task timing
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
      max_tokens: 8000, // Increased for more detailed responses
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
