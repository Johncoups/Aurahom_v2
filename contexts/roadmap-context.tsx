"use client";

import { createContext, useContext, useState, type ReactNode, useMemo } from "react";
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types";
import { generateRoadmap } from "@/app/actions/generateRoadmap";

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
			// Generate both roadmap and timeline estimates
			const [roadmapData, timelineData] = await Promise.all([
				generateRoadmap(p),
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
		} catch (error) {
			console.error('❌ Error in setProfileAndGenerate:', error);
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
		regeneratePhase
	}), [profile, roadmap, isLoading, regeneratePhase])

	return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
}

export function useRoadmap() {
	const ctx = useContext(RoadmapContext);
	if (!ctx) throw new Error("useRoadmap must be used within RoadmapProvider");
	return ctx;
}


