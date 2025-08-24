import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import type { OnboardingProfile } from '@/lib/roadmap-types';

// Initialize Supabase client for server-side operations with error handling
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseKey ? 'present' : 'missing'
    });
    throw new Error('Supabase configuration is incomplete. Please check environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Function to fetch baseline phases from database
async function getBaselinePhases(): Promise<any> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('baseline_construction_phases')
      .select('phases')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching baseline phases:', error);
      throw error;
    }
    
    // Handle the double-nested structure from the database
    // Database has: { phases: { phases: [...] } }
    // We need to extract the inner phases array
    const phasesData = data?.phases;
    if (phasesData && phasesData.phases) {
      return { phases: phasesData.phases };
    }
    
    // Fallback to direct phases if structure is different
    return data?.phases || { phases: [] };
  } catch (error) {
    console.error('Failed to fetch baseline phases:', error);
    // Return empty phases as fallback
    return { phases: [] };
  }
}

// Available models
const OPENAI_MODELS = {
  GPT4: 'gpt-4',
  GPT35: 'gpt-3.5-turbo',
  GPT4O: 'gpt-4o',
  GPT4OMINI: 'gpt-4o-mini'
} as const;

type OpenAIModel = typeof OPENAI_MODELS[keyof typeof OPENAI_MODELS];

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
 * Generate timeline estimate for a single phase using OpenAI
 */
async function generatePhaseTimeline(
  phase: { id: string; title: string },
  userProfile: OnboardingProfile,
  allPhases: { id: string; title: string }[]
): Promise<{
  phaseId: string;
  phaseTitle: string;
  timeline: string;
  rawOpenAIResponse: string;
  error?: string;
}> {
  try {
    console.log(`Generating timeline for phase: ${phase.id}`);
    
    const openai = getOpenAIClient();
    
    // Create the timeline estimation prompt
    const prompt = createTimelinePrompt(phase, userProfile, allPhases);
    
         const completion = await openai.chat.completions.create({
       model: OPENAI_MODELS.GPT4OMINI,
       messages: [
         {
           role: "user",
           content: prompt
         }
       ],
       temperature: 0.3,
       max_tokens: 200,
     });
    
    const timeline = completion.choices[0]?.message?.content || '';
    
         return {
       phaseId: phase.id,
       phaseTitle: phase.title,
       timeline: timeline.trim(),
       rawOpenAIResponse: timeline.trim()
     };
    
  } catch (error) {
    console.error(`Failed to generate timeline for phase ${phase.id}:`, error);
    
         return {
       phaseId: phase.id,
       phaseTitle: phase.title,
       timeline: `Timeline generation failed for ${phase.title}. Please consult with a construction professional for accurate estimates.`,
       rawOpenAIResponse: `Timeline generation failed for ${phase.title}. Please consult with a construction professional for accurate estimates.`,
       error: error instanceof Error ? error.message : 'Unknown error'
     };
  }
}

/**
 * Create the timeline estimation prompt for a specific phase
 */
/**
 * Create the timeline estimation prompt for a specific phase with regional considerations
 */
function createTimelinePrompt(phase: { id: string; title: string }, userProfile: OnboardingProfile, allPhases: { id: string; title: string }[]): string {
  // Determine if this is a DIY phase
  const isDIYPhase = userProfile.diyPhaseIds.includes(phase.id);
  
  // Extract state/region for regional adjustments
  const location = userProfile.cityState.toLowerCase();
  const isCaliforniaBased = location.includes('ca') || location.includes('california');
  const isHighRegulationState = isCaliforniaBased || 
    location.includes('ny') || location.includes('new york') ||
    location.includes('wa') || location.includes('washington') ||
    location.includes('ma') || location.includes('massachusetts') ||
    location.includes('md') || location.includes('maryland');
  
  const isMidwestBased = location.includes('ia') || location.includes('iowa') ||
    location.includes('ks') || location.includes('kansas') ||
    location.includes('ne') || location.includes('nebraska') ||
    location.includes('nd') || location.includes('north dakota') ||
    location.includes('sd') || location.includes('south dakota');

  // Determine seasonal considerations
  const isNorthernClimate = location.includes('mn') || location.includes('minnesota') ||
    location.includes('wi') || location.includes('wisconsin') ||
    location.includes('mi') || location.includes('michigan') ||
    location.includes('nd') || location.includes('north dakota') ||
    location.includes('mt') || location.includes('montana') ||
    location.includes('ak') || location.includes('alaska');

  return `You are a MASTER residential construction expert with 30+ years of experience across all US regions. Provide ONLY duration estimates for the specified construction phase with REGIONAL ADJUSTMENTS.

USER PROFILE
Role: ${userProfile.role}
Experience Level: ${userProfile.experience}
Construction Method: ${userProfile.constructionMethod}
Current Phase: ${userProfile.currentPhaseId}
DIY Phases: ${userProfile.diyPhaseIds.join(", ")}
Weekly Time Commitment: ${userProfile.weeklyHourlyCommitment} hours per week
Location: ${userProfile.cityState}
House Size: ${userProfile.houseSize} square feet
Foundation Type: ${userProfile.foundationType}
Number of Stories: ${userProfile.numberOfStories}
${userProfile.targetStartDate ? `Target Start Date: ${userProfile.targetStartDate}` : ''}

REGIONAL PROFILE ANALYSIS
Location: ${userProfile.cityState}
${isCaliforniaBased ? '⚠️ CALIFORNIA REGION - High regulation, complex permitting, seismic requirements' : ''}
${isHighRegulationState ? '⚠️ HIGH REGULATION STATE - Extended permitting, complex codes' : ''}
${isMidwestBased ? '✓ MIDWEST REGION - Streamlined permitting, predictable timelines' : ''}
${isNorthernClimate ? '❄️ NORTHERN CLIMATE - Winter construction limitations' : ''}

ADDITIONAL REGIONAL FACTORS:
**Market Conditions:**
${isCaliforniaBased || isHighRegulationState ? '- Hot Market: 1.3-2x delays for material delivery, contractor scheduling' : ''}
${isMidwestBased ? '- Stable Market: Baseline material/contractor availability' : ''}

**Natural Disaster Risk:**
${location.includes('fl') || location.includes('florida') || location.includes('tx') || location.includes('texas') || location.includes('la') || location.includes('louisiana') ? '- Hurricane Zone: Building codes add 1.2-1.5x time, seasonal work windows' : ''}
${location.includes('ca') || location.includes('california') ? '- Wildfire/Earthquake Zone: Special materials, inspections add 1.3-1.8x time' : ''}
${location.includes('ok') || location.includes('oklahoma') || location.includes('ks') || location.includes('kansas') ? '- Tornado Alley: Enhanced anchoring requirements, storm shelter considerations' : ''}

**Utility Infrastructure:**
${isMidwestBased ? '- Rural Utilities: Potential 2-8 week delays for new service connections' : ''}
${isCaliforniaBased ? '- Grid Constraints: Solar/battery requirements, utility interconnection delays' : ''}

**Workforce Dynamics:**
${location.includes('nd') || location.includes('north dakota') || location.includes('mt') || location.includes('montana') ? '- Oil Boom Regions: Extreme labor shortage, 2-3x contractor costs/delays' : ''}
${location.includes('fl') || location.includes('florida') || location.includes('az') || location.includes('arizona') ? '- Seasonal Workforce: Winter construction premium, summer heat limitations' : ''}

**Transportation/Access:**
${isMidwestBased ? '- Rural Access: Material delivery delays, limited contractor travel radius' : ''}
${location.includes('ak') || location.includes('alaska') ? '- Remote Location: 3-10x material costs, seasonal shipping windows' : ''}

PHASE ANALYSIS: ${phase.title}
Phase Type: ${phase.id}
${isDIYPhase ? 'Mode: DIY SELF-PERFORMANCE' : 'Mode: CONTRACTOR HIRED'}

CRITICAL REGIONAL ADJUSTMENTS

**Permit/Inspection Heavy Phases** (pre-construction, foundation, framing, rough-ins, final):
${isCaliforniaBased ? '- California: Add 3-8x baseline time for permits/inspections (CEQA, seismic, energy codes)' : ''}
${isHighRegulationState ? '- High Regulation State: Add 2-4x baseline time for permits/inspections' : ''}
${isMidwestBased ? '- Midwest: Use baseline permit/inspection times' : ''}

**Construction-Heavy Phases** (site prep, excavation, foundation, framing, roofing, exterior finishes, interior finishes):
${isCaliforniaBased ? '- California: Add 1.5-2.2x baseline time for construction complexity (Title 24, seismic, inspections)' : ''}
${isHighRegulationState ? '- High Regulation State: Add 1.2-1.8x baseline time for construction complexity' : ''}
${isMidwestBased ? '- Midwest: Use baseline construction times' : ''}

**Weather-Dependent Phases** (site prep, excavation, foundation, roofing, exterior):
${isNorthernClimate ? '- Northern Climate: Add 1.5-2x time if winter months, consider weather delays' : ''}
${location.includes('fl') || location.includes('florida') || location.includes('tx') || location.includes('texas') ? '- Hurricane Season: June-Nov construction windows, potential delays' : ''}
${location.includes('az') || location.includes('arizona') || location.includes('nv') || location.includes('nevada') ? '- Desert Climate: Summer heat limitations 10am-6pm work windows' : ''}
- Southern/Mild Climate: Minimal weather impact

**Code Complexity Phases** (framing, electrical, HVAC, insulation):
${isCaliforniaBased ? '- California: Title 24 energy codes, seismic requirements, solar mandates add 1.5-2.2x time' : ''}
${isHighRegulationState ? '- High Regulation: Complex codes add 1.2-1.5x time' : ''}
${location.includes('fl') || location.includes('florida') ? '- Florida: Hurricane strapping, flood elevation requirements add 1.2-1.4x time' : ''}

**Labor Market Adjustments**:
${isCaliforniaBased ? '- California: Skilled labor shortage, add 1.2-1.5x contractor time' : ''}
${location.includes('nd') || location.includes('north dakota') ? '- Oil Boom States: Extreme shortage, add 2-3x contractor time' : ''}
${isMidwestBased ? '- Midwest: Stable labor market, use baseline contractor time' : ''}

**Material/Supply Chain Factors**:
${location.includes('ak') || location.includes('alaska') || location.includes('hi') || location.includes('hawaii') ? '- Remote States: 2-8 week shipping delays, seasonal delivery windows' : ''}
${location.includes('ca') || location.includes('california') ? '- California: Specialized materials for codes, supply chain constraints' : ''}
${isMidwestBased ? '- Midwest: Standard supply chains, reliable delivery' : ''}

**Utility Connection Delays**:
${isMidwestBased ? '- Rural Areas: 2-8 weeks for new electric/gas service' : ''}
${isCaliforniaBased ? '- California: PG&E interconnection delays, solar/battery integration time' : ''}
${location.includes('tx') || location.includes('texas') ? '- Texas: Deregulated market complications, grid stability concerns' : ''}

MODE SELECTION (Mutually Exclusive)
If ${phase.id} ∈ [${userProfile.diyPhaseIds.join(", ")}] → MODE = DIY
Else → MODE = CONTRACTOR

🚨 BRACKET POLICE - READ THIS TWICE 🚨
You are the BRACKET POLICE. Your job is to ensure EVERY number is wrapped in [X] format.
- If you output "8 weeks" → YOU FAILED
- If you output "[8] weeks" → YOU SUCCEED
- Check your work before submitting
- No excuses - brackets are mandatory

OUTPUT FORMAT - BRACKETS ARE MANDATORY
🔨 DIY Phase
**Phase: ${phase.title} (DIY Phase)**
- **Duration**: [DIY_WEEKS] weeks ← MUST USE BRACKETS
- **DIY Hours**: [DIY_HOURS] hours ← MUST USE BRACKETS

🏗 Contractor Phase
**Phase: ${phase.title} (Contractor Phase)**
- **Contractor Duration**: [CONTRACTOR_WEEKS] weeks ← MUST USE BRACKETS

⚠️ BRACKET REQUIREMENT: Every number MUST be wrapped in square brackets [X]
❌ WRONG: Duration: 8 weeks
✅ CORRECT: Duration: [8] weeks

CALCULATION METHODOLOGY

**DIY Phases:**
1. Determine Base Hours: industry standard for ${userProfile.houseSize} sq ft, ${userProfile.numberOfStories}-story house
2. Apply Experience Multiplier based on ${userProfile.experience}
3. Apply Regional Complexity Multiplier:
   ${isCaliforniaBased ? '- California: 1.8-2.5x (complex codes, inspections, seismic requirements)' : ''}
   ${isHighRegulationState ? '- High Regulation: 1.3-1.8x (stricter codes)' : ''}
   ${isMidwestBased ? '- Midwest: 1.0x (baseline)' : ''}
4. Apply Weather Multiplier if applicable:
   ${isNorthernClimate ? '- Northern Climate: 1.3x for exterior phases' : ''}
5. Compute DIY_WEEKS = CEIL(ADJUSTED_DIY_HOURS / ${userProfile.weeklyHourlyCommitment})

**Contractor Phases:**
1. Use industry-standard durations for ${userProfile.constructionMethod}
2. Scale by ${userProfile.houseSize}, ${userProfile.numberOfStories}, ${userProfile.foundationType}
3. Apply Regional Adjustment Multipliers:
   ${isCaliforniaBased ? '- California Permit-Heavy Phases (pre-construction, foundation, framing, rough-ins, final): 3-8x baseline' : ''}
   ${isCaliforniaBased ? '- California Construction-Heavy Phases (site prep, excavation, roofing, exterior finishes, interior): 1.5-2.2x baseline' : ''}
   ${isHighRegulationState ? '- High Regulation States: 1.5-2.5x baseline' : ''}
   ${isMidwestBased ? '- Midwest States: 1.0x baseline' : ''}
4. Apply Labor Market Multipliers:
   ${isCaliforniaBased ? '- California: 1.2-1.5x for contractor availability' : ''}
5. Apply Weather Multipliers:
   ${isNorthernClimate ? '- Northern Climate: 1.5-2.0x for winter exterior work' : ''}

PHASE-SPECIFIC REGIONAL CONSIDERATIONS

**Pre-Construction Planning:**
${isCaliforniaBased ? '- California: 16-32 weeks (complex permitting, CEQA review, multiple agency approvals, seismic studies, environmental impact reports)' : ''}
${isHighRegulationState ? '- High Regulation: 8-20 weeks (multiple agency approvals, extended reviews)' : ''}
${isMidwestBased ? '- Midwest: 2-4 weeks (streamlined permitting)' : ''}

**California-Specific Pre-Planning Factors:**
${isCaliforniaBased ? '- CEQA Environmental Review: 4-12 weeks additional' : ''}
${isCaliforniaBased ? '- Seismic Engineering Studies: 2-6 weeks additional' : ''}
${isCaliforniaBased ? '- Multiple Agency Permits (Building, Planning, Fire, Public Works): 3-8 weeks additional' : ''}
${isCaliforniaBased ? '- Solar/Energy Code Compliance Planning: 2-4 weeks additional' : ''}
${isCaliforniaBased ? '- Neighborhood Notification & Appeal Periods: 2-6 weeks additional' : ''}

**Foundation/Structural Phases:**
${isCaliforniaBased ? '- California: Seismic engineering requirements, special rebar, extended inspections' : ''}
${isNorthernClimate ? '- Northern Climate: Frost line requirements, winter concrete limitations' : ''}

**Rough-in Phases:**
${isCaliforniaBased ? '- California: Solar-ready electrical, Title 24 HVAC compliance, water efficiency' : ''}
${isHighRegulationState ? '- High Regulation: Energy code compliance, extensive inspection requirements' : ''}

**Exterior Finishes:**
${isCaliforniaBased ? '- California: Title 24 energy compliance, seismic bracing, solar panel integration - use CONSTRUCTION multipliers (1.5-2.2x), NOT permit multipliers' : ''}
${isHighRegulationState ? '- High Regulation: Energy code compliance, weatherproofing requirements' : ''}

CRITICAL RULES - BRACKETS ARE ABSOLUTELY REQUIRED
🚨 BRACKET RULE #1: Use bracketed values [X] for EVERY number - NO EXCEPTIONS
🚨 BRACKET RULE #2: Format MUST be exactly: **Duration**: [8] weeks (not Duration: 8 weeks)
🚨 BRACKET RULE #3: If you see a number without brackets, you are WRONG
🚨 BRACKET RULE #4: Test your output - every number should be [X] format
- Always use the word "weeks" (never abbreviations)
- Output must be under 150 words
- Single numbers only (never ranges)
- Round weeks up (use CEIL)
- DIY Duration must be EQUAL TO OR LONGER than Contractor Duration for same phase
- Regional multipliers are MANDATORY - do not ignore location impacts
- For California locations: ALWAYS use the HIGHER end of the range for pre-planning phases
- For California locations: Apply MAXIMUM regional multipliers for permit-heavy phases
- For California locations: Exterior finishes, roofing, and interior work use CONSTRUCTION multipliers (1.5-2.2x), NOT permit multipliers (3-8x)
- For California locations: Only pre-construction, foundation, framing, rough-ins, and final phases use permit multipliers

VALIDATION CHECKLIST
✓ Applied appropriate regional multiplier for ${userProfile.cityState}
✓ DIY hours calculated with regional complexity factors
✓ Contractor weeks include permit/inspection delays for location
✓ Weather considerations applied if relevant
✓ DIY Duration ≥ Contractor Duration for same phase
✓ EVERY number is wrapped in brackets [X] format

🚨 FINAL BRACKET CHECK - BEFORE SUBMITTING:
1. Look at your output
2. Find every number (8, 12, 24, etc.)
3. Make sure each number is [8], [12], [24] format
4. If ANY number lacks brackets, you FAILED - fix it!

The system will automatically remove brackets from your response. Focus on providing accurate regionally-adjusted numbers in brackets.

REMEMBER: [X] format is NOT optional - it's MANDATORY for every single number!`;
}

/**
 * Generate timeline estimates for all phases in parallel
 */
async function generateAllPhaseTimelines(
  userProfile: OnboardingProfile
): Promise<Array<{
  phaseId: string;
  phaseTitle: string;
  timeline: string;
  rawOpenAIResponse: string;
  error?: string;
}>> {
  console.log(`Generating timeline estimates for all phases`);
  
  // Use the same phases as the roadmap system
  const roadmapPhases = await getBaselinePhases();
  
  // Validate that we have phases data
  if (!roadmapPhases || !roadmapPhases.phases || !Array.isArray(roadmapPhases.phases)) {
    console.error('Invalid baseline phases data structure:', roadmapPhases);
    throw new Error('Failed to fetch valid baseline phases data from database');
  }
  
  console.log(`Processing ${roadmapPhases.phases.length} baseline phases for timeline estimation`);
  
  // Find the current phase and get remaining phases (INCLUDE current phase)
  const currentPhaseIndex = roadmapPhases.phases.findIndex(p => p.id === userProfile.currentPhaseId);
  const remainingPhases = currentPhaseIndex >= 0 
    ? roadmapPhases.phases.slice(currentPhaseIndex)  // Include current phase and all future phases
    : [];
  
  // Ensure current phase is included for timeline estimation
  if (currentPhaseIndex >= 0 && remainingPhases.length > 0) {
    console.log(`Including current phase: ${userProfile.currentPhaseId} in timeline estimation`);
  }
  
  console.log(`Generating timelines for ${remainingPhases.length} phases in parallel`);
  console.log(`Current phase index: ${currentPhaseIndex}`);
  console.log(`Phases to process:`, remainingPhases.map(p => `${p.id}: ${p.title}`));
  
  // Generate all phase timelines in parallel
  const timelinePromises = remainingPhases.map(async (phase) => {
    return await generatePhaseTimeline(phase, userProfile, roadmapPhases.phases);
  });
  
  // Wait for all phases to complete simultaneously
  const timelines = await Promise.all(timelinePromises);
  
  console.log(`Generated timeline estimates for ${timelines.length} phases`);
  return timelines;
}

// POST endpoint for generating timeline estimates
export async function POST(request: NextRequest) {
  try {
    const { userProfile, userId, projectId } = await request.json();
    
    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile is required' },
        { status: 400 }
      );
    }
    
    if (!userId || !projectId) {
      return NextResponse.json(
        { error: 'User ID and Project ID are required' },
        { status: 400 }
      );
    }
    
    console.log('Timeline API received:', { userId, projectId, userProfileRole: userProfile.role });
    
    console.log('Starting timeline estimation generation via API route');
    
    // Generate timeline estimates for all phases in parallel
    const timelines = await generateAllPhaseTimelines(userProfile);
    
    console.log('Timeline estimation generated successfully via API route');
    
    // Structure the response with both raw and parsed data
    const rawOpenAIResponses: Record<string, string> = {};
    const parsedTimelineEstimates: Record<string, any> = {};
    
    timelines.forEach(timeline => {
      if (timeline.phaseId) {
        rawOpenAIResponses[timeline.phaseId] = timeline.rawOpenAIResponse;
        
                 // Parse the timeline response to extract durations
         // More flexible regex to handle variations in spacing and formatting
         console.log(`🔍 Parsing timeline for phase ${timeline.phaseId}:`);
         console.log(`🔍 Raw timeline text: "${timeline.timeline}"`);
         
                   // Updated patterns to handle bracketed format [X] weeks/hours
          const diyMatch = timeline.timeline.match(/\*\*Duration\*\*:\s*\[(\d+)\]\s*weeks?/i);
          const contractorMatch = timeline.timeline.match(/\*\*Contractor Duration\*\*:\s*\[(\d+)\]\s*weeks?/i);
          const diyHoursMatch = timeline.timeline.match(/\*\*DIY Hours\*\*:\s*\[(\d+)\]\s*hours?/i);
         
         console.log(`🔍 DIY match:`, diyMatch);
         console.log(`🔍 Contractor match:`, contractorMatch);
         console.log(`🔍 DIY Hours match:`, diyHoursMatch);
         
         parsedTimelineEstimates[timeline.phaseId] = {
           diyDuration: diyMatch ? `${diyMatch[1]} weeks` : null,
           contractorDuration: contractorMatch ? `${contractorMatch[1]} weeks` : null,
           diyHours: diyHoursMatch ? `${diyHoursMatch[1]} hours` : null,
           rawTimeline: timeline.timeline
         };
         
         console.log(`🔍 Parsed result:`, parsedTimelineEstimates[timeline.phaseId]);
      }
    });

    return NextResponse.json({
      success: true,
      userId: userId,
      projectId: projectId,
      timelines: timelines,
      rawOpenAIResponses: rawOpenAIResponses,
      parsedTimelineEstimates: parsedTimelineEstimates
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate timeline estimates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
