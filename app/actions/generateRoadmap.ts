"use server";

import { createClient } from '@supabase/supabase-js';
import type { OnboardingProfile, RoadmapData, RoadmapPhase, RoadmapTask } from "@/lib/roadmap-types";
import { generateRoadmapContent, generateStructuredContent } from "@/lib/openai";

// Helper functions to provide phase-specific content
function getQAChecksForPhase(phaseId: string): string[] {
	const qaChecks: Record<string, string[]> = {
		'just-starting': [
			'Is project scope clearly defined?',
			'Are project goals documented?',
			'Is budget range established?',
			'Are construction method options researched?',
			'Are local building codes reviewed?'
		],
		'pre-construction': [
			'Are all permits obtained and displayed?',
			'Are architectural plans finalized and approved?',
			'Are contractors licensed and insured?',
			'Is financing secured and documented?',
			'Are material orders confirmed with delivery dates?'
		],
		'site-prep': [
			'Is site properly cleared and graded?',
			'Are erosion control measures in place?',
			'Is construction access road established?',
			'Are temporary utilities installed?',
			'Is site drainage working properly?'
		],
		'foundation': [
			'Are concrete forms properly aligned and braced?',
			'Is rebar correctly placed and tied?',
			'Is concrete properly mixed and poured?',
			'Are anchor bolts correctly positioned?',
			'Is foundation waterproofing applied?'
		],
		'rough-framing': [
			'Are wall studs properly spaced and plumb?',
			'Is roof truss spacing correct?',
			'Are all connections properly fastened?',
			'Is blocking installed for utilities?',
			'Are windows and doors properly framed?'
		],
		'plumbing-rough': [
			'Are all pipes properly supported?',
			'Are drain slopes correct?',
			'Are vent pipes properly installed?',
			'Is water pressure adequate?',
			'Are all connections leak-free?'
		],
		'electrical-rough': [
			'Are all wires properly secured?',
			'Are outlet and switch boxes level?',
			'Is grounding system complete?',
			'Are all circuits properly labeled?',
			'Is panel wiring neat and organized?'
		],
		'insulation': [
			'Is insulation properly installed without gaps?',
			'Are vapor barriers correctly placed?',
			'Is air sealing complete?',
			'Are all penetrations sealed?',
			'Is R-value adequate for climate zone?'
		],
		'drywall': [
			'Are all joints properly taped and mudded?',
			'Are screw heads properly recessed?',
			'Is drywall properly secured to framing?',
			'Are corners and edges straight?',
			'Is surface smooth and ready for paint?'
		]
	};
	
	return qaChecks[phaseId] || [
		'Check all work meets building codes',
		'Verify materials are properly installed',
		'Ensure safety measures are in place',
		'Confirm quality standards are met'
	];
}

function getVendorQuestionsForPhase(phaseId: string): string[] {
	const vendorQuestions: Record<string, string[]> = {
		'just-starting': [
			'What is your experience with project planning and assessment?',
			'Can you help define project scope and requirements?',
			'What construction methods do you recommend for my situation?',
			'How do you handle budget planning and cost estimation?',
			'What is your process for code compliance research?'
		],
		'pre-construction': [
			'What is your experience with this type of project?',
			'Can you provide references from similar projects?',
			'What is your estimated timeline for completion?',
			'Do you have the necessary licenses and insurance?',
			'What is your payment schedule and terms?'
		],
		'site-prep': [
			'What equipment will you use for excavation?',
			'How will you handle excess soil removal?',
			'What erosion control measures do you implement?',
			'How do you ensure proper site drainage?',
			'What is your process for site cleanup?'
		],
		'foundation': [
			'What concrete mix design do you recommend?',
			'How do you ensure proper curing?',
			'What waterproofing system do you use?',
			'How do you handle weather delays?',
			'What is your quality control process?'
		],
		'rough-framing': [
			'What lumber grade do you use for framing?',
			'How do you ensure proper wall alignment?',
			'What fasteners do you use for connections?',
			'How do you handle roof truss installation?',
			'What is your process for quality checks?'
		],
		'plumbing-rough': [
			'What pipe materials do you recommend?',
			'How do you ensure proper pipe slopes?',
			'What is your testing procedure?',
			'How do you handle code compliance?',
			'What warranty do you provide?'
		],
		'electrical-rough': [
			'What wire types do you use?',
			'How do you ensure proper grounding?',
			'What is your testing procedure?',
			'How do you handle code compliance?',
			'What warranty do you provide?'
		],
		'insulation': [
			'What insulation materials do you use?',
			'How do you ensure proper installation?',
			'What R-value do you recommend?',
			'How do you handle air sealing?',
			'What is your quality guarantee?'
		],
		'drywall': [
			'What drywall thickness do you use?',
			'How many coats of mud do you apply?',
			'What is your sanding process?',
			'How do you ensure smooth finishes?',
			'What is your timeline for completion?'
		]
	};
	
	return vendorQuestions[phaseId] || [
		'What is your experience with this type of work?',
		'Can you provide references?',
		'What is your timeline and pricing?',
		'What warranty do you provide?',
		'How do you ensure quality?'
	];
}

function getVendorNeedsForPhase(phaseId: string): string[] {
	const vendorNeeds: Record<string, string[]> = {
		'just-starting': [
			'Project goals and vision description',
			'Budget constraints and financial situation',
			'Property information and site details',
			'Timeline preferences and constraints',
			'Construction method preferences or questions'
		],
		'pre-construction': [
			'Complete project specifications and plans',
			'Permit documentation and approvals',
			'Site access and staging area',
			'Utility connections and temporary power',
			'Project timeline and milestone dates'
		],
		'site-prep': [
			'Property survey and site plans',
			'Utility locates and permits',
			'Access to site and staging area',
			'Clearance for equipment and materials',
			'Contact information for coordination'
		],
		'foundation': [
			'Approved foundation plans',
			'Soil test reports and engineering',
			'Concrete specifications and mix design',
			'Access for concrete trucks and equipment',
			'Weather protection and curing conditions'
		],
		'rough-framing': [
			'Approved framing plans and details',
			'Lumber and material specifications',
			'Access for delivery and staging',
			'Power and lighting for work areas',
			'Coordination with other trades'
		],
		'plumbing-rough': [
			'Approved plumbing plans and specs',
			'Fixture and material specifications',
			'Access to work areas and staging',
			'Power for tools and equipment',
			'Coordination with framing and electrical'
		],
		'electrical-rough': [
			'Approved electrical plans and specs',
			'Fixture and material specifications',
			'Access to work areas and staging',
			'Power for tools and equipment',
			'Coordination with framing and plumbing'
		],
		'insulation': [
			'Approved insulation specifications',
			'Access to all wall and ceiling cavities',
			'Power for tools and equipment',
			'Proper ventilation and safety measures',
			'Coordination with other trades'
		],
		'drywall': [
			'Approved drywall specifications',
			'Access to all work areas',
			'Power and lighting for work',
			'Proper ventilation and dust control',
			'Coordination with other trades'
		]
	};
	
	return vendorNeeds[phaseId] || [
		'Complete project specifications',
		'Access to work areas',
		'Power and utilities',
		'Coordination with other trades',
		'Proper safety measures'
	];
}

// Initialize Supabase client for server-side operations with error handling
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables:', {
      url: supabaseUrl ? 'present' : 'missing',
      key: supabaseKey ? 'present' : 'missing'
    });
    throw new Error('Supabase configuration is incomplete. Please check environment variables.');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

// Function to fetch baseline phases from database
async function getBaselinePhases(): Promise<any> {
	try {
		const supabase = getSupabaseClient();
		
		console.log('📊 Fetching baseline phases from database...');
    
    const { data, error } = await supabase
      .from('baseline_construction_phases')
      .select('phases')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Error fetching baseline phases:', error);
      throw error;
    }
    
         console.log('Raw database response:', JSON.stringify(data, null, 2));
     
     // Handle the double-nested structure from the database
     // Database has: { phases: { phases: [...] } }
     // We need to extract the inner phases array
     const phasesData = data?.phases;
     if (phasesData && phasesData.phases) {
       console.log('Found double-nested structure, extracting inner phases array');
       console.log('Number of phases found:', phasesData.phases.length);
       console.log('Sample phase structure:', JSON.stringify(phasesData.phases[0], null, 2));
       return { phases: phasesData.phases };
     }
     
     // Fallback to direct phases if structure is different
     if (data?.phases) {
       console.log('Found direct phases structure');
       console.log('Number of phases found:', Array.isArray(data.phases) ? data.phases.length : 'Not an array');
       if (Array.isArray(data.phases) && data.phases.length > 0) {
         console.log('Sample phase structure:', JSON.stringify(data.phases[0], null, 2));
       }
       return { phases: data.phases };
     }
    
    console.warn('No phases data found in database response');
    return { phases: [] };
  } catch (error) {
    console.error('Failed to fetch baseline phases:', error);
    // Return empty phases as fallback
    return { phases: [] };
  }
}

// Enhanced roadmap generator with OpenAI integration
export async function generateRoadmap(profile: OnboardingProfile): Promise<RoadmapData> {
	console.log('🚀 generateRoadmap called with profile:', profile);
	
	try {
		// Check if OpenAI API key is available
		if (!process.env.OPENAI_API_KEY) {
			console.warn('⚠️ OPENAI_API_KEY not found, falling back to baseline');
			return generateBaselineRoadmap(profile);
		}

		console.log('🤖 Attempting AI-enhanced roadmap generation with OpenAI...');
		// Try to generate AI-enhanced roadmap
		const aiEnhancedRoadmap = await generateAIRoadmap(profile);
		console.log('✅ AI roadmap generation successful');
		return aiEnhancedRoadmap;
	} catch (error) {
		console.error('❌ AI roadmap generation failed:', error);
		console.warn('🔄 Falling back to baseline data');
		// Fallback to baseline data
		return generateBaselineRoadmap(profile);
	}
}

async function generateAIRoadmap(profile: OnboardingProfile): Promise<RoadmapData> {
	console.log('generateAIRoadmap called');
	
	const isNovice = profile.experience === "complete_novice";
	const isHighDetail = profile.experience === "complete_novice" || profile.experience === "diy_permitting" || profile.experience === "diy_maintenance" || profile.experience === "house_builder";
	
	// Validate that experience is selected
	if (!profile.experience) {
		throw new Error("Experience level must be selected before generating roadmap");
	}
	
	const diy = new Set(profile.diyPhaseIds);

	// Validate that current phase is selected
	if (!profile.currentPhaseId) {
		throw new Error("Current phase must be selected before generating roadmap");
	}
	
	// Validate that weekly hourly commitment is selected
	if (!profile.weeklyHourlyCommitment) {
		throw new Error("Weekly hourly commitment must be selected before generating roadmap");
	}
	
	// Validate that city, state is provided
	if (!profile.cityState) {
		throw new Error("City and state must be provided before generating roadmap");
	}
	
	// Fetch baseline phases from database
	const baselineRoadmapData = await getBaselinePhases();
	
	// Validate that we have phases data
	if (!baselineRoadmapData || !baselineRoadmapData.phases || !Array.isArray(baselineRoadmapData.phases)) {
		console.error('Invalid baseline phases data structure:', baselineRoadmapData);
		throw new Error('Failed to fetch valid baseline phases data from database');
	}
	
	console.log(`Processing ${baselineRoadmapData.phases.length} baseline phases for AI enhancement`);
	
	// Generate AI-enhanced phases
	const enhancedPhases: RoadmapPhase[] = [];

	for (const baselinePhase of baselineRoadmapData.phases) {
		const detailLevel = diy.has(baselinePhase.id) || isHighDetail ? "high" : "standard" as const;
		
		// Generate AI-enhanced content for the current phase if it matches user's current phase
		let enhancedTasks = baselinePhase.tasks;
		
		// Create baseline tasks from subtasks if no detailed tasks exist
		if ((!enhancedTasks || enhancedTasks.length === 0) && baselinePhase.subtasks && baselinePhase.subtasks.length > 0) {
			enhancedTasks = [{
				id: `baseline-${baselinePhase.id}`,
				title: `${baselinePhase.title} - Baseline Tasks`,
				description: `Standard tasks for ${baselinePhase.title} phase`,
				steps: baselinePhase.subtasks.map((subtask, index) => ({
					id: `step-${baselinePhase.id}-${index}`,
					description: subtask
				})),
				qaChecks: getQAChecksForPhase(baselinePhase.id),
				vendorQuestions: getVendorQuestionsForPhase(baselinePhase.id),
				vendorNeeds: getVendorNeedsForPhase(baselinePhase.id),
				notes: ''
			}];
		}
		
		if (baselinePhase.id === profile.currentPhaseId) {
			try {
				console.log(`Generating AI content for phase: ${baselinePhase.id}`);
				
				// Get remaining phases from current phase onwards
				const currentPhaseIndex = baselineRoadmapData.phases.findIndex(p => p.id === profile.currentPhaseId);
				const remainingPhases = baselineRoadmapData.phases.slice(currentPhaseIndex);
				
				const phaseDetails = `Current Phase: ${baselinePhase.title}\nPhase ID: ${profile.currentPhaseId}`;
				
				const aiGuidance = await generateRoadmapContent({
					role: profile.role,
					experience: profile.experience,
					constructionMethod: profile.constructionMethod,
					currentPhase: profile.currentPhaseId,
					diyPhases: profile.diyPhaseIds,
					weeklyHourlyCommitment: profile.weeklyHourlyCommitment,
					cityState: profile.cityState,
					propertyAddress: profile.propertyAddress,
					background: profile.background
				}, phaseDetails);
				
				console.log('AI guidance received:', aiGuidance.substring(0, 100) + '...');
				
				// Enhance tasks with AI-generated insights
				if (enhancedTasks && enhancedTasks.length > 0) {
					enhancedTasks = enhancedTasks.map(task => ({
						...task,
						notes: aiGuidance.slice(0, 200) + '...' // Add AI insights as notes
					}));
				}
			} catch (error) {
				console.warn(`Failed to generate AI content for phase ${baselinePhase.id}:`, error);
				// Continue with baseline tasks
			}
		}

		enhancedPhases.push({
			id: baselinePhase.id,
			title: baselinePhase.order ? `${baselinePhase.order}. ${baselinePhase.title}` : baselinePhase.title, // Add order number if available
			detailLevel,
			tasks: enhancedTasks
		});
	}

	return { phases: enhancedPhases };
}

async function generateBaselineRoadmap(profile: OnboardingProfile): Promise<RoadmapData> {
	console.log('🏗️ generateBaselineRoadmap called');
	
	const isNovice = profile.experience === "complete_novice";
	const isHighDetail = profile.experience === "complete_novice" || profile.experience === "diy_permitting" || profile.experience === "diy_maintenance" || profile.experience === "house_builder";
	
	// Validate that experience is selected
	if (!profile.experience) {
		throw new Error("Experience level must be selected before generating roadmap");
	}
	
	const diy = new Set(profile.diyPhaseIds);

	// Validate that current phase is selected
	if (!profile.currentPhaseId) {
		throw new Error("Current phase must be selected before generating roadmap");
	}
	
	// Validate that weekly hourly commitment is selected
	if (!profile.weeklyHourlyCommitment) {
		throw new Error("Weekly hourly commitment must be selected before generating roadmap");
	}
	
	// Validate that city, state is provided
	if (!profile.cityState) {
		throw new Error("City and state must be provided before generating roadmap");
	}
	
	// Fetch baseline data from database
	const baselineRoadmapData = await getBaselinePhases();
	
	// Validate that we have phases data
	if (!baselineRoadmapData || !baselineRoadmapData.phases || !Array.isArray(baselineRoadmapData.phases)) {
		console.error('Invalid baseline phases data structure:', baselineRoadmapData);
		throw new Error('Failed to fetch valid baseline phases data from database');
	}
	
	console.log(`Processing ${baselineRoadmapData.phases.length} baseline phases for baseline roadmap`);
	
	// Use the baseline data as a starting point
	const phases: RoadmapPhase[] = baselineRoadmapData.phases.map((p) => {
		const detailLevel = diy.has(p.id) || isHighDetail ? "high" : "standard" as const;
		
		console.log(`Processing phase ${p.id}:`, {
			title: p.title,
			hasTasks: !!p.tasks,
			tasksLength: p.tasks?.length || 0,
			hasSubtasks: !!p.subtasks,
			subtasksLength: p.subtasks?.length || 0,
			phaseData: JSON.stringify(p, null, 2)
		});
		
		// Create baseline tasks from subtasks if no detailed tasks exist
		let baselineTasks = p.tasks;
		if ((!p.tasks || p.tasks.length === 0) && p.subtasks && p.subtasks.length > 0) {
			console.log(`Creating baseline tasks from subtasks for phase ${p.id}`);
			// Create a single task from the subtasks
			baselineTasks = [{
				id: `baseline-${p.id}`,
				title: `${p.title} - Baseline Tasks`,
				description: `Standard tasks for ${p.title} phase`,
				steps: p.subtasks.map((subtask, index) => ({
					id: `step-${p.id}-${index}`,
					description: subtask
				})),
				qaChecks: getQAChecksForPhase(p.id),
				vendorQuestions: getVendorQuestionsForPhase(p.id),
				vendorNeeds: getVendorNeedsForPhase(p.id),
				notes: ''
			}];
		} else if (!p.tasks || p.tasks.length === 0) {
			console.log(`No tasks or subtasks found for phase ${p.id}, creating empty task structure`);
			// Create a basic task structure even if no subtasks exist
			baselineTasks = [{
				id: `baseline-${p.id}`,
				title: `${p.title} - Baseline Tasks`,
				description: `Standard tasks for ${p.title} phase`,
				steps: [],
				qaChecks: getQAChecksForPhase(p.id),
				vendorQuestions: getVendorQuestionsForPhase(p.id),
				vendorNeeds: getVendorNeedsForPhase(p.id),
				notes: ''
			}];
		}
		
		console.log(`Final tasks for phase ${p.id}:`, baselineTasks);
		
		// Return the phase with the appropriate detail level and numbered title
		return {
			id: p.id,
			title: p.order ? `${p.order}. ${p.title}` : p.title, // Add order number if available
			detailLevel,
			tasks: baselineTasks
		};
	});

	return { phases };
}


