import type { RoadmapData } from "./roadmap-types"

export const baselineRoadmapData: RoadmapData = {
	phases: [
		{
			id: "pre-construction",
			title: "Pre-Construction Planning",
			detailLevel: "standard",
			tasks: [
				{
					id: "pc-1",
					title: "Project Setup and Planning",
					status: "todo",
					steps: [
						{ id: "pc-1-1", description: "Complete project kickoff questionnaire" },
						{ id: "pc-1-3", description: "Establish budget and cost tracking" }
					],
					qaChecks: [
						"All project documents organized and accessible",
						"Budget breakdown completed",
						"Timeline established"
					],
					vendorQuestions: [
						"What is your typical project timeline?",
						"What are your payment terms?",
						"Do you provide written contracts?"
					],
					vendorNeeds: [
						"Project scope and requirements",
						"Budget constraints",
						"Timeline expectations"
					]
				}
			]
		},
		{
			id: "site-prep",
			title: "Site Preparation",
			detailLevel: "standard",
			tasks: [
				{
					id: "sp-1",
					title: "Site Clearing and Setup",
					status: "todo",
					steps: [
						{ id: "sp-1-1", description: "Clear and grub site within permitted limits" },
						{ id: "sp-1-2", description: "Install erosion controls" },
						{ id: "sp-1-3", description: "Set up construction access" }
					],
					qaChecks: [
						"Site properly cleared and leveled",
						"Erosion controls in place",
						"Access roads established"
					],
					vendorQuestions: [
						"What permits are required for site work?",
						"How do you handle rock or difficult soil?",
						"What is your cleanup process?"
					],
					vendorNeeds: [
						"Site plan and survey",
						"Permit information",
						"Access requirements"
					]
				}
			]
		},
		{
			id: "utilities-septic",
			title: "Utilities & Septic",
			detailLevel: "standard",
			tasks: [
				{
					id: "us-1",
					title: "Septic System Installation",
					status: "todo",
					steps: [
						{ id: "us-1-1", description: "Complete soil and perc tests" },
						{ id: "us-1-2", description: "Design septic system" },
						{ id: "us-1-3", description: "Install tank and distribution field" }
					],
					qaChecks: [
						"Perc test results documented",
						"System design approved",
						"Installation inspected"
					],
					vendorQuestions: [
						"What type of septic system do you recommend?",
						"What maintenance is required?",
						"Do you provide maintenance contracts?"
					],
					vendorNeeds: [
						"Site plan and soil test results",
						"Household size and water usage",
						"Local code requirements"
					]
				}
			]
		},
		{
			id: "foundation",
			title: "Foundation",
			detailLevel: "standard",
			tasks: [
				{
					id: "f-1",
					title: "Foundation Construction",
					status: "todo",
					steps: [
						{ id: "f-1-1", description: "Layout verification against survey" },
						{ id: "f-1-2", description: "Excavate and form footings" },
						{ id: "f-1-3", description: "Pour foundation walls" }
					],
					qaChecks: [
						"Layout matches plans exactly",
						"Footings properly reinforced",
						"Walls plumb and level"
					],
					vendorQuestions: [
						"What concrete mix do you use?",
						"How do you ensure accuracy?",
						"What is your warranty?"
					],
					vendorNeeds: [
						"Structural plans",
						"Foundation details",
						"Anchor bolt locations"
					]
				}
			]
		},
		{
			id: "rough-framing",
			title: "Rough Framing",
			detailLevel: "standard",
			tasks: [
				{
					id: "rf-1",
					title: "Structural Framing",
					status: "todo",
					steps: [
						{ id: "rf-1-1", description: "Install floor joists and subfloor" },
						{ id: "rf-1-2", description: "Frame walls and roof" },
						{ id: "rf-1-3", description: "Install sheathing" }
					],
					qaChecks: [
						"All connections properly fastened",
						"Walls plumb and straight",
						"Roof properly pitched"
					],
					vendorQuestions: [
						"What lumber grade do you use?",
						"How do you handle wind bracing?",
						"What is your inspection process?"
					],
					vendorNeeds: [
						"Framing plans",
						"Window and door schedules",
						"Roof pitch specifications"
					]
				}
			]
		},
		{
			id: "roofing",
			title: "Roofing",
			detailLevel: "standard",
			tasks: [
				{
					id: "r-1",
					title: "Roof Installation",
					status: "todo",
					steps: [
						{ id: "r-1-1", description: "Install underlayment and flashing" },
						{ id: "r-1-2", description: "Install roofing material" },
						{ id: "r-1-3", description: "Install gutters and vents" }
					],
					qaChecks: [
						"All flashing properly installed",
						"Roofing material properly fastened",
						"Ventilation adequate"
					],
					vendorQuestions: [
						"What roofing material do you recommend?",
						"How do you handle ice dams?",
						"What is your warranty coverage?"
					],
					vendorNeeds: [
						"Roof plans and specifications",
						"Material preferences",
						"Ventilation requirements"
					]
				}
			]
		},
		{
			id: "exterior",
			title: "Exterior Finishes",
			detailLevel: "standard",
			tasks: [
				{
					id: "e-1",
					title: "Exterior Siding and Trim",
					steps: [
						{ id: "e-1-1", description: "Install weather barrier" },
						{ id: "e-1-2", description: "Install siding material" },
						{ id: "e-1-3", description: "Install trim and caulk" }
					],
					qaChecks: [
						"All joints properly sealed",
						"Siding properly fastened",
						"Trim properly aligned"
					],
					vendorQuestions: [
						"What siding material do you recommend?",
						"How do you handle moisture?",
						"What maintenance is required?"
					],
					vendorNeeds: [
						"Exterior elevation plans",
						"Material preferences",
						"Color selections"
					]
				}
			]
		},
		{
			id: "plumbing-rough",
			title: "Plumbing Rough-In",
			detailLevel: "standard",
			tasks: [
				{
					id: "p-1",
					title: "Plumbing Installation",
					steps: [
						{ id: "p-1-1", description: "Install DWV piping" },
						{ id: "p-1-2", description: "Install water supply lines" },
						{ id: "p-1-3", description: "Pressure test systems" }
					],
					qaChecks: [
						"All joints properly sealed",
						"Proper slope on drains",
						"Systems hold pressure"
					],
					vendorQuestions: [
						"What pipe material do you use?",
						"How do you handle freezing?",
						"What is your testing procedure?"
					],
					vendorNeeds: [
						"Plumbing plans",
						"Fixture specifications",
						"Water heater requirements"
					]
				}
			]
		},
		{
			id: "electrical-rough",
			title: "Electrical Rough-In",
			detailLevel: "standard",
			tasks: [
				{
					id: "el-1",
					title: "Electrical Installation",
					steps: [
						{ id: "el-1-1", description: "Install service panel" },
						{ id: "el-1-2", description: "Rough-in wiring" },
						{ id: "el-1-3", description: "Install devices" }
					],
					qaChecks: [
						"All connections secure",
						"Proper wire sizing",
						"Grounding complete"
					],
					vendorQuestions: [
						"What panel size do you recommend?",
						"How do you handle surge protection?",
						"What is your inspection process?"
					],
					vendorNeeds: [
						"Electrical plans",
						"Load calculations",
						"Appliance specifications"
					]
				}
			]
		},
		{
			id: "hvac-rough",
			title: "HVAC Rough-In",
			detailLevel: "standard",
			tasks: [
				{
					id: "h-1",
					title: "HVAC Installation",
					steps: [
						{ id: "h-1-1", description: "Install ductwork" },
						{ id: "h-1-2", description: "Install equipment" },
						{ id: "h-1-3", description: "Test systems" }
					],
					qaChecks: [
						"Ductwork properly sealed",
						"Equipment properly sized",
						"Systems balanced"
					],
					vendorQuestions: [
						"What system size do you recommend?",
						"How do you handle zoning?",
						"What maintenance is required?"
					],
					vendorNeeds: [
						"HVAC plans",
						"Manual J calculations",
						"Equipment preferences"
					]
				}
			]
		},
		{
			id: "insulation",
			title: "Insulation & Air Sealing",
			detailLevel: "standard",
			tasks: [
				{
					id: "i-1",
					title: "Insulation Installation",
					steps: [
						{ id: "i-1-1", description: "Complete air sealing" },
						{ id: "i-1-2", description: "Install wall insulation" },
						{ id: "i-1-3", description: "Install attic insulation" }
					],
					qaChecks: [
						"All gaps sealed",
						"Proper R-values achieved",
						"Vapor barrier installed"
					],
					vendorQuestions: [
						"What R-values do you recommend?",
						"How do you handle air sealing?",
						"What is your testing process?"
					],
					vendorNeeds: [
						"Insulation specifications",
						"Air sealing requirements",
						"Vapor barrier needs"
					]
				}
			]
		},
		{
			id: "drywall",
			title: "Drywall",
			detailLevel: "standard",
			tasks: [
				{
					id: "d-1",
					title: "Drywall Installation",
					steps: [
						{ id: "d-1-1", description: "Hang drywall" },
						{ id: "d-1-2", description: "Tape and mud" },
						{ id: "d-1-3", description: "Sand and finish" }
					],
					qaChecks: [
						"All joints properly taped",
						"Surfaces smooth and ready for paint",
						"Corner bead properly installed"
					],
					vendorQuestions: [
						"What finish level do you provide?",
						"How do you handle repairs?",
						"What is your cleanup process?"
					],
					vendorNeeds: [
						"Finish level specifications",
						"Paint schedule",
						"Access requirements"
					]
				}
			]
		},
		{
			id: "paint",
			title: "Paint",
			detailLevel: "standard",
			tasks: [
				{
					id: "pt-1",
					title: "Painting",
					steps: [
						{ id: "pt-1-1", description: "Surface preparation" },
						{ id: "pt-1-2", description: "Prime surfaces" },
						{ id: "pt-1-3", description: "Apply finish coats" }
					],
					qaChecks: [
						"All surfaces properly prepared",
						"Paint applied evenly",
						"No drips or runs"
					],
					vendorQuestions: [
						"What paint brands do you use?",
						"How many coats do you apply?",
						"What is your touch-up policy?"
					],
					vendorNeeds: [
						"Color selections",
						"Finish specifications",
						"Paint schedule"
					]
				}
			]
		},
		{
			id: "trim-carpentry",
			title: "Trim Carpentry",
			detailLevel: "standard",
			tasks: [
				{
					id: "tc-1",
					title: "Trim Installation",
					steps: [
						{ id: "tc-1-1", description: "Install doors and hardware" },
						{ id: "tc-1-2", description: "Install trim molding" },
						{ id: "tc-1-3", description: "Install cabinets" }
					],
					qaChecks: [
						"All doors operate properly",
						"Trim properly aligned",
						"Cabinets level and secure"
					],
					vendorQuestions: [
						"What materials do you use?",
						"How do you handle custom work?",
						"What is your warranty?"
					],
					vendorNeeds: [
						"Door and hardware specifications",
						"Trim profiles",
						"Cabinet designs"
					]
				}
			]
		},
		{
			id: "flooring",
			title: "Flooring",
			detailLevel: "standard",
			tasks: [
				{
					id: "fl-1",
					title: "Flooring Installation",
					steps: [
						{ id: "fl-1-1", description: "Subfloor preparation" },
						{ id: "fl-1-2", description: "Install underlayment" },
						{ id: "fl-1-3", description: "Install flooring material" }
					],
					qaChecks: [
						"Subfloor properly prepared",
						"Underlayment installed correctly",
						"Flooring properly installed"
					],
					vendorQuestions: [
						"What underlayment do you recommend?",
						"How do you handle transitions?",
						"What is your warranty?"
					],
					vendorNeeds: [
						"Flooring specifications",
						"Room layouts",
						"Transition requirements"
					]
				}
			]
		},
		{
			id: "kitchen-bath",
			title: "Kitchen & Bath",
			detailLevel: "standard",
			tasks: [
				{
					id: "kb-1",
					title: "Kitchen and Bath Finishing",
					steps: [
						{ id: "kb-1-1", description: "Install cabinets and countertops" },
						{ id: "kb-1-2", description: "Install plumbing fixtures" },
						{ id: "kb-1-3", description: "Install appliances" }
					],
					qaChecks: [
						"All cabinets properly installed",
						"Fixtures working properly",
						"Appliances functioning"
					],
					vendorQuestions: [
						"What cabinet quality do you provide?",
						"How do you handle custom work?",
						"What is your installation warranty?"
					],
					vendorNeeds: [
						"Cabinet designs",
						"Fixture specifications",
						"Appliance requirements"
					]
				}
			]
		},
		{
			id: "final-touches",
			title: "Final Touches & Punch List",
			detailLevel: "standard",
			tasks: [
				{
					id: "ft-1",
					title: "Project Completion",
					steps: [
						{ id: "ft-1-1", description: "Complete punch list items" },
						{ id: "ft-1-2", description: "Final cleaning" },
						{ id: "ft-1-3", description: "Final inspection" }
					],
					qaChecks: [
						"All punch list items complete",
						"Site properly cleaned",
						"All systems functioning"
					],
					vendorQuestions: [
						"What is your punch list process?",
						"How do you handle warranty issues?",
						"What documentation do you provide?"
					],
					vendorNeeds: [
						"Punch list items",
						"Warranty information",
						"Maintenance instructions"
					]
				}
			]
		}
	]
}


