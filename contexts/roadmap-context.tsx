"use client";

import { createContext, useContext, useState, type ReactNode, useMemo, useEffect } from "react";
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types";
import { generateHybridRoadmap } from "@/lib/hybrid-roadmap-generator";
import type { CompleteProjectResponse } from "@/lib/unified-response-types";
import { supabase } from "@/lib/supabase";
import { getPhasesForMethod } from "@/lib/roadmap-phases";
import { generateRoadmap } from "@/app/actions/generateRoadmap";

interface RoadmapContextType {
	profile: OnboardingProfile | null;
	roadmap: RoadmapData | null;
	isLoading: boolean;
	hasExistingProject: boolean;
	isCheckingProject: boolean;
	setProfileAndGenerate: (p: OnboardingProfile) => Promise<void>;
	regeneratePhase: (phaseId: string, detailLevel: "low" | "standard" | "high") => Promise<void>;
	loadStoredRoadmap: () => Promise<void>;
	checkExistingProject: () => Promise<void>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

/**
 * Converts hybrid response format to legacy RoadmapData format for UI compatibility
 */
function convertHybridToLegacyFormat(hybridResponse: CompleteProjectResponse): RoadmapData {
	try {
		console.log('🔄 Converting hybrid response to legacy format...');
		console.log('🔍 Hybrid response structure:', {
			hasPhaseResponses: !!hybridResponse.phaseResponses,
			phaseCount: hybridResponse.phaseResponses?.length || 0,
			samplePhase: hybridResponse.phaseResponses?.[0] ? {
				phaseId: hybridResponse.phaseResponses[0].phaseId,
				phaseTitle: hybridResponse.phaseResponses[0].phaseTitle,
				hasTasks: !!hybridResponse.phaseResponses[0].tasks,
				hasExpertInsights: !!hybridResponse.phaseResponses[0].expertInsights
			} : 'No phases'
		});
		
		// Get the construction method from the project context
		const constructionMethod = hybridResponse.projectContext?.constructionMethod?.method || 'traditional-frame';
		console.log('🔍 Using construction method:', constructionMethod);
		
		// Get hardcoded baseline phases for this construction method
		const baselinePhases = getPhasesForMethod(constructionMethod);
		console.log(`📋 Found ${baselinePhases.length} baseline phases for ${constructionMethod}`);
		
		// Create a map of AI-generated content by phase ID
		const aiContentMap = new Map();
		hybridResponse.phaseResponses.forEach(phaseResponse => {
			aiContentMap.set(phaseResponse.phaseId, phaseResponse);
		});
		
		// Helper functions for phase-specific content
		const getQAChecksForPhase = (phaseId: string): string[] => {
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
		};

		const getVendorQuestionsForPhase = (phaseId: string): string[] => {
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
		};

		const getVendorNeedsForPhase = (phaseId: string): string[] => {
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
		};

		// Extract phases by combining baseline content with AI-generated content
		const phases = baselinePhases.map(baselinePhase => {
			const aiContent = aiContentMap.get(baselinePhase.id);
			
			console.log(`🔍 Processing phase ${baselinePhase.id}:`, {
				hasBaselineContent: !!baselinePhase.tasks,
				baselineTasksCount: baselinePhase.tasks?.length || 0,
				hasHelpfulInfo: !!baselinePhase.helpfulInformation,
				helpfulInfoCount: baselinePhase.helpfulInformation?.length || 0,
				hasAIContent: !!aiContent,
				aiTasksCount: aiContent?.tasks ? Object.values(aiContent.tasks).flat().length : 0
			});
			
			// Extract AI-generated content if available
			const aiTaskData = aiContent?.tasks || {};
			const aiHelpfulInfo = aiContent?.helpfulInformation || {};
			const aiExpertInsights = aiContent?.expertInsights || {};
			const aiRegionalAdjustments = aiContent?.regionalAdjustments || {};
			
			// Combine baseline content with AI-generated content
			const steps = [
				...(baselinePhase.tasks || []),
				...(aiTaskData.steps || []),
				...(aiHelpfulInfo.steps || [])
			].filter(Boolean);
			
			const qaChecks = [
				...getQAChecksForPhase(baselinePhase.id),
				...(aiTaskData.qaChecks || []),
				...(aiHelpfulInfo.qaChecks || []),
				...(aiExpertInsights.qualityCheckpoints || [])
			].filter(Boolean);
			
			// Get phase-specific vendor questions and needs
			const vendorQuestions = getVendorQuestionsForPhase(baselinePhase.id);
			const vendorNeeds = getVendorNeedsForPhase(baselinePhase.id);
			
			// Add AI-generated vendor content if available
			vendorQuestions.push(...(aiTaskData.vendorQuestions || []));
			vendorQuestions.push(...(aiHelpfulInfo.vendorQuestions || []));
			vendorNeeds.push(...(aiTaskData.vendorNeeds || []));
			vendorNeeds.push(...(aiHelpfulInfo.vendorNeeds || []));
			
			// Create comprehensive notes from all available information
			const notes = [
				...(aiExpertInsights.proTips || []),
				...(aiExpertInsights.commonMistakes || []),
				...(aiExpertInsights.costSavingTips || []),
				...(aiRegionalAdjustments.weatherConsiderations || []),
				...(aiRegionalAdjustments.permitRequirements || []),
				...(aiRegionalAdjustments.localVendorRecommendations || []),
				...(aiRegionalAdjustments.seasonalTiming || [])
			].filter(Boolean).join(' | ');
			
			return {
				id: baselinePhase.id,
				title: baselinePhase.title,
				detailLevel: 'standard' as const,
				tasks: [
					{
						id: `hybrid-${baselinePhase.id}`,
						title: baselinePhase.title,
						description: baselinePhase.description || `AI-enhanced tasks for ${baselinePhase.title} phase`,
						steps: steps,
						qaChecks: qaChecks,
						vendorQuestions: vendorQuestions,
						vendorNeeds: vendorNeeds,
						notes: notes || `AI-generated guidance for ${baselinePhase.title} phase`
					}
				]
			};
		});
		
		console.log(`✅ Converted ${phases.length} phases to legacy format`);
		console.log('🔍 Sample converted phase:', phases[0] ? {
			id: phases[0].id,
			title: phases[0].title,
			stepsCount: phases[0].tasks[0]?.steps?.length || 0,
			qaChecksCount: phases[0].tasks[0]?.qaChecks?.length || 0,
			vendorQuestionsCount: phases[0].tasks[0]?.vendorQuestions?.length || 0,
			vendorNeedsCount: phases[0].tasks[0]?.vendorNeeds?.length || 0,
			hasNotes: !!phases[0].tasks[0]?.notes
		} : 'No phases converted');
		
		return {
			phases,
			timelineEstimates: [], // Will be populated by timeline API
			parsedTimelineEstimates: {} // Will be populated by timeline API
		};
		
	} catch (error) {
		console.error('❌ Error converting hybrid response:', error);
		console.error('❌ Error details:', {
			message: error instanceof Error ? error.message : 'Unknown error',
			stack: error instanceof Error ? error.stack : 'No stack trace',
			hybridResponse: hybridResponse ? {
				hasPhaseResponses: !!hybridResponse.phaseResponses,
				phaseCount: hybridResponse.phaseResponses?.length || 0
			} : 'No hybrid response'
		});
		// Return empty roadmap as fallback
		return {
			phases: [],
			timelineEstimates: [],
			parsedTimelineEstimates: {}
		};
	}
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<OnboardingProfile | null>(null);
	const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [hasExistingProject, setHasExistingProject] = useState(false);
	const [isCheckingProject, setIsCheckingProject] = useState(true);

	// Check if user has an existing project
	async function checkExistingProject() {
		try {
			setIsCheckingProject(true);
			console.log('🔍 Checking for existing projects...');
			
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError) {
				console.error('❌ User authentication error:', userError);
				setHasExistingProject(false);
				return;
			}
			
			if (!user?.id) {
				console.log('⚠️ No authenticated user found');
				setHasExistingProject(false);
				return;
			}
			
			console.log('✅ User authenticated:', user.id);
			
			// Check if user has any projects
			const { data: projects, error: projectError } = await supabase
				.from('projects')
				.select('id, name, created_at')
				.eq('user_id', user.id)
				.limit(5);
			
			if (projectError) {
				console.error('❌ Error checking existing projects:', projectError);
				setHasExistingProject(false);
				return;
			}
			
			// Also check for existing roadmap data
			const { data: roadmapData, error: roadmapError } = await supabase
				.from('roadmap_data')
				.select('id, created_at')
				.eq('user_id', user.id)
				.limit(1);
			
			console.log('🔍 Projects query result:', {
				projectCount: projects?.length || 0,
				projects: projects || []
			});
			
			console.log('🔍 Roadmap data query result:', {
				roadmapCount: roadmapData?.length || 0,
				roadmapData: roadmapData || []
			});
			
			const hasProject = projects && projects.length > 0;
			const hasRoadmap = roadmapData && roadmapData.length > 0;
			const hasExistingData = hasProject || hasRoadmap;
			
			setHasExistingProject(hasExistingData);
			console.log(`✅ User ${hasExistingData ? 'has' : 'does not have'} existing project or roadmap data`);
			
		} catch (error) {
			console.error('❌ Error checking existing project:', error);
			setHasExistingProject(false);
		} finally {
			setIsCheckingProject(false);
		}
	}

	// Load stored roadmap and check for existing project when component mounts
	useEffect(() => {
		checkExistingProject();
		loadStoredRoadmap();
	}, []); // Empty dependency array means this runs once on mount

	async function setProfileAndGenerate(p: OnboardingProfile) {
		setIsLoading(true);
		setProfile(p);
		try {
			// Try hybrid approach first, fall back to baseline if it fails
			try {
				console.log('🔄 Starting hybrid roadmap generation...');
				
				// Get current user first
				const { data: { user }, error: userError } = await supabase.auth.getUser();
				if (userError || !user?.id) {
					throw new Error('User not authenticated');
				}
				
				// Create project first
				const projectData = {
					user_id: user.id,
					name: `Project - ${p.cityState}`,
					city_state: p.cityState,
					property_address: p.propertyAddress || null,
					house_size: p.houseSize,
					foundation_type: p.foundationType,
					number_of_stories: p.numberOfStories,
					target_start_date: p.targetStartDate || null,
					background: p.background || null
				};
				
				const { data: project, error: projectError } = await supabase
					.from('projects')
					.insert(projectData)
					.select()
					.single();
				
				if (projectError) {
					throw new Error(`Project creation failed: ${projectError.message}`);
				}
				
				console.log('✅ Project created:', project.id);
				
				// Generate hybrid roadmap with project ID
				const hybridResponse = await generateHybridRoadmap(p, project.id);
				console.log('✅ Hybrid roadmap generated:', hybridResponse);
				
				// Convert hybrid response to legacy format for UI compatibility
				const roadmapData = convertHybridToLegacyFormat(hybridResponse);
				console.log('✅ Converted to legacy format:', roadmapData);
			
			// Generate timeline estimates in parallel (maintaining existing parallel processing)
			const timelineResponse = await fetch('/api/generate-timeline-estimates', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					userProfile: p,
					userId: user.id,
					projectId: project.id
				})
			});
			
			let timelineData = await timelineResponse.json();
			console.log('🔍 Timeline API response status:', timelineResponse.status);
			
			// Validate timeline data
			if (!timelineData || !timelineData.success) {
				console.warn('⚠️ Timeline API failed or returned invalid data, using fallback');
				timelineData = {
					success: false,
					userId: user.id,
					projectId: project.id,
					timelines: [],
					rawOpenAIResponses: {},
					parsedTimelineEstimates: {}
				};
			}
			
			// Combine hybrid roadmap and timeline data
			const combinedData = {
				...roadmapData,
				timelineEstimates: timelineData.success ? timelineData.timelines : [],
				parsedTimelineEstimates: timelineData.success ? timelineData.parsedTimelineEstimates : {}
			};
			
			console.log('🔍 Combined data structure:', {
				hasPhases: !!combinedData.phases,
				phaseCount: combinedData.phases?.length || 0,
				hasTimelineEstimates: !!combinedData.timelineEstimates,
				timelineCount: combinedData.timelineEstimates?.length || 0,
				hasParsedEstimates: !!combinedData.parsedTimelineEstimates,
				parsedEstimatesKeys: combinedData.parsedTimelineEstimates ? Object.keys(combinedData.parsedTimelineEstimates) : []
			});
			
			setRoadmap(combinedData);
			console.log('✅ Roadmap state updated with hybrid data');
			
			// Store in Supabase using IDs from API response
			await storeRoadmapInSupabase(p, combinedData, timelineData);
			
			} catch (hybridError) {
				console.warn('⚠️ Hybrid approach failed, falling back to baseline:', hybridError);
				// Fall back to baseline approach
				const baselineRoadmap = await generateRoadmap(p);
				setRoadmap(baselineRoadmap);
			}
			
		} catch (error) {
			console.error('❌ Error in setProfileAndGenerate:', error);
		} finally {
			setIsLoading(false);
		}
	}

	// Store roadmap data in Supabase
	async function storeRoadmapInSupabase(profile: OnboardingProfile, roadmapData: RoadmapData, timelineData: any) {
		try {
			console.log('🔍 Starting Supabase storage...');
			console.log('🔍 Profile:', profile);
			console.log('🔍 Roadmap data:', roadmapData);
			

			
			// Get current user from auth context
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError) {
				console.error('❌ Error getting user:', userError);
				throw userError;
			}
			
			if (!user?.id) {
				console.warn('⚠️ No authenticated user found, skipping database storage');
				return;
			}
			
			console.log('✅ User authenticated:', user.id);

			// Ensure user exists in public.users table
			console.log('🔍 Checking if user exists in public.users table...');
			const { data: existingUser, error: userCheckError } = await supabase
				.from('users')
				.select('id')
				.eq('id', user.id)
				.single();

			if (userCheckError && userCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
				console.error('❌ Error checking user in public.users:', userCheckError);
				throw userCheckError;
			}

			if (!existingUser) {
				console.log('⚠️ User not found in public.users, creating user record...');
				const { error: createUserError } = await supabase
					.from('users')
					.insert({
						id: user.id,
						email: user.email,
						first_name: null,
						last_name: null,
						phone: null,
						is_active: true
					});

				if (createUserError) {
					console.error('❌ Error creating user in public.users:', createUserError);
					throw createUserError;
				}
				console.log('✅ User created in public.users table');
			} else {
				console.log('✅ User already exists in public.users table');
			}

			// Use the project ID from the timeline data instead of creating a new one
			const projectId = timelineData.projectId;
			console.log('🔍 Using existing project ID from timeline data:', projectId);
			
			// Verify the project exists and belongs to this user
			const { data: project, error: projectError } = await supabase
				.from('projects')
				.select('*')
				.eq('id', projectId)
				.eq('user_id', user.id)
				.single();

			if (projectError) {
				console.error('❌ Project verification error:', projectError);
				throw new Error(`Project ${projectId} not found or access denied`);
			}
			
			console.log('✅ Project verified:', project.id);

			// Store the roadmap data with proper structure
			console.log('🔍 Timeline data structure:', {
				hasRawResponses: !!timelineData.rawOpenAIResponses,
				hasParsedEstimates: !!timelineData.parsedTimelineEstimates,
				rawResponsesKeys: timelineData.rawOpenAIResponses ? Object.keys(timelineData.rawOpenAIResponses) : [],
				parsedEstimatesKeys: timelineData.parsedTimelineEstimates ? Object.keys(timelineData.parsedTimelineEstimates) : []
			});

			// Store the full responses for debugging
			const rawOpenAIResponses: Record<string, string> = {};
			if (timelineData.rawOpenAIResponses) {
				Object.keys(timelineData.rawOpenAIResponses).forEach(phaseId => {
					const response = timelineData.rawOpenAIResponses[phaseId];
					// Store the full response
					rawOpenAIResponses[phaseId] = response;
				});
			}
			
			const roadmapDataToStore = {
				user_id: user.id,
				project_id: project.id,
				raw_api_response: {
					rawOpenAIResponses: rawOpenAIResponses,
					parsedTimelineEstimates: timelineData.parsedTimelineEstimates || {},
					baseline_phases: roadmapData.phases,
					generated_at: new Date().toISOString()
				}
			};
			
			console.log('🔍 Storing roadmap data:', roadmapDataToStore);
			// Calculate storage size
			const jsonString = JSON.stringify(roadmapDataToStore.raw_api_response);
			const sizeInBytes = new Blob([jsonString]).size;
			const sizeInKB = (sizeInBytes / 1024).toFixed(2);
			const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
			
			console.log('🔍 Raw API response content:', {
				rawOpenAIResponsesCount: Object.keys(roadmapDataToStore.raw_api_response.rawOpenAIResponses).length,
				parsedEstimatesCount: Object.keys(roadmapDataToStore.raw_api_response.parsedTimelineEstimates).length,
				totalSize: `${sizeInKB} KB (${sizeInMB} MB)`,
				sampleRawResponse: Object.keys(roadmapDataToStore.raw_api_response.rawOpenAIResponses).slice(0, 1).map(key => ({
					phase: key,
					content: roadmapDataToStore.raw_api_response.rawOpenAIResponses[key]
				})),
				sampleParsedEstimate: Object.keys(roadmapDataToStore.raw_api_response.parsedTimelineEstimates).slice(0, 1).map(key => ({
					phase: key,
					data: roadmapDataToStore.raw_api_response.parsedTimelineEstimates[key]
				}))
			});
			
			// Log the actual content being stored
			console.log('🔍 Actual parsed estimates being stored:', {
				phases: Object.keys(roadmapDataToStore.raw_api_response.parsedTimelineEstimates),
				sampleData: roadmapDataToStore.raw_api_response.parsedTimelineEstimates['pre-construction'] || 'No pre-construction data'
			});
			
			// Debug: Log the raw timelineData structure
			console.log('🔍 DEBUG: Raw timelineData structure:', {
				hasParsedEstimates: !!timelineData.parsedTimelineEstimates,
				parsedEstimatesKeys: timelineData.parsedTimelineEstimates ? Object.keys(timelineData.parsedTimelineEstimates) : [],
				sampleParsedData: timelineData.parsedTimelineEstimates ? Object.entries(timelineData.parsedTimelineEstimates).slice(0, 3) : []
			});
			
			const { data: roadmapRecord, error: roadmapError } = await supabase
				.from('roadmap_data')
				.insert(roadmapDataToStore)
				.select()
				.single();

			if (roadmapError) {
				console.error('❌ Roadmap storage error:', roadmapError);
				throw roadmapError;
			}
			
			console.log('✅ Roadmap stored in Supabase:', roadmapRecord.id);
			
		} catch (error) {
			console.error('❌ Failed to store roadmap in Supabase:', error);
			console.error('❌ Error details:', {
				message: error instanceof Error ? error.message : 'Unknown error',
				code: (error as any)?.code,
				details: (error as any)?.details,
				hint: (error as any)?.hint,
				stack: error instanceof Error ? error.stack : 'No stack trace'
			});
			// Don't throw - we don't want to break the roadmap generation if storage fails
		}
	}

	// Retrieve stored roadmap data from Supabase
	async function loadStoredRoadmap() {
		try {
			// Only load stored data if there's no current roadmap data
			if (roadmap && roadmap.parsedTimelineEstimates && Object.keys(roadmap.parsedTimelineEstimates).length > 0) {
				console.log('✅ Current session has roadmap data, skipping stored data load');
				return;
			}
			
			setIsLoading(true);
			
			// Get current user from auth context
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			
			if (userError || !user?.id) {
				console.log('⚠️ No authenticated user found, skipping roadmap load');
				return;
			}
			
			console.log('🔍 Loading stored roadmap for user:', user.id);
			
			// Get the most recent roadmap data for this user
			const { data: roadmapRecords, error: roadmapError } = await supabase
				.from('roadmap_data')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(1);
			
			if (roadmapError) {
				console.error('❌ Error loading roadmap:', roadmapError);
				return;
			}
			
			if (roadmapRecords && roadmapRecords.length > 0) {
				const storedRoadmap = roadmapRecords[0];
				console.log('✅ Loaded stored roadmap:', storedRoadmap.id);
				
				// Check if this is hybrid approach data
				const isHybridData = storedRoadmap.raw_api_response?.hybrid_approach === true;
				console.log('🔍 Data type:', isHybridData ? 'Hybrid Approach' : 'Legacy');
				
				// Only reconstruct if we don't have current session data
				if (!roadmap || !roadmap.parsedTimelineEstimates || Object.keys(roadmap.parsedTimelineEstimates).length === 0) {
					let reconstructedRoadmap: RoadmapData;
					
					if (isHybridData) {
						// Handle hybrid approach data
						console.log('🔄 Processing hybrid approach data...');
						
						// Parse stored hybrid responses
						const { getStoredRawResponses, parseStoredResponses } = await import('@/lib/hybrid-roadmap-generator');
						
						const rawResponses = await getStoredRawResponses(storedRoadmap.project_id, user.id);
						if (rawResponses) {
							// Get project data to determine construction method
							const { data: projectData } = await supabase
								.from('projects')
								.select('construction_method')
								.eq('id', storedRoadmap.project_id)
								.single();
							
							const constructionMethod = projectData?.construction_method || 'post-frame';
							const hybridResponse = await parseStoredResponses(
								rawResponses,
								storedRoadmap.project_id,
								user.id,
								constructionMethod
							);
							
							reconstructedRoadmap = convertHybridToLegacyFormat(hybridResponse);
							console.log('✅ Hybrid roadmap restored from database');
						} else {
							// Fallback to empty roadmap
							reconstructedRoadmap = {
								phases: [],
								timelineEstimates: [],
								parsedTimelineEstimates: {}
							};
						}
					} else {
						// Handle legacy data
						console.log('🔄 Processing legacy data...');
						reconstructedRoadmap = {
							phases: storedRoadmap.raw_api_response?.baseline_phases || [],
							timelineEstimates: [], // We don't store the full timeline estimates
							parsedTimelineEstimates: storedRoadmap.raw_api_response?.parsedTimelineEstimates || {}
						};
						console.log('✅ Legacy roadmap restored from database');
					}
					
					// Restore the roadmap
					setRoadmap(reconstructedRoadmap);
					
					// Now fetch the profile from the projects table using project_id
					if (storedRoadmap.project_id) {
						try {
							const { data: projectData, error: projectError } = await supabase
								.from('projects')
								.select('*')
								.eq('id', storedRoadmap.project_id)
								.single();
							
							if (projectError) {
								console.error('❌ Error loading project profile:', projectError);
							} else if (projectData) {
								// Convert project data to OnboardingProfile format
								const profileData: OnboardingProfile = {
									role: projectData.role || 'owner_plus_diy',
									experience: projectData.experience || 'diy_permitting',
									subcontractorHelp: projectData.subcontractor_help || 'yes',
									constructionMethod: projectData.construction_method || 'post-frame',
									currentPhaseId: projectData.current_phase_id || 'just-starting',
									diyPhaseIds: projectData.diy_phase_ids || [],
									weeklyHourlyCommitment: projectData.weekly_hourly_commitment || '25',
									cityState: projectData.city_state || '',
									propertyAddress: projectData.property_address || '',
									houseSize: projectData.house_size || '',
									foundationType: projectData.foundation_type || 'pier-and-beam',
									numberOfStories: projectData.number_of_stories || '2-story',
									targetStartDate: projectData.target_start_date || '',
									background: projectData.background || ''
								};
								
								setProfile(profileData);
								console.log('✅ Profile restored from projects table');
							}
						} catch (error) {
							console.error('❌ Error fetching project profile:', error);
						}
					}
				} else {
					console.log('✅ Current session data preserved, not overwriting with stored data');
				}
			} else {
				console.log('ℹ️ No stored roadmap found for user');
			}
			
		} catch (error) {
			console.error('❌ Error loading stored roadmap:', error);
		} finally {
			setIsLoading(false);
		}
	}

	async function regeneratePhase(phaseId: string, detailLevel: "low" | "standard" | "high") {
		if (!profile || !roadmap) return
		
		setIsLoading(true)
		try {
			console.log(`🔄 Regenerating phase ${phaseId} with detail level ${detailLevel}...`);
			
			// Get current user
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user?.id) {
				throw new Error('User not authenticated');
			}
			
			// Get the current project ID from the roadmap data
			// For now, we'll need to find the project ID from the stored data
			// This is a simplified approach - in production you might want to store project ID in state
			const { data: projects } = await supabase
				.from('projects')
				.select('id')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(1)
				.single();
			
			if (!projects?.id) {
				throw new Error('No project found for regeneration');
			}
			
			// Regenerate the entire hybrid roadmap
			const hybridResponse = await generateHybridRoadmap(profile, projects.id);
			const roadmapData = convertHybridToLegacyFormat(hybridResponse);
			
			// Combine with existing timeline data
			const combinedData = {
				...roadmapData,
				timelineEstimates: roadmap.timelineEstimates || [],
				parsedTimelineEstimates: roadmap.parsedTimelineEstimates || {}
			};
			
			setRoadmap(combinedData);
			console.log(`✅ Phase ${phaseId} regenerated successfully`);
			
		} catch (error) {
			console.error(`❌ Error regenerating phase ${phaseId}:`, error);
		} finally {
			setIsLoading(false);
		}
	}

	const value = useMemo(() => ({ 
		profile, 
		roadmap, 
		isLoading, 
		hasExistingProject,
		isCheckingProject,
		setProfileAndGenerate,
		regeneratePhase,
		loadStoredRoadmap,
		checkExistingProject
	}), [profile, roadmap, isLoading, hasExistingProject, isCheckingProject])

	return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
	const ctx = useContext(RoadmapContext);
	if (!ctx) throw new Error("useRoadmap must be used within RoadmapProvider");
	return ctx;
}


