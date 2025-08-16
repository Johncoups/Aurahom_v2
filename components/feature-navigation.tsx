"use client"

import {
  Map,
  Calendar,
  CheckSquare,
  DollarSign,
  FileText,
  FolderOpen,
  Lightbulb,
  Clock,
  Users,
  LayoutDashboard,
} from "lucide-react"

const features = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "roadmap", name: "Roadmap", icon: Map },
  { id: "bids", name: "Bids", icon: FileText },
  { id: "schedule", name: "Schedule", icon: Calendar },
  { id: "tasks", name: "Tasks", icon: CheckSquare },
  { id: "budget", name: "Budget", icon: DollarSign },
  { id: "documents", name: "Documents", icon: FolderOpen },
  { id: "inspiration", name: "Inspiration", icon: Lightbulb },
  { id: "timeline", name: "Timeline Estimate", icon: Clock },
  { id: "vendors", name: "Vendors", icon: Users },
]

interface FeatureNavigationProps {
  onFeatureClick?: (featureId: string) => void
}

export function FeatureNavigation({ onFeatureClick }: FeatureNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {features.map((feature) => {
            const IconComponent = feature.icon
            return (
              <button
                key={feature.id}
                onClick={() => onFeatureClick?.(feature.id)}
                className="flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-cyan-100 transition-colors">
                  <IconComponent className="h-5 w-5 text-gray-600 group-hover:text-cyan-600" />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{feature.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
