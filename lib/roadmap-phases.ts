import type { ConstructionMethod } from "@/lib/roadmap-types";

/**
 * Construction Phase Interface
 * 
 * This system provides baseline duration estimates for all construction methods.
 * Users can:
 * 1. Use these baseline estimates for free tier functionality
 * 2. Generate AI-powered estimates via the OpenAI API for more accuracy
 * 3. Override with contractor estimates for final planning
 * 4. Override baseline estimates at any tier level using the duration override system
 * 
 * Duration estimates are based on industry standards and can be easily updated
 * by modifying the estimatedDuration field in each phase array below.
 * 
 * OVERRIDE SYSTEM:
 * - Free tier users can override baseline estimates with custom values
 * - AI tier users can override both baseline and AI-generated estimates
 * - All overrides are tracked with timestamps and notes
 * - Overrides take precedence over baseline estimates
 */
export interface ConstructionPhase {
  id: string
  title: string
  order: number
  description: string
  subtasks: string[]
  dependencies: string[] // IDs of phases that must be completed first
  constructionMethods: string[] // Which construction methods this phase applies to
  estimatedDuration?: string // Estimated duration for the phase
}

/**
 * Duration Override Interface
 * Allows users to override baseline estimates with custom values
 */
export interface DurationOverride {
  phaseId: string
  constructionMethod: ConstructionMethod
  customDuration: string
  overrideType: 'free-tier' | 'ai-tier' | 'contractor'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Traditional frame construction phases (current sequence)
export const TRADITIONAL_FRAME_PHASES: ConstructionPhase[] = [
  {
    id: "just-starting",
    title: "Just Starting",
    order: 0,
    description: "Project initiation and initial assessment phase",
    subtasks: [
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    dependencies: [],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    subtasks: [
      "Complete project kickoff questionnaire",
      "Secure financing and construction loan",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for plans",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Establish budget and cost tracking",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep",
    title: "Site Preparation",
    order: 2,
    description: "Site clearing, grading, and utility preparation",
    subtasks: [
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Rough grade pad to plan elevations",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Stake house corners, driveway, and utilities",
      "Apply for site/driveway/grading permits",
      "Pre-construction meeting with key trades",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    subtasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Install septic tank and distribution field",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Town water/sewer tap fees and hookup",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "excavation",
    title: "Excavation & Earthwork",
    order: 4,
    description: "Foundation excavation and site drainage",
    subtasks: [
      "Foundation excavation and trenching",
      "Install foundation footing drains",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Install curtain drains and swales",
      "Backfill and compaction",
      "Foundation drain board installation",
      "Waterproofing and dampproofing",
      "Perimeter drain tile with washed stone",
      "Final grade and drainage verification"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 5,
    description: "Concrete foundation walls, footings, slabs, and in-floor radiant heat system",
    subtasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Form/pour foundation walls or ICF",
      "Install anchor bolts and hold-downs",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Install sub-slab insulation for radiant heat",
      "Lay and staple PEX tubing for radiant heat",
      "Protect tubing transitions",
      "Pressure test radiant heat tubing",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["excavation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-6 weeks"
  },
  {
    id: "rough-framing",
    title: "Rough Framing",
    order: 6,
    description: "Complete structural framing including floors, walls, roof, and interior partitions",
    subtasks: [
      "Install sill plates and seal",
      "Frame floors with joists and subflooring",
      "Frame exterior walls",
      "Frame interior partition walls",
      "Install steel/wood carrying beams",
      "Frame roof trusses and decking",
      "Install sheathing and subfascia",
      "Frame exterior stairs and landings",
      "Install steel framing connectors",
      "Set windows and doors with flashing",
      "Install exterior WRB and tapes",
      "Install blocking for cabinets and vanities",
      "Reinforce walls for wall-hung fixtures",
      "Frame niches, benches, and curbs",
      "Straighten and plane walls",
      "Install soundproofing details",
      "Frame pocket and hidden doors",
      "Pre-drywall walk and documentation",
      "Rough framing inspection and QC"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "modular", "other"],
    estimatedDuration: "4-8 weeks"
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 7,
    description: "Roof installation and weatherproofing",
    subtasks: [
      "Install roof underlayment",
      "Install roof membrane",
      "Install flashing for chimneys and vents",
      "Install drip edge and gutters",
      "Install roofing material",
      "Install ridge and roof vents",
      "Install skylights if specified",
      "Final roof inspection",
      "Install downspouts and drainage"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 8,
    description: "Exterior siding, trim, and weather protection",
    subtasks: [
      "Install exterior foam sheathing",
      "Install weather barrier (Tyvek, etc.)",
      "Install membrane and flashing",
      "Install siding finish material",
      "Install stone/brick veneer if specified",
      "Install fascia, soffit, and trim",
      "Install exterior windows and doors",
      "Install exterior stairs and landings",
      "Exterior paint, stain, and caulk",
      "Final exterior inspection"
    ],
    dependencies: ["roofing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 9,
    description: "Underground and wall plumbing installation",
    subtasks: [
      "Install DWV piping with proper slope",
      "Install water supply piping (PEX/copper)",
      "Install gas piping if applicable",
      "Set tubs and shower pans",
      "Install blocking for fixtures",
      "Install hose bibbs and freeze protection",
      "Pressure test all systems",
      "Plumbing rough-in inspection",
      "Install water heater and treatment"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 10,
    description: "Electrical wiring and panel installation",
    subtasks: [
      "Install service panel and sub-panels",
      "Rough-in electrical wiring",
      "Install phone, cable, and internet wiring",
      "Install smoke and CO detectors",
      "Install bath fans and dedicated circuits",
      "Install exterior lighting and receptacles",
      "Generator and EV charger rough-in",
      "Label all circuits",
      "Electrical rough-in inspection"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 11,
    description: "Heating, ventilation, and air conditioning installation",
    subtasks: [
      "Complete Manual J/S/D calculations",
      "Install ductwork and registers",
      "Install refrigerant lines",
      "Install condensate and combustion vents",
      "Install ERV/HRV if specified",
      "Set outdoor unit pads",
      "Install zoning controls",
      "Set thermostat locations",
      "HVAC rough-in inspection"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 12,
    description: "Interior slabs, garage, and exterior concrete",
    subtasks: [
      "Verify radiant tubing protection",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 13,
    description: "Thermal and sound insulation installation",
    subtasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    dependencies: ["exterior", "rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 14,
    description: "Interior wall and ceiling finishing",
    subtasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 15,
    description: "Interior and exterior painting",
    subtasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 16,
    description: "Interior trim, doors, and hardware",
    subtasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 17,
    description: "Floor covering installation",
    subtasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 18,
    description: "Kitchen and bathroom finishing",
    subtasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 19,
    description: "Final details and project completion",
    subtasks: [
      "Complete punch list items",
      "Final cleaning and touch-ups",
      "Install final hardware and accessories",
      "Complete final inspections",
      "Obtain certificate of occupancy",
      "Final walkthrough with owner",
      "Project closeout and documentation",
      "Warranty information and handover"
    ],
    dependencies: ["kitchen-bath"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "1-2 weeks"
  }
]

// Post-frame construction phases (different sequence)
export const POST_FRAME_PHASES: ConstructionPhase[] = [
  {
    id: "just-starting",
    title: "Just Starting",
    order: 0,
    description: "Project initiation and initial assessment phase",
    subtasks: [
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    dependencies: [],
    constructionMethods: ["post-frame"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    subtasks: [
      "Complete project kickoff questionnaire",
      "Secure financing and construction loan",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for plans",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Establish budget and cost tracking",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
     constructionMethods: ["post-frame"],
     estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep",
    title: "Site Preparation",
    order: 2,
    description: "Site clearing, grading, and utility preparation",
    subtasks: [
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Rough grade pad to plan elevations",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Stake house corners, driveway, and utilities",
      "Apply for site/driveway/grading permits",
      "Pre-construction meeting with key trades",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    subtasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Install septic tank and distribution field",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Town water/sewer tap fees and hookup",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "excavation",
    title: "Excavation & Earthwork",
    order: 4,
    description: "Foundation excavation and site drainage",
    subtasks: [
      "Foundation excavation and trenching",
      "Install foundation footing drains",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Install curtain drains and swales",
      "Backfill and compaction",
      "Foundation drain board installation",
      "Waterproofing and dampproofing",
      "Perimeter drain tile with washed stone",
      "Final grade and drainage verification"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 5,
    description: "Concrete foundation walls, footings, and slabs",
    subtasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Form/pour foundation walls",
      "Install anchor bolts and hold-downs",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["excavation"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "post-frame-structure",
    title: "Post Frame Structure",
    order: 6,
    description: "Post frame construction with trusses, metal siding, windows, exterior doors, and roof",
    subtasks: [
      "Set posts in concrete or on piers",
      "Install post frame trusses",
      "Install roof purlins and girts",
      "Install roof decking",
      "Install metal roofing",
      "Install metal siding",
      "Install windows and exterior doors",
      "Post frame inspection and QC"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 7,
    description: "Exterior siding, trim, and weather protection",
    subtasks: [
      "Install exterior foam sheathing",
      "Install weather barrier (Tyvek, etc.)",
      "Install membrane and flashing",
      "Install siding finish material",
      "Install stone/brick veneer if specified",
      "Install fascia, soffit, and trim",
      "Install exterior windows and doors",
      "Install exterior stairs and landings",
      "Exterior paint, stain, and caulk",
      "Final exterior inspection"
    ],
    dependencies: ["post-frame-structure"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 8,
    description: "Underground and wall plumbing installation",
    subtasks: [
      "Install DWV piping with proper slope",
      "Install water supply piping (PEX/copper)",
      "Install gas piping if applicable",
      "Set tubs and shower pans",
      "Install blocking for fixtures",
      "Install hose bibbs and freeze protection",
      "Pressure test all systems",
      "Plumbing rough-in inspection",
      "Install water heater and treatment"
    ],
    dependencies: ["post-frame-structure"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Underground electrical wiring and panel installation",
    subtasks: [
      "Install service panel and sub-panels",
      "Rough-in electrical wiring",
      "Install phone, cable, and internet wiring",
      "Install smoke and CO detectors",
      "Install bath fans and dedicated circuits",
      "Install exterior lighting and receptacles",
      "Generator and EV charger rough-in",
      "Label all circuits",
      "Electrical rough-in inspection"
    ],
    dependencies: ["plumbing-rough"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Slab and Flatwork",
    order: 10,
    description: "Interior slabs, garage, and exterior concrete",
    subtasks: [
      "Verify radiant tubing protection if applicable",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    dependencies: ["electrical-rough"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 11,
    description: "Thermal and sound insulation installation",
    subtasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    dependencies: ["exterior", "concrete-slabs"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "rough-framing-post-frame",
    title: "Rough Framing",
    order: 12,
    description: "Interior walls, blocking, and soundproofing",
    subtasks: [
      "Frame interior partition walls",
      "Install blocking for cabinets and vanities",
      "Reinforce walls for wall-hung fixtures",
      "Frame niches, benches, and curbs",
      "Straighten and plane walls",
      "Install soundproofing details",
      "Frame pocket and hidden doors",
      "Pre-drywall walk and documentation",
      "Interior framing inspection"
    ],
    dependencies: ["insulation"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 13,
    description: "Heating, ventilation, and air conditioning installation",
    subtasks: [
      "Complete Manual J/S/D calculations",
      "Install ductwork and registers",
      "Install refrigerant lines",
      "Install condensate and combustion vents",
      "Install ERV/HRV if specified",
      "Set outdoor unit pads",
      "Install zoning controls",
      "Set thermostat locations",
      "HVAC rough-in inspection"
    ],
    dependencies: ["rough-framing-post-frame"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 14,
    description: "Interior wall and ceiling finishing",
    subtasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["hvac-rough"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 15,
    description: "Interior and exterior painting",
    subtasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 16,
    description: "Interior trim, doors, and hardware",
    subtasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 17,
    description: "Floor covering installation",
    subtasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 18,
    description: "Kitchen and bathroom finishing",
    subtasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 19,
    description: "Final details and project completion",
    subtasks: [
      "Complete punch list items",
      "Final cleaning and touch-ups",
      "Install final hardware and accessories",
      "Complete final inspections",
      "Obtain certificate of occupancy",
      "Final walkthrough with owner",
      "Project closeout and documentation",
      "Warranty information and handover"
    ],
    dependencies: ["kitchen-bath"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "1-2 weeks"
  }
]

// ICF construction phases
export const ICF_PHASES: ConstructionPhase[] = [
  {
    id: "just-starting",
    title: "Just Starting",
    order: 0,
    description: "Project initiation and initial assessment phase",
    subtasks: [
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    dependencies: [],
    constructionMethods: ["icf"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    subtasks: [
      "Complete project kickoff questionnaire",
      "Secure financing and construction loan",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for ICF-specific plans",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Establish budget and cost tracking",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep",
    title: "Site Preparation",
    order: 2,
    description: "Site clearing, grading, and utility preparation",
    subtasks: [
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Rough grade pad to plan elevations",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Stake house corners, driveway, and utilities",
      "Apply for site/driveway/grading permits",
      "Pre-construction meeting with key trades",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["icf"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    subtasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Install septic tank and distribution field",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Town water/sewer tap fees and hookup",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "excavation",
    title: "Excavation & Earthwork",
    order: 4,
    description: "Foundation excavation and site drainage",
    subtasks: [
      "Foundation excavation and trenching",
      "Install foundation footing drains",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Install curtain drains and swales",
      "Backfill and compaction",
      "Foundation drain board installation",
      "Waterproofing and dampproofing",
      "Perimeter drain tile with washed stone",
      "Final grade and drainage verification"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["icf"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "icf-foundation-walls",
    title: "ICF Foundation & Walls",
    order: 5,
    description: "ICF forms, concrete, and wall construction",
    subtasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Set up ICF forms with proper bracing",
      "Install rebar and reinforcement",
      "Install electrical and plumbing sleeves",
      "Pour concrete into ICF forms",
      "Remove ICF forms after curing",
      "ICF foundation inspection and QC"
    ],
    dependencies: ["excavation"],
    constructionMethods: ["icf"],
    estimatedDuration: "4-6 weeks"
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 6,
    description: "Roof installation and weatherproofing",
    subtasks: [
      "Install roof underlayment",
      "Install roof membrane",
      "Install flashing for chimneys and vents",
      "Install drip edge and gutters",
      "Install roofing material",
      "Install ridge and roof vents",
      "Install skylights if specified",
      "Final roof inspection",
      "Install downspouts and drainage"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 7,
    description: "Exterior siding, trim, and weather protection",
    subtasks: [
      "Install exterior foam sheathing",
      "Install weather barrier (Tyvek, etc.)",
      "Install membrane and flashing",
      "Install siding finish material",
      "Install stone/brick veneer if specified",
      "Install fascia, soffit, and trim",
      "Install exterior windows and doors",
      "Install exterior stairs and landings",
      "Exterior paint, stain, and caulk",
      "Final exterior inspection"
    ],
    dependencies: ["roofing"],
    constructionMethods: ["icf"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 8,
    description: "Underground and wall plumbing installation",
    subtasks: [
      "Install DWV piping with proper slope",
      "Install water supply piping (PEX/copper)",
      "Install gas piping if applicable",
      "Set tubs and shower pans",
      "Install blocking for fixtures",
      "Install hose bibbs and freeze protection",
      "Pressure test all systems",
      "Plumbing rough-in inspection",
      "Install water heater and treatment"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Electrical wiring and panel installation",
    subtasks: [
      "Install service panel and sub-panels",
      "Rough-in electrical wiring",
      "Install phone, cable, and internet wiring",
      "Install smoke and CO detectors",
      "Install bath fans and dedicated circuits",
      "Install exterior lighting and receptacles",
      "Generator and EV charger rough-in",
      "Label all circuits",
      "Electrical rough-in inspection"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 10,
    description: "Heating, ventilation, and air conditioning installation",
    subtasks: [
      "Complete Manual J/S/D calculations",
      "Install ductwork and registers",
      "Install refrigerant lines",
      "Install condensate and combustion vents",
      "Install ERV/HRV if specified",
      "Set outdoor unit pads",
      "Install zoning controls",
      "Set thermostat locations",
      "HVAC rough-in inspection"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 11,
    description: "Interior slabs, garage, and exterior concrete",
    subtasks: [
      "Verify radiant tubing protection if applicable",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 12,
    description: "Thermal and sound insulation installation",
    subtasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    dependencies: ["exterior", "icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "rough-framing-icf",
    title: "Rough Framing",
    order: 13,
    description: "Interior walls, blocking, and soundproofing",
    subtasks: [
      "Frame interior partition walls",
      "Install blocking for cabinets and vanities",
      "Reinforce walls for wall-hung fixtures",
      "Frame niches, benches, and curbs",
      "Straighten and plane walls",
      "Install soundproofing details",
      "Frame pocket and hidden doors",
      "Pre-drywall walk and documentation",
      "Rough framing inspection"
    ],
    dependencies: ["insulation"],
    constructionMethods: ["icf"],
    estimatedDuration: "3-5 weeks"
  },

  {
    id: "drywall",
    title: "Drywall",
    order: 14,
    description: "Interior wall and ceiling finishing",
    subtasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["rough-framing-icf"],
    constructionMethods: ["icf"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 16,
    description: "Interior and exterior painting",
    subtasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 17,
    description: "Interior trim, doors, and hardware",
    subtasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 18,
    description: "Floor covering installation",
    subtasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["icf"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 19,
    description: "Kitchen and bathroom finishing",
    subtasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["icf"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 20,
    description: "Final details and project completion",
    subtasks: [
      "Complete punch list items",
      "Final cleaning and touch-ups",
      "Install final hardware and accessories",
      "Complete final inspections",
      "Obtain certificate of occupancy",
      "Final walkthrough with owner",
      "Project closeout and documentation",
      "Warranty information and handover"
    ],
    dependencies: ["kitchen-bath"],
    constructionMethods: ["icf"],
    estimatedDuration: "1-2 weeks"
  }
]

// SIP (Structural Insulated Panel) construction phases
export const SIP_PHASES: ConstructionPhase[] = [
  {
    id: "just-starting",
    title: "Just Starting",
    order: 0,
    description: "Project initiation and initial assessment phase",
    subtasks: [
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    dependencies: [],
    constructionMethods: ["sip"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    subtasks: [
      "Complete project kickoff questionnaire",
      "Secure financing and construction loan",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for SIP-specific plans",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Establish budget and cost tracking",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
    constructionMethods: ["sip"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep",
    title: "Site Preparation",
    order: 2,
    description: "Site clearing, grading, and utility preparation",
    subtasks: [
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Rough grade pad to plan elevations",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Stake house corners, driveway, and utilities",
      "Apply for site/driveway/grading permits",
      "Pre-construction meeting with key trades",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["sip"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    subtasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Install septic tank and distribution field",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Town water/sewer tap fees and hookup",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 4,
    description: "Concrete foundation walls, footings, and slabs",
    subtasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Form/pour foundation walls",
      "Install anchor bolts and hold-downs",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["sip"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "sip-panel-installation",
    title: "SIP Panel Installation",
    order: 5,
    description: "Installation of structural insulated panels for walls and roof",
    subtasks: [
      "Set SIP panels according to engineered plans",
      "Install panel connectors and fasteners",
      "Seal panel joints with approved sealant",
      "Install roof SIP panels",
      "Install structural ridge beam",
      "SIP panel inspection and QC",
      "Install electrical and plumbing chases"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 6,
    description: "Exterior siding, trim, and weather protection",
    subtasks: [
      "Install exterior foam sheathing",
      "Install weather barrier (Tyvek, etc.)",
      "Install membrane and flashing",
      "Install siding finish material",
      "Install stone/brick veneer if specified",
      "Install fascia, soffit, and trim",
      "Install exterior windows and doors",
      "Install exterior stairs and landings",
      "Exterior paint, stain, and caulk",
      "Final exterior inspection"
    ],
    dependencies: ["sip-panel-installation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 7,
    description: "Underground and wall plumbing installation",
    subtasks: [
      "Install DWV piping with proper slope",
      "Install water supply piping (PEX/copper)",
      "Install gas piping if applicable",
      "Set tubs and shower pans",
      "Install blocking for fixtures",
      "Install hose bibbs and freeze protection",
      "Pressure test all systems",
      "Plumbing rough-in inspection",
      "Install water heater and treatment"
    ],
    dependencies: ["sip-panel-installation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 8,
    description: "Electrical wiring and panel installation",
    subtasks: [
      "Install service panel and sub-panels",
      "Rough-in electrical wiring",
      "Install phone, cable, and internet wiring",
      "Install smoke and CO detectors",
      "Install bath fans and dedicated circuits",
      "Install exterior lighting and receptacles",
      "Generator and EV charger rough-in",
      "Label all circuits",
      "Electrical rough-in inspection"
    ],
    dependencies: ["plumbing-rough"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 9,
    description: "Heating, ventilation, and air conditioning installation",
    subtasks: [
      "Complete Manual J/S/D calculations",
      "Install ductwork and registers",
      "Install refrigerant lines",
      "Install condensate and combustion vents",
      "Install ERV/HRV if specified",
      "Set outdoor unit pads",
      "Install zoning controls",
      "Set thermostat locations",
      "HVAC rough-in inspection"
    ],
    dependencies: ["electrical-rough"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 10,
    description: "Interior slabs, garage, and exterior concrete",
    subtasks: [
      "Verify radiant tubing protection if applicable",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 11,
    description: "Thermal and sound insulation installation",
    subtasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    dependencies: ["exterior", "sip-panel-installation"],
    constructionMethods: ["sip"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "rough-framing-sip",
    title: "Rough Framing",
    order: 12,
    description: "Interior walls, blocking, and soundproofing",
    subtasks: [
      "Frame interior partition walls",
      "Install blocking for cabinets and vanities",
      "Reinforce walls for wall-hung fixtures",
      "Frame niches, benches, and curbs",
      "Straighten and plane walls",
      "Install soundproofing details",
      "Frame pocket and hidden doors",
      "Pre-drywall walk and documentation",
      "Interior framing inspection"
    ],
    dependencies: ["insulation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 13,
    description: "Interior wall and ceiling finishing",
    subtasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["rough-framing-sip"],
    constructionMethods: ["sip"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 14,
    description: "Interior and exterior painting",
    subtasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 15,
    description: "Interior trim, doors, and hardware",
    subtasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 16,
    description: "Floor covering installation",
    subtasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["sip"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 17,
    description: "Kitchen and bathroom finishing",
    subtasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["sip"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 18,
    description: "Final details and project completion",
    subtasks: [
      "Complete punch list items",
      "Final cleaning and touch-ups",
      "Install final hardware and accessories",
      "Complete final inspections",
      "Obtain certificate of occupancy",
      "Final walkthrough with owner",
      "Project closeout and documentation",
      "Warranty information and handover"
    ],
    dependencies: ["kitchen-bath"],
    constructionMethods: ["sip"],
    estimatedDuration: "1-2 weeks"
  }
]

// Modular construction phases (similar to traditional but with factory assembly)
export const MODULAR_PHASES: ConstructionPhase[] = [
  {
    id: "just-starting",
    title: "Just Starting",
    order: 0,
    description: "Project initiation and initial assessment phase",
    subtasks: [
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    dependencies: [],
    constructionMethods: ["modular"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    subtasks: [
      "Complete project kickoff questionnaire",
      "Secure financing and construction loan",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for modular plans",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact modular manufacturer",
      "Establish budget and cost tracking",
      "Schedule factory visit and design review"
    ],
    dependencies: [],
    constructionMethods: ["modular"],
    estimatedDuration: "3-6 weeks"
  },
  {
    id: "site-prep",
    title: "Site Preparation",
    order: 2,
    description: "Site clearing, grading, and utility preparation",
    subtasks: [
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Rough grade pad to plan elevations",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Stake house corners, driveway, and utilities",
      "Apply for site/driveway/grading permits",
      "Pre-construction meeting with key trades",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["modular"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    subtasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Install septic tank and distribution field",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Town water/sewer tap fees and hookup",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 4,
    description: "Concrete foundation walls, footings, and slabs",
    subtasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Form/pour foundation walls",
      "Install anchor bolts and hold-downs",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["modular"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "modular-delivery-setup",
    title: "Modular Delivery & Setup",
    order: 5,
    description: "Delivery and installation of factory-built modules",
    subtasks: [
      "Coordinate crane and delivery logistics",
      "Set modules on foundation",
      "Connect modules together",
      "Install roof connection system",
      "Seal module connections",
      "Install structural bracing",
      "Modular setup inspection and QC"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["modular"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 6,
    description: "Roof installation and weatherproofing",
    subtasks: [
      "Install roof underlayment",
      "Install roof membrane",
      "Install flashing for chimneys and vents",
      "Install drip edge and gutters",
      "Install roofing material",
      "Install ridge and roof vents",
      "Install skylights if specified",
      "Final roof inspection",
      "Install downspouts and drainage"
    ],
    dependencies: ["modular-delivery-setup"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 7,
    description: "Exterior siding, trim, and weather protection",
    subtasks: [
      "Install exterior foam sheathing",
      "Install weather barrier (Tyvek, etc.)",
      "Install membrane and flashing",
      "Install siding finish material",
      "Install stone/brick veneer if specified",
      "Install fascia, soffit, and trim",
      "Install exterior windows and doors",
      "Install exterior stairs and landings",
      "Exterior paint, stain, and caulk",
      "Final exterior inspection"
    ],
    dependencies: ["roofing"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 8,
    description: "Underground and wall plumbing installation",
    subtasks: [
      "Install DWV piping with proper slope",
      "Install water supply piping (PEX/copper)",
      "Install gas piping if applicable",
      "Set tubs and shower pans",
      "Install blocking for fixtures",
      "Install hose bibbs and freeze protection",
      "Pressure test all systems",
      "Plumbing rough-in inspection",
      "Install water heater and treatment"
    ],
    dependencies: ["modular-delivery-setup"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Electrical wiring and panel installation",
    subtasks: [
      "Install service panel and sub-panels",
      "Rough-in electrical wiring",
      "Install phone, cable, and internet wiring",
      "Install smoke and CO detectors",
      "Install bath fans and dedicated circuits",
      "Install exterior lighting and receptacles",
      "Generator and EV charger rough-in",
      "Label all circuits",
      "Electrical rough-in inspection"
    ],
    dependencies: ["plumbing-rough"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 10,
    description: "Heating, ventilation, and air conditioning installation",
    subtasks: [
      "Complete Manual J/S/D calculations",
      "Install ductwork and registers",
      "Install refrigerant lines",
      "Install condensate and combustion vents",
      "Install ERV/HRV if specified",
      "Set outdoor unit pads",
      "Install zoning controls",
      "Set thermostat locations",
      "HVAC rough-in inspection"
    ],
    dependencies: ["electrical-rough"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 11,
    description: "Interior slabs, garage, and exterior concrete",
    subtasks: [
      "Verify radiant tubing protection if applicable",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 12,
    description: "Thermal and sound insulation installation",
    subtasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    dependencies: ["exterior", "modular-delivery-setup"],
    constructionMethods: ["modular"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "rough-framing-modular",
    title: "Rough Framing",
    order: 13,
    description: "Interior walls, blocking, and soundproofing",
    subtasks: [
      "Frame interior partition walls",
      "Install blocking for cabinets and vanities",
      "Reinforce walls for wall-hung fixtures",
      "Frame niches, benches, and curbs",
      "Straighten and plane walls",
      "Install soundproofing details",
      "Frame pocket and hidden doors",
      "Pre-drywall walk and documentation",
      "Interior framing inspection"
    ],
    dependencies: ["insulation"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 14,
    description: "Interior wall and ceiling finishing",
    subtasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["rough-framing-modular"],
    constructionMethods: ["modular"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 15,
    description: "Interior and exterior painting",
    subtasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 16,
    description: "Interior trim, doors, and hardware",
    subtasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 17,
    description: "Floor covering installation",
    subtasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["modular"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 18,
    description: "Kitchen and bathroom finishing",
    subtasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["modular"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 19,
    description: "Final details and project completion",
    subtasks: [
      "Complete punch list items",
      "Final cleaning and touch-ups",
      "Install final hardware and accessories",
      "Complete final inspections",
      "Obtain certificate of occupancy",
      "Final walkthrough with owner",
      "Project closeout and documentation",
      "Warranty information and handover"
    ],
    dependencies: ["kitchen-bath"],
    constructionMethods: ["modular"],
    estimatedDuration: "1-2 weeks"
  }
]

// Default to traditional frame for backward compatibility
export const CONSTRUCTION_PHASES = TRADITIONAL_FRAME_PHASES;

export function getPhaseById(id: string): ConstructionPhase | undefined {
  return CONSTRUCTION_PHASES.find(phase => phase.id === id)
}

export function getPhasesByOrder(): ConstructionPhase[] {
  return [...CONSTRUCTION_PHASES].sort((a, b) => a.order - b.order)
}

export function getPhasesForDropdown(): { id: string; title: string }[] {
  return CONSTRUCTION_PHASES.map(phase => ({
    id: phase.id,
    title: `${phase.order}. ${phase.title}`
  }))
}

export function getPhaseDependencies(phaseId: string): ConstructionPhase[] {
  const phase = getPhaseById(phaseId)
  if (!phase) return []
  
  return phase.dependencies
    .map(depId => getPhaseById(depId))
    .filter((dep): dep is ConstructionPhase => dep !== undefined)
}

// New function to get phases based on construction method
export function getPhasesForMethod(method: ConstructionMethod): ConstructionPhase[] {
  switch (method) {
    case "post-frame":
      return POST_FRAME_PHASES;
    case "icf":
      return ICF_PHASES;
    case "sip":
      return SIP_PHASES; // Now has dedicated SIP phases
    case "modular":
      return MODULAR_PHASES; // Now has dedicated modular phases
    case "other":
      return TRADITIONAL_FRAME_PHASES; // Default to traditional for unknown methods
    default:
      return TRADITIONAL_FRAME_PHASES;
  }
}

// Function to get phases for dropdown based on construction method
export function getPhasesForDropdownByMethod(method: ConstructionMethod): { id: string; title: string }[] {
  const phases = getPhasesForMethod(method);
  return phases.map(phase => ({
    id: phase.id,
    title: `${phase.order}. ${phase.title}`
  }));
}

/**
 * Utility function to update duration estimates for a specific phase
 * This makes it easy to adjust estimates based on local conditions or contractor input
 */
export function updatePhaseDuration(
  method: ConstructionMethod, 
  phaseId: string, 
  newDuration: string
): boolean {
  let phases: ConstructionPhase[];
  
  switch (method) {
    case "post-frame":
      phases = POST_FRAME_PHASES;
      break;
    case "icf":
      phases = ICF_PHASES;
      break;
    case "sip":
      phases = SIP_PHASES;
      break;
    case "modular":
      phases = MODULAR_PHASES;
      break;
    case "traditional-frame":
    case "other":
      phases = TRADITIONAL_FRAME_PHASES;
      break;
    default:
      return false;
  }
  
  const phase = phases.find(p => p.id === phaseId);
  if (phase) {
    phase.estimatedDuration = newDuration;
    return true;
  }
  
  return false;
}

/**
 * Get all phases with their current duration estimates for easy review/editing
 */
export function getAllPhasesWithDurations(): Array<{
  method: string;
  phaseId: string;
  title: string;
  currentDuration: string | undefined;
}> {
  const result: Array<{
    method: string;
    phaseId: string;
    title: string;
    currentDuration: string | undefined;
  }> = [];
  
  // Traditional Frame phases
  TRADITIONAL_FRAME_PHASES.forEach(phase => {
    result.push({
      method: "traditional-frame",
      phaseId: phase.id,
      title: phase.title,
      currentDuration: phase.estimatedDuration
    });
  });
  
  // Post-Frame phases
  POST_FRAME_PHASES.forEach(phase => {
    result.push({
      method: "post-frame",
      phaseId: phase.id,
      title: phase.title,
      currentDuration: phase.estimatedDuration
    });
  });
  
  // ICF phases
  ICF_PHASES.forEach(phase => {
    result.push({
      method: "icf",
      phaseId: phase.id,
      title: phase.title,
      currentDuration: phase.estimatedDuration
    });
  });
  
  // SIP phases
  SIP_PHASES.forEach(phase => {
    result.push({
      method: "sip",
      phaseId: phase.id,
      title: phase.title,
      currentDuration: phase.estimatedDuration
    });
  });
  
  // Modular phases
  MODULAR_PHASES.forEach(phase => {
    result.push({
      method: "modular",
      phaseId: phase.id,
      title: phase.title,
      currentDuration: phase.estimatedDuration
    });
  });
  
  return result;
}

/**
 * Duration Override Management Functions
 * These functions allow users to override baseline estimates at any tier level
 */

// In-memory storage for duration overrides (in production, this would be in Supabase)
const durationOverrides: Map<string, DurationOverride> = new Map();

/**
 * Set a duration override for a specific phase and construction method
 */
export function setDurationOverride(
  phaseId: string,
  constructionMethod: ConstructionMethod,
  customDuration: string,
  overrideType: DurationOverride['overrideType'],
  notes?: string
): void {
  const key = `${constructionMethod}-${phaseId}`;
  const override: DurationOverride = {
    phaseId,
    constructionMethod,
    customDuration,
    overrideType,
    notes,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  durationOverrides.set(key, override);
}

/**
 * Get the effective duration for a phase, considering any overrides
 */
export function getEffectiveDuration(
  phaseId: string,
  constructionMethod: ConstructionMethod
): string | undefined {
  const key = `${constructionMethod}-${phaseId}`;
  const override = durationOverrides.get(key);
  
  if (override) {
    return override.customDuration;
  }
  
  // Fall back to baseline estimate
  const phases = getPhasesForMethod(constructionMethod);
  const phase = phases.find(p => p.id === phaseId);
  return phase?.estimatedDuration;
}

/**
 * Remove a duration override
 */
export function removeDurationOverride(
  phaseId: string,
  constructionMethod: ConstructionMethod
): boolean {
  const key = `${constructionMethod}-${phaseId}`;
  return durationOverrides.delete(key);
}

/**
 * Get all active duration overrides
 */
export function getAllDurationOverrides(): DurationOverride[] {
  return Array.from(durationOverrides.values());
}

/**
 * Get duration overrides for a specific construction method
 */
export function getDurationOverridesForMethod(method: ConstructionMethod): DurationOverride[] {
  return getAllDurationOverrides().filter(override => override.constructionMethod === method);
}
