"use client"

import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"
import { getPhaseById, getPhasesForMethod } from "@/lib/roadmap-phases"
import { useRoadmap } from "@/contexts/roadmap-context"

interface RoadmapViewProps {
	data: RoadmapData
}

export function RoadmapView({ data }: RoadmapViewProps) {
	const { profile } = useRoadmap();
	
	// Debug logging when component renders
	console.log('🔍 RoadmapView rendered with data:', {
		hasData: !!data,
		hasPhases: !!data?.phases,
		phaseCount: data?.phases?.length || 0,
		hasTimelineEstimates: !!data?.timelineEstimates,
		timelineCount: data?.timelineEstimates?.length || 0,
		hasParsedEstimates: !!data?.parsedTimelineEstimates,
		parsedEstimatesKeys: data?.parsedTimelineEstimates ? Object.keys(data.parsedTimelineEstimates) : [],
		sampleParsedData: data?.parsedTimelineEstimates ? 
			Object.entries(data.parsedTimelineEstimates).slice(0, 2) : 'No parsed data'
	});

	// Debug function to manually trigger data dump
	const triggerDebugDump = () => {
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const filename = `roadmap-view-debug-${timestamp}.txt`;
		
		const debugData = {
			timestamp: new Date().toISOString(),
			profile: profile,
			roadmapData: {
				phases: data.phases?.map(p => ({ id: p.id, title: p.title })) || [],
				hasTimelineEstimates: !!data.timelineEstimates,
				timelineEstimatesCount: data.timelineEstimates?.length || 0,
				hasParsedEstimates: !!data.parsedTimelineEstimates,
				parsedEstimatesKeys: data.parsedTimelineEstimates ? Object.keys(data.parsedTimelineEstimates) : []
			},
			phaseMatching: {
				roadmapPhaseIds: data.phases?.map(p => p.id) || [],
				parsedEstimatesPhaseIds: data.parsedTimelineEstimates ? Object.keys(data.parsedTimelineEstimates) : [],
				matchingPhases: data.phases?.filter(p => 
					data.parsedTimelineEstimates?.[p.id]
				).map(p => p.id) || [],
				missingPhases: data.phases?.filter(p => 
					!data.parsedTimelineEstimates?.[p.id]
				).map(p => p.id) || []
			},
			sampleData: {
				samplePhase: data.phases?.[0] ? {
					id: data.phases[0].id,
					title: data.phases[0].title,
					hasParsedData: !!data.parsedTimelineEstimates?.[data.phases[0].id],
					parsedData: data.parsedTimelineEstimates?.[data.phases[0].id] || 'No parsed data'
				} : 'No phases available',
				sampleParsedEstimate: data.parsedTimelineEstimates ? 
					Object.entries(data.parsedTimelineEstimates).slice(0, 3) : 'No parsed estimates'
			}
		};
		
		const debugText = `=== ROADMAP VIEW DEBUG DUMP ===
Generated: ${debugData.timestamp}

=== USER PROFILE ===
${JSON.stringify(debugData.profile, null, 2)}

=== ROADMAP DATA ===
${JSON.stringify(debugData.roadmapData, null, 2)}

=== PHASE MATCHING ANALYSIS ===
${JSON.stringify(debugData.phaseMatching, null, 2)}

=== SAMPLE DATA ===
${JSON.stringify(debugData.sampleData, null, 2)}

=== FULL ROADMAP PHASES ===
${JSON.stringify(data.phases, null, 2)}

=== FULL PARSED TIMELINE ESTIMATES ===
${JSON.stringify(data.parsedTimelineEstimates, null, 2)}
`;
		
		const blob = new Blob([debugText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		
		console.log(`✅ Roadmap view debug data dumped to file: ${filename}`);
		console.log('🔍 Debug data structure:', debugData);
	};

	return (
		<div className="max-w-6xl mx-auto p-4 space-y-6">
			{/* Debug Button */}
			<div className="flex justify-end">
				<button
					onClick={triggerDebugDump}
					className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
				>
					🐛 Debug: Dump Data to File
				</button>
			</div>
			
			{/* Data Debug Display */}
			<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
				<h3 className="font-semibold text-yellow-800 mb-2">🔍 Data Debug Info</h3>
				<div className="text-sm text-yellow-700 space-y-1">
					<div><strong>Has phases:</strong> {data.phases ? 'Yes' : 'No'} ({data.phases?.length || 0} phases)</div>
					<div><strong>Has timelineEstimates:</strong> {data.timelineEstimates ? 'Yes' : 'No'} ({data.timelineEstimates?.length || 0} estimates)</div>
					<div><strong>Has parsedTimelineEstimates:</strong> {data.parsedTimelineEstimates ? 'Yes' : 'No'}</div>
					<div><strong>Parsed estimates keys:</strong> {data.parsedTimelineEstimates ? Object.keys(data.parsedTimelineEstimates).join(', ') : 'None'}</div>
					<div><strong>Sample parsed data:</strong> {data.parsedTimelineEstimates && Object.keys(data.parsedTimelineEstimates).length > 0 ? 
						JSON.stringify(data.parsedTimelineEstimates[Object.keys(data.parsedTimelineEstimates)[0]], null, 2) : 'None'}</div>
				</div>
			</div>
			
			{/* Timeline Summary Section */}
			{data.timelineEstimates && data.timelineEstimates.length > 0 && (
				<div className="p-6 bg-white rounded-lg border shadow-sm">
					<h2 className="text-xl font-semibold mb-4">Project Timeline Summary</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
						<div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
							<div className="text-2xl font-bold text-green-700">
								{data.phases.reduce((total, phase) => {
									if (phase.id === "just-starting") return total;
									
									const parsedData = data.parsedTimelineEstimates?.[phase.id];
									if (parsedData) {
										const isDIYPhase = profile?.diyPhaseIds.includes(phase.id);
										
										if (isDIYPhase && parsedData.diyDuration) {
											const weeks = parseInt(parsedData.diyDuration.match(/\d+/)?.[0] || '0');
											return total + weeks;
										} else if (parsedData.contractorDuration) {
											const weeks = parseInt(parsedData.contractorDuration.match(/\d+/)?.[0] || '0');
											return total + weeks;
										}
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-green-600">Total Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
							<div className="text-2xl font-bold text-blue-700">
								{data.phases.reduce((total, phase) => {
									if (phase.id === "just-starting") return total;
									
									const isDIYPhase = profile?.diyPhaseIds.includes(phase.id);
									if (isDIYPhase) {
										const parsedData = data.parsedTimelineEstimates?.[phase.id];
										if (parsedData?.diyDuration) {
											const weeks = parseInt(parsedData.diyDuration.match(/\d+/)?.[0] || '0');
											return total + weeks;
										}
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-blue-600">DIY Weeks</div>
						</div>
						
						<div className="text-center p-4 bg-purple-50 border border-purple-200 rounded-lg">
							<div className="text-2xl font-bold text-purple-700">
								{data.phases.reduce((total, phase) => {
									if (phase.id === "just-starting") return total;
									
									const isDIYPhase = profile?.diyPhaseIds.includes(phase.id);
									if (!isDIYPhase) {
										const parsedData = data.parsedTimelineEstimates?.[phase.id];
										if (parsedData?.contractorDuration) {
											const weeks = parseInt(parsedData.contractorDuration.match(/\d+/)?.[0] || '0');
											return total + weeks;
										}
									}
									return total;
								}, 0)}
							</div>
							<div className="text-sm text-purple-700">Contractor Weeks</div>
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
							{/* Hide duration for "Just Starting" phase */}
							{phase.id !== "just-starting" && (() => {
								// Priority 1: Check for parsed timeline data from API
								if (data.parsedTimelineEstimates && profile) {
									const parsedData = data.parsedTimelineEstimates[phase.id];
									
									// Enhanced debugging for this specific phase
									console.log(`🔍 Phase "${phase.title}" (ID: ${phase.id}):`, {
										hasParsedEstimates: !!data.parsedTimelineEstimates,
										parsedEstimatesKeys: Object.keys(data.parsedTimelineEstimates || {}),
										lookingForPhaseId: phase.id,
										foundParsedData: !!parsedData,
										parsedData: parsedData,
										isDIYPhase: profile.diyPhaseIds.includes(phase.id),
										diyPhaseIds: profile.diyPhaseIds
									});
									
									if (parsedData) {
										// Check if this phase is marked as DIY by the user
										const isDIYPhase = profile.diyPhaseIds.includes(phase.id);
										
										if (isDIYPhase && parsedData.diyDuration) {
											// Priority 1: DIY Duration from API
											return (
												<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
													{parsedData.diyDuration}
												</span>
											);
										}
										
										// Priority 2: Contractor Duration from API (if no DIY or user didn't select DIY)
										if (parsedData.contractorDuration) {
											return (
												<span className="text-base px-3 py-1 rounded font-medium bg-purple-100 text-purple-700 border-purple-200">
													{parsedData.contractorDuration}
												</span>
											);
										}
									}
								}
								
								// Priority 3: Baseline estimatedDuration (always available)
								if (phaseInfo?.estimatedDuration) {
									return (
										<span className="text-base px-3 py-1 rounded font-medium bg-blue-50 text-blue-800 border-blue-200">
											{phaseInfo.estimatedDuration}
										</span>
									);
								}
								
								// This should never happen - indicates a problem
								return (
									<span className="text-base px-3 py-1 rounded font-medium bg-red-50 text-red-800 border-red-200">
										Duration Error
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


