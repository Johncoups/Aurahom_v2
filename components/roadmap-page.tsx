"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Check, Play, MapPin } from "lucide-react"

const phases = [
  {
    id: 1,
    title: "Phase 1: Planning & Design",
    status: "Completed",
    description: "Finalize architectural plans, secure necessary permits, and define the project budget and timeline.",
    tasks: [
      { id: 1, text: "Create blueprint", completed: true },
      { id: 2, text: "Hire architect", completed: true },
      { id: 3, text: "Get permits", completed: true },
    ],
  },
  {
    id: 2,
    title: "Phase 2: Foundation & Framing",
    status: "In Progress",
    description: "Excavate the site, pour the foundation, and construct the basic frame structure of the house.",
    tasks: [
      { id: 1, text: "Site excavation", completed: true },
      { id: 2, text: "Pour foundation", completed: true },
      { id: 3, text: "Frame construction", completed: false },
      { id: 4, text: "Roof installation", completed: false },
    ],
  },
  {
    id: 3,
    title: "Phase 3: Exterior & Interior Rough-in",
    status: "Upcoming",
    description: "Install plumbing, electrical, and HVAC systems. Complete exterior siding and roofing work.",
    tasks: [
      { id: 1, text: "Plumbing rough-in", completed: false },
      { id: 2, text: "Electrical rough-in", completed: false },
      { id: 3, text: "HVAC installation", completed: false },
      { id: 4, text: "Exterior siding", completed: false },
    ],
  },
  {
    id: 4,
    title: "Phase 4: Interior Finishes",
    status: "Upcoming",
    description:
      "Install drywall, flooring, paint, and interior fixtures. Complete kitchen and bathroom installations.",
    tasks: [
      { id: 1, text: "Drywall installation", completed: false },
      { id: 2, text: "Flooring installation", completed: false },
      { id: 3, text: "Interior painting", completed: false },
      { id: 4, text: "Kitchen installation", completed: false },
    ],
  },
  {
    id: 5,
    title: "Phase 5: Final Fixtures & Landscaping",
    status: "Upcoming",
    description: "Install final fixtures, complete landscaping, and conduct final inspections and walkthrough.",
    tasks: [
      { id: 1, text: "Light fixtures", completed: false },
      { id: 2, text: "Landscaping", completed: false },
      { id: 3, text: "Final inspection", completed: false },
      { id: 4, text: "Final walkthrough", completed: false },
    ],
  },
]

export function RoadmapPage() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1)

  const getPhaseIcon = (phase: (typeof phases)[0]) => {
    if (phase.status === "Completed") {
      return (
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )
    } else if (phase.status === "In Progress") {
      return (
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{phase.id}</span>
        </div>
      )
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-sm font-semibold">{phase.id}</span>
        </div>
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600"
      case "In Progress":
        return "text-cyan-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-100">
              <MapPin className="h-6 w-6 text-cyan-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Roadmap</h1>
          </div>
          <p className="text-gray-600">Your step-by-step guide to a successful project.</p>
        </div>

        {/* Project Phases Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Project Phases</h2>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {phases.map((phase) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getPhaseIcon(phase)}
                      <div className="text-left">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                          <span className={`text-sm ${getStatusColor(phase.status)}`}>({phase.status})</span>
                        </div>
                      </div>
                    </div>
                    {expandedPhase === phase.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {expandedPhase === phase.id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="ml-12 pt-4">
                        <p className="text-gray-600 mb-4">{phase.description}</p>

                        <div className="space-y-2 mb-4">
                          {phase.tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-3">
                              <div
                                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  task.completed ? "bg-cyan-600 border-cyan-600" : "border-gray-300"
                                }`}
                              >
                                {task.completed && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <span className={`text-sm ${task.completed ? "text-gray-900" : "text-gray-600"}`}>
                                {task.text}
                              </span>
                            </div>
                          ))}
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                          <Play className="h-4 w-4" />
                          <span className="text-sm font-medium">Watch Video</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
