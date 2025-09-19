"use server";

import { createClient } from '@supabase/supabase-js';
import type { OnboardingProfile, RoadmapData, RoadmapPhase, RoadmapTask } from "@/lib/roadmap-types";
import { generateRoadmapContent, generateStructuredContent } from "@/lib/openai";
import { generateHybridRoadmap } from "@/lib/hybrid-roadmap-generator";
import type { CompleteProjectResponse } from "@/lib/unified-response-types";

// Helper functions to provide phase-specific content
function getQAChecksForPhase(phaseId: string, isDiy: boolean = false): string[] {
	const diyQaChecks: Record<string, string[]> = {
		'just-starting': [
			'Is project scope clearly defined?',
			'Are project goals documented?',
			'Is budget range established?',
			'Are construction method options researched?',
			'Are local building codes reviewed?',
			'Do you have the necessary tools and equipment?',
			'Have you assessed your skill level for this project?'
		],
		'pre-construction': [
			'Are all permits obtained and displayed?',
			'Are architectural plans finalized and approved?',
			'Are contractors licensed and insured?',
			'Is financing secured and documented?',
			'Are material orders confirmed with delivery dates?'
		],
		'site-prep-excavation': [
			'Is site properly cleared and graded?',
			'Are erosion control measures in place?',
			'Is construction access road established?',
			'Are temporary utilities installed?',
			'Is site drainage working properly?',
			'Is excavation complete and properly graded?',
			'Are foundation trenches properly dug?'
		],
		'foundation': [
			'Are concrete forms properly aligned and braced?',
			'Is rebar correctly placed and tied?',
			'Is concrete properly mixed and poured?',
			'Are anchor bolts correctly positioned?',
			'Is foundation waterproofing applied?'
		],
		'under-slab-services': [
			'Are all under-slab utilities properly installed?',
			'Are plumbing pressure tests completed and passed?',
			'Are electrical conduits at correct depths?',
			'Is vapor barrier properly installed?',
			'Are all utility sleeves properly positioned?',
			'Is sand bedding properly compacted?',
			'Are all inspections completed and approved?'
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

	const contractorQaChecks: Record<string, string[]> = {
		'just-starting': [
			'Is project scope clearly defined?',
			'Are project goals documented?',
			'Is budget range established?',
			'Are construction method options researched?',
			'Are local building codes reviewed?',
			'Are all contractors licensed and insured?',
			'Are contracts properly executed?'
		],
		'pre-construction': [
			'Are all permits obtained and displayed?',
			'Are architectural plans finalized and approved?',
			'Are contractors licensed and insured?',
			'Is financing secured and documented?',
			'Are material orders confirmed with delivery dates?'
		],
		'site-prep-excavation': [
			'Is site properly cleared and graded?',
			'Are erosion control measures in place?',
			'Is construction access road established?',
			'Are temporary utilities installed?',
			'Is site drainage working properly?',
			'Is excavation complete and properly graded?',
			'Are foundation trenches properly dug?'
		],
		'foundation': [
			'Are concrete forms properly aligned and braced?',
			'Is rebar correctly placed and tied?',
			'Is concrete properly mixed and poured?',
			'Are anchor bolts correctly positioned?',
			'Is foundation waterproofing applied?'
		],
		'under-slab-services': [
			'Are all under-slab utilities properly installed?',
			'Are plumbing pressure tests completed and passed?',
			'Are electrical conduits at correct depths?',
			'Is vapor barrier properly installed?',
			'Are all utility sleeves properly positioned?',
			'Is sand bedding properly compacted?',
			'Are all inspections completed and approved?'
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
			'Are all connections properly made?'
		],
		'insulation': [
			'Is insulation properly installed?',
			'Are all gaps and voids filled?',
			'Is vapor barrier properly installed?',
			'Are all penetrations sealed?',
			'Is R-value appropriate for climate?'
		],
		'drywall': [
			'Are all joints properly taped and mudded?',
			'Are screw heads properly recessed?',
			'Is drywall properly secured to framing?',
			'Are corners and edges straight?',
			'Is surface smooth and ready for paint?'
		]
	};
	
	const qaChecks = isDiy ? diyQaChecks : contractorQaChecks;
	return qaChecks[phaseId] || [
		'Check all work meets building codes',
		'Verify materials are properly installed',
		'Ensure safety measures are in place',
		'Confirm quality standards are met'
	];
}

function getVendorQuestionsForPhase(phaseId: string, isDiy: boolean = false): string[] {
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
		'site-prep-excavation': [
			'What equipment will you use for excavation?',
			'How will you handle excess soil removal?',
			'What erosion control measures do you implement?',
			'How do you ensure proper site drainage?',
			'What is your process for site cleanup?',
			'How do you handle rock removal and blasting if needed?',
			'What is your process for foundation trenching?'
		],
		'foundation': [
			'What concrete mix design do you recommend?',
			'How do you ensure proper curing?',
			'What waterproofing system do you use?',
			'How do you handle weather delays?',
			'What is your quality control process?'
		],
		'under-slab-services': [
			'What plumbing and electrical services do you install under-slab?',
			'How do you ensure proper pipe slopes and depths?',
			'What is your pressure testing procedure?',
			'How do you coordinate between plumbing and electrical trades?',
			'What warranty do you provide on under-slab work?'
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

function getVendorNeedsForPhase(phaseId: string, isDiy: boolean = false): string[] {
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
		'site-prep-excavation': [
			'Property survey and site plans',
			'Utility locates and permits',
			'Access to site and staging area',
			'Clearance for equipment and materials',
			'Contact information for coordination',
			'Excavation equipment and operators',
			'Foundation trenching specifications'
		],
		'foundation': [
			'Approved foundation plans',
			'Soil test reports and engineering',
			'Concrete specifications and mix design',
			'Access for concrete trucks and equipment',
			'Weather protection and curing conditions'
		],
		'under-slab-services': [
			'Complete foundation inspection and approval',
			'Access to foundation area for utility installation',
			'Coordination between plumbing and electrical contractors',
			'Proper excavation and backfill equipment',
			'Pressure testing equipment and procedures'
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

/**
 * Converts hybrid response format to legacy RoadmapData format for backward compatibility
 */
function convertHybridToLegacyFormat(hybridResponse: CompleteProjectResponse, profile?: OnboardingProfile): RoadmapData {
	try {
		console.log('🔄 Converting hybrid response to legacy format...');
		
		// Extract phases from the hybrid response
		const phases = hybridResponse.phaseResponses.map(phaseResponse => ({
			id: phaseResponse.phaseId,
			title: phaseResponse.phaseTitle,
			detailLevel: 'standard' as const, // Default detail level
			tasks: [
				{
					id: `hybrid-${phaseResponse.phaseId}`,
					title: phaseResponse.phaseTitle,
					description: `AI-enhanced tasks for ${phaseResponse.phaseTitle} phase`,
					steps: [], // Will be populated from baseline phases if needed
					qaChecks: getQAChecksForPhase(phaseResponse.phaseId, profile?.diyPhaseIds?.includes(phaseResponse.phaseId) || false),
					vendorQuestions: getVendorQuestionsForPhase(phaseResponse.phaseId, profile?.diyPhaseIds?.includes(phaseResponse.phaseId) || false),
					vendorNeeds: getVendorNeedsForPhase(phaseResponse.phaseId, profile?.diyPhaseIds?.includes(phaseResponse.phaseId) || false),
					status: 'todo' as const,
					notes: phaseResponse.expertInsights?.proTips?.join(' ') || ''
				}
			]
		}));
		
		console.log(`✅ Converted ${phases.length} phases to legacy format`);
		
	// Extract timeline data from hybrid phase responses
	const timelineEstimates: any[] = [];
	const parsedTimelineEstimates: Record<string, any> = {};
	
	hybridResponse.phaseResponses.forEach(phaseResponse => {
		if (phaseResponse.timeline) {
			const timeline = phaseResponse.timeline;
			
			// Add to timelineEstimates array (for backward compatibility)
			timelineEstimates.push({
				phaseId: phaseResponse.phaseId,
				phaseTitle: phaseResponse.phaseTitle,
				rawOpenAIResponse: timeline.rawTimeline || '',
				error: undefined
			});
			
			// Add to parsedTimelineEstimates object (main format used by UI)
			parsedTimelineEstimates[phaseResponse.phaseId] = {
				diyDuration: timeline.diyDuration,
				contractorDuration: timeline.contractorDuration,
				diyHours: timeline.diyHours,
				rawTimeline: timeline.rawTimeline || ''
			};
		}
	});
	
	console.log('✅ Extracted timeline data from hybrid system:', {
		timelineCount: timelineEstimates.length,
		parsedEstimatesCount: Object.keys(parsedTimelineEstimates).length,
		phases: Object.keys(parsedTimelineEstimates)
	});
	
	return {
		phases,
		timelineEstimates,
		parsedTimelineEstimates
	};
		
	} catch (error) {
		console.error('❌ Error converting hybrid response:', error);
		// Return empty roadmap as fallback
		return {
			phases: [],
			timelineEstimates: [],
			parsedTimelineEstimates: {}
		};
	}
}

// Enhanced roadmap generator with hybrid approach integration
export async function generateRoadmap(profile: OnboardingProfile, projectId?: string): Promise<RoadmapData> {
	console.log('🚀 generateRoadmap called with profile:', profile);
	
	try {
		// Check if we have a project ID for hybrid approach
		if (projectId) {
			console.log('🤖 Using hybrid approach for roadmap generation...');
			const hybridResponse = await generateHybridRoadmap(profile, projectId);
			const legacyRoadmap = convertHybridToLegacyFormat(hybridResponse, profile);
			console.log('✅ Hybrid roadmap generation successful');
			return legacyRoadmap;
		}
		
		// Fallback to legacy approach if no project ID
		console.log('⚠️ No project ID provided, falling back to legacy approach');
		
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

/**
 * Hybrid roadmap generator that uses the new hybrid approach
 * This is the recommended function for new implementations
 */
export async function generateHybridRoadmapAction(
	profile: OnboardingProfile, 
	projectId: string
): Promise<CompleteProjectResponse> {
	console.log('🚀 generateHybridRoadmapAction called with profile:', profile, 'projectId:', projectId);
	
	try {
		const hybridResponse = await generateHybridRoadmap(profile, projectId);
		console.log('✅ Hybrid roadmap generation successful');
		return hybridResponse;
	} catch (error) {
		console.error('❌ Hybrid roadmap generation failed:', error);
		throw new Error(`Failed to generate hybrid roadmap: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
		
		// Always create detailed task structure - even if no baseline tasks exist
		let enhancedTasks: any[] = [{
			id: `baseline-${baselinePhase.id}`,
			title: baselinePhase.title,
			description: `Standard tasks for ${baselinePhase.title} phase`,
			steps: baselinePhase.tasks && baselinePhase.tasks.length > 0 
				? baselinePhase.tasks.map((task, index) => ({
					id: `step-${baselinePhase.id}-${index}`,
					description: task
				}))
				: [],
			qaChecks: getQAChecksForPhase(baselinePhase.id),
			vendorQuestions: getVendorQuestionsForPhase(baselinePhase.id),
			vendorNeeds: getVendorNeedsForPhase(baselinePhase.id),
			notes: ''
		}];
		
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
			title: baselinePhase.title, // Use clean title without order number
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
			// Note: Using tasks field instead of deprecated subtasks
			phaseData: JSON.stringify(p, null, 2)
		});
		
		// Always create baseline tasks structure - even if no tasks exist
		let baselineTasks = [{
			id: `baseline-${p.id}`,
			title: p.title,
			description: `Standard tasks for ${p.title} phase`,
			steps: p.tasks && p.tasks.length > 0 
				? p.tasks.map((task, index) => ({
					id: `step-${p.id}-${index}`,
					description: task
				}))
				: [],
			qaChecks: getQAChecksForPhase(p.id),
			vendorQuestions: getVendorQuestionsForPhase(p.id),
			vendorNeeds: getVendorNeedsForPhase(p.id),
			notes: ''
		}];
		
		console.log(`Final tasks for phase ${p.id}:`, baselineTasks);
		
		// Return the phase with the appropriate detail level and numbered title
		return {
			id: p.id,
							title: p.title, // Use clean title without order number
			detailLevel,
			tasks: baselineTasks
		};
	});

	return { phases };
}


