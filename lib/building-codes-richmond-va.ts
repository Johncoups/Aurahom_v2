// Richmond City, VA specific building code requirements
// This provides jurisdiction-specific guidance for the AI prompts

export const RICHMOND_VA_BUILDING_CODES = {
  // Foundation and Structural
  foundation: {
    frostDepth: "18 inches below grade",
    minimumDepth: "12 inches below grade",
    rebarSpacing: "12 inches on center minimum",
    concreteStrength: "3000 PSI minimum for residential",
    waterproofing: "Required on all below-grade walls",
    drainage: "Perimeter drain tile with washed stone required"
  },

  // Framing
  framing: {
    studSpacing: "16 inches on center for load-bearing walls",
    headerSizing: "Minimum 2x8 for openings up to 4 feet",
    fireBlocking: "Required at floor/ceiling assemblies",
    soundproofing: "STC 45 minimum between dwelling units",
    shearWalls: "Required for lateral load resistance"
  },

  // Electrical
  electrical: {
    serviceSize: "200 amp minimum for new construction",
    gfciProtection: "Required in bathrooms, kitchens, garages, outdoors",
    afciProtection: "Required for all 15 and 20 amp circuits",
    smokeDetectors: "Required in all bedrooms and hallways",
    coDetectors: "Required near fuel-burning appliances"
  },

  // Plumbing
  plumbing: {
    pipeMaterials: "PEX, copper, or CPVC allowed",
    venting: "2 inch minimum diameter for main vent",
    cleanouts: "Required every 50 feet and at every 90° turn",
    backflowPrevention: "Required for irrigation systems",
    waterHeater: "Must be accessible for service"
  },

  // HVAC
  hvac: {
    manualJ: "Required for all new installations",
    ductSealing: "All joints must be sealed with mastic",
    ventilation: "50 CFM minimum for bathrooms",
    equipmentEfficiency: "SEER 14 minimum for air conditioners",
    combustionAir: "Required for fuel-burning appliances"
  },

  // Insulation
  insulation: {
    wallRValue: "R-20 minimum for above-grade walls",
    ceilingRValue: "R-38 minimum for ceilings",
    basementWalls: "R-10 minimum for below-grade walls",
    airSealing: "Required at all penetrations",
    vaporBarrier: "Required on warm side of insulation"
  },

  // Fire Safety
  fireSafety: {
    fireSeparation: "1-hour rating between dwelling units",
    egressWindows: "Minimum 5.7 sq ft opening",
    smokeAlarms: "Required in all sleeping areas",
    carbonMonoxide: "Required near fuel-burning appliances",
    fireExtinguisher: "Required in kitchen"
  },

  // Accessibility
  accessibility: {
    doorWidth: "32 inches minimum clear opening",
    hallwayWidth: "36 inches minimum",
    bathroomAccess: "Must be accessible from bedroom",
    kitchenAccess: "Must be accessible from living area",
    stepHeight: "7 inches maximum for exterior steps"
  },

  // Energy Code
  energyCode: {
    airSealing: "Maximum 3 ACH50 air leakage",
    windowUValue: "U-0.30 maximum for new windows",
    ductLeakage: "Maximum 4% of total air flow",
    lightingEfficiency: "75% of fixtures must be high-efficiency",
    renewableEnergy: "Solar ready requirements for new construction"
  },

  // Inspection Requirements
  inspections: {
    foundation: "Before concrete pour",
    framing: "After rough-in, before insulation",
    electrical: "After rough-in, before drywall",
    plumbing: "After rough-in, before drywall",
    hvac: "After rough-in, before drywall",
    insulation: "After installation, before drywall",
    final: "After completion, before occupancy"
  },

  // Permit Requirements
  permits: {
    building: "Required for all structural work",
    electrical: "Required for all electrical work",
    plumbing: "Required for all plumbing work",
    mechanical: "Required for all HVAC work",
    demolition: "Required for structural demolition",
    fees: "Based on construction value"
  },

  // Common Violations
  commonViolations: [
    "Missing fire blocking at floor/ceiling assemblies",
    "Insufficient insulation R-values",
    "Improper electrical outlet spacing",
    "Missing GFCI protection in wet areas",
    "Inadequate ventilation in bathrooms",
    "Improper stair rise/run ratios",
    "Missing handrails on stairs",
    "Insufficient egress window sizes",
    "Improper smoke detector placement",
    "Missing carbon monoxide detectors"
  ],

  // Local Amendments
  localAmendments: {
    "IRC 2021": "Richmond City amendments to International Residential Code",
    "IBC 2021": "Richmond City amendments to International Building Code",
    "NEC 2023": "Richmond City amendments to National Electrical Code",
    "IPC 2021": "Richmond City amendments to International Plumbing Code",
    "IMC 2021": "Richmond City amendments to International Mechanical Code"
  }
};

// Function to get building code requirements for a specific phase
export function getBuildingCodeRequirements(phaseId: string): string {
  const phaseMap: { [key: string]: string } = {
    "pre-construction": "foundation",
    "foundation": "foundation",
    "rough-framing": "framing",
    "electrical-rough": "electrical",
    "plumbing-rough": "plumbing",
    "hvac-rough": "hvac",
    "insulation": "insulation",
    "exterior": "fireSafety",
    "kitchen-bath": "accessibility",
    "flooring": "accessibility",
    "radiant-heat": "energyCode"
  };

  const category = phaseMap[phaseId];
  if (!category) return "General building code requirements apply.";

  const requirements = RICHMOND_VA_BUILDING_CODES[category as keyof typeof RICHMOND_VA_BUILDING_CODES];
  
  if (!requirements) {
    return "Building code requirements for this phase are not yet defined.";
  }

  if (typeof requirements === 'string') {
    return requirements;
  }

  // Additional safety check to ensure requirements is an object
  if (typeof requirements !== 'object' || requirements === null) {
    return "Building code requirements for this phase are not yet defined.";
  }

  try {
    return Object.entries(requirements)
      .map(([key, value]) => `- ${key}: ${value}`)
      .join('\n');
  } catch (error) {
    console.error('Error processing building code requirements:', error);
    return "Building code requirements for this phase are not yet defined.";
  }
}

// Function to get inspection requirements for a phase
export function getInspectionRequirements(phaseId: string): string {
  const inspectionMap: { [key: string]: string } = {
    "foundation": "Foundation inspection required before concrete pour",
    "rough-framing": "Framing inspection required after rough-in, before insulation",
    "electrical-rough": "Electrical inspection required after rough-in, before drywall",
    "plumbing-rough": "Plumbing inspection required after rough-in, before drywall",
    "hvac-rough": "HVAC inspection required after rough-in, before drywall",
    "insulation": "Insulation inspection required after installation, before drywall"
  };

  return inspectionMap[phaseId] || "General inspection requirements apply.";
}
