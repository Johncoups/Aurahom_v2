"use client"

import { useState, useEffect } from "react"
import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"
import { getPhasesForMethod, CONSTRUCTION_PHASES } from "@/lib/roadmap-phases"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Timer, AlertTriangle, User, Wrench, ChevronDown, ChevronRight } from "lucide-react"
import { useRoadmap } from "@/contexts/roadmap-context"
import { supabase } from "@/lib/supabase"

interface RoadmapTimelineProps {
	data: RoadmapData
	onPhaseClick?: (phaseId: string) => void
}

export function RoadmapTimeline({ data, onPhaseClick }: RoadmapTimelineProps) {
	const { profile } = useRoadmap()
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
	const [timelineEstimates, setTimelineEstimates] = useState<Record<string, any>>({})
	const [regionalContext, setRegionalContext] = useState<any>(null)
	const [expertInsights, setExpertInsights] = useState<Record<string, any>>({})

	// Load hybrid data for enhanced display
	useEffect(() => {
		async function loadHybridData() {
			try {
				const { data: { user } } = await supabase.auth.getUser()
				if (!user?.id) return

				// Get the most recent roadmap data to check for hybrid approach
				const { data: roadmapRecords } = await supabase
					.from('roadmap_data')
					.select('raw_api_response')
					.eq('user_id', user.id)
					.eq('raw_api_response->>hybrid_approach', 'true')
					.order('created_at', { ascending: false })
					.limit(1)
					.single()

				if (roadmapRecords?.raw_api_response) {
					const rawResponse = roadmapRecords.raw_api_response
					
					// Parse regional analysis if available
					if (rawResponse.regionalAnalysis) {
						try {
							const regionalData = JSON.parse(rawResponse.regionalAnalysis)
							setRegionalContext(regionalData)
						} catch (error) {
							console.warn('Failed to parse regional analysis:', error)
						}
					}

					// Parse phase responses for expert insights
					if (rawResponse.phaseResponses) {
						const insights: Record<string, any> = {}
						for (const [phaseId, rawPhaseResponse] of Object.entries(rawResponse.phaseResponses)) {
							try {
								const phaseData = JSON.parse(rawPhaseResponse as string)
								if (phaseData.expertInsights) {
									insights[phaseId] = phaseData.expertInsights
								}
							} catch (error) {
								console.warn(`Failed to parse phase response for ${phaseId}:`, error)
							}
						}
						setExpertInsights(insights)
					}
				}

				// Set timeline estimates from roadmap data
				if (data.parsedTimelineEstimates) {
					setTimelineEstimates(data.parsedTimelineEstimates)
				}
			} catch (error) {
				console.error('Failed to load hybrid data:', error)
			}
		}

		loadHybridData()
	}, [data])

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

	const getTimelineEstimate = (phaseId: string) => {
		const estimate = timelineEstimates[phaseId]
		if (!estimate) return null

		const isDIYPhase = profile?.diyPhaseIds?.includes(phaseId) || false
		
		// For DIY phases, prioritize DIY duration data
		if (isDIYPhase) {
			if (estimate.diyDuration) {
				return {
					type: 'diy',
					duration: estimate.diyDuration,
					hours: estimate.diyHours
				}
			}
			// If DIY phase but no DIY duration data, return null (don't show contractor duration)
			return null
		}
		
		// For contractor phases, show contractor duration
		if (estimate.contractorDuration) {
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

		data.phases.forEach(phase => {
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
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Timeline</h1>
				<p className="text-gray-600">Your personalized construction roadmap in chronological order</p>
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

			<div className="space-y-6">
				{data.phases.map((phase, index) => {
					// Get the correct phases based on user's construction method
					const userPhases = profile ? getPhasesForMethod(profile.constructionMethod) : CONSTRUCTION_PHASES;
					const phaseInfo = userPhases.find((p: any) => p.id === phase.id)
					const status = getPhaseStatus(phase)
					const isExpanded = expandedPhases.has(phase.id)
					const timelineEstimate = getTimelineEstimate(phase.id)
					
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
										{/* Enhanced Timeline Estimate Display */}
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
										
										{!onPhaseClick && (
											isExpanded ? (
												<ChevronDown className="h-5 w-5 text-gray-400" />
											) : (
												<ChevronRight className="h-5 w-5 text-gray-400" />
											)
										)}
									</div>
								</div>
							</CardHeader>

							{isExpanded && (
								<CardContent className="pt-0">
									<div className="border-t pt-4">
										{/* Expert Insights from Hybrid Approach */}
										{expertInsights[phase.id] && (
											<div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
												<h4 className="font-semibold text-green-900 mb-3">Expert Insights</h4>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													{expertInsights[phase.id].proTips && expertInsights[phase.id].proTips.length > 0 && (
														<div className="bg-white p-3 rounded border border-green-100">
															<h5 className="font-medium text-green-800 mb-2">Pro Tips</h5>
															<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
																{expertInsights[phase.id].proTips.map((tip: string, i: number) => (
																	<li key={i}>{tip}</li>
																))}
															</ul>
														</div>
													)}
													
													{expertInsights[phase.id].commonMistakes && expertInsights[phase.id].commonMistakes.length > 0 && (
														<div className="bg-white p-3 rounded border border-green-100">
															<h5 className="font-medium text-green-800 mb-2">Common Mistakes to Avoid</h5>
															<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
																{expertInsights[phase.id].commonMistakes.map((mistake: string, i: number) => (
																	<li key={i}>{mistake}</li>
																))}
															</ul>
														</div>
													)}
													
													{expertInsights[phase.id].costSavingTips && expertInsights[phase.id].costSavingTips.length > 0 && (
														<div className="bg-white p-3 rounded border border-green-100">
															<h5 className="font-medium text-green-800 mb-2">Cost-Saving Tips</h5>
															<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
																{expertInsights[phase.id].costSavingTips.map((tip: string, i: number) => (
																	<li key={i}>{tip}</li>
																))}
															</ul>
														</div>
													)}
													
													{expertInsights[phase.id].qualityCheckpoints && expertInsights[phase.id].qualityCheckpoints.length > 0 && (
														<div className="bg-white p-3 rounded border border-green-100">
															<h5 className="font-medium text-green-800 mb-2">Quality Checkpoints</h5>
															<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
																{expertInsights[phase.id].qualityCheckpoints.map((checkpoint: string, i: number) => (
																	<li key={i}>{checkpoint}</li>
																))}
															</ul>
														</div>
													)}
												</div>
											</div>
										)}

										<h4 className="font-semibold text-gray-900 mb-3">Key Tasks</h4>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											{phaseInfo.tasks.map((task, taskIndex) => (
												<div key={taskIndex} className="flex items-start gap-2 text-sm text-gray-700">
													<span className="text-blue-500 mt-0.5">•</span>
													<span>{task}</span>
												</div>
											))}
										</div>
										
										{/* Helpful Information - QA Checks, Vendor Questions, Vendor Needs */}
										{phaseInfo?.helpfulInformation && phaseInfo.helpfulInformation.length > 0 && (
											<div className="mt-6 pt-4 border-t">
												<h4 className="font-semibold text-gray-900 mb-4">Helpful Information</h4>
												
												<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
													<div className="bg-white p-4 rounded border">
														<div className="text-sm font-semibold text-gray-700 mb-3">Questions to ask vendors:</div>
														<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
															{phaseInfo.helpfulInformation
																?.filter(info => info.toLowerCase().includes('quote') || info.toLowerCase().includes('compare'))
																?.map((info, i) => (
																	<li key={i}>{info}</li>
																))
															}
														</ul>
													</div>
													<div className="bg-white p-4 rounded border">
														<div className="text-sm font-semibold text-gray-700 mb-3">What vendors need from you:</div>
														<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
															{phaseInfo.helpfulInformation
																?.filter(info => info.toLowerCase().includes('research') || info.toLowerCase().includes('create') || info.toLowerCase().includes('apply'))
																?.map((info, i) => (
																	<li key={i}>{info}</li>
																))
															}
														</ul>
													</div>
												</div>
												
												<div className="bg-white p-4 rounded border mt-4">
													<div className="text-sm font-semibold text-gray-700 mb-3">Quality checks:</div>
													<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
														{phaseInfo.helpfulInformation
															?.filter(info => !info.toLowerCase().includes('quote') && !info.toLowerCase().includes('compare') && !info.toLowerCase().includes('research') && !info.toLowerCase().includes('create') && !info.toLowerCase().includes('apply'))
															?.map((info, i) => (
																<li key={i}>{info}</li>
															))
														}
													</ul>
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
