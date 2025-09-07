import { generateText } from './openai';
import { ProjectContext } from './project-context';
import { RegionalContext } from './regional-analysis';
import { OnboardingProfile } from './roadmap-types';

export interface PhaseSpecificPrompt {
  phaseId: string;
  phaseName: string;
  prompt: string;
  expertPersona: string;
  temperature: number;
}

export interface PhasePromptConfig {
  phaseId: string;
  phaseName: string;
  expertPersona: string;
  temperature: number;
  focusAreas: string[];
  keyConsiderations: string[];
  deliverables: string[];
}

/**
 * Generate phase-specific prompts for construction phases
 */
export async function generatePhaseSpecificPrompts(
  profile: OnboardingProfile,
  projectContext: ProjectContext,
  regionalContext: RegionalContext,
  phaseConfigs: PhasePromptConfig[]
): Promise<PhaseSpecificPrompt[]> {
  try {
    console.log(`Generating ${phaseConfigs.length} phase-specific prompts`);
    
    const prompts: PhaseSpecificPrompt[] = [];
    
    for (const config of phaseConfigs) {
      const prompt = createPhaseSpecificPrompt(config, profile, projectContext, regionalContext);
      
      prompts.push({
        phaseId: config.phaseId,
        phaseName: config.phaseName,
        prompt,
        expertPersona: config.expertPersona,
        temperature: config.temperature
      });
    }
    
    console.log(`Generated ${prompts.length} phase-specific prompts`);
    return prompts;
    
  } catch (error) {
    console.error(`Error generating phase-specific prompts:`, error);
    throw error;
  }
}

/**
 * Create a phase-specific prompt for a single construction phase
 */
function createPhaseSpecificPrompt(
  config: PhasePromptConfig,
  profile: OnboardingProfile,
  projectContext: ProjectContext,
  regionalContext: RegionalContext
): string {
  return `You are a ${config.expertPersona} with 20+ years of specialized experience in ${config.phaseName}.

## PROJECT CONTEXT
- Construction Method: ${profile.constructionMethod}
- Experience Level: ${profile.experience}
- Location: ${profile.cityState}
- Project Complexity: ${projectContext.projectDetails.complexity}
- House Size: ${profile.houseSize}
- Foundation Type: ${profile.foundationType}
- Number of Stories: ${profile.numberOfStories}
- Current Phase: ${profile.currentPhaseId}

## REGIONAL CONTEXT
- Primary Classification: ${regionalContext.primaryClassification}
- Secondary Classifications: ${regionalContext.secondaryClassifications.join(', ')}
- Permit Multiplier: ${regionalContext.multipliers.permitHeavy}x
- Weather Multiplier: ${regionalContext.multipliers.weatherDependent}x
- Material Multiplier: ${regionalContext.multipliers.materialAvailability}x

## PHASE FOCUS: ${config.phaseName}
${config.focusAreas.map(area => `- ${area}`).join('\n')}

## KEY CONSIDERATIONS
${config.keyConsiderations.map(consideration => `- ${consideration}`).join('\n')}

## DELIVERABLES
${config.deliverables.map(deliverable => `- ${deliverable}`).join('\n')}

## INSTRUCTIONS
Create a comprehensive, actionable guide for the ${config.phaseName} phase that includes:

1. **Detailed Step-by-Step Process** - Break down the phase into clear, sequential steps
2. **Quality Control Checkpoints** - Identify critical inspection points and quality standards
3. **Vendor Questions** - List specific questions to ask contractors/suppliers
4. **Vendor Requirements** - Specify what information vendors need from you
5. **Timeline Estimates** - Provide realistic duration ranges based on project complexity
6. **Cost Considerations** - Include budget factors and cost-saving opportunities
7. **Common Pitfalls** - Highlight frequent mistakes and how to avoid them
8. **Regional Adaptations** - Adjust recommendations for the specific location and climate

## OUTPUT FORMAT
Return structured JSON with these exact fields:

\`\`\`json
{
  "phaseId": "${config.phaseId}",
  "phaseName": "${config.phaseName}",
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step Title",
      "description": "Detailed description of what to do",
      "duration": "2-3 days",
      "difficulty": "Beginner|Intermediate|Advanced",
      "tools": ["Tool 1", "Tool 2"],
      "materials": ["Material 1", "Material 2"],
      "safetyNotes": ["Safety consideration 1", "Safety consideration 2"]
    }
  ],
  "qualityChecks": [
    {
      "checkpoint": "Checkpoint Name",
      "description": "What to verify",
      "criteria": "Success criteria",
      "timing": "When to perform this check"
    }
  ],
  "vendorQuestions": [
    "What specific experience do you have with ${config.phaseName}?",
    "Can you provide references from similar projects?",
    "What is your estimated timeline for this phase?"
  ],
  "vendorNeeds": [
    "Detailed project specifications",
    "Site access information",
    "Permit documentation"
  ],
  "timelineEstimates": {
    "minimum": "X days",
    "typical": "Y days", 
    "maximum": "Z days",
    "factors": ["Factor 1", "Factor 2"]
  },
  "costConsiderations": {
    "typicalRange": "$X - $Y",
    "costDrivers": ["Driver 1", "Driver 2"],
    "savingsOpportunities": ["Opportunity 1", "Opportunity 2"]
  },
  "commonPitfalls": [
    {
      "pitfall": "Common mistake",
      "consequence": "What happens if you make this mistake",
      "prevention": "How to avoid it"
    }
  ],
  "regionalAdaptations": [
    "Adaptation for ${regionalContext.primaryClassification}",
    "Weather-specific considerations",
    "Local permit requirements"
  ]
}
\`\`\`

Focus on practical, actionable guidance that a ${profile.experience} level builder can follow successfully.`;
}

/**
 * Get default phase configurations for common construction phases
 */
export function getDefaultPhaseConfigs(): PhasePromptConfig[] {
  return [
    {
      phaseId: 'site-preparation',
      phaseName: 'Site Preparation & Excavation',
      expertPersona: 'MASTER SITE PREPARATION SPECIALIST',
      temperature: 0.2,
      focusAreas: [
        'Site clearing and preparation',
        'Excavation and grading',
        'Utility connections',
        'Drainage and waterproofing'
      ],
      keyConsiderations: [
        'Soil conditions and stability',
        'Utility line locations',
        'Drainage requirements',
        'Permit compliance'
      ],
      deliverables: [
        'Prepared building site',
        'Proper drainage system',
        'Utility connections ready',
        'Excavation complete'
      ]
    },
    {
      phaseId: 'foundation',
      phaseName: 'Foundation Construction',
      expertPersona: 'MASTER FOUNDATION ENGINEER',
      temperature: 0.1,
      focusAreas: [
        'Foundation design and layout',
        'Concrete placement',
        'Curing and protection',
        'Waterproofing and drainage'
      ],
      keyConsiderations: [
        'Foundation type and design',
        'Concrete mix and placement',
        'Curing conditions',
        'Waterproofing requirements'
      ],
      deliverables: [
        'Completed foundation',
        'Proper drainage system',
        'Waterproofing installed',
        'Foundation inspection passed'
      ]
    },
    {
      phaseId: 'framing',
      phaseName: 'Framing Construction',
      expertPersona: 'MASTER FRAMING SPECIALIST',
      temperature: 0.3,
      focusAreas: [
        'Structural framing',
        'Load-bearing walls',
        'Roof framing',
        'Sheathing and bracing'
      ],
      keyConsiderations: [
        'Structural integrity',
        'Load distribution',
        'Wind and seismic resistance',
        'Building code compliance'
      ],
      deliverables: [
        'Complete structural frame',
        'Proper load distribution',
        'Code-compliant construction',
        'Framing inspection passed'
      ]
    },
    {
      phaseId: 'electrical-rough',
      phaseName: 'Electrical Rough-In',
      expertPersona: 'MASTER ELECTRICAL CONTRACTOR',
      temperature: 0.2,
      focusAreas: [
        'Electrical planning and design',
        'Wire installation',
        'Outlet and switch boxes',
        'Panel installation'
      ],
      keyConsiderations: [
        'Electrical load calculations',
        'Code compliance',
        'Safety requirements',
        'Future expansion needs'
      ],
      deliverables: [
        'Complete electrical rough-in',
        'Code-compliant installation',
        'Electrical inspection passed',
        'Panel ready for connection'
      ]
    },
    {
      phaseId: 'plumbing-rough',
      phaseName: 'Plumbing Rough-In',
      expertPersona: 'MASTER PLUMBING CONTRACTOR',
      temperature: 0.2,
      focusAreas: [
        'Plumbing system design',
        'Pipe installation',
        'Fixture connections',
        'Water and waste systems'
      ],
      keyConsiderations: [
        'Water pressure and flow',
        'Drainage and venting',
        'Code compliance',
        'Future maintenance access'
      ],
      deliverables: [
        'Complete plumbing rough-in',
        'Code-compliant installation',
        'Plumbing inspection passed',
        'Systems ready for fixtures'
      ]
    },
    {
      phaseId: 'hvac-rough',
      phaseName: 'HVAC Rough-In',
      expertPersona: 'MASTER HVAC CONTRACTOR',
      temperature: 0.2,
      focusAreas: [
        'HVAC system design',
        'Ductwork installation',
        'Equipment placement',
        'Ventilation systems'
      ],
      keyConsiderations: [
        'Load calculations',
        'Duct sizing and routing',
        'Energy efficiency',
        'Code compliance'
      ],
      deliverables: [
        'Complete HVAC rough-in',
        'Code-compliant installation',
        'HVAC inspection passed',
        'Systems ready for equipment'
      ]
    },
    {
      phaseId: 'insulation',
      phaseName: 'Insulation Installation',
      expertPersona: 'MASTER INSULATION SPECIALIST',
      temperature: 0.2,
      focusAreas: [
        'Insulation planning',
        'Material selection',
        'Installation techniques',
        'Air sealing'
      ],
      keyConsiderations: [
        'R-value requirements',
        'Moisture control',
        'Air sealing',
        'Code compliance'
      ],
      deliverables: [
        'Complete insulation installation',
        'Proper air sealing',
        'Code-compliant R-values',
        'Insulation inspection passed'
      ]
    },
    {
      phaseId: 'drywall',
      phaseName: 'Drywall Installation',
      expertPersona: 'MASTER DRYWALL CONTRACTOR',
      temperature: 0.3,
      focusAreas: [
        'Drywall planning',
        'Installation techniques',
        'Taping and finishing',
        'Texture application'
      ],
      keyConsiderations: [
        'Seam placement',
        'Screw spacing',
        'Taping techniques',
        'Finish quality'
      ],
      deliverables: [
        'Complete drywall installation',
        'Professional taping and finishing',
        'Ready for paint',
        'Drywall inspection passed'
      ]
    },
    {
      phaseId: 'flooring',
      phaseName: 'Flooring Installation',
      expertPersona: 'MASTER FLOORING SPECIALIST',
      temperature: 0.3,
      focusAreas: [
        'Flooring selection',
        'Subfloor preparation',
        'Installation techniques',
        'Finishing and protection'
      ],
      keyConsiderations: [
        'Subfloor condition',
        'Moisture levels',
        'Installation methods',
        'Finish protection'
      ],
      deliverables: [
        'Complete flooring installation',
        'Professional finish',
        'Proper protection',
        'Flooring inspection passed'
      ]
    },
    {
      phaseId: 'exterior-finishes',
      phaseName: 'Exterior Finishes',
      expertPersona: 'MASTER EXTERIOR FINISH SPECIALIST',
      temperature: 0.3,
      focusAreas: [
        'Exterior material selection',
        'Installation techniques',
        'Weather protection',
        'Aesthetic finishing'
      ],
      keyConsiderations: [
        'Weather resistance',
        'Material compatibility',
        'Installation methods',
        'Long-term durability'
      ],
      deliverables: [
        'Complete exterior finishes',
        'Weather-resistant installation',
        'Professional appearance',
        'Exterior inspection passed'
      ]
    }
  ];
}

/**
 * Create a custom phase configuration
 */
export function createPhaseConfig(
  phaseId: string,
  phaseName: string,
  expertPersona: string,
  temperature: number = 0.3,
  focusAreas: string[] = [],
  keyConsiderations: string[] = [],
  deliverables: string[] = []
): PhasePromptConfig {
  return {
    phaseId,
    phaseName,
    expertPersona,
    temperature,
    focusAreas,
    keyConsiderations,
    deliverables
  };
}
