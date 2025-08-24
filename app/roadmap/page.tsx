"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { FeatureNavigation } from "@/components/feature-navigation"
import { RoadmapProvider, useRoadmap } from "@/contexts/roadmap-context"
import { RoadmapTimeline } from "@/components/roadmap-timeline"
import { ConstructionTimeline } from "@/components/construction-timeline"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

function RoadmapInner() {
	const { profile, roadmap, isLoading } = useRoadmap()
	const router = useRouter()
	


	if (isLoading) {
		return <div className="max-w-2xl mx-auto p-8 text-center">Generating roadmap...</div>
	}

	if (!profile) {
		return (
			<div className="max-w-2xl mx-auto p-8 text-center">
				<h2 className="text-xl font-semibold mb-4">No Roadmap Yet</h2>
				<p className="text-gray-600 mb-6">Complete onboarding to generate your personalized construction roadmap.</p>
				<Button onClick={() => router.push("/onboarding")}>Start Onboarding</Button>
			</div>
		)
	}

	if (!roadmap) {
		// Show fallback timeline with basic construction phases
		return (
			<div className="space-y-6">
				<div className="max-w-2xl mx-auto p-8 text-center">
					<h2 className="text-xl font-semibold mb-4">Personalized Roadmap Not Available</h2>
					<p className="text-gray-600 mb-6">Here's a standard construction timeline based on your building method.</p>
					<Button onClick={() => router.push("/onboarding")}>Complete Onboarding</Button>
				</div>
				<ConstructionTimeline 
					constructionMethod={profile.constructionMethod}
					title="Standard Construction Timeline"
					description="Basic construction phases for your building method"
				/>
			</div>
		)
	}

	return (
		<div className="space-y-6">
			
			{/* Timeline Summary Section */}
			{roadmap.timelineEstimates && roadmap.timelineEstimates.length > 0 && (
				<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg border">
					<h2 className="text-xl font-semibold mb-4">Project Timeline Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="text-2xl font-bold text-green-700">
								{roadmap.timelineEstimates.reduce((total, phase) => {
									const isDIYPhase = profile?.diyPhaseIds.includes(phase.phaseId);
									if (isDIYPhase) {
										const durationMatch = phase.timeline.match(/.*\*\*Duration\*\*:\s*(\d+)\s*weeks/);
										return total + (durationMatch ? parseInt(durationMatch[1]) : 0);
									} else {
										const contractorMatch = phase.timeline.match(/.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/);
										return total + (contractorMatch ? parseInt(contractorMatch[1]) : 0);
									}
								}, 0)}
							</div>
							<div className="text-sm text-green-600">Total Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="text-2xl font-bold text-blue-700">
								{roadmap.timelineEstimates.reduce((total, phase) => {
									const isDIYPhase = profile?.diyPhaseIds.includes(phase.phaseId);
									if (isDIYPhase) {
										const durationMatch = phase.timeline.match(/.*\*\*Duration\*\*:\s*(\d+)\s*weeks/);
										return total + (durationMatch ? parseInt(durationMatch[1]) : 0);
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-blue-600">DIY Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
							<div className="text-2xl font-bold text-purple-700">
								{roadmap.timelineEstimates.reduce((total, phase) => {
									const isDIYPhase = profile?.diyPhaseIds.includes(phase.phaseId);
									if (!isDIYPhase) {
										const contractorMatch = phase.timeline.match(/.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/);
										return total + (contractorMatch ? parseInt(contractorMatch[1]) : 0);
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-purple-600">Contractor Weeks</div>
						</div>
					</div>
				</div>
			)}
			
			{/* Main Roadmap */}
			<RoadmapTimeline data={roadmap} />
		</div>
	)
}

export default function RoadmapPage() {
	const router = useRouter()
	
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gray-50">
				<DashboardHeader />
				<main className="pb-6">
					<FeatureNavigation onFeatureClick={(feature) => {
						if (feature === "roadmap") return; // Stay on roadmap
						if (feature === "dashboard") router.push("/dashboard");
						if (feature === "timeline") router.push("/timeline-demo");
						// Add other feature routes as needed
					}} />
					<RoadmapInner />
				</main>
			</div>
		</ProtectedRoute>
	)
}
