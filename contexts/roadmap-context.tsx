"use client";

import { createContext, useContext, useState, type ReactNode, useMemo, useEffect } from "react";
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types";
import { generateRoadmap } from "@/app/actions/generateRoadmap";
import { supabase } from "@/lib/supabase";

interface RoadmapContextType {
	profile: OnboardingProfile | null;
	roadmap: RoadmapData | null;
	isLoading: boolean;
	setProfileAndGenerate: (p: OnboardingProfile) => Promise<void>;
	regeneratePhase: (phaseId: string, detailLevel: "low" | "standard" | "high") => Promise<void>;
	loadStoredRoadmap: () => Promise<void>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<OnboardingProfile | null>(null);
	const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Load stored roadmap when component mounts
	useEffect(() => {
		loadStoredRoadmap();
	}, []); // Empty dependency array means this runs once on mount

	async function setProfileAndGenerate(p: OnboardingProfile) {
		setIsLoading(true);
		setProfile(p);
		try {
			console.log('🔄 Starting roadmap generation...');
			
			// Get current user first
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user?.id) {
				throw new Error('User not authenticated');
			}
			
			// Generate roadmap first to get baseline data
			const roadmapData = await generateRoadmap(p);
			console.log('✅ Roadmap generated:', roadmapData);
			console.log('🔍 Roadmap phases structure:', roadmapData.phases);
			if (roadmapData.phases && roadmapData.phases.length > 0) {
				console.log('🔍 First phase structure:', roadmapData.phases[0]);
				console.log('🔍 First phase tasks:', roadmapData.phases[0].tasks);
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
			
			// Now generate timeline estimates with user and project IDs
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
			console.log('🔍 Timeline API response data:', timelineData);
			
			console.log('🔍 Timeline API response:', {
				success: timelineData.success,
				hasTimelines: !!timelineData.timelines,
				timelineCount: timelineData.timelines?.length || 0,
				hasRawResponses: !!timelineData.rawOpenAIResponses,
				hasParsedEstimates: !!timelineData.parsedTimelineEstimates,
				rawResponsesKeys: timelineData.rawOpenAIResponses ? Object.keys(timelineData.rawOpenAIResponses) : [],
				parsedEstimatesKeys: timelineData.parsedTimelineEstimates ? Object.keys(timelineData.parsedTimelineEstimates) : []
			});
			
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
			
			// Verify IDs match what we sent
			if (timelineData.userId !== user.id || timelineData.projectId !== project.id) {
				console.warn('⚠️ Timeline API returned different IDs than expected');
			}
			
			console.log('🔍 Timeline API response IDs:', {
				expectedUserId: user.id,
				receivedUserId: timelineData.userId,
				expectedProjectId: project.id,
				receivedProjectId: timelineData.projectId
			});
			
			// Combine roadmap and timeline data
			const combinedData = {
				...roadmapData,
				timelineEstimates: timelineData.success ? timelineData.timelines : [],
				parsedTimelineEstimates: timelineData.success ? timelineData.parsedTimelineEstimates : {}
			};
			
			console.log('🔍 Combined data structure:', {
				hasTimelineEstimates: !!combinedData.timelineEstimates,
				timelineEstimatesCount: combinedData.timelineEstimates?.length || 0,
				hasParsedEstimates: !!combinedData.parsedTimelineEstimates,
				parsedEstimatesKeys: combinedData.parsedTimelineEstimates ? Object.keys(combinedData.parsedTimelineEstimates) : [],
				sampleParsedData: combinedData.parsedTimelineEstimates ? Object.keys(combinedData.parsedTimelineEstimates).slice(0, 3).map(key => ({
					phase: key,
					data: combinedData.parsedTimelineEstimates[key]
				})) : []
			});
			
			console.log('🔍 Setting roadmap state with combined data:', {
				hasPhases: !!combinedData.phases,
				phaseCount: combinedData.phases?.length || 0,
				hasTimelineEstimates: !!combinedData.timelineEstimates,
				timelineCount: combinedData.timelineEstimates?.length || 0,
				hasParsedEstimates: !!combinedData.parsedTimelineEstimates,
				parsedEstimatesKeys: combinedData.parsedTimelineEstimates ? Object.keys(combinedData.parsedTimelineEstimates) : [],
				sampleParsedData: combinedData.parsedTimelineEstimates ? 
					Object.entries(combinedData.parsedTimelineEstimates).slice(0, 2) : 'No parsed data'
			});
			
			setRoadmap(combinedData);
			console.log('✅ Roadmap state updated with combined data');
			
			// Store in Supabase using IDs from API response
			await storeRoadmapInSupabase(p, combinedData, timelineData);
			
		} catch (error) {
			console.error('❌ Error in setProfileAndGenerate:', error);
		} finally {
			setIsLoading(false);
		}
	}

	// Function to dump API response data to a text file for troubleshooting
	async function dumpApiResponseToFile(profile: OnboardingProfile, roadmapData: RoadmapData, timelineData: any) {
		try {
			const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
			const filename = `api-response-debug-${timestamp}.txt`;
			
			// Create comprehensive debug data
			const debugData = {
				timestamp: new Date().toISOString(),
				profile: profile,
				roadmapData: {
					phases: roadmapData.phases?.map(p => ({ id: p.id, title: p.title })) || [],
					hasTimelineEstimates: !!roadmapData.timelineEstimates,
					timelineEstimatesCount: roadmapData.timelineEstimates?.length || 0,
					hasParsedEstimates: !!roadmapData.parsedTimelineEstimates,
					parsedEstimatesKeys: roadmapData.parsedTimelineEstimates ? Object.keys(roadmapData.parsedTimelineEstimates) : []
				},
				timelineData: {
					success: timelineData.success,
					userId: timelineData.userId,
					projectId: timelineData.projectId,
					hasTimelines: !!timelineData.timelines,
					timelineCount: timelineData.timelines?.length || 0,
					hasRawResponses: !!timelineData.rawOpenAIResponses,
					hasParsedEstimates: !!timelineData.parsedTimelineEstimates,
					rawResponsesKeys: timelineData.rawOpenAIResponses ? Object.keys(timelineData.rawOpenAIResponses) : [],
					parsedEstimatesKeys: timelineData.parsedTimelineEstimates ? Object.keys(timelineData.parsedTimelineEstimates) : []
				},
				phaseMatching: {
					roadmapPhaseIds: roadmapData.phases?.map(p => p.id) || [],
					parsedEstimatesPhaseIds: roadmapData.parsedTimelineEstimates ? Object.keys(roadmapData.parsedTimelineEstimates) : [],
					matchingPhases: roadmapData.phases?.filter(p => 
						roadmapData.parsedTimelineEstimates?.[p.id]
					).map(p => p.id) || [],
					missingPhases: roadmapData.phases?.filter(p => 
						!roadmapData.parsedTimelineEstimates?.[p.id]
					).map(p => p.id) || []
				},
				sampleData: {
					samplePhase: roadmapData.phases?.[0] ? {
						id: roadmapData.phases[0].id,
						title: roadmapData.phases[0].title,
						hasParsedData: !!roadmapData.parsedTimelineEstimates?.[roadmapData.phases[0].id],
						parsedData: roadmapData.parsedTimelineEstimates?.[roadmapData.phases[0].id] || 'No parsed data'
					} : 'No phases available',
					sampleParsedEstimate: roadmapData.parsedTimelineEstimates ? 
						Object.entries(roadmapData.parsedTimelineEstimates).slice(0, 2) : 'No parsed estimates'
				}
			};
			
			// Convert to formatted text
			const debugText = `=== API RESPONSE DEBUG DUMP ===
Generated: ${debugData.timestamp}

=== USER PROFILE ===
${JSON.stringify(debugData.profile, null, 2)}

=== ROADMAP DATA ===
${JSON.stringify(debugData.roadmapData, null, 2)}

=== TIMELINE DATA ===
${JSON.stringify(debugData.timelineData, null, 2)}

=== PHASE MATCHING ANALYSIS ===
${JSON.stringify(debugData.phaseMatching, null, 2)}

=== SAMPLE DATA ===
${JSON.stringify(debugData.sampleData, null, 2)}

=== FULL ROADMAP PHASES ===
${JSON.stringify(roadmapData.phases, null, 2)}

=== FULL PARSED TIMELINE ESTIMATES ===
${JSON.stringify(roadmapData.parsedTimelineEstimates, null, 2)}

=== FULL TIMELINE DATA ===
${JSON.stringify(timelineData, null, 2)}
`;
			
			// Create and download the file
			const blob = new Blob([debugText], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			
			console.log(`✅ Debug data dumped to file: ${filename}`);
			console.log('🔍 Debug data structure:', debugData);
			
		} catch (error) {
			console.error('❌ Failed to dump debug data:', error);
		}
	}

	// Store roadmap data in Supabase
	async function storeRoadmapInSupabase(profile: OnboardingProfile, roadmapData: RoadmapData, timelineData: any) {
		try {
			console.log('🔍 Starting Supabase storage...');
			console.log('🔍 Profile:', profile);
			console.log('🔍 Roadmap data:', roadmapData);
			
			// DUMP API RESPONSE TO FILE FOR TROUBLESHOOTING
			await dumpApiResponseToFile(profile, roadmapData, timelineData);
			
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
				console.log('🔍 Raw API response content:', {
					hasRawResponses: !!storedRoadmap.raw_api_response?.rawOpenAIResponses,
					rawResponsesCount: storedRoadmap.raw_api_response?.rawOpenAIResponses ? Object.keys(storedRoadmap.raw_api_response.rawOpenAIResponses).length : 0,
					hasParsedEstimates: !!storedRoadmap.raw_api_response?.parsedTimelineEstimates,
					parsedEstimatesCount: storedRoadmap.raw_api_response?.parsedTimelineEstimates ? Object.keys(storedRoadmap.raw_api_response.parsedTimelineEstimates).length : 0
				});
				
				// Only reconstruct if we don't have current session data
				if (!roadmap || !roadmap.parsedTimelineEstimates || Object.keys(roadmap.parsedTimelineEstimates).length === 0) {
					const reconstructedRoadmap = {
						phases: storedRoadmap.raw_api_response?.baseline_phases || [],
						timelineEstimates: [], // We don't store the full timeline estimates
						parsedTimelineEstimates: storedRoadmap.raw_api_response?.parsedTimelineEstimates || {}
					};
					
					setRoadmap(reconstructedRoadmap);
					console.log('✅ Roadmap restored from database');
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
			// Create a new profile with the updated detail level for this phase
			const updatedProfile = { ...profile }
			// For now, just regenerate the whole roadmap. Later you can optimize to regenerate just one phase
			const data = await generateRoadmap(updatedProfile)
			setRoadmap(data)
		} finally {
			setIsLoading(false)
		}
	}

	const value = useMemo(() => ({ 
		profile, 
		roadmap, 
		isLoading, 
		setProfileAndGenerate,
		regeneratePhase,
		loadStoredRoadmap
	}), [profile, roadmap, isLoading, regeneratePhase, loadStoredRoadmap])

	return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
	const ctx = useContext(RoadmapContext);
	if (!ctx) throw new Error("useRoadmap must be used within RoadmapProvider");
	return ctx;
}


