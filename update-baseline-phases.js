require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// New consolidated phases structure
const newPhases = {
  phases: [
    {
      id: "just-starting",
      title: "Just Starting",
      order: 0,
      description: "Project initiation and initial assessment phase",
      subtasks: [
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
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"]
    },
    {
      id: "pre-construction",
      title: "Pre-Construction Planning",
      order: 1,
      description: "Initial planning, financing, and legal setup before breaking ground",
      subtasks: [
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
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-4 weeks"
    },
    {
      id: "site-prep-excavation",
      title: "Site Preparation & Excavation",
      order: 2,
      description: "Site preparation, excavation, and foundation preparation",
      subtasks: [
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
        "Final grade and drainage verification",
        "Site inspection(s) per jurisdiction"
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
      subtasks: [
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
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "foundation",
      title: "Foundation",
      order: 4,
      description: "Concrete foundation walls, footings, slabs, and in-floor radiant heat system",
      subtasks: [
        "Layout verification against survey stakes",
        "Form and pour footings with rebar",
        "Pre-pour inspection and pour footings",
        "Form/pour foundation walls or ICF",
        "Install anchor bolts and hold-downs",
        "Install foundation footing drains",
        "Install curtain drains and swales",
        "Install foundation drain board installation",
        "Waterproofing and dampproofing",
        "Perimeter drain tile with washed stone",
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
      dependencies: ["utilities-septic"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "3-6 weeks"
    },
    {
      id: "rough-framing",
      title: "Rough Framing",
      order: 5,
      description: "Complete structural framing including floors, walls, roof, and interior partitions",
      subtasks: [
        "Install sill plates and seal",
        "Frame floors with joists and subflooring",
        "Frame exterior walls",
        "Frame interior partition walls",
        "Install steel/wood carrying beams",
        "Frame roof trusses and decking",
        "Install roof sheathing and underlayment",
        "Install windows and exterior doors",
        "Frame garage and porches if applicable",
        "Install structural hardware and connectors",
        "Pre-inspection for framing",
        "Framing inspection and approval"
      ],
      dependencies: ["foundation"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "4-8 weeks"
    },
    {
      id: "roofing",
      title: "Roofing",
      order: 6,
      description: "Complete roof installation including shingles, flashing, and ventilation",
      subtasks: [
        "Install roof underlayment and ice barrier",
        "Install roof flashing around penetrations",
        "Install roof shingles or metal roofing",
        "Install ridge vents and soffit vents",
        "Install gutters and downspouts",
        "Install chimney flashing if applicable",
        "Install skylights if applicable",
        "Roof inspection and approval",
        "Clean up roofing debris"
      ],
      dependencies: ["rough-framing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "1-2 weeks"
    },
    {
      id: "exterior",
      title: "Exterior Finishes",
      order: 7,
      description: "Exterior siding, trim, and finishing touches",
      subtasks: [
        "Install house wrap and flashing",
        "Install exterior siding (vinyl, wood, brick, etc.)",
        "Install exterior trim and corner boards",
        "Install soffit and fascia",
        "Install exterior doors and hardware",
        "Install garage doors and openers",
        "Install exterior lighting fixtures",
        "Install address numbers and mailbox",
        "Exterior caulking and sealing",
        "Exterior inspection and approval"
      ],
      dependencies: ["roofing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-4 weeks"
    },
    {
      id: "plumbing-rough",
      title: "Plumbing Rough-In",
      order: 8,
      description: "Installation of all plumbing pipes, drains, and fixtures",
      subtasks: [
        "Install main water supply line",
        "Install water distribution pipes",
        "Install drain, waste, and vent pipes",
        "Install water heater and connections",
        "Install plumbing fixtures rough-ins",
        "Install sump pump if required",
        "Pressure test water lines",
        "Test drain and vent systems",
        "Plumbing rough-in inspection",
        "Insulate hot water pipes"
      ],
      dependencies: ["rough-framing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "electrical-rough",
      title: "Electrical Rough-In",
      order: 9,
      description: "Installation of all electrical wiring, panels, and outlets",
      subtasks: [
        "Install electrical service panel",
        "Install branch circuit wiring",
        "Install outlet and switch boxes",
        "Install lighting fixture boxes",
        "Install ceiling fan boxes",
        "Install smoke detector wiring",
        "Install doorbell and intercom wiring",
        "Install garage door opener circuit",
        "Install outdoor electrical outlets",
        "Electrical rough-in inspection"
      ],
      dependencies: ["rough-framing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "hvac-rough",
      title: "HVAC Rough-In",
      order: 10,
      description: "Installation of heating, ventilation, and air conditioning systems",
      subtasks: [
        "Install HVAC equipment and ductwork",
        "Install air return and supply ducts",
        "Install thermostat wiring and controls",
        "Install air filters and registers",
        "Install exhaust fans and vents",
        "Install gas lines for furnace if applicable",
        "Install refrigerant lines for AC",
        "Install condensate drain lines",
        "HVAC rough-in inspection",
        "Test HVAC systems"
      ],
      dependencies: ["rough-framing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "concrete-slabs",
      title: "Concrete Slabs & Flatwork",
      order: 11,
      description: "Installation of concrete floors, driveways, and walkways",
      subtasks: [
        "Prepare subgrade for concrete",
        "Install concrete forms and reinforcement",
        "Install control joints and expansion joints",
        "Pour and finish concrete slabs",
        "Pour and finish garage floor",
        "Pour and finish driveways and walkways",
        "Pour and finish porches and patios",
        "Install concrete sealer",
        "Concrete curing and protection",
        "Concrete inspection and approval"
      ],
      dependencies: ["rough-framing"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-4 weeks"
    },
    {
      id: "insulation",
      title: "Insulation & Air Sealing",
      order: 12,
      description: "Installation of insulation and air sealing materials",
      subtasks: [
        "Install wall insulation (fiberglass, cellulose, spray foam)",
        "Install ceiling/attic insulation",
        "Install floor insulation if applicable",
        "Install foundation insulation",
        "Install air sealing materials",
        "Install vapor barriers",
        "Install sound insulation if required",
        "Insulation inspection and approval",
        "Test air tightness if required"
      ],
      dependencies: ["rough-framing", "plumbing-rough", "electrical-rough", "hvac-rough"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "1-2 weeks"
    },
    {
      id: "drywall",
      title: "Drywall",
      order: 13,
      description: "Installation and finishing of drywall throughout the house",
      subtasks: [
        "Install drywall sheets",
        "Tape and mud drywall joints",
        "Install corner beads and trim",
        "Sand drywall surfaces",
        "Apply primer coat",
        "Install drywall screws and patches",
        "Drywall inspection and approval",
        "Clean up drywall dust and debris"
      ],
      dependencies: ["insulation"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "paint",
      title: "Paint",
      order: 14,
      description: "Interior and exterior painting and finishing",
      subtasks: [
        "Prepare surfaces for painting",
        "Apply primer coats",
        "Apply finish paint coats",
        "Paint interior walls and ceilings",
        "Paint interior trim and doors",
        "Paint exterior surfaces if applicable",
        "Paint garage and outbuildings",
        "Clean up paint supplies and equipment",
        "Paint inspection and approval"
      ],
      dependencies: ["drywall"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "trim-carpentry",
      title: "Trim Carpentry",
      order: 15,
      description: "Installation of interior trim, cabinets, and finishing touches",
      subtasks: [
        "Install interior door trim",
        "Install window trim and sills",
        "Install baseboards and quarter round",
        "Install crown molding and chair rails",
        "Install stair railings and balusters",
        "Install closet shelving and rods",
        "Install interior doors and hardware",
        "Install cabinet hardware",
        "Trim carpentry inspection and approval"
      ],
      dependencies: ["paint"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-3 weeks"
    },
    {
      id: "flooring",
      title: "Flooring",
      order: 16,
      description: "Installation of all floor coverings and finishes",
      subtasks: [
        "Install hardwood floors",
        "Install laminate or engineered flooring",
        "Install tile floors",
        "Install carpet and padding",
        "Install vinyl or linoleum flooring",
        "Install floor transitions and trim",
        "Install floor registers and vents",
        "Flooring inspection and approval",
        "Clean up flooring debris and materials"
      ],
      dependencies: ["trim-carpentry"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "2-4 weeks"
    },
    {
      id: "kitchen-bath",
      title: "Kitchen & Bath",
      order: 17,
      description: "Installation of kitchen and bathroom fixtures and appliances",
      subtasks: [
        "Install kitchen cabinets and countertops",
        "Install kitchen appliances",
        "Install bathroom vanities and fixtures",
        "Install toilets and shower/tub",
        "Install kitchen and bath hardware",
        "Install mirrors and accessories",
        "Install garbage disposal and dishwasher",
        "Kitchen and bath inspection and approval",
        "Test all fixtures and appliances"
      ],
      dependencies: ["flooring"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "3-5 weeks"
    },
    {
      id: "final-touches",
      title: "Final Touches & Punch List",
      order: 18,
      description: "Final inspections, cleanup, and move-in preparation",
      subtasks: [
        "Final building inspection",
        "Final electrical inspection",
        "Final plumbing inspection",
        "Final HVAC inspection",
        "Address punch list items",
        "Clean up construction debris",
        "Install final hardware and accessories",
        "Landscaping and final grading",
        "Final walkthrough with owner",
        "Obtain certificate of occupancy"
      ],
      dependencies: ["kitchen-bath"],
      constructionMethods: ["traditional-frame", "post-frame", "icf", "sip", "modular", "other"],
      estimatedDuration: "1-2 weeks"
    }
  ]
};

async function updateBaselinePhases() {
  try {
    console.log('🔄 Updating baseline construction phases...');
    
    // First, check if there's an existing record
    const { data: existingData, error: selectError } = await supabase
      .from('baseline_construction_phases')
      .select('*')
      .eq('is_active', true);
    
    if (selectError) {
      console.error('❌ Error checking existing data:', selectError);
      return;
    }
    
    if (existingData && existingData.length > 0) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('baseline_construction_phases')
        .update({
          phases: newPhases,
          updated_at: new Date().toISOString()
        })
        .eq('is_active', true);
      
      if (updateError) {
        console.error('❌ Error updating phases:', updateError);
        return;
      }
      
      console.log('✅ Successfully updated existing baseline phases');
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('baseline_construction_phases')
        .insert({
          phases: newPhases,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('❌ Error inserting phases:', insertError);
        return;
      }
      
      console.log('✅ Successfully inserted new baseline phases');
    }
    
    console.log('🎉 Baseline phases updated successfully!');
    console.log('📊 Total phases:', newPhases.phases.length);
    console.log('🔗 Site Preparation & Excavation phase ID:', 'site-prep-excavation');
    
  } catch (error) {
    console.error('❌ Error updating baseline phases:', error);
  }
}

// Run the update
updateBaselinePhases();
