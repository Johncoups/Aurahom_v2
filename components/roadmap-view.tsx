"use client"

import { useState } from "react"
import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getPhaseById, getPhasesForMethod } from "@/lib/roadmap-phases"

interface RoadmapViewProps {
	data: RoadmapData
	onRegeneratePhase?: (phaseId: string, detailLevel: "low" | "standard" | "high") => void
}

export function RoadmapView({ data, onRegeneratePhase }: RoadmapViewProps) {
	const [detailLevels, setDetailLevels] = useState<Record<string, "low" | "standard" | "high">>(() => {
		const levels: Record<string, "low" | "standard" | "high"> = {}
		data.phases.forEach(phase => {
			levels[phase.id] = phase.detailLevel
		})
		return levels
	})

	const handleDetailLevelChange = (phaseId: string, level: "low" | "standard" | "high") => {
		setDetailLevels(prev => ({ ...prev, [phaseId]: level }))
	}

	return (
		<div className="max-w-6xl mx-auto p-4 space-y-6">
			{data.phases.map(phase => {
				const phaseInfo = getPhaseById(phase.id)
				return (
					<section key={phase.id} className="border rounded-lg p-6 bg-white shadow-sm">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-semibold text-gray-900">
									{phaseInfo?.order}. {phase.title}
								</h2>
								{phaseInfo?.description && (
									<p className="text-gray-600 mt-1">{phaseInfo.description}</p>
								)}
							</div>
							<div className="flex items-center gap-3">
								<Select value={detailLevels[phase.id]} onValueChange={(value: "low" | "standard" | "high") => handleDetailLevelChange(phase.id, value)}>
									<SelectTrigger className="w-32">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="low">Low Detail</SelectItem>
										<SelectItem value="standard">Standard</SelectItem>
										<SelectItem value="high">High Detail</SelectItem>
									</SelectContent>
								</Select>
								{onRegeneratePhase && (
									<Button 
										variant="outline" 
										size="sm"
										onClick={() => onRegeneratePhase(phase.id, detailLevels[phase.id])}
									>
										Regenerate
									</Button>
								)}
							</div>
						</div>

						{/* Phase Subtasks */}
						{phaseInfo?.subtasks && (
							<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
								<h3 className="font-semibold text-blue-900 mb-3">Phase Subtasks</h3>
								<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
									{phaseInfo.subtasks.map((subtask, index) => (
										<li key={index} className="flex items-start gap-2 text-sm text-blue-800">
											<span className="text-blue-600 mt-0.5">•</span>
											<span>{subtask}</span>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* AI-Generated Tasks */}
						<div className="space-y-4">
							<h3 className="font-semibold text-gray-900 border-b pb-2">Detailed Tasks</h3>
							<ul className="space-y-4">
								{phase.tasks.map(task => (
									<li key={task.id} className="border rounded-lg p-4 bg-gray-50">
										<div className="font-medium text-gray-900 mb-3">{task.title}</div>
										
										{task.steps.length > 0 && (
											<div className="mb-3">
												<div className="text-sm font-semibold text-gray-700 mb-2">Steps:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.steps.map(step => (
														<li key={step.id}>{step.description}</li>
													))}
												</ul>
											</div>
										)}

										{task.qaChecks.length > 0 && (
											<div className="mb-3">
												<div className="text-sm font-semibold text-gray-700 mb-2">Quality checks:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.qaChecks.map((q, i) => (
														<li key={i}>{q}</li>
													))}
												</ul>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="bg-white p-3 rounded border">
												<div className="text-sm font-semibold text-gray-700 mb-2">Questions to ask vendors:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.vendorQuestions.map((q, i) => (
														<li key={i}>{q}</li>
													))}
												</ul>
											</div>
											<div className="bg-white p-3 rounded border">
												<div className="text-sm font-semibold text-gray-700 mb-2">What vendors need from you:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.vendorNeeds.map((q, i) => (
														<li key={i}>{q}</li>
													))}
												</ul>
											</div>
										</div>
									</li>
								))}
							</ul>
						</div>
					</section>
				)
			})}
		</div>
	)
}


