/**
 * Hybrid Roadmap Generator
 * 
 * This module orchestrates the hybrid approach by:
 * 1. Generating shared context (regional + project + user)
 * 2. Processing phases in parallel using shared context
 * 3. Storing raw AI responses in Supabase
 * 4. Returning structured data for UI consumption
 */

import { generateText } from './openai';
import { generateRegionalAnalysis } from './regional-analysis';
import { generateProjectContext } from './project-context';
import { buildUserProfile } from './user-profile-builder';
import { createPhasePrompt } from './phase-prompt-builder';
import { parsePhaseResponse } from './phase-response-parser';
import { assembleCompleteProjectResponse } from './response-assembler';
import { supabase } from './supabase';
import type { OnboardingProfile } from './roadmap-types';
import type { 
  RegionalAnalysisResponse, 
  ProjectContextResponse, 
  PhaseSpecificResponse,
  CompleteProjectResponse 
} from './unified-response-types';

// ============================================================================
// HYBRID ROADMAP GENERATOR
// ============================================================================

/**
 * Generates a complete hybrid roadmap using the hybrid approach
 */
export async function generateHybridRoadmap(
  userProfile: OnboardingProfile,
  projectId: string
): Promise<CompleteProjectResponse> {
  try {
    console.log('🚀 Starting hybrid roadmap generation for project:', projectId);
    
    // Step 1: Generate shared context (sequential for dependencies)
    console.log('📊 Generating shared context...');
    const regionalContext = await generateRegionalAnalysis(userProfile.cityState);
    const projectContext = await generateProjectContext(userProfile, regionalContext);
    const userProfileData = await buildUserProfile(userProfile, regionalContext);
    
    console.log('✅ Shared context generated');
    
    // Step 2: Get baseline phases for the construction method
    const baselinePhases = await getBaselinePhasesForMethod(userProfile.constructionMethod);
    console.log(`📋 Found ${baselinePhases.length} phases for ${userProfile.constructionMethod}`);
    
    // Step 3: Generate phase-specific prompts
    const phasePrompts = generatePhasePrompts(
      baselinePhases,
      userProfileData,
      regionalContext,
      projectContext,
      projectId
    );
    
    // Step 4: Process phases in parallel
    console.log('⚡ Processing phases in parallel...');
    const phaseResponses = await processPhasesInParallel(
      phasePrompts,
      userProfile.constructionMethod,
      projectId
    );
    
    console.log(`✅ Processed ${phaseResponses.length} phases`);
    
    // Step 5: Store raw responses in Supabase
    await storeRawResponsesInSupabase(
      projectId,
      projectId,
      {
        regionalAnalysis: (regionalContext as any).rawResponse || '',
        projectContext: (projectContext as any).rawResponse || '',
        phaseResponses: phaseResponses.reduce((acc, response) => {
          acc[response.data.phaseId] = (response as any).rawResponse || '';
          return acc;
        }, {} as Record<string, string>)
      }
    );
    
    // Step 6: Assemble complete project response
    const completeResponse = assembleCompleteProjectResponse(
      projectId,
      'unknown',
      {
        regionalAnalysis: regionalContext as any,
        projectContext: projectContext as any,
        phaseResponses: phaseResponses
      }
    );
    
    console.log('🎉 Hybrid roadmap generation complete');
    return completeResponse;
    
  } catch (error) {
    console.error('❌ Hybrid roadmap generation failed:', error);
    throw new Error(`Failed to generate hybrid roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets baseline phases for a specific construction method
 */
async function getBaselinePhasesForMethod(constructionMethod: string): Promise<Array<{id: string, title: string}>> {
  try {
    
    const { data, error } = await supabase
      .from('baseline_construction_phases')
      .select('phases')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching baseline phases:', error);
      throw error;
    }
    
    // Extract phases for the specific construction method
    const allPhases = data?.phases?.phases || [];
    const methodPhases = allPhases.filter((phase: any) => 
      phase.constructionMethods?.includes(constructionMethod)
    );
    
    // If no phases found for this method, return fallback phases
    if (methodPhases.length === 0) {
      console.log(`No phases found for ${constructionMethod}, using fallback phases`);
      return getFallbackPhases(constructionMethod);
    }
    
    return methodPhases.map((phase: any) => ({
      id: phase.id,
      title: phase.title
    }));
    
  } catch (error) {
    console.error('Failed to fetch baseline phases:', error);
    // Return fallback phases if any error occurs
    return getFallbackPhases(constructionMethod);
  }
}

function getFallbackPhases(constructionMethod: string): Array<{id: string, title: string}> {
  // Return method-specific phases based on construction method
  switch (constructionMethod.toLowerCase()) {
    case 'traditional':
    case 'barndominium':
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'rough-framing', title: 'Rough Framing' },
        { id: 'roofing', title: 'Roofing' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'paint', title: 'Paint' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
    
    case 'post-frame':
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'rough-framing', title: 'Rough Framing' },
        { id: 'post-frame-structure', title: 'Post Frame Structure' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'rough-framing-post-frame', title: 'Rough Framing Post Frame' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'paint', title: 'Paint' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
    
    case 'icf':
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'icf-foundation-walls', title: 'ICF Foundation & Walls' },
        { id: 'rough-framing', title: 'Rough Framing' },
        { id: 'roofing', title: 'Roofing' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'rough-framing-icf', title: 'Rough Framing ICF' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'paint', title: 'Paint' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
    
    case 'sip':
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'sip-panel-installation', title: 'SIP Panel Installation' },
        { id: 'rough-framing', title: 'Rough Framing' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'rough-framing-sip', title: 'Rough Framing SIP' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'paint', title: 'Paint' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
    
    case 'modular':
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'modular-delivery-setup', title: 'Modular Delivery & Setup' },
        { id: 'roofing', title: 'Roofing' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'rough-framing-modular', title: 'Rough Framing Modular' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'rough-framing-modular', title: 'Rough Framing Modular' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'paint', title: 'Paint' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
    
    default:
      // Fallback to traditional frame phases for unknown methods
      console.log(`Unknown construction method: ${constructionMethod}, using traditional frame phases`);
      return [
        { id: 'foundation', title: 'Foundation' },
        { id: 'rough-framing', title: 'Rough Framing' },
        { id: 'roofing', title: 'Roofing' },
        { id: 'exterior', title: 'Exterior' },
        { id: 'plumbing-rough', title: 'Plumbing Rough' },
        { id: 'electrical-rough', title: 'Electrical Rough' },
        { id: 'hvac-rough', title: 'HVAC Rough' },
        { id: 'insulation', title: 'Insulation' },
        { id: 'drywall', title: 'Drywall' },
        { id: 'paint', title: 'Paint' },
        { id: 'trim-carpentry', title: 'Trim Carpentry' },
        { id: 'flooring', title: 'Flooring' },
        { id: 'kitchen-bath', title: 'Kitchen & Bath' },
        { id: 'final-touches', title: 'Final Touches' }
      ];
  }
}

/**
 * Generates phase-specific prompts for all phases
 */
function generatePhasePrompts(
  phases: Array<{id: string, title: string}>,
  userProfile: any,
  regionalContext: any,
  projectContext: any,
  projectId: string
): Array<{phaseId: string, phaseTitle: string, prompt: string}> {
  return phases.map(phase => ({
    phaseId: phase.id,
    phaseTitle: phase.title,
    prompt: createPhasePrompt(
      phase.id,
      phase.title,
      userProfile,
      regionalContext,
      projectContext,
      projectId
    )
  }));
}

/**
 * Processes all phases in parallel using OpenAI
 */
async function processPhasesInParallel(
  phasePrompts: Array<{phaseId: string, phaseTitle: string, prompt: string}>,
  constructionMethod: string,
  projectId: string
): Promise<PhaseSpecificResponse[]> {
  console.log(`⚡ Processing ${phasePrompts.length} phases in parallel...`);
  
  // Process all phases in parallel
  const phasePromises = phasePrompts.map(async ({ phaseId, phaseTitle, prompt }) => {
    try {
      console.log(`🔄 Processing phase: ${phaseId}`);
      
      // Generate AI response
      const rawResponse = await generateText(prompt, 'gpt-4o-mini', {
        temperature: 0.3,
        maxTokens: 1000
      });
      
      // Parse the response
      const parsedResponse = parsePhaseResponse(
        phaseId,
        phaseTitle,
        constructionMethod,
        rawResponse,
        projectId
      );
      
      // Add the raw response to the parsed response for storage
      (parsedResponse as any).rawResponse = rawResponse;
      
      console.log(`✅ Completed phase: ${phaseId}`);
      return parsedResponse;
      
    } catch (error) {
      console.error(`❌ Failed to process phase ${phaseId}:`, error);
      
      // Return error response
      const errorResponse: PhaseSpecificResponse = {
        projectId,
        timestamp: new Date().toISOString(),
        success: false,
        type: 'phase_specific',
        error: `Failed to process phase ${phaseId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: {
          phaseId,
          phaseTitle,
          constructionMethod,
          timeline: {
            diyDuration: null,
            contractorDuration: null,
            diyHours: null,
            rawTimeline: ''
          },
          tasks: {
            steps: [],
            qaChecks: [],
            vendorQuestions: [],
            vendorNeeds: []
          },
          helpfulInformation: {
            steps: [],
            qaChecks: [],
            vendorQuestions: [],
            vendorNeeds: []
          },
          regionalAdjustments: {
            weatherConsiderations: [],
            permitRequirements: [],
            localVendorRecommendations: [],
            seasonalTiming: []
          },
          expertInsights: {
            commonMistakes: [],
            proTips: [],
            costSavingTips: [],
            qualityCheckpoints: []
          }
        }
      };
      
      // Add empty raw response for error case
      (errorResponse as any).rawResponse = '';
      
      return errorResponse;
    }
  });
  
  // Wait for all phases to complete
  const results = await Promise.all(phasePromises);
  
  // Log results
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`📊 Phase processing complete: ${successful} successful, ${failed} failed`);
  
  return results;
}

/**
 * Stores raw AI responses in Supabase using existing roadmap_data table
 */
async function storeRawResponsesInSupabase(
  projectId: string,
  userId: string,
  rawResponses: {
    regionalAnalysis: string;
    projectContext: string;
    phaseResponses: Record<string, string>;
  }
): Promise<void> {
  try {
    console.log('💾 Storing raw responses in Supabase...');
    
    const dataToStore = {
      user_id: userId,
      project_id: projectId,
      friendly_name: 'Hybrid Roadmap',
      raw_api_response: {
        hybrid_approach: true,
        regionalAnalysis: rawResponses.regionalAnalysis,
        projectContext: rawResponses.projectContext,
        phaseResponses: rawResponses.phaseResponses,
        generated_at: new Date().toISOString()
      },
      needs_timeline_resubmission: false
    };
    
    const { error } = await supabase
      .from('roadmap_data')
      .insert(dataToStore);
    
    if (error) {
      console.error('❌ Failed to store raw responses:', error);
      throw error;
    }
    
    console.log('✅ Raw responses stored successfully');
    
  } catch (error) {
    console.error('❌ Failed to store raw responses in Supabase:', error);
    // Don't throw - we don't want to break roadmap generation if storage fails
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Gets stored raw responses from Supabase using existing roadmap_data table
 */
export async function getStoredRawResponses(
  projectId: string,
  userId: string
): Promise<{
  regionalAnalysis: string;
  projectContext: string;
  phaseResponses: Record<string, string>;
} | null> {
  try {
    
    const { data, error } = await supabase
      .from('roadmap_data')
      .select('raw_api_response')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .eq('raw_api_response->>hybrid_approach', 'true')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching stored responses:', error);
      return null;
    }
    
    const rawResponse = data?.raw_api_response;
    if (!rawResponse || !rawResponse.hybrid_approach) {
      return null;
    }
    
    return {
      regionalAnalysis: rawResponse.regionalAnalysis || '',
      projectContext: rawResponse.projectContext || '',
      phaseResponses: rawResponse.phaseResponses || {}
    };
    
  } catch (error) {
    console.error('Failed to fetch stored responses:', error);
    return null;
  }
}

/**
 * Parses stored raw responses into structured data
 */
export async function parseStoredResponses(
  rawResponses: {
    regionalAnalysis: string;
    projectContext: string;
    phaseResponses: Record<string, string>;
  },
  projectId: string,
  userId: string,
  constructionMethod: string
): Promise<CompleteProjectResponse> {
  try {
    console.log('🔄 Parsing stored responses...');
    
    // Parse regional analysis
    const regionalContext = await generateRegionalAnalysis(''); // Will be overridden
    
    // Parse project context
    const projectContext = await generateProjectContext({} as OnboardingProfile, regionalContext); // Will be overridden
    
    // Parse phase responses
    const phaseResponses = Object.entries(rawResponses.phaseResponses).map(([phaseId, rawResponse]) => {
      // Extract phase title from baseline phases (simplified)
      const phaseTitle = phaseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      return parsePhaseResponse(
        phaseId,
        phaseTitle,
        constructionMethod,
        rawResponse,
        projectId
      );
    });
    
    // Assemble complete response
    const completeResponse = assembleCompleteProjectResponse(
      projectId,
      userId,
      {
        regionalAnalysis: regionalContext as any,
        projectContext: projectContext as any,
        phaseResponses: phaseResponses
      }
    );
    
    console.log('✅ Stored responses parsed successfully');
    return completeResponse;
    
  } catch (error) {
    console.error('❌ Failed to parse stored responses:', error);
    throw new Error(`Failed to parse stored responses: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
