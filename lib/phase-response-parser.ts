/**
 * Phase Response Parser for Hybrid AI Approach
 * 
 * This module parses AI responses from phase-specific prompts,
 * extracts project IDs, and validates response structure.
 */

import { PhaseSpecificResponse } from './unified-response-types';
import { parseProjectIdFromResponse, parseTimelineData } from './response-assembler';

// ============================================================================
// PHASE RESPONSE PARSING
// ============================================================================

/**
 * Parses a phase-specific AI response into structured data
 * Focuses only on AI-generated content (timeline, regional adjustments, expert insights)
 * Hardcoded content (tasks, helpful info, QA checks) is handled by roadmap-phases.ts
 */
export function parsePhaseResponse(
  phaseId: string,
  phaseTitle: string,
  constructionMethod: string,
  rawResponse: string,
  expectedProjectId?: string
): PhaseSpecificResponse {
  try {
    console.log(`🔍 Parsing phase response for ${phaseId}:`, {
      responseLength: rawResponse.length,
      startsWithPrompt: rawResponse.includes('You are a'),
      hasProjectId: rawResponse.includes('PROJECT ID:'),
      hasTimeline: rawResponse.includes('Duration:'),
      hasRegionalAdjustments: rawResponse.includes('REGIONAL ADJUSTMENTS'),
      hasExpertInsights: rawResponse.includes('EXPERT INSIGHTS'),
      sampleResponse: rawResponse.substring(0, 200) + '...'
    });
    
    // Check if response contains the prompt text instead of structured content
    if (rawResponse.includes('You are a') && rawResponse.includes('PROJECT ID:')) {
      console.warn(`⚠️ Phase ${phaseId} returned prompt text instead of structured response`);
      // Return a fallback response with basic timeline data
      return {
        projectId: expectedProjectId || 'unknown',
        timestamp: new Date().toISOString(),
        success: false,
        type: 'phase_specific',
        error: 'AI returned prompt text instead of structured response',
        data: {
          phaseId,
          phaseTitle,
          constructionMethod,
          timeline: {
            diyDuration: null,
            contractorDuration: null,
            diyHours: null,
            rawTimeline: rawResponse
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
    }
    
    // Extract project ID from response
    const projectId = parseProjectIdFromResponse(rawResponse) || expectedProjectId || 'unknown';
    
    // Parse timeline data with bracketed format support
    const timeline = parseTimelineData(rawResponse);
    
    // Parse only AI-generated content
    const aiContent = parseAIGeneratedContent(rawResponse);
    
    return {
      projectId,
      timestamp: new Date().toISOString(),
      success: true,
      type: 'phase_specific',
      data: {
        phaseId,
        phaseTitle,
        constructionMethod,
        timeline,
        // DETAILED TASKS (AI-generated)
        tasks: {
          steps: aiContent.steps,
          qaChecks: aiContent.qaChecks,
          vendorQuestions: aiContent.vendorQuestions,
          vendorNeeds: aiContent.vendorNeeds
        },
        // HELPFUL INFORMATION (AI-generated)
        helpfulInformation: {
          steps: aiContent.helpfulSteps,
          qaChecks: aiContent.helpfulQaChecks,
          vendorQuestions: aiContent.helpfulVendorQuestions,
          vendorNeeds: aiContent.helpfulVendorNeeds
        },
        // REGIONAL ADJUSTMENTS (AI-generated)
        regionalAdjustments: {
          weatherConsiderations: aiContent.weatherConsiderations,
          permitRequirements: aiContent.permitRequirements,
          localVendorRecommendations: aiContent.localVendorRecommendations,
          seasonalTiming: aiContent.seasonalTiming
        },
        // EXPERT INSIGHTS (AI-generated)
        expertInsights: {
          commonMistakes: aiContent.commonMistakes,
          proTips: aiContent.proTips,
          costSavingTips: aiContent.costSavingTips,
          qualityCheckpoints: aiContent.qualityCheckpoints
        }
      }
    };
  } catch (error) {
    return {
      projectId: expectedProjectId || 'unknown',
      timestamp: new Date().toISOString(),
      success: false,
      type: 'phase_specific',
      error: `Failed to parse phase response: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: {
        phaseId,
        phaseTitle,
        constructionMethod,
        timeline: {
          diyDuration: null,
          contractorDuration: null,
          diyHours: null,
          rawTimeline: rawResponse
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
  }
}

/**
 * Parses only AI-generated content from phase response text
 * Excludes hardcoded content (tasks, helpful info, QA checks, vendor questions/needs)
 */
function parseAIGeneratedContent(rawResponse: string): {
  // DETAILED TASKS
  steps: string[];
  qaChecks: string[];
  vendorQuestions: string[];
  vendorNeeds: string[];
  // HELPFUL INFORMATION
  helpfulSteps: string[];
  helpfulQaChecks: string[];
  helpfulVendorQuestions: string[];
  helpfulVendorNeeds: string[];
  // REGIONAL ADJUSTMENTS
  weatherConsiderations: string[];
  permitRequirements: string[];
  localVendorRecommendations: string[];
  seasonalTiming: string[];
  // EXPERT INSIGHTS
  commonMistakes: string[];
  proTips: string[];
  costSavingTips: string[];
  qualityCheckpoints: string[];
} {
  return {
    // DETAILED TASKS (AI-generated)
    steps: extractListFromSection(rawResponse, [
      'DETAILED TASKS',
      'Step-by-step instructions',
      'Steps:',
      'Instructions:',
      'Procedure:',
      'Process:'
    ]),
    qaChecks: extractListFromSection(rawResponse, [
      'DETAILED TASKS',
      'Quality assurance checkpoints',
      'QA Checks:',
      'Quality Checks:',
      'Checkpoints:',
      'Inspection Points:'
    ]),
    vendorQuestions: extractListFromSection(rawResponse, [
      'DETAILED TASKS',
      'Vendor questions to ask',
      'Vendor Questions:',
      'Questions to Ask:',
      'Ask Vendors:',
      'Contractor Questions:'
    ]),
    vendorNeeds: extractListFromSection(rawResponse, [
      'DETAILED TASKS',
      'What vendors need from you',
      'Vendor Needs:',
      'What Vendors Need:',
      'Provide to Vendors:',
      'Contractor Requirements:'
    ]),
    
    // HELPFUL INFORMATION (AI-generated)
    helpfulSteps: extractListFromSection(rawResponse, [
      'HELPFUL INFORMATION',
      'Additional resources and references',
      'Helpful Steps:',
      'Additional Steps:',
      'Resources:',
      'References:'
    ]),
    helpfulQaChecks: extractListFromSection(rawResponse, [
      'HELPFUL INFORMATION',
      'Safety considerations',
      'Safety Checks:',
      'Safety QA:',
      'Safety Points:',
      'Safety Considerations:'
    ]),
    helpfulVendorQuestions: extractListFromSection(rawResponse, [
      'HELPFUL INFORMATION',
      'Tool and material requirements',
      'Tool Questions:',
      'Material Questions:',
      'Equipment Questions:',
      'Supply Questions:'
    ]),
    helpfulVendorNeeds: extractListFromSection(rawResponse, [
      'HELPFUL INFORMATION',
      'Troubleshooting guide',
      'Troubleshooting:',
      'Problem Solving:',
      'Common Issues:',
      'Troubleshooting Tips:'
    ]),
    
    // REGIONAL ADJUSTMENTS (AI-generated)
    weatherConsiderations: extractListFromSection(rawResponse, [
      'REGIONAL ADJUSTMENTS',
      'Weather considerations',
      'Weather Considerations',
      'Climate factors:',
      'Weather factors:'
    ]),
    permitRequirements: extractListFromSection(rawResponse, [
      'REGIONAL ADJUSTMENTS',
      'Local permit requirements',
      'Permit Requirements',
      'Permits:',
      'Local permits:'
    ]),
    localVendorRecommendations: extractListFromSection(rawResponse, [
      'REGIONAL ADJUSTMENTS',
      'Regional vendor recommendations',
      'Vendor Recommendations',
      'Local Vendors:',
      'Local contractors:'
    ]),
    seasonalTiming: extractListFromSection(rawResponse, [
      'REGIONAL ADJUSTMENTS',
      'Seasonal timing considerations',
      'Seasonal Timing',
      'Timing:',
      'Best time to:'
    ]),
    
    // EXPERT INSIGHTS (AI-generated)
    commonMistakes: extractListFromSection(rawResponse, [
      'EXPERT INSIGHTS',
      'Common mistakes to avoid',
      'Common Mistakes',
      'Mistakes to Avoid:',
      'Avoid these mistakes:'
    ]),
    proTips: extractListFromSection(rawResponse, [
      'EXPERT INSIGHTS',
      'Professional tips and tricks',
      'Pro Tips',
      'Tips and Tricks:',
      'Expert tips:'
    ]),
    costSavingTips: extractListFromSection(rawResponse, [
      'EXPERT INSIGHTS',
      'Cost-saving opportunities',
      'Cost-Saving Tips',
      'Save Money:',
      'Budget tips:'
    ]),
    qualityCheckpoints: extractListFromSection(rawResponse, [
      'EXPERT INSIGHTS',
      'Quality checkpoints',
      'Quality Checkpoints',
      'Quality Control:',
      'Quality assurance:'
    ])
  };
}

/**
 * Extracts a list of items from a specific section of the response
 */
function extractListFromSection(text: string, sectionHeaders: string[]): string[] {
  for (const header of sectionHeaders) {
    const sectionMatch = text.match(new RegExp(`${header}[\\s\\S]*?(?=\\n\\n|\\n[A-Z]|$)`, 'i'));
    if (sectionMatch) {
      const sectionText = sectionMatch[0];
      return parseListItems(sectionText);
    }
  }
  return [];
}

/**
 * Parses list items from text (handles various formats)
 */
function parseListItems(text: string): string[] {
  const items: string[] = [];
  
  // Split by common list patterns
  const lines = text.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and headers
    if (!trimmed || trimmed.match(/^[A-Z\s:]+$/)) continue;
    
    // Handle various list formats
    const listPatterns = [
      /^[-•*]\s*(.+)$/,           // - item, • item, * item
      /^\d+\.\s*(.+)$/,           // 1. item
      /^[a-z]\)\s*(.+)$/i,        // a) item
      /^\([a-z]\)\s*(.+)$/i,      // (a) item
      /^[A-Z]\.\s*(.+)$/,         // A. item
      /^\([A-Z]\)\s*(.+)$/,       // (A) item
      /^[ivx]+\.\s*(.+)$/i,       // i. item, ii. item, etc.
      /^\([ivx]+\)\s*(.+)$/i,     // (i) item, (ii) item, etc.
      /^[^\w]*([A-Z].+)$/         // Any line starting with capital (fallback)
    ];
    
    for (const pattern of listPatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        const item = match[1].trim();
        if (item.length > 3) { // Filter out very short items
          items.push(item);
          break;
        }
      }
    }
  }
  
  return items;
}

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

/**
 * Validates a phase response for completeness and correctness
 * Focuses on AI-generated content validation
 */
export function validatePhaseResponse(response: PhaseSpecificResponse): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check project ID
  if (!response.projectId || response.projectId === 'unknown') {
    errors.push('Project ID is missing or invalid');
  }
  
  // Check timeline data (AI-generated)
  if (!response.data.timeline.diyDuration && !response.data.timeline.contractorDuration) {
    errors.push('No timeline estimates provided (neither DIY nor contractor duration)');
  }
  
  // Check for AI-generated content
  if (response.data.regionalAdjustments.weatherConsiderations.length === 0) {
    warnings.push('No weather considerations provided');
  }
  
  if (response.data.regionalAdjustments.permitRequirements.length === 0) {
    warnings.push('No permit requirements provided');
  }
  
  if (response.data.expertInsights.commonMistakes.length === 0) {
    warnings.push('No expert insights provided');
  }
  
  if (response.data.expertInsights.proTips.length === 0) {
    warnings.push('No professional tips provided');
  }
  
  // Check for bracketed format in raw timeline
  const rawTimeline = response.data.timeline.rawTimeline;
  if (rawTimeline && !rawTimeline.includes('[') && !rawTimeline.includes(']')) {
    warnings.push('Raw timeline may not use bracketed format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates multiple phase responses
 */
export function validatePhaseResponses(responses: PhaseSpecificResponse[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
  phaseErrors: Record<string, string[]>;
  phaseWarnings: Record<string, string[]>;
} {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];
  const phaseErrors: Record<string, string[]> = {};
  const phaseWarnings: Record<string, string[]> = {};
  
  for (const response of responses) {
    const validation = validatePhaseResponse(response);
    
    if (validation.errors.length > 0) {
      phaseErrors[response.data.phaseId] = validation.errors;
      allErrors.push(...validation.errors.map(error => `${response.data.phaseId}: ${error}`));
    }
    
    if (validation.warnings.length > 0) {
      phaseWarnings[response.data.phaseId] = validation.warnings;
      allWarnings.push(...validation.warnings.map(warning => `${response.data.phaseId}: ${warning}`));
    }
  }
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    phaseErrors,
    phaseWarnings
  };
}

// ============================================================================
// RESPONSE PROCESSING UTILITIES
// ============================================================================

/**
 * Processes multiple phase responses in parallel
 */
export async function processPhaseResponses(
  responses: Array<{
    phaseId: string;
    phaseTitle: string;
    constructionMethod: string;
    rawResponse: string;
    expectedProjectId?: string;
  }>
): Promise<PhaseSpecificResponse[]> {
  const promises = responses.map(response => 
    Promise.resolve(parsePhaseResponse(
      response.phaseId,
      response.phaseTitle,
      response.constructionMethod,
      response.rawResponse,
      response.expectedProjectId
    ))
  );
  
  return Promise.all(promises);
}

/**
 * Extracts project IDs from multiple responses
 */
export function extractProjectIds(responses: PhaseSpecificResponse[]): string[] {
  const projectIds = new Set<string>();
  
  for (const response of responses) {
    if (response.projectId && response.projectId !== 'unknown') {
      projectIds.add(response.projectId);
    }
  }
  
  return Array.from(projectIds);
}

/**
 * Groups responses by project ID
 */
export function groupResponsesByProjectId(responses: PhaseSpecificResponse[]): Record<string, PhaseSpecificResponse[]> {
  const grouped: Record<string, PhaseSpecificResponse[]> = {};
  
  for (const response of responses) {
    const projectId = response.projectId;
    if (!grouped[projectId]) {
      grouped[projectId] = [];
    }
    grouped[projectId].push(response);
  }
  
  return grouped;
}

/**
 * Filters responses by success status
 */
export function filterSuccessfulResponses(responses: PhaseSpecificResponse[]): PhaseSpecificResponse[] {
  return responses.filter(response => response.success);
}

/**
 * Filters responses by failure status
 */
export function filterFailedResponses(responses: PhaseSpecificResponse[]): PhaseSpecificResponse[] {
  return responses.filter(response => !response.success);
}

/**
 * Gets summary statistics for phase responses
 * Focuses on AI-generated content metrics
 */
export function getPhaseResponseStats(responses: PhaseSpecificResponse[]): {
  total: number;
  successful: number;
  failed: number;
  projectIds: string[];
  phases: string[];
  avgWeatherConsiderationsPerPhase: number;
  avgExpertInsightsPerPhase: number;
  avgProTipsPerPhase: number;
} {
  const successful = filterSuccessfulResponses(responses);
  const failed = filterFailedResponses(responses);
  
  const totalWeatherConsiderations = successful.reduce((sum, response) => 
    sum + response.data.regionalAdjustments.weatherConsiderations.length, 0);
  const totalExpertInsights = successful.reduce((sum, response) => 
    sum + response.data.expertInsights.commonMistakes.length + 
    response.data.expertInsights.proTips.length + 
    response.data.expertInsights.costSavingTips.length + 
    response.data.expertInsights.qualityCheckpoints.length, 0);
  const totalProTips = successful.reduce((sum, response) => 
    sum + response.data.expertInsights.proTips.length, 0);
  
  return {
    total: responses.length,
    successful: successful.length,
    failed: failed.length,
    projectIds: extractProjectIds(responses),
    phases: responses.map(r => r.data.phaseId),
    avgWeatherConsiderationsPerPhase: successful.length > 0 ? Math.round(totalWeatherConsiderations / successful.length) : 0,
    avgExpertInsightsPerPhase: successful.length > 0 ? Math.round(totalExpertInsights / successful.length) : 0,
    avgProTipsPerPhase: successful.length > 0 ? Math.round(totalProTips / successful.length) : 0
  };
}
