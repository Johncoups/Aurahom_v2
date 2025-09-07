"use client"

import { useState, useEffect } from "react"
import { getPhasesForMethod, getPhaseById } from "@/lib/roadmap-phases"
import type { ConstructionMethod, RoadmapData } from "@/lib/roadmap-types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Timer, AlertTriangle, ChevronDown, ChevronRight, User, Wrench } from "lucide-react"
import { useRoadmap } from "@/contexts/roadmap-context"
import { supabase } from "@/lib/supabase"

interface ConstructionTimelineProps {
	constructionMethod?: ConstructionMethod
	title?: string
	description?: string
	data?: RoadmapData
}

export function ConstructionTimeline({ 
	constructionMethod = "traditional-frame",
	title = "Construction Timeline",
	description = "Standard construction phases in chronological order",
	data
}: ConstructionTimelineProps) {
	const { profile, roadmap } = useRoadmap()
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
	const [timelineEstimates, setTimelineEstimates] = useState<Record<string, any>>({})
	const [regionalContext, setRegionalContext] = useState<any>(null)
	
	// Use provided data or fallback to context data
	const roadmapData = data || roadmap
	const userConstructionMethod = profile?.constructionMethod || constructionMethod
	const phases = getPhasesForMethod(userConstructionMethod)

	// Load timeline estimates and regional context
	useEffect(() => {
		async function loadTimelineData() {
			if (!roadmapData?.parsedTimelineEstimates) return

			// Set timeline estimates from roadmap data
			setTimelineEstimates(roadmapData.parsedTimelineEstimates)

			// Load regional context if available
			try {
				const { data: { user } } = await supabase.auth.getUser()
				if (!user?.id) return

				const { data: roadmapRecords } = await supabase
					.from('roadmap_data')
					.select('raw_api_response')
					.eq('user_id', user.id)
					.eq('raw_api_response->>hybrid_approach', 'true')
					.order('created_at', { ascending: false })
					.limit(1)
					.single()

				if (roadmapRecords?.raw_api_response?.regionalAnalysis) {
					try {
						const regionalData = JSON.parse(roadmapRecords.raw_api_response.regionalAnalysis)
						setRegionalContext(regionalData)
					} catch (error) {
						console.warn('Failed to parse regional analysis:', error)
					}
				}
			} catch (error) {
				console.error('Failed to load regional context:', error)
			}
		}

		loadTimelineData()
	}, [roadmapData])

	const togglePhase = (phaseId: string) => {
		const newExpanded = new Set(expandedPhases)
		if (newExpanded.has(phaseId)) {
			newExpanded.delete(phaseId)
		} else {
			newExpanded.add(phaseId)
		}
		setExpandedPhases(newExpanded)
	}

	const getPhaseStatus = (phaseId: string) => {
		// For now, all phases are "pending" - you can add logic later to track completion
		return "pending"
	}

	const getTimelineEstimate = (phaseId: string) => {
		const estimate = timelineEstimates[phaseId]
		if (!estimate) return null

		const isDIYPhase = profile?.diyPhaseIds?.includes(phaseId)
		
		if (isDIYPhase && estimate.diyDuration) {
			return {
				type: 'diy',
				duration: estimate.diyDuration,
				hours: estimate.diyHours
			}
		} else if (estimate.contractorDuration) {
			return {
				type: 'contractor',
				duration: estimate.contractorDuration
			}
		}
		
		return null
	}

	const getTotalTimeline = () => {
		let totalWeeks = 0
		let diyWeeks = 0
		let contractorWeeks = 0

		phases.forEach(phase => {
			if (phase.id === "just-starting") return
			
			const estimate = getTimelineEstimate(phase.id)
			if (estimate) {
				const weeks = parseInt(estimate.duration.match(/\d+/)?.[0] || '0')
				totalWeeks += weeks
				
				if (estimate.type === 'diy') {
					diyWeeks += weeks
				} else {
					contractorWeeks += weeks
				}
			}
		})

		return { totalWeeks, diyWeeks, contractorWeeks }
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className="h-5 w-5 text-green-600" />
			case "in-progress":
				return <Timer className="h-5 w-5 text-blue-600" />
			case "blocked":
				return <AlertTriangle className="h-5 w-5 text-red-600" />
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

	const timelineSummary = getTotalTimeline()

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="mb-8 text-center">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
				<p className="text-gray-600">{description}</p>
				<Badge variant="outline" className="mt-3">
					{userConstructionMethod.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} Construction
				</Badge>
			</div>

			{/* Timeline Summary */}
			{timelineSummary.totalWeeks > 0 && (
				<div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
					<h2 className="text-xl font-semibold mb-4 text-blue-900">Project Timeline Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="text-center p-4 bg-white rounded-lg border border-blue-100">
							<div className="text-2xl font-bold text-blue-700">{timelineSummary.totalWeeks}</div>
							<div className="text-sm text-blue-600">Total Weeks</div>
						</div>
						<div className="text-center p-4 bg-white rounded-lg border border-blue-100">
							<div className="text-2xl font-bold text-green-700">{timelineSummary.diyWeeks}</div>
							<div className="text-sm text-green-600">DIY Weeks</div>
						</div>
						<div className="text-center p-4 bg-white rounded-lg border border-blue-100">
							<div className="text-2xl font-bold text-purple-700">{timelineSummary.contractorWeeks}</div>
							<div className="text-sm text-purple-600">Contractor Weeks</div>
						</div>
					</div>
					{regionalContext && (
						<div className="mt-4 p-3 bg-white rounded border border-blue-100">
							<p className="text-sm text-blue-700">
								<strong>Regional Context:</strong> {regionalContext.primaryClassification} • {regionalContext.climateZone}
							</p>
						</div>
					)}
				</div>
			)}

			<div className="space-y-4">
				{phases.map((phase) => {
					const status = getPhaseStatus(phase.id)
					const isExpanded = expandedPhases.has(phase.id)
					const timelineEstimate = getTimelineEstimate(phase.id)
					
					return (
						<Card 
							key={phase.id} 
							className="transition-all duration-200 hover:shadow-md"
						>
							<CardHeader 
								className="pb-3 cursor-pointer"
								onClick={() => togglePhase(phase.id)}
							>
								<div className="flex items-start justify-between">
									<div className="flex items-center gap-4">
										<div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold text-lg">
											{phase.order}
										</div>
										<div className="flex-1">
											<CardTitle className="text-xl text-gray-900 mb-1">
												{phase.title}
											</CardTitle>
											<p className="text-gray-600 text-sm">
												{phase.description}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										{/* Timeline Estimate Display */}
										{timelineEstimate && (
											<div className="flex items-center gap-2">
												{timelineEstimate.type === 'diy' ? (
													<div className="flex items-center gap-1 text-green-700">
														<Wrench className="h-4 w-4" />
														<span className="text-sm font-medium">{timelineEstimate.duration}</span>
														{timelineEstimate.hours && (
															<span className="text-xs text-green-600">({timelineEstimate.hours})</span>
														)}
													</div>
												) : (
													<div className="flex items-center gap-1 text-purple-700">
														<User className="h-4 w-4" />
														<span className="text-sm font-medium">{timelineEstimate.duration}</span>
													</div>
												)}
											</div>
										)}
										
										{getStatusIcon(status)}
										<Badge className={getStatusColor(status)}>
											{status === "completed" ? "Completed" : 
											 status === "in-progress" ? "In Progress" : 
											 status === "blocked" ? "Blocked" : "Pending"}
										</Badge>
										{isExpanded ? (
											<ChevronDown className="h-5 w-5 text-gray-400" />
										) : (
											<ChevronRight className="h-5 w-5 text-gray-400" />
										)}
									</div>
								</div>
							</CardHeader>

							{isExpanded && (
								<CardContent className="pt-0">
									<div className="border-t pt-4">
										<h4 className="font-semibold text-gray-900 mb-3">Key Tasks</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{phase.tasks.map((task, taskIndex) => (
												<div key={taskIndex} className="flex items-start gap-2 text-sm text-gray-700">
													<span className="text-blue-500 mt-0.5">•</span>
													<span>{task}</span>
												</div>
											))}
										</div>
									</div>
								</CardContent>
							)}
						</Card>
					)
				})}
			</div>

			<div className="mt-8 text-center text-sm text-gray-500">
				Click on any phase to expand and view key tasks
			</div>
		</div>
	)
}
