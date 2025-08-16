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

export default function DashboardRoutePage() {
  const [currentView, setCurrentView] = useState<string>("dashboard")

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardContent />
      case "roadmap":
        return <RoadmapPage />
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <main className="pb-6">
          <FeatureNavigation onFeatureClick={setCurrentView} />
          {renderCurrentView()}
        </main>
      </div>
    </ProtectedRoute>
  )
}


