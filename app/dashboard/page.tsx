"use client"

import { useState, useEffect } from "react"
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
	const { profile, roadmap, isLoading, regeneratePhase, hasExistingProject, isCheckingProject } = useRoadmap()
	const router = useRouter()

	// Auto-switch to roadmap view when roadmap data becomes available
	useEffect(() => {
		if (currentView === "roadmap" && roadmap && !isLoading) {
			// Roadmap is loaded and ready, view will automatically show it
		}
	}, [currentView, roadmap, isLoading])

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
				// Show loading while checking for existing projects
				if (isCheckingProject) {
					return (
						<div className="max-w-2xl mx-auto p-8 text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
							<p className="text-gray-600">Loading your dashboard...</p>
						</div>
					)
				}
				// Show welcome screen for new users, dashboard for existing users
				if (!hasExistingProject) {
					return (
						<div className="max-w-2xl mx-auto p-8 text-center">
							<h2 className="text-2xl font-bold mb-4">Welcome to Aurahom!</h2>
							<p className="text-gray-600 mb-6">Start building your construction roadmap by completing the onboarding process.</p>
							<Button onClick={() => setCurrentView("roadmap")}>Get Started</Button>
						</div>
					)
				}
				return <DashboardContent />
			case "roadmap":
				if (isLoading) {
					return <div className="max-w-2xl mx-auto p-8 text-center">Generating roadmap...</div>
				}
				if (!roadmap) {
					// Show OnboardingWizard if no roadmap exists
					return <OnboardingWizard onComplete={() => setCurrentView("roadmap")} />
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


