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
  tasks: string[]
  helpfulInformation?: string[] // Helpful information and guidance
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
    tasks: [
      "Acquire Land",
      "Complete initial project assessment",
      "Determine project scope and goals",
      "Research construction methods and options",
      "Assess budget and financing needs",
      "Identify potential challenges and solutions",
      "Begin gathering project requirements",
      "Research local building codes and regulations",
      "Consider timeline and scheduling needs"
    ],
    helpfulInformation: [
      "Research 3-5 similar completed projects in your area for insights and costs",
      "Interview 2-3 local contractors to understand pricing and availability",
      "Visit 3 different building supply stores to research material costs",
      "Research 3 different financing options (construction loans, HELOC, cash)",
      "Review 3 different insurance policies (builder's risk, liability, workers comp)",
      "Research 3 different permit requirements and typical timelines",
      "Create a project budget spreadsheet with multiple cost scenarios",
      "Develop a risk assessment document with mitigation strategies",
      "Research 3 different construction methods and their pros/cons",
      "Create a project timeline with key milestones and dependencies"
    ],
    dependencies: [],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "pre-construction",
    title: "Pre-Construction Planning",
    order: 1,
    description: "Initial planning, financing, and legal setup before breaking ground",
    tasks: [
      "Complete project kickoff questionnaire",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for plans",
      "Establish budget and cost tracking",
      "Secure financing and construction loan",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Schedule pre-construction meeting with trades"
    ],
    helpfulInformation: [
      "Get 3+ quotes from architects/engineers and compare their experience",
      "Research 3 different survey companies and their pricing",
      "Create a detailed cost breakdown spreadsheet with line items",
      "Apply to 3+ banks for construction loans and compare terms",
      "Research 3 different permit expediting services if needed",
      "Get 3+ insurance quotes and compare coverage options",
      "Create a contractor evaluation matrix with criteria and scoring",
      "Develop a pre-construction meeting agenda and checklist",
      "Research 3 different project management software options",
      "Create a communication plan with all stakeholders"
    ],
    dependencies: [],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep-excavation",
    title: "Site Preparation & Excavation",
    order: 2,
    description: "Site preparation, excavation, and foundation preparation",
    tasks: [
      "Apply for site/driveway/grading permits",
      "**CALL FOR UTILITY LOCATIONS**",
      "Establish benchmark elevations",
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Stake house corners, driveway, and utilities",
      "Install construction entrance and access roads",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Foundation excavation and trenching",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Pre-construction meeting with key trades",
      "Backfill and compaction",
      "Final grade and drainage verification",
      "Site inspection(s) per jurisdiction"
    ],
    helpfulInformation: [
      "Get 3+ quotes from excavation contractors and compare equipment and experience",
      "Research 3 different erosion control product suppliers and their pricing",
      "Contact 3+ utility companies to understand connection requirements and costs",
      "Get 3+ quotes from survey companies for benchmark elevations",
      "Research 3 different temporary power/water service providers",
      "Get 3+ quotes from portable restroom and dumpster rental companies",
      "Research 3 different erosion control installation methods and costs",
      "Create a site preparation checklist with photos and measurements",
      "Research 3 different rock removal methods if blasting is needed",
      "Develop a site access plan for deliveries and equipment"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    tasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Town water/sewer tap fees and hookup",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Install septic tank and distribution field",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    helpfulInformation: [
      "Get 3+ quotes from soil testing companies and compare their methods",
      "Research 3 different septic system designs and their costs",
      "Contact 3+ utility companies for connection fees and requirements",
      "Get 3+ quotes from well drilling companies and compare their experience",
      "Research 3 different water treatment systems and their maintenance needs",
      "Get 3+ quotes from septic installers and compare their warranties",
      "Research 3 different electrical service upgrade options and costs",
      "Get 3+ quotes from gas line installers and compare their safety records",
      "Research 3 different telecom providers and their installation requirements",
      "Create a utility connection timeline with all required inspections"
    ],
    dependencies: ["site-prep-excavation"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },

  {
    id: "foundation",
    title: "Foundation",
    order: 4,
    description: "Concrete foundation walls, footings, slabs, and in-floor radiant heat system",
    tasks: [
      "Layout verification against survey stakes",
      "Form footings with rebar, pre-pour inspection, and pour footings",
      "Form and pour foundation walls",
      "Install anchor bolts and hold-downs",
      "Install foundation drainage system (footing drains / perimeter drain tile with washed stone)",
      "Install curtain drains and swales (if required for site drainage)",
      "Waterproof or dampproof foundation walls and install protection/drain board",
      "Install under-slab plumbing sleeves",
      "Install vapor barrier and rigid insulation",
      "Place slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "Conduct as-built/foundation survey if required"
    ],
    helpfulInformation: [
      "Get 3+ quotes from concrete contractors and compare their experience with foundations",
      "Research 3 different rebar suppliers and compare their quality and pricing",
      "Get 3+ quotes from waterproofing contractors and compare their methods",
      "Research 3 different drainage system designs and their effectiveness",
      "Get 3+ quotes from excavation contractors for foundation trenches",
      "Research 3 different concrete mix designs and their strength characteristics",
      "Get 3+ quotes from formwork companies and compare their quality",
      "Research 3 different anchor bolt systems and their load ratings",
      "Create a foundation inspection checklist with photos and measurements",
      "Develop a concrete curing and protection plan for different weather conditions"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-6 weeks"
  },
  {
    id: "rough-framing",
    title: "Rough Framing",
    order: 5,
    description: "Complete structural framing including floors, walls, roof, and interior partitions",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from framing contractors and compare their experience and crew size",
      "Research 3 different lumber suppliers and compare their quality and pricing",
      "Get 3+ quotes from truss manufacturers and compare their engineering and delivery times",
      "Research 3 different subfloor materials and their installation requirements",
      "Get 3+ quotes from door/window suppliers and compare their energy ratings",
      "Research 3 different framing techniques and their structural benefits",
      "Get 3+ quotes from crane services for truss installation if needed",
      "Research 3 different blocking materials and their fire resistance ratings",
      "Create a framing inspection checklist with photos and measurements",
      "Develop a weather protection plan for exposed framing during construction"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "modular", "other"],
    estimatedDuration: "4-8 weeks"
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 6,
    description: "Roof installation and weatherproofing",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from roofing contractors and compare their experience and warranties",
      "Research 3 different roofing materials and compare their lifespan and costs",
      "Get 3+ quotes from gutter companies and compare their materials and installation",
      "Research 3 different underlayment products and their moisture resistance",
      "Get 3+ quotes from skylight suppliers and compare their energy ratings",
      "Research 3 different flashing materials and their durability",
      "Get 3+ quotes from ventilation companies and compare their airflow ratings",
      "Research 3 different roof membrane options and their installation methods",
      "Create a roof inspection checklist with photos and measurements",
      "Develop a roof maintenance schedule and warranty documentation"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 7,
    description: "Exterior siding, trim, and weather protection",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from siding contractors and compare their experience and warranties",
      "Research 3 different siding materials and compare their durability and maintenance",
      "Get 3+ quotes from stone/brick veneer installers and compare their craftsmanship",
      "Research 3 different weather barrier products and their permeability ratings",
      "Get 3+ quotes from window/door installers and compare their energy ratings",
      "Research 3 different exterior paint brands and their weather resistance",
      "Get 3+ quotes from trim carpenters and compare their attention to detail",
      "Research 3 different flashing materials and their corrosion resistance",
      "Create an exterior inspection checklist with photos and measurements",
      "Develop an exterior maintenance schedule and warranty documentation"
    ],
    dependencies: ["roofing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 8,
    description: "Underground and wall plumbing installation",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from plumbing contractors and compare their experience and licenses",
      "Research 3 different pipe materials and compare their durability and costs",
      "Get 3+ quotes from water heater suppliers and compare their efficiency ratings",
      "Research 3 different water treatment systems and their maintenance requirements",
      "Get 3+ quotes from gas line installers and compare their safety certifications",
      "Research 3 different fixture brands and compare their quality and warranties",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different pressure testing methods and their accuracy",
      "Create a plumbing inspection checklist with photos and measurements",
      "Develop a plumbing maintenance schedule and warranty documentation"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Electrical wiring and panel installation",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from electrical contractors and compare their experience and licenses",
      "Research 3 different electrical panel brands and compare their capacity and features",
      "Get 3+ quotes from generator installers and compare their sizing and fuel options",
      "Research 3 different EV charger brands and compare their charging speeds and costs",
      "Get 3+ quotes from low-voltage contractors for phone/cable/internet wiring",
      "Research 3 different smoke detector brands and compare their features and reliability",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different wire types and compare their ampacity and costs",
      "Create an electrical inspection checklist with photos and measurements",
      "Develop an electrical maintenance schedule and warranty documentation"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 10,
    description: "Heating, ventilation, and air conditioning installation",
    tasks: [
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
    helpfulInformation: [
      "Get 3+ quotes from HVAC contractors and compare their experience and certifications",
      "Research 3 different HVAC brands and compare their efficiency ratings and warranties",
      "Get 3+ quotes from ductwork companies and compare their materials and installation",
      "Research 3 different thermostat brands and compare their features and smart capabilities",
      "Get 3+ quotes from ERV/HRV suppliers and compare their energy recovery efficiency",
      "Research 3 different duct materials and compare their insulation and air tightness",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different zoning systems and compare their flexibility and costs",
      "Create an HVAC inspection checklist with photos and measurements",
      "Develop an HVAC maintenance schedule and warranty documentation"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 11,
    description: "Interior slabs, garage, and exterior concrete",
    tasks: [
      "Verify radiant tubing protection",
      "Confirm slab thickness and reinforcement",
      "Place, finish, and cure slabs",
      "Saw-cut control joints",
      "Install garage apron and driveway",
      "Install porches and walkways",
      "Apply sealers and hardeners",
      "Final concrete inspection"
    ],
    helpfulInformation: [
      "Get 3+ quotes from concrete contractors and compare their experience and equipment",
      "Research 3 different concrete mix designs and compare their strength and workability",
      "Get 3+ quotes from finishing companies and compare their techniques and quality",
      "Research 3 different sealer brands and compare their durability and maintenance",
      "Get 3+ quotes from saw-cutting companies and compare their precision and timing",
      "Research 3 different reinforcement materials and compare their strength and costs",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different curing methods and compare their effectiveness and costs",
      "Create a concrete inspection checklist with photos and measurements",
      "Develop a concrete maintenance schedule and warranty documentation"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 12,
    description: "Thermal and sound insulation installation",
    tasks: [
      "Complete air sealing pass",
      "Install vent baffles and eave chutes",
      "Install wall insulation (batts/blown/foam)",
      "Install attic insulation",
      "Install sound batts where specified",
      "Install vapor retarder if required",
      "Blower door test and remediation",
      "Insulation inspection"
    ],
    helpfulInformation: [
      "Get 3+ quotes from insulation contractors and compare their experience and techniques",
      "Research 3 different insulation materials and compare their R-values and costs",
      "Get 3+ quotes from air sealing companies and compare their methods and materials",
      "Research 3 different vapor retarder products and compare their permeability ratings",
      "Get 3+ quotes from blower door testing companies and compare their equipment and accuracy",
      "Research 3 different sound insulation products and compare their STC ratings",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different air sealing materials and compare their durability and effectiveness",
      "Create an insulation inspection checklist with photos and measurements",
      "Develop an insulation maintenance schedule and warranty documentation"
    ],
    dependencies: ["exterior", "rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 13,
    description: "Interior wall and ceiling finishing",
    tasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    helpfulInformation: [
      "Get 3+ quotes from drywall contractors and compare their experience and finish quality",
      "Research 3 different drywall brands and compare their thickness and moisture resistance",
      "Get 3+ quotes from taping companies and compare their techniques and finish levels",
      "Research 3 different mud brands and compare their workability and drying time",
      "Get 3+ quotes from sanding companies and compare their techniques and dust control",
      "Research 3 different corner protection products and compare their durability and costs",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different primer brands and compare their coverage and adhesion",
      "Create a drywall inspection checklist with photos and measurements",
      "Develop a drywall maintenance schedule and warranty documentation"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 14,
    description: "Interior and exterior painting",
    tasks: [
      "Surface preparation and caulking",
      "Mask and protect surfaces",
      "Prime all surfaces",
      "Sand between coats",
      "Apply finish coats",
      "Exterior painting as weather allows",
      "Touch-ups and final inspection"
    ],
    helpfulInformation: [
      "Get 3+ quotes from painting contractors and compare their experience and techniques",
      "Research 3 different paint brands and compare their coverage and durability",
      "Get 3+ quotes from caulking companies and compare their materials and techniques",
      "Research 3 different primer brands and compare their adhesion and coverage",
      "Get 3+ quotes from sanding companies and compare their techniques and dust control",
      "Research 3 different paint finishes and compare their appearance and maintenance",
      "Get 3+ quotes from inspection companies and compare their thoroughness",
      "Research 3 different masking materials and compare their protection and ease of use",
      "Create a paint inspection checklist with photos and measurements",
      "Develop a paint maintenance schedule and warranty documentation"
    ],
    dependencies: ["drywall"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 15,
    description: "Interior trim, doors, and hardware",
    tasks: [
      "Install interior doors and jambs",
      "Install door hardware",
      "Install casing, base, and crown molding",
      "Install window stools and aprons",
      "Build closets and shelving",
      "Install stair trim and railings",
      "Install cabinet boxes",
      "Caulk and putty preparation"
    ],
    helpfulInformation: [
      "Get 3+ quotes from trim carpenters and compare their experience and craftsmanship",
      "Research 3 different door brands and compare their quality and energy ratings",
      "Get 3+ quotes from hardware suppliers and compare their quality and warranties",
      "Research 3 different molding materials and compare their durability and costs",
      "Get 3+ quotes from cabinet installers and compare their techniques and quality",
      "Research 3 different stair railing designs and compare their safety and aesthetics",
      "Get 3+ quotes from caulking companies and compare their materials and techniques",
      "Research 3 different trim materials and compare their moisture resistance and costs",
      "Create a trim inspection checklist with photos and measurements",
      "Develop a trim maintenance schedule and warranty documentation"
    ],
    dependencies: ["paint"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 16,
    description: "Floor covering installation",
    tasks: [
      "Inspect subfloor flatness",
      "Moisture testing and acclimation",
      "Install underlayments and sound isolation",
      "Install tile with proper layout",
      "Install wood/LVP flooring",
      "Install carpet with pad",
      "Install transitions and trim",
      "Protect until substantial completion"
    ],
    helpfulInformation: [
      "Get 3+ quotes from flooring contractors and compare their experience and techniques",
      "Research 3 different flooring materials and compare their durability and maintenance",
      "Get 3+ quotes from tile installers and compare their craftsmanship and patterns",
      "Research 3 different underlayment products and compare their sound isolation ratings",
      "Get 3+ quotes from wood flooring suppliers and compare their species and finishes",
      "Research 3 different LVP brands and compare their wear layers and warranties",
      "Get 3+ quotes from carpet installers and compare their padding and installation",
      "Research 3 different transition materials and compare their durability and costs",
      "Create a flooring inspection checklist with photos and measurements",
      "Develop a flooring maintenance schedule and warranty documentation"
    ],
    dependencies: ["trim-carpentry"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 17,
    description: "Kitchen and bathroom finishing",
    tasks: [
      "Install kitchen cabinets",
      "Install bathroom vanities",
      "Install countertops and backsplash",
      "Install plumbing fixtures",
      "Install appliances",
      "Install hardware and accessories",
      "Final kitchen and bath inspection"
    ],
    dependencies: ["flooring"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "other"],
    estimatedDuration: "3-4 weeks"
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 18,
    description: "Final details and project completion",
    tasks: [
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
    tasks: [
      "Acquire Land",
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
    tasks: [
      "Complete project kickoff questionnaire",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for plans",
      "Establish budget and cost tracking",
      "Secure financing and construction loan",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
     constructionMethods: ["post-frame"],
     estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep-excavation",
    title: "Site Preparation & Excavation",
    order: 2,
    description: "Site preparation, excavation, and foundation preparation",
    tasks: [
      "Apply for site/driveway/grading permits",
      "**CALL FOR UTILITY LOCATIONS**",
      "Establish benchmark elevations",
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Foundation excavation and trenching",
      "Stake house corners, driveway, and utilities",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Backfill and compaction",
      "Pre-construction meeting with key trades",
      "Final grade and drainage verification",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
     constructionMethods: ["post-frame"],
     estimatedDuration: "2-3 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    tasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Town water/sewer tap fees and hookup",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Install septic tank and distribution field",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep-excavation"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "1-2 weeks"
  },

  {
    id: "foundation",
    title: "Foundation",
    order: 4,
    description: "Concrete foundation walls, footings, and slabs",
    tasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Form/pour foundation walls",
      "Install anchor bolts and hold-downs",
      "Install foundation footing drains",
      "Install curtain drains and swales",
      "Install foundation drain board installation",
      "Waterproofing and dampproofing",
      "Perimeter drain tile with washed stone",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "rough-framing",
    title: "Rough Framing",
    order: 5,
    description: "Complete structural framing including floors, walls, roof, and interior partitions",
    tasks: [
      "Install sill plates and seal",
      "Frame floors with joists and subflooring",
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
    helpfulInformation: [
      "Get 3+ quotes from framing contractors and compare their experience and crew size",
      "Research 3 different lumber suppliers and compare their quality and pricing",
      "Get 3+ quotes from truss manufacturers and compare their engineering and delivery times",
      "Research 3 different subfloor materials and their installation requirements",
      "Get 3+ quotes from door/window suppliers and compare their energy ratings",
      "Research 3 different framing techniques and their structural benefits",
      "Get 3+ quotes from crane services for truss installation if needed",
      "Research 3 different blocking materials and their fire resistance ratings",
      "Create a framing inspection checklist with photos and measurements",
      "Develop a weather protection plan for exposed framing during construction"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["post-frame"],
    estimatedDuration: "4-8 weeks"
  },
  {
    id: "post-frame-structure",
    title: "Post Frame Structure",
    order: 6,
    description: "Post frame construction with trusses, metal siding, windows, exterior doors, and roof",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Underground electrical wiring and panel installation",
    tasks: [
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
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Slab and Flatwork",
    order: 10,
    description: "Interior slabs, garage, and exterior concrete",
    tasks: [
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
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 11,
    description: "Thermal and sound insulation installation",
    tasks: [
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
    constructionMethods: ["post-frame"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "rough-framing-post-frame",
    title: "Rough Framing",
    order: 12,
    description: "Interior walls, blocking, and soundproofing",
    tasks: [
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
    tasks: [
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
    order: 13,
    description: "Interior wall and ceiling finishing",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
      "Acquire Land",
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
    tasks: [
      "Complete project kickoff questionnaire",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for ICF-specific plans",
      "Establish budget and cost tracking",
      "Secure financing and construction loan",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep-excavation",
    title: "Site Preparation & Excavation",
    order: 2,
    description: "Site preparation, excavation, and foundation preparation",
    tasks: [
      "Apply for site/driveway/grading permits",
      "**CALL FOR UTILITY LOCATIONS**",
      "Establish benchmark elevations",
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Foundation excavation and trenching",
      "Stake house corners, driveway, and utilities",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Backfill and compaction",
      "Pre-construction meeting with key trades",
      "Final grade and drainage verification",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    tasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Town water/sewer tap fees and hookup",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Install septic tank and distribution field",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep-excavation"],
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },

  {
    id: "icf-foundation-walls",
    title: "ICF Foundation & Walls",
    order: 4,
    description: "ICF forms, concrete, and wall construction",
    tasks: [
      "Layout verification against survey stakes",
      "Form and pour footings with rebar",
      "Pre-pour inspection and pour footings",
      "Set up ICF forms with proper bracing",
      "Install rebar and reinforcement",
      "Install electrical and plumbing sleeves",
      "Pour concrete into ICF forms",
      "Remove ICF forms after curing",
      "Install foundation footing drains",
      "Install curtain drains and swales",
      "Install foundation drain board installation",
      "Waterproofing and dampproofing",
      "Perimeter drain tile with washed stone",
      "ICF foundation inspection and QC"
    ],
    dependencies: ["utilities-septic"],
    constructionMethods: ["icf"],
    estimatedDuration: "4-6 weeks"
  },
  {
    id: "rough-framing",
    title: "Rough Framing",
    order: 5,
    description: "Complete structural framing including floors, walls, roof, and interior partitions",
    tasks: [
      "Install sill plates and seal",
      "Frame floors with joists and subflooring",
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
    helpfulInformation: [
      "Get 3+ quotes from framing contractors and compare their experience and crew size",
      "Research 3 different lumber suppliers and compare their quality and pricing",
      "Get 3+ quotes from truss manufacturers and compare their engineering and delivery times",
      "Research 3 different subfloor materials and their installation requirements",
      "Get 3+ quotes from door/window suppliers and compare their energy ratings",
      "Research 3 different framing techniques and their structural benefits",
      "Get 3+ quotes from crane services for truss installation if needed",
      "Research 3 different blocking materials and their fire resistance ratings",
      "Create a framing inspection checklist with photos and measurements",
      "Develop a weather protection plan for exposed framing during construction"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"],
    estimatedDuration: "4-8 weeks"
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 6,
    description: "Roof installation and weatherproofing",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 9,
    description: "Electrical wiring and panel installation",
    tasks: [
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
    constructionMethods: ["icf"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 10,
    description: "Heating, ventilation, and air conditioning installation",
    tasks: [
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
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 11,
    description: "Interior slabs, garage, and exterior concrete",
    tasks: [
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
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 12,
    description: "Thermal and sound insulation installation",
    tasks: [
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
    constructionMethods: ["icf"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "rough-framing-icf",
    title: "Rough Framing",
    order: 13,
    description: "Interior walls, blocking, and soundproofing",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
      "Acquire Land",
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
    tasks: [
      "Complete project kickoff questionnaire",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for SIP-specific plans",
      "Establish budget and cost tracking",
      "Secure financing and construction loan",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact sub contractors",
      "Schedule pre-construction meeting with trades"
    ],
    dependencies: [],
    constructionMethods: ["sip"],
    estimatedDuration: "2-4 weeks"
  },
  {
    id: "site-prep-excavation",
    title: "Site Preparation & Excavation",
    order: 2,
    description: "Site preparation, excavation, and foundation preparation",
    tasks: [
      "Apply for site/driveway/grading permits",
      "**CALL FOR UTILITY LOCATIONS**",
      "Establish benchmark elevations",
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Foundation excavation and trenching",
      "Stake house corners, driveway, and utilities",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Backfill and compaction",
      "Pre-construction meeting with key trades",
      "Final grade and drainage verification",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    tasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Town water/sewer tap fees and hookup",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Install septic tank and distribution field",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep-excavation"],
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 3,
    description: "Concrete foundation walls, footings, and slabs",
    tasks: [
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
    order: 4,
    description: "Installation of structural insulated panels for walls and roof",
    tasks: [
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
    id: "rough-framing",
    title: "Rough Framing",
    order: 5,
    description: "Complete structural framing including floors, walls, roof, and interior partitions",
    tasks: [
      "Install sill plates and seal",
      "Frame floors with joists and subflooring",
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
    helpfulInformation: [
      "Get 3+ quotes from framing contractors and compare their experience and crew size",
      "Research 3 different lumber suppliers and compare their quality and pricing",
      "Get 3+ quotes from truss manufacturers and compare their engineering and delivery times",
      "Research 3 different subfloor materials and their installation requirements",
      "Get 3+ quotes from door/window suppliers and compare their energy ratings",
      "Research 3 different framing techniques and their structural benefits",
      "Get 3+ quotes from crane services for truss installation if needed",
      "Research 3 different blocking materials and their fire resistance ratings",
      "Create a framing inspection checklist with photos and measurements",
      "Develop a weather protection plan for exposed framing during construction"
    ],
    dependencies: ["sip-panel-installation"],
    constructionMethods: ["sip"],
    estimatedDuration: "4-8 weeks"
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 6,
    description: "Exterior siding, trim, and weather protection",
    tasks: [
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
    tasks: [
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
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 8,
    description: "Electrical wiring and panel installation",
    tasks: [
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
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 9,
    description: "Heating, ventilation, and air conditioning installation",
    tasks: [
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
    constructionMethods: ["sip"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 10,
    description: "Interior slabs, garage, and exterior concrete",
    tasks: [
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
    tasks: [
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
    constructionMethods: ["sip"],
    estimatedDuration: "1-2 weeks"
  },
  {
    id: "rough-framing-sip",
    title: "Rough Framing",
    order: 12,
    description: "Interior walls, blocking, and soundproofing",
    tasks: [
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
    tasks: [
      "Hang drywall (MR board where needed)",
      "Tape and mud to Level 4/5 finish",
      "Sand and touch-up",
      "Install corner protection",
      "Prime walls and ceilings",
      "Ready-for-paint inspection",
      "Final drywall inspection"
    ],
    dependencies: ["rough-framing"],
    constructionMethods: ["sip"],
    estimatedDuration: "3-5 weeks"
  },
  {
    id: "paint",
    title: "Paint",
    order: 14,
    description: "Interior and exterior painting",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
      "Acquire Land",
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
    tasks: [
      "Complete project kickoff questionnaire",
      "Obtain property survey and site analysis",
      "Hire architect/engineer for modular plans",
      "Establish budget and cost tracking",
      "Secure financing and construction loan",
      "Obtain building permits and approvals",
      "Secure insurance (builder's risk, liability)",
      "Identify and contact modular manufacturer",
      "Schedule factory visit and design review"
    ],
    dependencies: [],
    constructionMethods: ["modular"],
    estimatedDuration: "3-6 weeks"
  },
  {
    id: "site-prep-excavation",
    title: "Site Preparation & Excavation",
    order: 2,
    description: "Site preparation, excavation, and foundation preparation",
    tasks: [
      "Apply for site/driveway/grading permits",
      "**CALL FOR UTILITY LOCATIONS**",
      "Establish benchmark elevations",
      "Clear and grub site within permitted limits",
      "Install erosion controls (silt fence, inlet protection)",
      "Cut and fill operations",
      "Rock removal and blasting if needed",
      "Foundation excavation and trenching",
      "Stake house corners, driveway, and utilities",
      "Install construction entrance and access roads",
      "Set up temporary power and water",
      "Install portable restroom and dumpster",
      "Backfill and compaction",
      "Pre-construction meeting with key trades",
      "Final grade and drainage verification",
      "Site inspection(s) per jurisdiction"
    ],
    dependencies: ["pre-construction"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "utilities-septic",
    title: "Utilities & Septic",
    order: 3,
    description: "Installation of water, sewer, and utility systems",
    tasks: [
      "Soil and perc tests for septic system",
      "Septic system design and permitting",
      "Town water/sewer tap fees and hookup",
      "Well drilling and pump installation",
      "Pressure tank and water treatment setup",
      "Install septic tank and distribution field",
      "Electrical service connection and meter",
      "Gas line installation and hookup",
      "Telecom and internet hookup",
      "Final utility inspections"
    ],
    dependencies: ["site-prep-excavation"],
    constructionMethods: ["modular"],
    estimatedDuration: "2-3 weeks"
  },
  {
    id: "foundation",
    title: "Foundation",
    order: 3,
    description: "Concrete foundation walls, footings, and slabs",
    tasks: [
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
    order: 4,
    description: "Delivery and installation of factory-built modules",
    tasks: [
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
    order: 5,
    description: "Roof installation and weatherproofing",
    tasks: [
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
    order: 6,
    description: "Exterior siding, trim, and weather protection",
    tasks: [
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
    order: 7,
    description: "Underground and wall plumbing installation",
    tasks: [
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
    order: 8,
    description: "Electrical wiring and panel installation",
    tasks: [
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
    order: 9,
    description: "Heating, ventilation, and air conditioning installation",
    tasks: [
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
    order: 10,
    description: "Interior slabs, garage, and exterior concrete",
    tasks: [
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
    order: 11,
    description: "Thermal and sound insulation installation",
    tasks: [
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
    order: 12,
    description: "Interior walls, blocking, and soundproofing",
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
    tasks: [
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
