"use client"


import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"

import { getPhaseById, getPhasesForMethod } from "@/lib/roadmap-phases"
import { useRoadmap } from "@/contexts/roadmap-context"

interface RoadmapViewProps {
	data: RoadmapData
}

export function RoadmapView({ data }: RoadmapViewProps) {
	const { profile } = useRoadmap();


	return (
		<div className="max-w-6xl mx-auto p-4 space-y-6">
			{/* Timeline Summary Section */}
			{data.timelineEstimates && data.timelineEstimates.length > 0 && (
				<div className="p-6 bg-white rounded-lg border shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Project Timeline Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="text-2xl font-bold text-green-700">
								{data.timelineEstimates.reduce((total, phase) => {
									// Check if this is a DIY phase by looking at the phase title
									const isDIYPhase = phase.phaseTitle.toLowerCase().includes('diy');
									
									if (isDIYPhase) {
										// For DIY phases, look for duration
										const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
										const durationMatch = phase.timeline.match(durationPattern);
										return total + (durationMatch ? parseInt(durationMatch[1]) : 0);
									} else {
										// For contractor phases, look for Contractor Duration
										const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
										const contractorMatch = phase.timeline.match(contractorPattern);
										return total + (contractorMatch ? parseInt(contractorMatch[1]) : 0);
									}
								}, 0)}
							</div>
							<div className="text-sm text-green-600">Total Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="text-2xl font-bold text-blue-700">
								{data.timelineEstimates.reduce((total, phase) => {
									// Only count DIY phases
									const isDIYPhase = phase.phaseTitle.toLowerCase().includes('diy');
									if (isDIYPhase) {
										const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
										const durationMatch = phase.timeline.match(durationPattern);
										return total + (durationMatch ? parseInt(durationMatch[1]) : 0);
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-blue-600">DIY Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
							<div className="text-2xl font-bold text-purple-700">
								{data.timelineEstimates.reduce((total, phase) => {
									// Only count contractor phases
									const isDIYPhase = phase.phaseTitle.toLowerCase().includes('diy');
									if (!isDIYPhase) {
										const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
										const contractorMatch = phase.timeline.match(contractorPattern);
										return total + (contractorMatch ? parseInt(contractorMatch[1]) : 0);
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-purple-700">Contractor Weeks</div>
						</div>
					</div>
					
					{/* Detailed Timeline Breakdown */}
					<div className="mt-6">
						<h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Timeline Breakdown</h3>
						<div className="space-y-4">
							{data.timelineEstimates.map((phase, index) => {
								const phaseTitle = phase.phaseTitle.replace(' - Timeline Estimate', '');
								
								return (
									<div key={index} className="border border-gray-200 rounded-lg">
										<div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors">
											<h4 className="text-lg font-semibold text-gray-900">{phaseTitle}</h4>
											<div className="flex items-center gap-3">
												{/* Duration Badge */}
												<span className="text-sm px-3 py-1 rounded font-medium bg-blue-100 text-blue-700 border-blue-200">
													{(() => {
														const durationMatch = phase.timeline.match(/.*\*\*Duration\*\*:\s*(\d+)\s*weeks/);
														const contractorMatch = phase.timeline.match(/.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/);
														
														if (durationMatch) return `${durationMatch[1]} weeks`;
														if (contractorMatch) return `${contractorMatch[1]} weeks`;
														return 'Duration not available';
													})()}
												</span>
											</div>
										</div>
										
										{/* Timeline Details */}
										<div className="px-4 pb-4">
											<div className="bg-gray-50 p-3 rounded text-sm">
												{phase.timeline.split('\n').map((line, lineIndex) => {
													const trimmedLine = line.trim();
													
													// Check if line starts with a number
													if (/^\d+\./.test(trimmedLine)) {
														return (
															<div key={lineIndex} className="mb-2 pl-6 border-l-2 border-blue-200">
																<span className="text-gray-700">{trimmedLine}</span>
															</div>
														);
													} else if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 3 && !/^\d/.test(trimmedLine)) {
														// Section headers (all caps, not numbers)
														return (
															<div key={lineIndex} className="mt-4 mb-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">
																{trimmedLine}
															</div>
														);
													} else {
														// Regular body text
														return (
															<div key={lineIndex} className="mb-2 pl-4 text-gray-700">
																{trimmedLine}
															</div>
														);
													}
												})}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}
			
			{data.phases && data.phases.length > 0 ? data.phases.map(phase => {
				const phaseInfo = getPhaseById(phase.id)
				return (
					<section key={phase.id || `phase-${Math.random()}`} className="border rounded-lg p-6 bg-white shadow-sm">
						<div className="flex items-center justify-between mb-6">
							<div>
								<h2 className="text-2xl font-semibold text-gray-900">
									{phase.title}
								</h2>
								{phaseInfo?.description && (
									<p className="text-gray-600 mt-1">{phaseInfo.description}</p>
								)}
							</div>
							

							
							{/* Duration Display - Moved to right side */}
							{(() => {
								// Safely access timeline text with proper null checks
								const timelineText = phase.tasks && phase.tasks.length > 0 && phase.tasks[0]?.notes ? phase.tasks[0].notes : '';
								
								if (timelineText && profile) {
									// Check if this phase is a DIY phase by looking at the phase title
									const phaseTitle = phase.title.toLowerCase();
									const isDIYPhase = profile.diyPhaseIds.some(diyPhase => {
										const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
										return phaseTitle.includes(diyPhaseFormatted);
									});
									
									if (isDIYPhase) {
										// For DIY phases, look for duration in clean format (brackets already removed)
										const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
										const durationMatch = timelineText.match(durationPattern);
										
										if (durationMatch) {
											return (
												<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
													{`${durationMatch[1]} weeks`}
												</span>
											);
										}
										
										// Fallback: look for DIY hours and calculate weeks
										const hoursPattern = /.*\*\*DIY Hours\*\*:\s*(\d+)\s*hours/;
										const hoursMatch = timelineText.match(hoursPattern);
										
										if (hoursMatch) {
											const totalHours = parseInt(hoursMatch[1]);
											const weeklyCommitment = parseInt(profile.weeklyHourlyCommitment);
											const calculatedWeeks = Math.ceil(totalHours / weeklyCommitment);
											return (
												<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
													{`${calculatedWeeks} weeks`}
												</span>
											);
										}
									} else {
										// For contractor phases, only look for Contractor Duration
										const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
										const contractorMatch = timelineText.match(contractorPattern);
										
										if (contractorMatch) {
											return (
												<span className="text-base px-3 py-1 rounded font-medium bg-purple-100 text-purple-700 border-purple-200">
													{`${contractorMatch[1]} weeks`}
												</span>
											);
										}
									}
								}
								
								// Fallback to baseline estimatedDuration if no AI timeline data
								if (phaseInfo?.estimatedDuration) {
									return (
										<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
											{phaseInfo.estimatedDuration}
										</span>
									);
								}
								
								// Show "Duration not available" with matching styling
								return (
									<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
										Duration not available
									</span>
								);
							})()}
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
							{phase.tasks && phase.tasks.length > 0 ? (
								<ul className="space-y-4">
									{phase.tasks.map(task => (
									<li key={task.id} className="border rounded-lg p-4 bg-gray-50">
										<div className="font-medium text-gray-900 mb-3">{task.title || 'Untitled Task'}</div>
										
										{task.steps && task.steps.length > 0 && (
											<div className="mb-3">
												<div className="text-sm font-semibold text-gray-700 mb-2">Steps:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.steps.map(step => (
														<li key={step.id}>{step.description || 'Step description not available'}</li>
													))}
												</ul>
											</div>
										)}

										{task.qaChecks && task.qaChecks.length > 0 && (
											<div className="mb-3">
												<div className="text-sm font-semibold text-gray-700 mb-2">Quality checks:</div>
												<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
													{task.qaChecks.map((q, i) => (
														<li key={i}>{q || 'Quality check not available'}</li>
													))}
												</ul>
											</div>
										)}

										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div className="bg-white p-3 rounded border">
												<div className="text-sm font-semibold text-gray-700 mb-2">Questions to ask vendors:</div>
												{task.vendorQuestions && task.vendorQuestions.length > 0 ? (
													<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
														{task.vendorQuestions.map((q, i) => (
														<li key={i}>{q}</li>
													))}
													</ul>
												) : (
													<p className="text-gray-500 text-sm">No vendor questions available</p>
												)}
											</div>
											<div className="bg-white p-3 rounded border">
												<div className="text-sm font-semibold text-gray-700 mb-2">What vendors need from you:</div>
												{task.vendorNeeds && task.vendorNeeds.length > 0 ? (
													<ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
														{task.vendorNeeds.map((q, i) => (
														<li key={i}>{q}</li>
													))}
													</ul>
												) : (
													<p className="text-gray-500 text-sm">No vendor requirements available</p>
												)}
											</div>
										</div>
									</li>
								))}
								</ul>
							) : (
								<div className="text-gray-500 text-center py-8">
									<p>No detailed tasks available for this phase.</p>
									<p className="text-sm mt-2">Tasks will be generated when you select this phase for AI enhancement.</p>
								</div>
							)}
						</div>
					</section>
				)
			}) : (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No roadmap phases available.</p>
					<p className="text-gray-400 text-sm mt-2">Please generate a roadmap to see construction phases.</p>
				</div>
			)}
		</div>
	)
}


