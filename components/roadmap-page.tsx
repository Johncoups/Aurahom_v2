"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Check, Play, MapPin, RefreshCw, Loader2 } from "lucide-react"
import { useRoadmap } from "@/contexts/roadmap-context"
import { RoadmapProvider } from "@/contexts/roadmap-context"
import type { RoadmapPhase, RoadmapTask } from "@/lib/roadmap-types"

function RoadmapPageInner() {
  const { roadmap, profile, isLoading, regeneratePhase } = useRoadmap()
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)
  const [regeneratingPhase, setRegeneratingPhase] = useState<string | null>(null)

  // Auto-expand the first phase if available
  useEffect(() => {
    if (roadmap?.phases && roadmap.phases.length > 0 && !expandedPhase) {
      setExpandedPhase(roadmap.phases[0].id)
    }
  }, [roadmap, expandedPhase])

  const handleRegeneratePhase = async (phaseId: string) => {
    if (!regeneratePhase) return
    
    setRegeneratingPhase(phaseId)
    try {
      await regeneratePhase(phaseId, "high") // Always regenerate with high detail for testing
    } catch (error) {
      console.error('Failed to regenerate phase:', error)
    } finally {
      setRegeneratingPhase(null)
    }
  }

  const getPhaseIcon = (phase: RoadmapPhase) => {
    const hasCompletedTasks = phase.tasks.some(task => task.status === "done")
    const hasInProgressTasks = phase.tasks.some(task => task.status === "doing")
    
    if (hasCompletedTasks && !hasInProgressTasks) {
      return (
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )
    } else if (hasInProgressTasks) {
      return (
        <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center">
          <span className="text-white text-sm font-semibold">{phase.tasks.filter(t => t.status === "done").length}/{phase.tasks.length}</span>
        </div>
      )
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-gray-600 text-sm font-semibold">0/{phase.tasks.length}</span>
        </div>
      )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "text-green-600"
      case "doing":
        return "text-cyan-600"
      default:
        return "text-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "done":
        return "Completed"
      case "doing":
        return "In Progress"
      default:
        return "Not Started"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
          <span className="text-gray-600">Generating your roadmap...</span>
        </div>
      </div>
    )
  }

  if (!roadmap || !roadmap.phases) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-2 rounded-lg bg-cyan-100 inline-block mb-4">
            <MapPin className="h-6 w-6 text-cyan-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Roadmap Available</h1>
          <p className="text-gray-600 mb-6">Please complete the onboarding process to generate your personalized construction roadmap.</p>
          <button 
            onClick={() => window.location.href = '/onboarding'}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-gray-900">AI-Generated Roadmap</h1>
          </div>
          <p className="text-gray-600">
            Your personalized construction roadmap powered by Gemini AI. 
            {profile && (
              <span className="ml-2 text-sm bg-cyan-100 px-2 py-1 rounded">
                {profile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
                  profile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
                  "Owner-builder acting as General Contractor (will self-perform some phases)"} • {profile.experience} level
              </span>
            )}
          </p>
        </div>

        {/* Project Phases Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Construction Phases</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click on any phase to see detailed tasks. AI-enhanced content is marked with a sparkle icon ✨
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {roadmap.phases.map((phase) => (
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
                          <span className={`text-sm ${getStatusColor(phase.tasks.some(t => t.status === "done") ? "done" : phase.tasks.some(t => t.status === "doing") ? "doing" : "todo")}`}>
                            ({getStatusText(phase.tasks.some(t => t.status === "done") ? "done" : phase.tasks.some(t => t.status === "doing") ? "doing" : "todo")})
                          </span>
                          {phase.detailLevel === "high" && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">High Detail</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {phase.tasks.length} tasks • Detail level: {phase.detailLevel}
                        </p>
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
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">Tasks & Steps</h4>
                          <button
                            onClick={() => handleRegeneratePhase(phase.id)}
                            disabled={regeneratingPhase === phase.id}
                            className="flex items-center gap-2 px-3 py-1 text-sm border border-cyan-300 rounded-lg text-cyan-700 hover:bg-cyan-50 transition-colors disabled:opacity-50"
                          >
                            {regeneratingPhase === phase.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RefreshCw className="h-3 w-3" />
                            )}
                            Regenerate with AI
                          </button>
                        </div>

                        <div className="space-y-4">
                          {phase.tasks.map((task) => (
                            <div key={task.id} className="border border-gray-100 rounded-lg p-3">
                              <div className="flex items-start gap-3 mb-2">
                                <div
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                                    task.status === "done" ? "bg-green-600 border-green-600" : 
                                    task.status === "doing" ? "bg-cyan-600 border-cyan-600" : 
                                    "border-gray-300"
                                  }`}
                                >
                                  {task.status === "done" && <Check className="h-3 w-3 text-white" />}
                                  {task.status === "doing" && <span className="text-white text-xs">●</span>}
                                </div>
                                <div className="flex-1">
                                  <h5 className={`font-medium ${task.status === "done" ? "text-gray-900" : "text-gray-700"}`}>
                                    {task.title}
                                  </h5>
                                  {task.notes && (
                                    <p className="text-sm text-purple-600 mt-1 bg-purple-50 p-2 rounded">
                                      ✨ AI Insight: {task.notes}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Task Steps */}
                              {task.steps && task.steps.length > 0 && (
                                <div className="ml-7 space-y-2">
                                  {task.steps.map((step, index) => (
                                    <div key={step.id} className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="text-gray-400 text-xs">{index + 1}.</span>
                                      {step.description}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* QA Checks */}
                              {task.qaChecks && task.qaChecks.length > 0 && (
                                <div className="ml-7 mt-3">
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Quality Checks</h6>
                                  <div className="space-y-1">
                                    {task.qaChecks.map((check, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="text-gray-400 text-xs">✓</span>
                                        {check}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Vendor Questions */}
                              {task.vendorQuestions && task.vendorQuestions.length > 0 && (
                                <div className="ml-7 mt-3">
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Questions for Vendors</h6>
                                  <div className="space-y-1">
                                    {task.vendorQuestions.map((question, index) => (
                                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="text-gray-400 text-xs">?</span>
                                        {question}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
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

export function RoadmapPage() {
  return (
    <RoadmapProvider>
      <RoadmapPageInner />
    </RoadmapProvider>
  )
}
