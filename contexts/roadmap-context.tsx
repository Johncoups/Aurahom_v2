"use client";

import { createContext, useContext, useState, type ReactNode, useMemo, useEffect } from "react";
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types";
import { generateHybridRoadmap } from "@/lib/hybrid-roadmap-generator";
import type { CompleteProjectResponse } from "@/lib/unified-response-types";
import { supabase } from "@/lib/supabase";
import { getPhasesForMethod } from "@/lib/roadmap-phases";

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
				...(aiTaskData.qaChecks || []),
				...(aiHelpfulInfo.qaChecks || []),
				...(aiExpertInsights.qualityCheckpoints || [])
			].filter(Boolean);
			
			// Extract vendor questions and needs from baseline helpfulInformation
			const vendorQuestions = (baselinePhase.helpfulInformation || [])
				.filter(info => info.includes('quotes from') || info.includes('Get 3+'))
				.map(info => info.replace('Get 3+ quotes from', 'Ask for quotes from')
					.replace('Research 3 different', 'Ask about different')
					.replace('Contact 3+', 'Contact multiple'));
			
			const vendorNeeds = (baselinePhase.helpfulInformation || [])
				.filter(info => info.includes('compare') || info.includes('Research'))
				.map(info => info.replace('compare their', 'provide details about their')
					.replace('Research 3 different', 'Provide information about different'));
			
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
			
			console.log('🔍 Projects query result:', {
				projectCount: projects?.length || 0,
				projects: projects || []
			});
			
			const hasProject = projects && projects.length > 0;
			setHasExistingProject(hasProject);
			console.log(`✅ User ${hasProject ? 'has' : 'does not have'} existing project`);
			
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


