/**
 * Response Assembler for Hybrid AI Approach
 * 
 * This module handles parsing, validation, and assembly of AI responses
 * with proper project ID tracking and bracketed format parsing.
 */

import {
  BaseAIResponse,
  RegionalAnalysisResponse,
  ProjectContextResponse,
  PhaseSpecificResponse,
  MainRoadmapResponse,
  CompleteProjectResponse,
  ResponseAssemblyStatus,
  isRegionalAnalysisResponse,
  isProjectContextResponse,
  isPhaseSpecificResponse,
  isMainRoadmapResponse,
  validateResponse,
  createErrorResponse
} from './unified-response-types';

// ============================================================================
// RESPONSE PARSING UTILITIES
// ============================================================================

/**
 * Parses bracketed duration format from AI responses
 * Handles: [8] weeks, [40] hours, etc.
 */
export function parseBracketedDuration(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  if (match && match[1]) {
    return `${match[1]} ${pattern.source.includes('weeks') ? 'weeks' : 'hours'}`;
  }
  return null;
}

/**
 * Parses timeline data from phase-specific AI responses
 * Maintains the same bracketed format parsing as current system
 */
export function parseTimelineData(rawTimeline: string): {
  diyDuration: string | null;
  contractorDuration: string | null;
  diyHours: string | null;
  rawTimeline: string;
} {
  // Use the same regex patterns as current system
  const diyMatch = rawTimeline.match(/\*\*Duration\*\*:\s*\[(\d+)\]\s*weeks?/i);
  const contractorMatch = rawTimeline.match(/\*\*Contractor Duration\*\*:\s*\[(\d+)\]\s*weeks?/i);
  const diyHoursMatch = rawTimeline.match(/\*\*DIY Hours\*\*:\s*\[(\d+)\]\s*hours?/i);

  return {
    diyDuration: diyMatch ? `${diyMatch[1]} weeks` : null,
    contractorDuration: contractorMatch ? `${contractorMatch[1]} weeks` : null,
    diyHours: diyHoursMatch ? `${diyHoursMatch[1]} hours` : null,
    rawTimeline
  };
}

/**
 * Parses project ID from AI response text
 * Looks for patterns like "Project ID: abc123" or "projectId: abc123"
 */
export function parseProjectIdFromResponse(text: string): string | null {
  const patterns = [
    /Project ID:\s*([a-zA-Z0-9-_]+)/i,
    /projectId:\s*([a-zA-Z0-9-_]+)/i,
    /project_id:\s*([a-zA-Z0-9-_]+)/i,
    /"projectId":\s*"([a-zA-Z0-9-_]+)"/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parses structured data from AI response text
 * Handles JSON-like responses and structured text
 */
export function parseStructuredData(text: string): any {
  // Try to parse as JSON first
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    // Continue with text parsing if JSON fails
  }

  // Parse structured text format
  const data: any = {};
  
  // Common patterns for structured data
  const patterns = {
    cityState: /City State:\s*([^\n]+)/i,
    primaryClassification: /Primary Classification:\s*([^\n]+)/i,
    secondaryClassifications: /Secondary Classifications:\s*([^\n]+)/i,
    climateZone: /Climate Zone:\s*([^\n]+)/i,
    permitComplexity: /Permit Complexity:\s*([^\n]+)/i,
    inspectionFrequency: /Inspection Frequency:\s*([^\n]+)/i,
    codeStrictness: /Code Strictness:\s*([^\n]+)/i,
    laborAvailability: /Labor Availability:\s*([^\n]+)/i,
    materialCosts: /Material Costs:\s*([^\n]+)/i,
    contractorAvailability: /Contractor Availability:\s*([^\n]+)/i,
    permitTimeline: /Permit Timeline:\s*([^\n]+)/i
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      data[key] = match[1].trim();
    }
  }

  // Parse multipliers
  const multiplierPattern = /(\w+):\s*([\d.]+)/g;
  let multiplierMatch;
  const multipliers: Record<string, number> = {};
  
  while ((multiplierMatch = multiplierPattern.exec(text)) !== null) {
    const key = multiplierMatch[1].toLowerCase().replace(/\s+/g, '');
    const value = parseFloat(multiplierMatch[2]);
    if (!isNaN(value)) {
      multipliers[key] = value;
    }
  }
  
  if (Object.keys(multipliers).length > 0) {
    data.multipliers = multipliers;
  }

  return data;
}

// ============================================================================
// RESPONSE PARSERS
// ============================================================================

/**
 * Parses regional analysis response from AI
 */
export function parseRegionalAnalysisResponse(
  projectId: string,
  rawResponse: string
): RegionalAnalysisResponse {
  try {
    const data = parseStructuredData(rawResponse);
    
    return {
      projectId,
      timestamp: new Date().toISOString(),
      success: true,
      type: 'regional_analysis',
      data: {
        cityState: data.cityState || 'Unknown',
        primaryClassification: data.primaryClassification || 'Standard Region',
        secondaryClassifications: data.secondaryClassifications?.split(',').map((s: string) => s.trim()) || [],
        climateZone: data.climateZone || 'Unknown',
        seasonalFactors: {
          winterLimitations: data.winterLimitations || false,
          summerChallenges: data.summerChallenges || false,
          rainySeason: data.rainySeason || null,
          optimalConstructionMonths: data.optimalConstructionMonths?.split(',').map((s: string) => s.trim()) || []
        },
        regulatoryEnvironment: {
          permitComplexity: data.permitComplexity || 'Standard',
          inspectionFrequency: data.inspectionFrequency || 'Standard',
          codeStrictness: data.codeStrictness || 'Standard',
          specialRequirements: data.specialRequirements?.split(',').map((s: string) => s.trim()) || []
        },
        marketConditions: {
          laborAvailability: data.laborAvailability || 'Medium',
          materialCosts: data.materialCosts || 'Average',
          contractorAvailability: data.contractorAvailability || 'Medium',
          permitTimeline: data.permitTimeline || 'Standard'
        },
        multipliers: {
          weatherDependent: data.multipliers?.weatherDependent || 1.0,
          permitComplexity: data.multipliers?.permitComplexity || 1.0,
          laborAvailability: data.multipliers?.laborAvailability || 1.0,
          materialCosts: data.multipliers?.materialCosts || 1.0
        },
        recommendations: data.recommendations?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
      }
    };
  } catch (error) {
    return createErrorResponse<RegionalAnalysisResponse>(
      projectId,
      'regional_analysis',
      `Failed to parse regional analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Parses project context response from AI
 */
export function parseProjectContextResponse(
  projectId: string,
  rawResponse: string
): ProjectContextResponse {
  try {
    const data = parseStructuredData(rawResponse);
    
    return {
      projectId,
      timestamp: new Date().toISOString(),
      success: true,
      type: 'project_context',
      data: {
        projectDetails: {
          houseSize: data.houseSize || 0,
          foundationType: data.foundationType || 'Unknown',
          numberOfStories: data.numberOfStories || 1,
          constructionMethod: data.constructionMethod || 'Unknown',
          targetStartDate: data.targetStartDate || null
        },
        timelinePreference: data.timelinePreference || 'Standard',
        budgetRange: data.budgetRange || 'Mid-Range',
        projectComplexity: data.projectComplexity || 'Moderate',
        regionalContext: {
          cityState: data.cityState || 'Unknown',
          primaryClassification: data.primaryClassification || 'Standard Region',
          multipliers: data.multipliers || {}
        }
      }
    };
  } catch (error) {
    return createErrorResponse<ProjectContextResponse>(
      projectId,
      'project_context',
      `Failed to parse project context: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Parses phase-specific response from AI
 * Includes timeline parsing with bracketed format support
 */
export function parsePhaseSpecificResponse(
  projectId: string,
  phaseId: string,
  phaseTitle: string,
  constructionMethod: string,
  rawResponse: string
): PhaseSpecificResponse {
  try {
    const data = parseStructuredData(rawResponse);
    const timeline = parseTimelineData(rawResponse);
    
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
        tasks: {
          steps: data.steps?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          qaChecks: data.qaChecks?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          vendorQuestions: data.vendorQuestions?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          vendorNeeds: data.vendorNeeds?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
        },
        helpfulInformation: {
          steps: data.helpfulSteps?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          qaChecks: data.helpfulQaChecks?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          vendorQuestions: data.helpfulVendorQuestions?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          vendorNeeds: data.helpfulVendorNeeds?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
        },
        regionalAdjustments: {
          weatherConsiderations: data.weatherConsiderations?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          permitRequirements: data.permitRequirements?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          localVendorRecommendations: data.localVendorRecommendations?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          seasonalTiming: data.seasonalTiming?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
        },
        expertInsights: {
          commonMistakes: data.commonMistakes?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          proTips: data.proTips?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          costSavingTips: data.costSavingTips?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          qualityCheckpoints: data.qualityCheckpoints?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
        }
      }
    };
  } catch (error) {
    return createErrorResponse<PhaseSpecificResponse>(
      projectId,
      'phase_specific',
      `Failed to parse phase-specific response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Parses main roadmap response from AI
 */
export function parseMainRoadmapResponse(
  projectId: string,
  rawResponse: string
): MainRoadmapResponse {
  try {
    const data = parseStructuredData(rawResponse);
    
    return {
      projectId,
      timestamp: new Date().toISOString(),
      success: true,
      type: 'main_roadmap',
      data: {
        phases: data.phases || [],
        overallTimeline: {
          totalDuration: data.totalDuration || 'Unknown',
          criticalPath: data.criticalPath?.split(',').map((s: string) => s.trim()) || [],
          milestones: data.milestones || []
        },
        recommendations: {
          phaseOrdering: data.phaseOrdering?.split(',').map((s: string) => s.trim()) || [],
          riskMitigation: data.riskMitigation?.split('\n').map((s: string) => s.trim()).filter(Boolean) || [],
          resourceAllocation: data.resourceAllocation?.split('\n').map((s: string) => s.trim()).filter(Boolean) || []
        }
      }
    };
  } catch (error) {
    return createErrorResponse<MainRoadmapResponse>(
      projectId,
      'main_roadmap',
      `Failed to parse main roadmap response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// ============================================================================
// RESPONSE ASSEMBLER
// ============================================================================

/**
 * Assembles complete project response from individual AI responses
 */
export function assembleCompleteProjectResponse(
  projectId: string,
  userId: string,
  responses: {
    regionalAnalysis?: RegionalAnalysisResponse;
    projectContext?: ProjectContextResponse;
    mainRoadmap?: MainRoadmapResponse;
    phaseResponses: PhaseSpecificResponse[];
  }
): CompleteProjectResponse {
  const timestamp = new Date().toISOString();
  
  return {
    projectId,
    userId,
    timestamp,
    regionalAnalysis: responses.regionalAnalysis?.data || {
      cityState: 'Unknown',
      primaryClassification: 'Standard Region',
      secondaryClassifications: [],
      climateZone: 'Unknown',
      seasonalFactors: {
        winterLimitations: false,
        summerChallenges: false,
        rainySeason: null,
        optimalConstructionMonths: []
      },
      regulatoryEnvironment: {
        permitComplexity: 'Standard',
        inspectionFrequency: 'Standard',
        codeStrictness: 'Standard',
        specialRequirements: []
      },
      marketConditions: {
        laborAvailability: 'Medium',
        materialCosts: 'Average',
        contractorAvailability: 'Medium',
        permitTimeline: 'Standard'
      },
      multipliers: {
        weatherDependent: 1.0,
        permitComplexity: 1.0,
        laborAvailability: 1.0,
        materialCosts: 1.0
      },
      recommendations: []
    },
    projectContext: responses.projectContext?.data || {
      projectDetails: {
        houseSize: 0,
        foundationType: 'Unknown',
        numberOfStories: 1,
        constructionMethod: 'Unknown',
        targetStartDate: null
      },
      timelinePreference: 'Standard',
      budgetRange: 'Mid-Range',
      projectComplexity: 'Moderate',
      regionalContext: {
        cityState: 'Unknown',
        primaryClassification: 'Standard Region',
        multipliers: {}
      }
    },
    mainRoadmap: responses.mainRoadmap?.data || {
      phases: [],
      overallTimeline: {
        totalDuration: 'Unknown',
        criticalPath: [],
        milestones: []
      },
      recommendations: {
        phaseOrdering: [],
        riskMitigation: [],
        resourceAllocation: []
      }
    },
    phaseResponses: responses.phaseResponses.map(response => response.data),
    metadata: {
      totalPhases: responses.phaseResponses.length,
      completedPhases: responses.phaseResponses.filter(r => r.success).length,
      lastUpdated: timestamp,
      version: '1.0.0'
    }
  };
}

/**
 * Tracks assembly status for parallel processing
 */
export function createAssemblyStatus(
  projectId: string,
  userId: string,
  requiredServices: string[]
): ResponseAssemblyStatus {
  return {
    projectId,
    userId,
    status: 'pending',
    completedServices: [],
    pendingServices: [...requiredServices],
    errors: [],
    startedAt: new Date().toISOString()
  };
}

/**
 * Updates assembly status when a service completes
 */
export function updateAssemblyStatus(
  status: ResponseAssemblyStatus,
  service: string,
  success: boolean,
  error?: string
): ResponseAssemblyStatus {
  const updatedStatus = { ...status };
  
  if (success) {
    updatedStatus.completedServices.push(service);
    updatedStatus.pendingServices = updatedStatus.pendingServices.filter(s => s !== service);
  } else {
    updatedStatus.errors.push({
      service,
      error: error || 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
  
  // Update overall status
  if (updatedStatus.pendingServices.length === 0) {
    updatedStatus.status = updatedStatus.errors.length === 0 ? 'completed' : 'failed';
    updatedStatus.completedAt = new Date().toISOString();
  } else {
    updatedStatus.status = 'in_progress';
  }
  
  return updatedStatus;
}

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

/**
 * Validates all responses before assembly
 */
export function validateAllResponses(responses: {
  regionalAnalysis?: RegionalAnalysisResponse;
  projectContext?: ProjectContextResponse;
  mainRoadmap?: MainRoadmapResponse;
  phaseResponses: PhaseSpecificResponse[];
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Validate each response
  if (responses.regionalAnalysis) {
    const validation = validateResponse(responses.regionalAnalysis);
    if (!validation.valid) {
      errors.push(`Regional Analysis: ${validation.errors.join(', ')}`);
    }
  }
  
  if (responses.projectContext) {
    const validation = validateResponse(responses.projectContext);
    if (!validation.valid) {
      errors.push(`Project Context: ${validation.errors.join(', ')}`);
    }
  }
  
  if (responses.mainRoadmap) {
    const validation = validateResponse(responses.mainRoadmap);
    if (!validation.valid) {
      errors.push(`Main Roadmap: ${validation.errors.join(', ')}`);
    }
  }
  
  responses.phaseResponses.forEach((response, index) => {
    const validation = validateResponse(response);
    if (!validation.valid) {
      errors.push(`Phase Response ${index + 1}: ${validation.errors.join(', ')}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
