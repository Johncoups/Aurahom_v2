"use client"

import {
  Map,
  Clock,
  CheckSquare,
  DollarSign,
  FileText,
  FolderOpen,
  Lightbulb,
  Timer,
  Users,
  LayoutDashboard,
} from "lucide-react"

const features = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", name: "Roadmap", icon: Map },
  { id: "bids", name: "Bids", icon: FileText },
  { id: "schedule", name: "Schedule", icon: Clock },
  { id: "tasks", name: "Tasks", icon: CheckSquare },
  { id: "budget", name: "Budget", icon: DollarSign },
  { id: "documents", name: "Documents", icon: FolderOpen },
  { id: "inspiration", name: "Inspiration", icon: Lightbulb },
  { id: "timeline", name: "Timeline Estimate", icon: Timer },
  { id: "vendors", name: "Vendors", icon: Users },
]

interface FeatureNavigationProps {
  onFeatureClick?: (featureId: string) => void
  activeFeatureId?: string
}

export function FeatureNavigation({ onFeatureClick, activeFeatureId }: FeatureNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {features.map((feature) => {
            const IconComponent = feature.icon
            const isActive = activeFeatureId === feature.id
            return (
              <button
                key={feature.id}
                onClick={() => onFeatureClick?.(feature.id)}
                className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-lg transition-colors group ${
                  isActive ? "bg-cyan-50 text-cyan-700" : "hover:bg-gray-50"
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${isActive ? "bg-cyan-200" : "bg-gray-100 group-hover:bg-cyan-100"}`}>
                  <IconComponent className={`h-5 w-5 ${isActive ? "text-cyan-700" : "text-gray-600 group-hover:text-cyan-600"}`} />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${isActive ? "text-cyan-700" : "text-gray-700"}`}>{feature.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
