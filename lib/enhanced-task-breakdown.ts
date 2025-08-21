// Enhanced task breakdown system for extremely detailed guidance
// This provides granular, step-by-step procedures for each construction task

export const ENHANCED_TASK_BREAKDOWNS = {
  "interior-framing": {
    "layout": [
      "Measure and mark wall locations on floor with chalk line",
      "Transfer measurements to ceiling using plumb bob",
      "Mark stud locations every 16 inches on center",
      "Mark door and window openings with exact dimensions",
      "Verify all measurements are within 1/8 inch tolerance",
      "Mark electrical outlet and switch locations",
      "Mark plumbing fixture locations",
      "Double-check all measurements against plans"
    ],
    "cutting": [
      "Cut top and bottom plates to exact length",
      "Cut studs to exact height (ceiling height minus 3 inches)",
      "Cut headers for all openings (2x8 minimum for 4' openings)",
      "Cut cripple studs for above and below openings",
      "Cut blocking pieces for fire blocking and soundproofing",
      "Label all pieces with location and purpose",
      "Verify all cuts are square and accurate"
    ],
    "assembly": [
      "Lay out bottom plate on floor",
      "Mark stud locations on bottom plate",
      "Stand up studs and attach to bottom plate with 16d nails",
      "Attach top plate to studs",
      "Install headers above openings",
      "Install cripple studs above and below openings",
      "Install fire blocking at floor/ceiling assemblies",
      "Install soundproofing blocking between rooms",
      "Verify all connections are secure"
    ],
    "quality_control": [
      "Check that walls are plumb (within 1/4 inch over 8 feet)",
      "Check that walls are straight (within 1/4 inch over 8 feet)",
      "Verify all studs are 16 inches on center",
      "Check that headers are properly sized",
      "Verify fire blocking is installed correctly",
      "Check that soundproofing blocking is installed",
      "Verify all nails are driven flush",
      "Check that openings are correct size"
    ]
  },

  "plumbing-rough": {
    "layout": [
      "Mark all fixture locations on floor and walls",
      "Plan pipe routing to minimize bends and turns",
      "Mark vent locations and routing",
      "Plan cleanout locations (every 50 feet and at 90° turns)",
      "Verify all measurements are accurate",
      "Check that slope calculations are correct",
      "Plan for proper pipe support and hangers"
    ],
    "installation": [
      "Install main drain line with proper slope (1/4 inch per foot minimum)",
      "Install vent lines with proper sizing (2 inch minimum)",
      "Install water supply lines with proper sizing",
      "Install cleanouts at required locations",
      "Install pipe supports every 4 feet",
      "Install backflow prevention devices",
      "Install pressure relief valves where required"
    ],
    "testing": [
      "Perform pressure test on water lines (100 PSI for 2 hours)",
      "Perform drain test on waste lines (fill to top for 15 minutes)",
      "Perform air test on vent lines (5 PSI for 15 minutes)",
      "Check for leaks at all joints",
      "Verify proper slope on all drain lines",
      "Check that all fixtures drain properly",
      "Verify proper venting operation"
    ],
    "quality_control": [
      "Check that all joints are properly sealed",
      "Verify proper slope on all drain lines",
      "Check that all pipes are properly supported",
      "Verify cleanouts are accessible",
      "Check that all fixtures are properly connected",
      "Verify proper venting operation",
      "Check for any leaks or drips"
    ]
  },

  "electrical-rough": {
    "layout": [
      "Mark all outlet and switch locations",
      "Plan circuit routing to minimize wire length",
      "Mark panel location and size",
      "Plan for proper wire support and protection",
      "Mark for GFCI and AFCI protection",
      "Plan for proper grounding",
      "Verify all measurements are accurate"
    ],
    "installation": [
      "Install electrical boxes at all locations",
      "Run wire to all outlets and switches",
      "Install panel and main service",
      "Install ground rods and grounding system",
      "Install GFCI and AFCI breakers",
      "Install smoke and CO detectors",
      "Install proper wire supports and protection"
    ],
    "testing": [
      "Test all circuits for proper operation",
      "Test GFCI and AFCI protection",
      "Test grounding system",
      "Check for proper wire sizing",
      "Verify proper breaker sizing",
      "Test smoke and CO detectors",
      "Check for any shorts or ground faults"
    ],
    "quality_control": [
      "Check that all boxes are properly installed",
      "Verify proper wire sizing for all circuits",
      "Check that all connections are secure",
      "Verify proper grounding",
      "Check that all protection devices work",
      "Verify proper wire support and protection",
      "Check for any code violations"
    ]
  },

  "hvac-rough": {
    "layout": [
      "Perform Manual J load calculations",
      "Mark equipment locations",
      "Plan duct routing for efficiency",
      "Plan for proper air distribution",
      "Mark thermostat locations",
      "Plan for proper ventilation",
      "Verify all measurements are accurate"
    ],
    "installation": [
      "Install HVAC equipment",
      "Install ductwork with proper sizing",
      "Install air distribution registers",
      "Install return air grilles",
      "Install thermostat and controls",
      "Install ventilation system",
      "Install proper duct supports and sealing"
    ],
    "testing": [
      "Test equipment operation",
      "Test air flow and distribution",
      "Test thermostat operation",
      "Test ventilation system",
      "Check for proper air balance",
      "Verify proper duct sealing",
      "Test for any air leaks"
    ],
    "quality_control": [
      "Check that all equipment is properly installed",
      "Verify proper duct sizing",
      "Check that all joints are sealed",
      "Verify proper air flow",
      "Check that all controls work properly",
      "Verify proper ventilation",
      "Check for any code violations"
    ]
  },

  "flooring": {
    "preparation": [
      "Check subfloor for level and condition",
      "Repair any damaged areas",
      "Install proper underlayment",
      "Acclimate flooring materials",
      "Plan layout for minimal waste",
      "Mark starting point and layout",
      "Verify all measurements are accurate"
    ],
    "installation": [
      "Install first row with proper spacing",
      "Continue installation row by row",
      "Cut pieces to fit around obstacles",
      "Install transitions and trim",
      "Install baseboards and moldings",
      "Fill any gaps or holes",
      "Clean up all debris and materials"
    ],
    "finishing": [
      "Sand any rough edges",
      "Apply finish coats if required",
      "Install all trim and moldings",
      "Caulk all gaps and joints",
      "Clean all surfaces thoroughly",
      "Apply protective coatings if needed",
      "Final inspection and touch-ups"
    ],
    "quality_control": [
      "Check that all pieces fit properly",
      "Verify proper spacing and gaps",
      "Check that all joints are tight",
      "Verify proper finish and appearance",
      "Check that all trim is installed",
      "Verify proper cleanup",
      "Check for any defects or damage"
    ]
  },

  "kitchen-bath": {
    "cabinet_installation": [
      "Mark cabinet locations on walls",
      "Install upper cabinets first",
      "Install lower cabinets",
      "Level and secure all cabinets",
      "Install cabinet hardware",
      "Install cabinet doors and drawers",
      "Adjust all doors and drawers"
    ],
    "countertop_installation": [
      "Measure and template countertops",
      "Cut countertops to size",
      "Install countertops on cabinets",
      "Seal all joints and seams",
      "Install backsplash",
      "Install sink and faucet",
      "Install any additional fixtures"
    ],
    "fixture_installation": [
      "Install plumbing fixtures",
      "Install electrical fixtures",
      "Install appliances",
      "Test all fixtures and appliances",
      "Install any additional accessories",
      "Clean up all debris",
      "Final inspection and testing"
    ],
    "quality_control": [
      "Check that all cabinets are level",
      "Verify proper door and drawer operation",
      "Check that countertops are secure",
      "Verify proper fixture operation",
      "Check that all appliances work",
      "Verify proper cleanup",
      "Check for any defects or damage"
    ]
  },

  "radiant-heat": {
    "layout": [
      "Mark tubing layout on subfloor",
      "Plan for proper heat distribution",
      "Mark manifold locations",
      "Plan for proper tubing routing",
      "Calculate tubing lengths needed",
      "Plan for proper insulation",
      "Verify all measurements are accurate"
    ],
    "installation": [
      "Install insulation on subfloor",
      "Install tubing in planned layout",
      "Secure tubing with proper fasteners",
      "Install manifolds and controls",
      "Connect tubing to manifolds",
      "Install pump and controls",
      "Install thermostat and programming"
    ],
    "testing": [
      "Pressure test all tubing",
      "Test pump operation",
      "Test control operation",
      "Test thermostat operation",
      "Check for any leaks",
      "Verify proper heat distribution",
      "Test for any malfunctions"
    ],
    "quality_control": [
      "Check that all tubing is secure",
      "Verify proper tubing layout",
      "Check that all connections are tight",
      "Verify proper pump operation",
      "Check that all controls work",
      "Verify proper heat distribution",
      "Check for any code violations"
    ]
  }
};

// Function to get enhanced task breakdown for a specific phase
export function getEnhancedTaskBreakdown(phaseId: string): any {
  return ENHANCED_TASK_BREAKDOWNS[phaseId as keyof typeof ENHANCED_TASK_BREAKDOWNS] || {};
}

// Function to get specific task breakdown for a phase
export function getPhaseTaskBreakdown(phaseId: string, taskType: string): string[] {
  const breakdown = getEnhancedTaskBreakdown(phaseId);
  return breakdown[taskType] || [];
}
