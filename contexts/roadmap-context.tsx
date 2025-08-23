"use client";

import { createContext, useContext, useState, type ReactNode, useMemo } from "react";
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types";
import { generateRoadmap } from "@/app/actions/generateRoadmap";
import { supabase } from "@/lib/supabase";

interface RoadmapContextType {
	profile: OnboardingProfile | null;
	roadmap: RoadmapData | null;
	isLoading: boolean;
	setProfileAndGenerate: (p: OnboardingProfile) => Promise<void>;
	regeneratePhase: (phaseId: string, detailLevel: "low" | "standard" | "high") => Promise<void>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: ReactNode }) {
	const [profile, setProfile] = useState<OnboardingProfile | null>(null);
	const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function setProfileAndGenerate(p: OnboardingProfile) {
		setIsLoading(true);
		setProfile(p);
		try {
			console.log('🔄 Starting roadmap generation...');
			// Generate both roadmap and timeline estimates
			const [roadmapData, timelineData] = await Promise.all([
				generateRoadmap(p).then(data => {
					console.log('✅ Roadmap generated:', data);
					console.log('🔍 Roadmap phases structure:', data.phases);
					if (data.phases && data.phases.length > 0) {
						console.log('🔍 First phase structure:', data.phases[0]);
						console.log('🔍 First phase tasks:', data.phases[0].tasks);
					}
					return data;
				}).catch(error => {
					console.error('❌ Roadmap generation failed:', error);
					throw error;
				}),
				fetch('/api/generate-timeline-estimates', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ userProfile: p })
				}).then(res => res.json())
			]);
			
			// Combine roadmap and timeline data
			const combinedData = {
				...roadmapData,
				timelineEstimates: timelineData.success ? timelineData.timelines : []
			};
			
			setRoadmap(combinedData);
			
			// Store in Supabase
			await storeRoadmapInSupabase(p, combinedData);
			
		} catch (error) {
			console.error('❌ Error in setProfileAndGenerate:', error);
		} finally {
			setIsLoading(false);
		}
	}

	// Store roadmap data in Supabase
	async function storeRoadmapInSupabase(profile: OnboardingProfile, roadmapData: RoadmapData) {
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

			// First, create or get the project
			const projectData = {
				user_id: user.id,
				name: `Project - ${profile.cityState}`,
				city_state: profile.cityState,
				property_address: profile.propertyAddress || null,
				house_size: profile.houseSize,
				foundation_type: profile.foundationType,
				number_of_stories: profile.numberOfStories,
				target_start_date: profile.targetStartDate || null, // Convert empty string to null
				background: profile.background || null
			};
			
			console.log('🔍 Creating project with data:', projectData);
			
			// Use simple insert instead of upsert since we don't have the unique constraint
			const { data: project, error: projectError } = await supabase
				.from('projects')
				.insert(projectData)
				.select()
				.single();

			if (projectError) {
				console.error('❌ Project creation error:', projectError);
				throw projectError;
			}
			
			console.log('✅ Project created/updated:', project.id);

			// Store the roadmap data
			const roadmapDataToStore = {
				user_id: user.id,
				project_id: project.id,
				raw_api_response: {
					profile,
					roadmap: roadmapData,
					generated_at: new Date().toISOString()
				}
			};
			
			console.log('🔍 Storing roadmap data:', roadmapDataToStore);
			
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
				hint: (error as any)?.hint
			});
			// Don't throw - we don't want to break the roadmap generation if storage fails
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
		regeneratePhase
	}), [profile, roadmap, isLoading, regeneratePhase])

	return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
	const ctx = useContext(RoadmapContext);
	if (!ctx) throw new Error("useRoadmap must be used within RoadmapProvider");
	return ctx;
}


