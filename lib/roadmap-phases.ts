import type { ConstructionMethod } from "@/lib/roadmap-types";

export interface ConstructionPhase {
  id: string
  title: string
  order: number
  description: string
  subtasks: string[]
  dependencies: string[] // IDs of phases that must be completed first
  constructionMethods: string[] // Which construction methods this phase applies to
}

// Traditional frame construction phases (current sequence)
export const TRADITIONAL_FRAME_PHASES: ConstructionPhase[] = [
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
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
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
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
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
      "Form/pour foundation walls or ICF",
      "Install anchor bolts and hold-downs",
      "Under-slab plumbing sleeves",
      "Vapor barrier and rigid insulation",
      "Foundation waterproofing and protection board",
      "Slab reinforcement and control joints",
      "Pour foundation and garage slabs",
      "As-built/foundation survey if required"
    ],
    dependencies: ["excavation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "exterior-framing",
    title: "Exterior Framing (Shell)",
    order: 6,
    description: "Structural framing of floors, exterior walls, and roof - the house shell",
    subtasks: [
      "Install sill plates and seal",
      "Frame floors with joists and subflooring",
      "Frame exterior walls only",
      "Install steel/wood carrying beams",
      "Frame roof trusses and decking",
      "Install sheathing and subfascia",
      "Frame exterior stairs and landings",
      "Install steel framing connectors",
      "Set windows and doors with flashing",
      "Install exterior WRB and tapes",
      "Exterior framing inspection and QC"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "modular", "other"]
  },
  {
    id: "interior-framing",
    title: "Interior Framing & Blocking",
    order: 7,
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
    dependencies: ["exterior-framing"],
    constructionMethods: ["traditional-frame", "modular", "other"]
  },
  {
    id: "roofing",
    title: "Roofing",
    order: 8,
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
    dependencies: ["interior-framing"],
    constructionMethods: ["traditional-frame", "modular", "other"]
  },
  {
    id: "exterior",
    title: "Exterior Finishes",
    order: 9,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "plumbing-rough",
    title: "Plumbing Rough-In",
    order: 10,
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
    dependencies: ["exterior-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "electrical-rough",
    title: "Electrical Rough-In",
    order: 11,
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
    dependencies: ["exterior-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "hvac-rough",
    title: "HVAC Rough-In",
    order: 12,
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
    dependencies: ["exterior-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "radiant-heat",
    title: "In-Floor Radiant Heat",
    order: 13,
    description: "Sub-slab radiant heating system",
    subtasks: [
      "Create zone map and control strategy",
      "Install sub-slab insulation",
      "Install vapor barrier",
      "Lay and staple PEX tubing",
      "Protect tubing transitions",
      "Pressure test before concrete pour",
      "Install boiler and heat source",
      "Install mixing valves and controls",
      "Integrate with HVAC system"
    ],
    dependencies: ["foundation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "concrete-slabs",
    title: "Concrete Slabs & Flatwork",
    order: 14,
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
    dependencies: ["radiant-heat", "foundation"],
    constructionMethods: ["traditional-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "insulation",
    title: "Insulation & Air Sealing",
    order: 15,
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
    dependencies: ["exterior", "exterior-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "interior-framing-blocking",
    title: "Interior Framing & Blocking",
    order: 16,
    description: "Interior walls, blocking, and soundproofing",
    subtasks: [
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 17,
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
    dependencies: ["interior-framing"],
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "paint",
    title: "Paint",
    order: 18,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "trim-carpentry",
    title: "Trim Carpentry",
    order: 19,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "flooring",
    title: "Flooring",
    order: 20,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "kitchen-bath",
    title: "Kitchen & Bath",
    order: 21,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  },
  {
    id: "final-touches",
    title: "Final Touches & Punch List",
    order: 22,
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
    constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
  }
]

// Post-frame construction phases (different sequence)
export const POST_FRAME_PHASES: ConstructionPhase[] = [
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
  },
  {
    id: "post-frame-structure",
    title: "Post Frame Structure",
    order: 5,
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
    constructionMethods: ["post-frame"]
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
    dependencies: ["post-frame-structure"],
    constructionMethods: ["post-frame"]
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
    dependencies: ["post-frame-structure"],
    constructionMethods: ["post-frame"]
  },
  {
    id: "radiant-heat",
    title: "In-Floor Heat (Optional)",
    order: 8,
    description: "Sub-slab radiant heating system",
    subtasks: [
      "Create zone map and control strategy",
      "Install sub-slab insulation",
      "Install vapor barrier",
      "Lay and staple PEX tubing",
      "Protect tubing transitions",
      "Pressure test before concrete pour",
      "Install boiler and heat source",
      "Install mixing valves and controls",
      "Integrate with HVAC system"
    ],
    dependencies: ["plumbing-rough"],
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
  },
  {
    id: "concrete-slabs",
    title: "Slab and Flatwork",
    order: 10,
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
    dependencies: ["radiant-heat", "electrical-rough"],
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
  },
  {
    id: "interior-framing-post-frame",
    title: "Interior Framing & Blocking",
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
    constructionMethods: ["post-frame"]
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
    dependencies: ["interior-framing-post-frame"],
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
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
    constructionMethods: ["post-frame"]
  }
]

// ICF construction phases
export const ICF_PHASES: ConstructionPhase[] = [
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
  },
  {
    id: "radiant-heat",
    title: "In-Floor Radiant Heat",
    order: 11,
    description: "Sub-slab radiant heating system",
    subtasks: [
      "Create zone map and control strategy",
      "Install sub-slab insulation",
      "Install vapor barrier",
      "Lay and staple PEX tubing",
      "Protect tubing transitions",
      "Pressure test before concrete pour",
      "Install boiler and heat source",
      "Install mixing valves and controls",
      "Integrate with HVAC system"
    ],
    dependencies: ["icf-foundation-walls"],
    constructionMethods: ["icf"]
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
    dependencies: ["radiant-heat", "icf-foundation-walls"],
    constructionMethods: ["icf"]
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
    dependencies: ["exterior", "icf-foundation-walls"],
    constructionMethods: ["icf"]
  },
  {
    id: "interior-framing-icf",
    title: "Interior Framing & Blocking",
    order: 14,
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
    constructionMethods: ["icf"]
  },
  {
    id: "drywall",
    title: "Drywall",
    order: 15,
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
    dependencies: ["interior-framing"],
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
    constructionMethods: ["icf"]
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
      return POST_FRAME_PHASES; // SIP similar to post-frame for now
    case "modular":
      return TRADITIONAL_FRAME_PHASES; // Modular similar to traditional for now
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
