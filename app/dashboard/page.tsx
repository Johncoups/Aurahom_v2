"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardHeader } from "@/components/dashboard-header"
import { FeatureNavigation } from "@/components/feature-navigation"
import { DashboardPage as DashboardContent } from "@/components/dashboard-page"
import { RoadmapPage } from "@/components/roadmap-page"
import { SchedulePage } from "@/components/schedule-page"
import { TaskGeneratorPage } from "@/components/task-generator-page"
import { BidsPage } from "@/components/bids-page"
import { BudgetPage } from "@/components/budget-page"
import { RoadmapProvider, useRoadmap } from "@/contexts/roadmap-context"
import { RoadmapView } from "@/components/roadmap-view"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { OnboardingWizard } from "@/components/onboarding-wizard"

function DashboardInner() {
	const [currentView, setCurrentView] = useState<string>("dashboard")
	const { profile, roadmap, isLoading, regeneratePhase } = useRoadmap()
	const router = useRouter()

	const handleFeatureClick = (feature: string) => {
		if (feature === "timeline") {
			router.push("/timeline-demo")
			return
		}
		setCurrentView(feature)
	}

	const renderCurrentView = () => {
		switch (currentView) {
			case "dashboard":
				if (!profile) {
					return <OnboardingWizard onComplete={() => setCurrentView("roadmap")} />
				}
				return <DashboardContent />
			case "roadmap":
				if (!profile) {
					return (
						<div className="max-w-2xl mx-auto p-8 text-center">
							<h2 className="text-xl font-semibold mb-4">No Roadmap Yet</h2>
							<p className="text-gray-600 mb-6">Complete onboarding to generate your personalized construction roadmap.</p>
							<Button onClick={() => setCurrentView("dashboard")}>Start Onboarding</Button>
						</div>
					)
				}
				if (isLoading) {
					return <div className="max-w-2xl mx-auto p-8 text-center">Generating roadmap...</div>
				}
				if (!roadmap) {
					return <div className="max-w-2xl mx-auto p-8 text-center">Error generating roadmap. Please try onboarding again.</div>
				}
				return <RoadmapView data={roadmap} onRegeneratePhase={regeneratePhase} />
			case "schedule":
				return <SchedulePage />
			case "tasks":
				return <TaskGeneratorPage />
			case "bids":
				return <BidsPage />
			case "budget":
				return <BudgetPage />
			default:
				return <DashboardContent />
		}
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardHeader />
			<main className="pb-6">
				<FeatureNavigation onFeatureClick={handleFeatureClick} />
				{renderCurrentView()}
			</main>
		</div>
	)
}

export default function DashboardRoutePage() {
	return (
		<ProtectedRoute>
			<RoadmapProvider>
				<DashboardInner />
			</RoadmapProvider>
		</ProtectedRoute>
	)
}


