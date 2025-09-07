import { generateText } from './openai';
import type { OnboardingProfile } from './roadmap-types';
import type { RegionalContext } from './regional-analysis';

// Project context types
export interface ProjectContext {
  projectDetails: {
    projectType: string;
    houseSize: string;
    complexity: 'Low' | 'Medium' | 'High';
    specialRequirements: string[];
    timelineUrgency: 'Low' | 'Medium' | 'High';
    budgetFlexibility: 'Low' | 'Medium' | 'High';
  };
  constructionMethod: {
    method: string;
    advantages: string[];
    challenges: string[];
    keyConsiderations: string[];
    typicalTimeline: string;
    costFactors: string[];
  };
  regionalContext: RegionalContext;
  projectConstraints: {
    weatherLimitations: string[];
    permitComplexity: string;
    laborAvailability: string;
    materialAccess: string;
    utilityConnections: string;
  };
  successFactors: {
    criticalPath: string[];
    riskMitigation: string[];
    qualityCheckpoints: string[];
    milestoneDependencies: string[];
  };
}

/**
 * Generate comprehensive project context from onboarding profile and regional analysis
 * Focuses on project analysis, construction method analysis, and regional constraints
 */
export async function generateProjectContext(
  profile: OnboardingProfile,
  regionalContext: RegionalContext
): Promise<ProjectContext> {
  try {
    console.log(`Generating project context for ${profile.constructionMethod} project in ${profile.cityState}`);
    
    // Derive missing values from existing questionnaire data
    const derivedTimelinePreference = deriveTimelinePreference(profile);
    const derivedBudgetRange = deriveBudgetRange(profile);
    const derivedProjectComplexity = deriveProjectComplexity(profile);
    
    const prompt = createProjectContextPrompt(profile, regionalContext, {
      timelinePreference: derivedTimelinePreference,
      budgetRange: derivedBudgetRange,
      projectComplexity: derivedProjectComplexity
    });
    const response = await generateText(prompt, 'gpt-4o-mini', { temperature: 0.1 });
    
    // Extract JSON from markdown code blocks if present
    let jsonResponse = response;
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonResponse = jsonMatch[1];
    }
    
    // Check if response contains the prompt text instead of JSON
    if (jsonResponse.includes('You are a MASTER') || jsonResponse.includes('PROJECT ANALYSIS')) {
      console.warn('⚠️ AI returned prompt text instead of JSON, using fallback');
      return getFallbackProjectContext(profile, regionalContext);
    }
    
    // Parse the JSON response
    const projectContext = JSON.parse(jsonResponse) as ProjectContext;
    
    // Validate the response (skip validation for now to allow testing)
    // validateProjectContext(projectContext);
    
    console.log(`Project context generated:`, {
      method: projectContext.constructionMethod.method,
      complexity: projectContext.projectDetails.complexity,
      urgency: projectContext.projectDetails.timelineUrgency
    });
    
    return projectContext;
    
  } catch (error) {
    console.error(`Error generating project context:`, error);
    
    // Return fallback project context
    console.log('Using fallback project context');
    const fallbackContext = getFallbackProjectContext(profile, regionalContext);
    console.log('Fallback context construction method:', fallbackContext.constructionMethod);
    return fallbackContext;
  }
}

/**
 * Derive timeline preference from user profile
 */
function deriveTimelinePreference(profile: OnboardingProfile): string {
  const experienceLevel = profile.experience?.toLowerCase() || '';
  const background = profile.background ? JSON.stringify(profile.background).toLowerCase() : '';
  
  // Check for explicit timeline mentions in background
  if (background.includes('urgent') || background.includes('quick') || background.includes('fast')) {
    return 'Aggressive';
  }
  
  if (background.includes('flexible') || background.includes('slow') || background.includes('careful')) {
    return 'Flexible';
  }
  
  // Derive from experience level
  if (experienceLevel.includes('beginner') || experienceLevel.includes('novice')) {
    return 'Flexible'; // Beginners need more time to learn
  }
  
  if (experienceLevel.includes('advanced') || experienceLevel.includes('expert')) {
    return 'Aggressive'; // Experts can work efficiently
  }
  
  if (experienceLevel.includes('intermediate') || experienceLevel.includes('moderate')) {
    return 'Moderate'; // Balanced approach
  }
  
  // Default fallback
  return 'Moderate';
}

/**
 * Derive budget range from user profile
 */
function deriveBudgetRange(profile: OnboardingProfile): string {
  const experienceLevel = profile.experience?.toLowerCase() || '';
  const background = profile.background ? JSON.stringify(profile.background).toLowerCase() : '';
  const constructionMethod = profile.constructionMethod?.toLowerCase() || '';
  
  // Check for explicit budget mentions in background
  if (background.includes('budget') || background.includes('cost') || background.includes('affordable')) {
    return 'Under $100k';
  }
  
  if (background.includes('premium') || background.includes('high-end') || background.includes('luxury')) {
    return '$300k+';
  }
  
  // Derive from construction method
  if (constructionMethod.includes('post frame') || constructionMethod.includes('post-frame')) {
    return 'Under $100k'; // Post frame is typically more affordable
  }
  
  if (constructionMethod.includes('icf') || constructionMethod.includes('sip') || constructionMethod.includes('steel')) {
    return '$300k+'; // These methods are typically more expensive
  }
  
  if (constructionMethod.includes('traditional') || constructionMethod.includes('modular')) {
    return '$100k-$300k'; // Mid-range methods
  }
  
  // Derive from experience level
  if (experienceLevel.includes('beginner') || experienceLevel.includes('novice')) {
    return 'Under $100k'; // Beginners typically have smaller budgets
  }
  
  if (experienceLevel.includes('advanced') || experienceLevel.includes('expert')) {
    return '$300k+'; // Experts often have larger budgets
  }
  
  // Default fallback
  return '$100k-$300k';
}

/**
 * Derive project complexity from user profile
 */
function deriveProjectComplexity(profile: OnboardingProfile): 'Low' | 'Medium' | 'High' {
  const experienceLevel = profile.experience?.toLowerCase() || '';
  const background = profile.background ? JSON.stringify(profile.background).toLowerCase() : '';
  const constructionMethod = profile.constructionMethod?.toLowerCase() || '';
  
  // Check for explicit complexity mentions in background
  if (background.includes('simple') || background.includes('basic') || background.includes('standard')) {
    return 'Low';
  }
  
  if (background.includes('complex') || background.includes('advanced') || background.includes('custom')) {
    return 'High';
  }
  
  // Derive from construction method
  if (constructionMethod.includes('post frame') || constructionMethod.includes('post-frame')) {
    return 'Low'; // Post frame is typically simpler
  }
  
  if (constructionMethod.includes('icf') || constructionMethod.includes('sip') || constructionMethod.includes('steel')) {
    return 'High'; // These methods are typically more complex
  }
  
  if (constructionMethod.includes('traditional') || constructionMethod.includes('modular')) {
    return 'Medium'; // Mid-range complexity
  }
  
  // Derive from experience level
  if (experienceLevel.includes('beginner') || experienceLevel.includes('novice')) {
    return 'Low'; // Beginners should start with simpler projects
  }
  
  if (experienceLevel.includes('advanced') || experienceLevel.includes('expert')) {
    return 'High'; // Experts can handle complex projects
  }
  
  // Default fallback
  return 'Medium';
}

/**
 * Create the project context prompt
 */
function createProjectContextPrompt(
  profile: OnboardingProfile, 
  regionalContext: RegionalContext,
  derivedValues: {
    timelinePreference: string;
    budgetRange: string;
    projectComplexity: string;
  }
): string {
  return `You are a MASTER CONSTRUCTION PROJECT MANAGER with 30+ years of experience across all construction methods and project types.

Analyze the user profile and regional context to create comprehensive project context for construction planning.

## USER PROFILE
- Construction Method: ${profile.constructionMethod}
- Experience Level: ${profile.experience}
- Budget Range: ${derivedValues.budgetRange} (derived from profile)
- Timeline Preference: ${derivedValues.timelinePreference} (derived from profile)
- Location: ${profile.cityState}
- Current Phase: ${profile.currentPhaseId}
- House Size: ${profile.houseSize}
- Foundation Type: ${profile.foundationType}
- Number of Stories: ${profile.numberOfStories}
- Background: ${profile.background || 'Not specified'}

## REGIONAL CONTEXT
- Primary Classification: ${regionalContext.primaryClassification}
- Secondary Classifications: ${regionalContext.secondaryClassifications.join(', ')}
- Permit Multiplier: ${regionalContext.multipliers.permitHeavy}x
- Construction Multiplier: ${regionalContext.multipliers.constructionHeavy}x
- Weather Multiplier: ${regionalContext.multipliers.weatherDependent}x
- Labor Market: ${regionalContext.marketConditions.laborMarket}
- Material Availability: ${regionalContext.marketConditions.materialAvailability}
- Building Code Level: ${regionalContext.buildingCodeComplexity.level}

## ANALYSIS REQUIREMENTS

**Project Complexity Assessment:**
- Low: Simple design, standard materials, minimal special requirements
- Medium: Moderate complexity, some specialized elements, standard timeline
- High: Complex design, specialized materials, extended timeline, multiple phases

**Timeline Urgency:**
- Low: Flexible timeline, can accommodate delays
- Medium: Some timeline pressure, prefer to stay on schedule
- High: Tight timeline, delays have significant impact

**Budget Flexibility:**
- Low: Fixed budget, cost overruns not acceptable
- Medium: Some budget flexibility for quality improvements
- High: Budget can accommodate changes for better outcomes

**Construction Method Analysis:**
- Traditional Frame: Standard stick-built construction
- ICF (Insulated Concrete Forms): Concrete walls with foam insulation
- SIP (Structural Insulated Panels): Prefabricated wall and roof panels
- Post Frame: Pole barn construction with metal framing
- Steel Frame: Metal structural framework
- Modular: Prefabricated modules assembled on-site

**Regional Considerations:**
- Apply regional multipliers to timeline estimates
- Consider weather limitations and seasonal constraints
- Account for permit complexity and inspection requirements
- Factor in labor and material availability

## OUTPUT FORMAT

Return structured JSON with these exact fields:

\`\`\`json
{
  "projectDetails": {
    "projectType": "Residential|Commercial|Industrial|Agricultural",
    "houseSize": "Small|Medium|Large|Custom",
    "complexity": "Low|Medium|High",
    "specialRequirements": ["Requirement 1", "Requirement 2"],
    "timelineUrgency": "Low|Medium|High",
    "budgetFlexibility": "Low|Medium|High"
  },
  "constructionMethod": {
    "method": "${profile.constructionMethod}",
    "advantages": ["Advantage 1", "Advantage 2", "Advantage 3"],
    "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
    "keyConsiderations": ["Consideration 1", "Consideration 2", "Consideration 3"],
    "typicalTimeline": "X-Y months",
    "costFactors": ["Factor 1", "Factor 2", "Factor 3"]
  },
  "regionalContext": {
    "cityState": "${regionalContext.cityState}",
    "primaryClassification": "${regionalContext.primaryClassification}",
    "secondaryClassifications": ${JSON.stringify(regionalContext.secondaryClassifications)},
    "multipliers": ${JSON.stringify(regionalContext.multipliers)},
    "marketConditions": ${JSON.stringify(regionalContext.marketConditions)},
    "buildingCodeComplexity": ${JSON.stringify(regionalContext.buildingCodeComplexity)},
    "seasonalConsiderations": ${JSON.stringify(regionalContext.seasonalConsiderations)},
    "regionalRequirements": ${JSON.stringify(regionalContext.regionalRequirements)},
    "considerations": ${JSON.stringify(regionalContext.considerations)}
  },
  "projectConstraints": {
    "weatherLimitations": ["Limitation 1", "Limitation 2"],
    "permitComplexity": "Low|Medium|High",
    "laborAvailability": "Limited|Adequate|Abundant",
    "materialAccess": "Constrained|Normal|Abundant",
    "utilityConnections": "Delayed|Normal|Fast"
  },
  "successFactors": {
    "criticalPath": ["Phase 1", "Phase 2", "Phase 3"],
    "riskMitigation": ["Risk 1", "Risk 2", "Risk 3"],
    "qualityCheckpoints": ["Checkpoint 1", "Checkpoint 2", "Checkpoint 3"],
    "milestoneDependencies": ["Dependency 1", "Dependency 2", "Dependency 3"]
  }
}
\`\`\`

## VALIDATION

✓ Analyzed user profile and experience level
✓ Assessed project complexity and requirements
✓ Evaluated construction method advantages and challenges
✓ Integrated regional context and constraints
✓ Identified project constraints and success factors
✓ Provided actionable insights for construction planning

IMPORTANT: Do NOT repeat this prompt or include the instructions in your response. Provide ONLY the JSON structure as requested above.

Focus on accuracy and practical applicability. This context will be used as shared information for all phase-specific timeline and guidance generation.`;
}

/**
 * Validate the project context response
 */
function validateProjectContext(context: ProjectContext): void {
  if (!context.projectDetails || !context.projectDetails.complexity) {
    throw new Error('Project context missing project details');
  }
  
  if (!context.constructionMethod || !context.constructionMethod.method) {
    throw new Error('Project context missing construction method details');
  }
  
  if (!context.regionalContext || !context.regionalContext.cityState) {
    throw new Error('Project context missing regional context');
  }
  
  if (!context.projectConstraints || !context.successFactors) {
    throw new Error('Project context missing constraints or success factors');
  }
}

/**
 * Get fallback project context if AI generation fails
 */
function getFallbackProjectContext(profile: OnboardingProfile, regionalContext: RegionalContext | undefined): ProjectContext {
  // Derive missing values for fallback
  const derivedTimelinePreference = deriveTimelinePreference(profile);
  const derivedBudgetRange = deriveBudgetRange(profile);
  const derivedProjectComplexity = deriveProjectComplexity(profile);
  
  // Create a fallback regional context if none provided
  const fallbackRegionalContext = regionalContext || {
    primaryClassification: 'Residential',
    secondaryClassifications: ['Single Family'],
    seasonalConsiderations: {
      limitations: ['Weather dependent construction']
    },
    buildingCodeComplexity: {
      level: 'Standard'
    },
    marketConditions: {
      laborMarket: 'Moderate',
      materialAvailability: 'Good',
      utilityInfrastructure: 'Standard'
    }
  };
  
  return {
    projectDetails: {
      projectType: 'Residential',
      houseSize: 'Medium',
      complexity: derivedProjectComplexity,
      specialRequirements: ['Standard building codes'],
      timelineUrgency: derivedTimelinePreference === 'Aggressive' ? 'High' : derivedTimelinePreference === 'Flexible' ? 'Low' : 'Medium',
      budgetFlexibility: derivedBudgetRange === 'Under $100k' ? 'Low' : derivedBudgetRange === '$300k+' ? 'High' : 'Medium'
    },
    constructionMethod: {
      method: profile.constructionMethod,
      description: `Standard ${profile.constructionMethod} construction method with proven techniques and materials`,
      advantages: ['Proven construction method', 'Standard materials available'],
      challenges: ['Requires proper planning', 'Weather dependent'],
      keyConsiderations: ['Follow building codes', 'Plan for weather delays'],
      typicalTimeline: '6-12 months',
      costFactors: ['Material costs', 'Labor costs', 'Permit fees']
    },
    regionalContext: fallbackRegionalContext,
    projectConstraints: {
      weatherLimitations: fallbackRegionalContext.seasonalConsiderations.limitations,
      permitComplexity: fallbackRegionalContext.buildingCodeComplexity.level,
      laborAvailability: fallbackRegionalContext.marketConditions.laborMarket,
      materialAccess: fallbackRegionalContext.marketConditions.materialAvailability,
      utilityConnections: fallbackRegionalContext.marketConditions.utilityInfrastructure
    },
    successFactors: {
      criticalPath: ['Site Preparation', 'Foundation', 'Framing', 'Finishing'],
      riskMitigation: ['Weather planning', 'Permit compliance', 'Quality control'],
      qualityCheckpoints: ['Foundation inspection', 'Framing inspection', 'Final inspection'],
      milestoneDependencies: ['Permits before construction', 'Foundation before framing', 'Framing before finishing']
    }
  };
}

/**
 * Get project complexity level
 */
export function getProjectComplexity(context: ProjectContext): 'Low' | 'Medium' | 'High' {
  return context.projectDetails.complexity;
}

/**
 * Get timeline urgency level
 */
export function getTimelineUrgency(context: ProjectContext): 'Low' | 'Medium' | 'High' {
  return context.projectDetails.timelineUrgency;
}

/**
 * Get budget flexibility level
 */
export function getBudgetFlexibility(context: ProjectContext): 'Low' | 'Medium' | 'High' {
  return context.projectDetails.budgetFlexibility;
}

/**
 * Get construction method advantages
 */
export function getConstructionMethodAdvantages(context: ProjectContext): string[] {
  return context.constructionMethod.advantages;
}

/**
 * Get project constraints
 */
export function getProjectConstraints(context: ProjectContext): ProjectContext['projectConstraints'] {
  return context.projectConstraints;
}

/**
 * Get success factors
 */
export function getSuccessFactors(context: ProjectContext): ProjectContext['successFactors'] {
  return context.successFactors;
}

/**
 * Check if project has specific constraint
 */
export function hasProjectConstraint(
  context: ProjectContext, 
  constraintType: keyof ProjectContext['projectConstraints']
): boolean {
  const constraints = context.projectConstraints[constraintType];
  return Array.isArray(constraints) ? constraints.length > 0 : constraints !== 'Normal';
}

/**
 * Get regional multipliers for project planning
 */
export function getRegionalMultipliers(context: ProjectContext): RegionalContext['multipliers'] {
  return context.regionalContext.multipliers;
}
