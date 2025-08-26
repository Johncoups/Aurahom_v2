"use client"

import { useState } from "react"
import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"
import { getPhasesForMethod, CONSTRUCTION_PHASES } from "@/lib/roadmap-phases"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react"
import { useRoadmap } from "@/contexts/roadmap-context"

interface RoadmapTimelineProps {
	data: RoadmapData
	onPhaseClick?: (phaseId: string) => void
}

export function RoadmapTimeline({ data, onPhaseClick }: RoadmapTimelineProps) {
	const { profile } = useRoadmap()
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())

	const togglePhase = (phaseId: string) => {
		const newExpanded = new Set(expandedPhases)
		if (newExpanded.has(phaseId)) {
			newExpanded.delete(phaseId)
		} else {
			newExpanded.add(phaseId)
		}
		setExpandedPhases(newExpanded)
	}

	const getPhaseStatus = (phase: RoadmapPhase) => {
		// For now, all phases are "pending" - you can add logic later to track completion
		return "pending"
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className="h-5 w-5 text-green-600" />
			case "in-progress":
				return <Clock className="h-5 w-5 text-blue-600" />
			case "blocked":
				return <AlertCircle className="h-5 w-5 text-red-600" />
			default:
				return <Circle className="h-5 w-5 text-gray-400" />
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 border-green-200"
			case "in-progress":
				return "bg-blue-100 text-blue-800 border-blue-200"
			case "blocked":
				return "bg-red-100 text-red-800 border-red-200"
			default:
				return "bg-gray-100 text-gray-800 border-gray-200"
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Timeline</h1>
				<p className="text-gray-600">Your personalized construction roadmap in chronological order</p>
			</div>

			<div className="space-y-6">
				{data.phases.map((phase, index) => {
					// Get the correct phases based on user's construction method
					const userPhases = profile ? getPhasesForMethod(profile.constructionMethod) : CONSTRUCTION_PHASES;
					const phaseInfo = userPhases.find((p: any) => p.id === phase.id)
					const status = getPhaseStatus(phase)
					const isExpanded = expandedPhases.has(phase.id)
					
					if (!phaseInfo) return null

					return (
						<Card 
							key={phase.id} 
							className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
								onPhaseClick ? 'hover:border-blue-300' : ''
							}`}
							onClick={() => onPhaseClick ? onPhaseClick(phase.id) : togglePhase(phase.id)}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
											{phaseInfo.order}
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl text-gray-900 mb-1">
												{phaseInfo.title}
											</CardTitle>
											<p className="text-gray-600 text-sm">
												{phaseInfo.description}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										{/* Timeline Estimate Badge */}
										{data.timelineEstimates && (() => {
											const timelineEstimate = data.timelineEstimates.find(t => t.phaseId === phase.id);
											if (timelineEstimate) {
												const isDIYPhase = timelineEstimate.timeline.toLowerCase().includes('diy phase');
												const durationMatch = timelineEstimate.timeline.match(/.*\*\*Duration\*\*:\s*(\d+)\s*weeks/);
												const contractorMatch = timelineEstimate.timeline.match(/.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/);
												
												if (durationMatch || contractorMatch) {
													const weeks = durationMatch ? durationMatch[1] : contractorMatch![1];
													return (
														<Badge className={`${
															isDIYPhase 
																? 'bg-blue-100 text-blue-700 border-blue-200' 
																: 'bg-purple-100 text-purple-700 border-purple-200'
														}`}>
															{weeks} weeks
														</Badge>
													);
												}
											}
											return null;
										})()}
										
										{getStatusIcon(status)}
										<Badge className={getStatusColor(status)}>
											{status === "completed" ? "Completed" : 
											 status === "in-progress" ? "In Progress" : 
											 status === "blocked" ? "Blocked" : "Pending"}
										</Badge>
									</div>
								</div>
							</CardHeader>

							{isExpanded && (
								<CardContent className="pt-0">
									<div className="border-t pt-4">
										<h4 className="font-semibold text-gray-900 mb-3">Key Tasks</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{phaseInfo.tasks.map((task, taskIndex) => (
												<div key={taskIndex} className="flex items-start gap-2 text-sm text-gray-700">
													<span className="text-blue-500 mt-0.5">•</span>
													<span>{task}</span>
												</div>
											))}
										</div>
										
										{phase.tasks && phase.tasks.length > 0 && (
											<div className="mt-4 pt-4 border-t">
												<h4 className="font-semibold text-gray-900 mb-3">AI-Generated Tasks</h4>
												<div className="text-sm text-gray-600">
													{phase.tasks.length} detailed task{phase.tasks.length !== 1 ? 's' : ''} available
												</div>
											</div>
										)}
									</div>
								</CardContent>
							)}
						</Card>
					)
				})}
			</div>

			{onPhaseClick && (
				<div className="mt-8 text-center text-sm text-gray-500">
					Click on any phase to view detailed information
				</div>
			)}
		</div>
	)
}
