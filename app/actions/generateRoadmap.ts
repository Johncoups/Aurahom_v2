"use server";

import { baselineRoadmapData } from "@/lib/roadmap-baseline";
import type { OnboardingProfile, RoadmapData, RoadmapPhase, RoadmapTask } from "@/lib/roadmap-types";
import { generateRoadmapContent, generateStructuredContent } from "@/lib/openai";

// Enhanced roadmap generator with OpenAI integration
export async function generateRoadmap(profile: OnboardingProfile): Promise<RoadmapData> {
	console.log('generateRoadmap called with profile:', profile);
	
	try {
		// Check if OpenAI API key is available
		if (!process.env.OPENAI_API_KEY) {
			console.warn('OPENAI_API_KEY not found, falling back to baseline');
			return generateBaselineRoadmap(profile);
		}

		console.log('Attempting AI-enhanced roadmap generation with OpenAI...');
		// Try to generate AI-enhanced roadmap
		const aiEnhancedRoadmap = await generateAIRoadmap(profile);
		console.log('AI roadmap generation successful');
		return aiEnhancedRoadmap;
	} catch (error) {
		console.error('AI roadmap generation failed:', error);
		console.warn('Falling back to baseline data');
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
	
	// Generate AI-enhanced phases
	const enhancedPhases: RoadmapPhase[] = [];

	for (const baselinePhase of baselineRoadmapData.phases) {
		const detailLevel = diy.has(baselinePhase.id) || isHighDetail ? "high" : "standard" as const;
		
		// Generate AI-enhanced content for the current phase if it matches user's current phase
		let enhancedTasks = baselinePhase.tasks;
		
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
				enhancedTasks = baselinePhase.tasks.map(task => ({
					...task,
					notes: aiGuidance.slice(0, 200) + '...' // Add AI insights as notes
				}));
			} catch (error) {
				console.warn(`Failed to generate AI content for phase ${baselinePhase.id}:`, error);
				// Continue with baseline tasks
			}
		}

		enhancedPhases.push({
			id: baselinePhase.id,
			title: baselinePhase.title,
			detailLevel,
			tasks: enhancedTasks
		});
	}

	return { phases: enhancedPhases };
}

function generateBaselineRoadmap(profile: OnboardingProfile): RoadmapData {
	console.log('generateBaselineRoadmap called');
	
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
	
	// Use the baseline data as a starting point
	const phases: RoadmapPhase[] = baselineRoadmapData.phases.map((p) => {
		const detailLevel = diy.has(p.id) || isHighDetail ? "high" : "standard" as const;
		
		// Return the phase with the appropriate detail level
		return {
			id: p.id,
			title: p.title,
			detailLevel,
			tasks: p.tasks // Use the existing tasks from baseline data
		};
	});

	return { phases };
}


