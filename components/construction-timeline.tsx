"use client"

import { useState } from "react"
import { getPhasesForMethod, getPhaseById } from "@/lib/roadmap-phases"
import type { ConstructionMethod } from "@/lib/roadmap-types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight } from "lucide-react"

interface ConstructionTimelineProps {
	constructionMethod?: ConstructionMethod
	title?: string
	description?: string
}

export function ConstructionTimeline({ 
	constructionMethod = "traditional-frame",
	title = "Construction Timeline",
	description = "Standard construction phases in chronological order"
}: ConstructionTimelineProps) {
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
	const phases = getPhasesForMethod(constructionMethod)

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
				<h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
				<p className="text-gray-600">{description}</p>
				<Badge variant="outline" className="mt-3">
					{constructionMethod.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())} Construction
				</Badge>
			</div>

			<div className="space-y-4">
				{phases.map((phase) => {
					const status = getPhaseStatus(phase.id)
					const isExpanded = expandedPhases.has(phase.id)
					
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
											{phase.subtasks.map((subtask, subtaskIndex) => (
												<div key={subtaskIndex} className="flex items-start gap-2 text-sm text-gray-700">
													<span className="text-blue-500 mt-0.5">•</span>
													<span>{subtask}</span>
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
