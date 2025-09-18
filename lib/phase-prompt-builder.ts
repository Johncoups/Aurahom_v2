/**
 * Phase Prompt Builder for Hybrid AI Approach
 * 
 * This module generates focused, expert-level prompts for individual construction phases
 * with proper project ID integration and shared context.
 */

import { OnboardingProfile } from './roadmap-types';
import { RegionalContext } from './regional-analysis';
import { ProjectContext } from './project-context';
import { UserProfile } from './user-profile-builder';

// ============================================================================
// PHASE PROMPT CONFIGURATION
// ============================================================================

/**
 * Phase-specific expert personas and their specialties
 * Based on actual phase IDs from roadmap-phases.ts
 */
export const PHASE_EXPERTS = {
  'just-starting': {
    title: 'PROJECT INITIATION EXPERT',
    expertise: 'Project planning, scope definition, goal setting, initial research',
    experience: '30+ years in construction project management and planning'
  },
  'pre-construction': {
    title: 'PRE-CONSTRUCTION PLANNING EXPERT',
    expertise: 'Permits, contracts, financing, scheduling, risk management',
    experience: '25+ years in pre-construction planning and project coordination'
  },
  'site-prep-excavation': {
    title: 'SITE PREPARATION & EXCAVATION EXPERT',
    expertise: 'Site analysis, excavation, utility connections, foundation preparation',
    experience: '30+ years in site development and excavation'
  },
  'utilities-septic': {
    title: 'UTILITIES & SEPTIC EXPERT',
    expertise: 'Utility connections, septic systems, water, sewer, electrical service',
    experience: '25+ years in utility installation and septic system design'
  },
  'foundation': {
    title: 'FOUNDATION CONSTRUCTION EXPERT',
    expertise: 'Concrete work, foundation systems, waterproofing, structural integrity',
    experience: '25+ years in foundation construction and structural engineering'
  },
  'under-slab-services': {
    title: 'UNDER-SLAB SERVICES EXPERT',
    expertise: 'Under-slab plumbing, electrical conduits, utility installation, pressure testing',
    experience: '25+ years in under-slab utility installation and pre-slab work'
  },
  'icf-foundation-walls': {
    title: 'ICF FOUNDATION WALLS EXPERT',
    expertise: 'Insulated Concrete Forms, foundation walls, energy efficiency',
    experience: '20+ years in ICF construction and foundation systems'
  },
  'rough-framing': {
    title: 'ROUGH FRAMING EXPERT',
    expertise: 'Structural framing, load calculations, building envelope, code compliance',
    experience: '30+ years in residential framing and structural systems'
  },
  'rough-framing-post-frame': {
    title: 'POST-FRAME ROUGH FRAMING EXPERT',
    expertise: 'Post-frame construction, large structural posts, metal building systems',
    experience: '25+ years in post-frame construction and agricultural building'
  },
  'rough-framing-icf': {
    title: 'ICF ROUGH FRAMING EXPERT',
    expertise: 'ICF-specific framing, connection details, energy-efficient construction',
    experience: '20+ years in ICF construction and energy-efficient building'
  },
  'rough-framing-sip': {
    title: 'SIP ROUGH FRAMING EXPERT',
    expertise: 'Structural Insulated Panels, panel connections, precision installation',
    experience: '20+ years in SIP construction and panelized building systems'
  },
  'rough-framing-modular': {
    title: 'MODULAR ROUGH FRAMING EXPERT',
    expertise: 'Modular construction, module connections, factory-built components',
    experience: '25+ years in modular construction and prefabricated building'
  },
  'post-frame-structure': {
    title: 'POST-FRAME STRUCTURE EXPERT',
    expertise: 'Post-frame buildings, large spans, agricultural construction, metal systems',
    experience: '30+ years in post-frame construction and agricultural building'
  },
  'sip-panel-installation': {
    title: 'SIP PANEL INSTALLATION EXPERT',
    expertise: 'Structural Insulated Panels, crane operations, panel connections',
    experience: '20+ years in SIP installation and panelized construction'
  },
  'modular-delivery-setup': {
    title: 'MODULAR DELIVERY & SETUP EXPERT',
    expertise: 'Modular delivery, crane operations, module placement, connections',
    experience: '25+ years in modular construction and delivery logistics'
  },
  'roofing': {
    title: 'ROOFING EXPERT',
    expertise: 'Roof systems, weatherproofing, ventilation, structural support',
    experience: '30+ years in residential and commercial roofing'
  },
  'exterior': {
    title: 'EXTERIOR FINISHES EXPERT',
    expertise: 'Siding, windows, doors, weather barriers, exterior systems',
    experience: '25+ years in exterior construction and weatherproofing'
  },
  'plumbing-rough': {
    title: 'PLUMBING ROUGH-IN EXPERT',
    expertise: 'Water systems, drainage, rough-in installation, code compliance',
    experience: '25+ years in residential plumbing and water systems'
  },
  'concrete-slabs': {
    title: 'CONCRETE SLABS EXPERT',
    expertise: 'Concrete work, slab preparation, finishing, curing, quality control',
    experience: '25+ years in concrete construction and slab work'
  },
  'electrical-rough': {
    title: 'ELECTRICAL ROUGH-IN EXPERT',
    expertise: 'Electrical systems, rough-in installation, safety, code compliance',
    experience: '30+ years in residential electrical systems'
  },
  'hvac-rough': {
    title: 'HVAC ROUGH-IN EXPERT',
    expertise: 'Heating, cooling, ventilation, ductwork, energy efficiency',
    experience: '25+ years in residential HVAC and energy systems'
  },
  'insulation': {
    title: 'INSULATION EXPERT',
    expertise: 'Thermal performance, air sealing, energy efficiency, comfort',
    experience: '20+ years in residential insulation and energy systems'
  },
  'drywall': {
    title: 'DRYWALL EXPERT',
    expertise: 'Wall systems, finishing, texture, paint preparation',
    experience: '25+ years in drywall installation and finishing'
  },
  'paint': {
    title: 'PAINTING EXPERT',
    expertise: 'Interior painting, color selection, surface preparation, finishing',
    experience: '20+ years in residential painting and interior finishing'
  },
  'trim-carpentry': {
    title: 'TRIM CARPENTRY EXPERT',
    expertise: 'Trim work, molding, doors, windows, finish carpentry',
    experience: '25+ years in finish carpentry and trim installation'
  },
  'flooring': {
    title: 'FLOORING EXPERT',
    expertise: 'Floor systems, materials, installation, durability, maintenance',
    experience: '25+ years in residential flooring systems'
  },
  'kitchen-bath': {
    title: 'KITCHEN & BATH EXPERT',
    expertise: 'Kitchen and bathroom design, fixtures, cabinetry, functionality',
    experience: '30+ years in kitchen and bathroom construction and design'
  },
  'final-touches': {
    title: 'FINAL TOUCHES EXPERT',
    expertise: 'Final details, hardware, cleaning, quality control, walkthrough',
    experience: '25+ years in construction finishing and quality assurance'
  },
  'electrical': {
    title: 'ELECTRICAL EXPERT',
    expertise: 'Electrical systems, wiring, outlets, fixtures, code compliance, safety',
    experience: '25+ years in electrical installation and maintenance'
  },
  'plumbing': {
    title: 'PLUMBING EXPERT',
    expertise: 'Plumbing systems, pipes, fixtures, water supply, drainage, code compliance',
    experience: '25+ years in plumbing installation and maintenance'
  },
  'hvac': {
    title: 'HVAC EXPERT',
    expertise: 'Heating, ventilation, air conditioning, ductwork, energy efficiency',
    experience: '25+ years in HVAC installation and maintenance'
  },
  'insulation': {
    title: 'INSULATION EXPERT',
    expertise: 'Insulation materials, energy efficiency, moisture control, air sealing',
    experience: '20+ years in insulation installation and energy efficiency'
  },
  'drywall': {
    title: 'DRYWALL EXPERT',
    expertise: 'Drywall installation, taping, mudding, sanding, texture, finishing',
    experience: '20+ years in drywall installation and finishing'
  },
  'flooring': {
    title: 'FLOORING EXPERT',
    expertise: 'Flooring materials, installation, subfloor preparation, finishing',
    experience: '20+ years in flooring installation and maintenance'
  },
  'finishing': {
    title: 'FINISHING EXPERT',
    expertise: 'Final finishes, trim work, paint, fixtures, final inspections',
    experience: '25+ years in finishing work and final construction details'
  },
  'roofing': {
    title: 'ROOFING EXPERT',
    expertise: 'Roofing systems, materials, installation, weatherproofing, ventilation',
    experience: '25+ years in roofing installation and maintenance'
  },
  'exterior': {
    title: 'EXTERIOR EXPERT',
    expertise: 'Exterior finishes, siding, windows, doors, weatherproofing',
    experience: '25+ years in exterior construction and finishing'
  },
  'plumbing-rough': {
    title: 'ROUGH PLUMBING EXPERT',
    expertise: 'Rough plumbing, pipe installation, water supply, drainage systems',
    experience: '25+ years in plumbing installation and rough-in work'
  },
  'electrical-rough': {
    title: 'ROUGH ELECTRICAL EXPERT',
    expertise: 'Rough electrical, wiring, outlets, electrical panels, code compliance',
    experience: '25+ years in electrical installation and rough-in work'
  },
  'hvac-rough': {
    title: 'ROUGH HVAC EXPERT',
    expertise: 'HVAC rough-in, ductwork, ventilation, system installation',
    experience: '25+ years in HVAC installation and rough-in work'
  },
  'paint': {
    title: 'PAINTING EXPERT',
    expertise: 'Interior painting, color selection, surface preparation, finishing',
    experience: '20+ years in residential painting and interior finishing'
  },
  'trim-carpentry': {
    title: 'TRIM CARPENTRY EXPERT',
    expertise: 'Trim work, molding, doors, windows, finish carpentry',
    experience: '25+ years in finish carpentry and trim installation'
  },
  'kitchen-bath': {
    title: 'KITCHEN & BATH EXPERT',
    expertise: 'Kitchen and bathroom design, fixtures, cabinetry, functionality',
    experience: '30+ years in kitchen and bathroom construction and design'
  },
  'final-touches': {
    title: 'FINAL TOUCHES EXPERT',
    expertise: 'Final details, hardware, cleaning, quality control, walkthrough',
    experience: '25+ years in construction finishing and quality assurance'
  },
  'post-frame-structure': {
    title: 'POST FRAME STRUCTURE EXPERT',
    expertise: 'Post frame construction, metal buildings, structural engineering, connections',
    experience: '30+ years in post frame and metal building construction'
  },
  'icf-foundation-walls': {
    title: 'ICF FOUNDATION EXPERT',
    expertise: 'ICF construction, concrete forms, insulation, structural design',
    experience: '25+ years in ICF construction and concrete work'
  },
  'sip-panel-installation': {
    title: 'SIP PANEL EXPERT',
    expertise: 'SIP panel installation, structural insulated panels, energy efficiency',
    experience: '25+ years in SIP construction and panel installation'
  },
  'modular-delivery-setup': {
    title: 'MODULAR CONSTRUCTION EXPERT',
    expertise: 'Modular home delivery, crane operations, site preparation, connections',
    experience: '30+ years in modular construction and delivery'
  },
  'rough-framing-post-frame': {
    title: 'POST FRAME ROUGH EXPERT',
    expertise: 'Post frame rough framing, metal connections, structural details',
    experience: '25+ years in post frame rough framing'
  },
  'rough-framing-icf': {
    title: 'ICF ROUGH EXPERT',
    expertise: 'ICF rough framing, concrete integration, structural connections',
    experience: '25+ years in ICF rough framing'
  },
  'rough-framing-sip': {
    title: 'SIP ROUGH EXPERT',
    expertise: 'SIP rough framing, panel integration, structural connections',
    experience: '25+ years in SIP rough framing'
  },
  'rough-framing-modular': {
    title: 'MODULAR ROUGH EXPERT',
    expertise: 'Modular rough framing, unit connections, structural integration',
    experience: '25+ years in modular rough framing'
  }
} as const;

/**
 * Construction method specific considerations
 */
export const CONSTRUCTION_METHOD_GUIDANCE = {
  'traditional-frame': {
    description: 'Traditional stick-built construction with dimensional lumber',
    keyConsiderations: [
      'Standard 16" or 24" on-center framing',
      'Conventional foundation requirements',
      'Standard insulation and air sealing',
      'Traditional sequencing and timing'
    ]
  },
  'post-frame': {
    description: 'Post-frame construction with large structural posts',
    keyConsiderations: [
      'Large post spacing (8-12 feet)',
      'Metal building components',
      'Simplified foundation requirements',
      'Faster construction timeline',
      'Agricultural/commercial applications'
    ]
  },
  'barndominium': {
    description: 'Barndominium construction combining metal building with residential finishes',
    keyConsiderations: [
      'Metal frame structure with residential interior',
      'Open floor plan design',
      'Energy efficient construction',
      'Modern aesthetic with industrial elements',
      'Cost-effective building method'
    ]
  },
  'icf': {
    description: 'Insulated Concrete Forms construction',
    keyConsiderations: [
      'Concrete form system',
      'Superior insulation values',
      'Complex electrical and plumbing rough-ins',
      'Specialized contractor requirements',
      'Energy efficiency benefits'
    ]
  },
  'sip': {
    description: 'Structural Insulated Panels construction',
    keyConsiderations: [
      'Pre-fabricated panel system',
      'Precise measurements and planning',
      'Crane requirements for installation',
      'Specialized connection details',
      'Energy efficiency and speed benefits'
    ]
  },
  'modular': {
    description: 'Modular/pre-fabricated construction',
    keyConsiderations: [
      'Factory-built components',
      'Transportation and crane requirements',
      'Site preparation for modules',
      'Connection and finishing details',
      'Quality control and inspection'
    ]
  }
} as const;

// ============================================================================
// PHASE PROMPT BUILDER
// ============================================================================

/**
 * Generates a focused prompt for a specific construction phase
 */
export function createPhasePrompt(
  phaseId: string,
  phaseTitle: string,
  userProfile: UserProfile,
  regionalContext: RegionalContext,
  projectContext: ProjectContext,
  projectId: string
): string {
  const expert = PHASE_EXPERTS[phaseId as keyof typeof PHASE_EXPERTS];
  const constructionMethod = CONSTRUCTION_METHOD_GUIDANCE[projectContext.constructionMethod?.method as keyof typeof CONSTRUCTION_METHOD_GUIDANCE];
  
  if (!expert) {
    throw new Error(`Unknown phase: ${phaseId}`);
  }

  return `You are a ${expert.title} with ${expert.experience}.

PROJECT ID: ${projectId}
PHASE: ${phaseTitle} (${phaseId})
CONSTRUCTION METHOD: ${userProfile.constructionMethod}

EXPERTISE AREA
${expert.expertise}

USER PROFILE
Experience Level: ${userProfile.experience}
Location: ${userProfile.userInfo.cityState}
DIY Commitment: ${userProfile.diyCommitment}
Subcontractor Help: ${userProfile.subcontractorHelp}
Physical Constraints: ${userProfile.physicalConstraints?.join(', ') || 'None specified'}
Long-term Goals: ${userProfile.longTermGoals?.join(', ') || 'Not specified'}

PROJECT DETAILS
House Size: ${projectContext.projectDetails.houseSize} square feet
Foundation Type: ${projectContext.projectDetails.foundationType}
Number of Stories: ${projectContext.projectDetails.numberOfStories}
Target Start Date: ${projectContext.projectDetails.targetStartDate || 'Not specified'}
Timeline Preference: ${projectContext.timelinePreference}
Budget Range: ${projectContext.budgetRange}
Project Complexity: ${projectContext.projectComplexity}

REGIONAL CONTEXT
Location: ${regionalContext.cityState}
Primary Classification: ${regionalContext.primaryClassification}
Secondary Classifications: ${regionalContext.secondaryClassifications.join(', ')}
Climate Zone: ${regionalContext.climateZone}

Seasonal Factors:
- Winter Limitations: ${regionalContext.seasonalFactors?.winterLimitations ? 'Yes' : 'No'}
- Summer Challenges: ${regionalContext.seasonalFactors?.summerChallenges ? 'Yes' : 'No'}
- Rainy Season: ${regionalContext.seasonalFactors?.rainySeason || 'None'}
- Optimal Construction Months: ${regionalContext.seasonalFactors?.optimalConstructionMonths?.join(', ') || 'Year-round'}

Regulatory Environment:
- Permit Complexity: ${regionalContext.regulatoryEnvironment?.permitComplexity || 'Standard'}
- Inspection Frequency: ${regionalContext.regulatoryEnvironment?.inspectionFrequency || 'Standard'}
- Code Strictness: ${regionalContext.regulatoryEnvironment?.codeStrictness || 'Standard'}
- Special Requirements: ${regionalContext.regulatoryEnvironment?.specialRequirements?.join(', ') || 'None'}

Market Conditions:
- Labor Availability: ${regionalContext.marketConditions?.laborAvailability || 'Moderate'}
- Material Costs: ${regionalContext.marketConditions?.materialCosts || 'Standard'}
- Contractor Availability: ${regionalContext.marketConditions?.contractorAvailability || 'Moderate'}
- Permit Timeline: ${regionalContext.marketConditions?.permitTimeline || 'Standard'}

Regional Multipliers:
- Weather Dependent: ${regionalContext.multipliers?.weatherDependent || 1}x
- Permit Complexity: ${regionalContext.multipliers?.permitComplexity || 1}x
- Labor Availability: ${regionalContext.multipliers?.laborAvailability || 1}x
- Material Costs: ${regionalContext.multipliers?.materialCosts || 1}x

CONSTRUCTION METHOD GUIDANCE
${constructionMethod.description || 'Standard construction method guidance'}

Key Considerations:
${constructionMethod.keyConsiderations?.map(consideration => `- ${consideration}`).join('\n') || '- Follow standard building practices'}

TASK REQUIREMENTS
Provide comprehensive guidance for the ${phaseTitle} phase including:

1. TIMELINE ESTIMATES (REQUIRED FORMAT)
   - **Duration**: [X] weeks (DIY timeline)
   - **Contractor Duration**: [X] weeks (Professional timeline)
   - **DIY Hours**: [X] hours (Total DIY time commitment)

2. DETAILED TASKS
   - Step-by-step instructions
   - Quality assurance checkpoints
   - Vendor questions to ask
   - What vendors need from you

3. REGIONAL ADJUSTMENTS
   - Weather considerations specific to ${regionalContext.cityState}
   - Local permit requirements and timelines
   - Regional vendor recommendations
   - Seasonal timing considerations

4. EXPERT INSIGHTS
   - Common mistakes to avoid
   - Professional tips and tricks
   - Cost-saving opportunities
   - Quality checkpoints

5. HELPFUL INFORMATION
   - Additional resources and references
   - Safety considerations
   - Tool and material requirements
   - Troubleshooting guide

CRITICAL REQUIREMENTS
- Use bracketed format [X] for ALL numbers (Duration: [8] weeks, not Duration: 8 weeks)
- Include Project ID: ${projectId} in your response
- Provide specific, actionable guidance
- Consider regional factors and construction method
- Focus on practical implementation
- Include safety considerations

OUTPUT FORMAT
Structure your response with clear sections and use the exact formatting requirements above. Ensure all durations use the bracketed format [X] weeks/hours.

IMPORTANT: Do NOT repeat this prompt or include the instructions in your response. Provide ONLY the structured content as requested above.

Remember: You are the expert for this specific phase. Provide detailed, practical guidance that considers the user's experience level, regional factors, and construction method.`;
}

/**
 * Generates prompts for multiple phases in parallel
 */
export function createPhasePrompts(
  phaseIds: string[],
  phaseTitles: Record<string, string>,
  userProfile: UserProfile,
  regionalContext: RegionalContext,
  projectContext: ProjectContext,
  projectId: string
): Record<string, string> {
  const prompts: Record<string, string> = {};
  
  for (const phaseId of phaseIds) {
    const phaseTitle = phaseTitles[phaseId];
    if (phaseTitle) {
      try {
        prompts[phaseId] = createPhasePrompt(
          phaseId,
          phaseTitle,
          userProfile,
          regionalContext,
          projectContext,
          projectId
        );
      } catch (error) {
        console.error(`Failed to create prompt for phase ${phaseId}:`, error);
        // Continue with other phases
      }
    }
  }
  
  return prompts;
}

/**
 * Validates that a phase prompt contains all required elements
 */
export function validatePhasePrompt(prompt: string, phaseId: string, projectId: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check for project ID
  if (!prompt.includes(`Project ID: ${projectId}`)) {
    errors.push('Project ID not found in prompt');
  }
  
  // Check for phase information
  if (!prompt.includes(`PHASE:`) || !prompt.includes(phaseId)) {
    errors.push('Phase information not found in prompt');
  }
  
  // Check for required sections
  const requiredSections = [
    'TIMELINE ESTIMATES',
    'DETAILED TASKS',
    'REGIONAL ADJUSTMENTS',
    'EXPERT INSIGHTS',
    'HELPFUL INFORMATION'
  ];
  
  for (const section of requiredSections) {
    if (!prompt.includes(section)) {
      errors.push(`Required section '${section}' not found`);
    }
  }
  
  // Check for bracketed format instructions
  if (!prompt.includes('[X] weeks') || !prompt.includes('[X] hours')) {
    errors.push('Bracketed format instructions not found');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Gets the expert persona for a specific phase
 */
export function getPhaseExpert(phaseId: string): { title: string; expertise: string; experience: string } | null {
  return PHASE_EXPERTS[phaseId as keyof typeof PHASE_EXPERTS] || null;
}

/**
 * Gets construction method guidance for a specific method
 */
export function getConstructionMethodGuidance(constructionMethod: string): {
  description: string;
  keyConsiderations: string[];
} | null {
  return CONSTRUCTION_METHOD_GUIDANCE[constructionMethod as keyof typeof CONSTRUCTION_METHOD_GUIDANCE] || null;
}
