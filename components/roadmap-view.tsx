"use client"

import { useState, useEffect } from "react"
import type { RoadmapData, RoadmapPhase } from "@/lib/roadmap-types"
import { getPhaseById, getPhasesForMethod, CONSTRUCTION_PHASES } from "@/lib/roadmap-phases"
import { useRoadmap } from "@/contexts/roadmap-context"
import { supabase } from "@/lib/supabase"

interface RoadmapViewProps {
	data: RoadmapData
}

export function RoadmapView({ data }: RoadmapViewProps) {
	const { profile } = useRoadmap();
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
	const [regionalContext, setRegionalContext] = useState<any>(null);
	const [expertInsights, setExpertInsights] = useState<Record<string, any>>({});
	
	// Load hybrid data for enhanced display
	useEffect(() => {
		async function loadHybridData() {
			try {
				const { data: { user } } = await supabase.auth.getUser();
				if (!user?.id) return;

				// Get the most recent roadmap data to check for hybrid approach
				const { data: roadmapRecords } = await supabase
					.from('roadmap_data')
					.select('raw_api_response, project_id')
					.eq('user_id', user.id)
					.eq('raw_api_response->>hybrid_approach', 'true')
					.order('created_at', { ascending: false })
					.limit(1)
					.single();

				if (roadmapRecords?.raw_api_response) {
					const rawResponse = roadmapRecords.raw_api_response;
					
					// Parse regional analysis if available
					if (rawResponse.regionalAnalysis) {
						try {
							const regionalData = JSON.parse(rawResponse.regionalAnalysis);
							setRegionalContext(regionalData);
						} catch (error) {
							console.warn('Failed to parse regional analysis:', error);
						}
					}

					// Parse phase responses for expert insights
					if (rawResponse.phaseResponses) {
						const insights: Record<string, any> = {};
						for (const [phaseId, rawPhaseResponse] of Object.entries(rawResponse.phaseResponses)) {
							try {
								const phaseData = JSON.parse(rawPhaseResponse as string);
								if (phaseData.expertInsights) {
									insights[phaseId] = phaseData.expertInsights;
								}
							} catch (error) {
								console.warn(`Failed to parse phase response for ${phaseId}:`, error);
							}
						}
						setExpertInsights(insights);
					}
				}
			} catch (error) {
				console.error('Failed to load hybrid data:', error);
			}
		}

		loadHybridData();
	}, []);

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
			Object.entries(data.parsedTimelineEstimates).slice(0, 2) : 'No parsed data',
		hasRegionalContext: !!regionalContext,
		expertInsightsCount: Object.keys(expertInsights).length
	});

	const togglePhase = (phaseId: string) => {
		setExpandedPhases(prev => {
			const newSet = new Set(prev);
			if (newSet.has(phaseId)) {
				newSet.delete(phaseId);
			} else {
				newSet.add(phaseId);
			}
			return newSet;
		});
	};

	return (
		<div className="max-w-6xl mx-auto p-4 space-y-6">
			
			{/* Timeline Summary Section */}
			{data.parsedTimelineEstimates && Object.keys(data.parsedTimelineEstimates).length > 0 && (
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

			{/* Regional Context Section */}
			{regionalContext && (
				<div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
					<h2 className="text-xl font-semibold mb-4 text-blue-900">Regional Context & Insights</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{regionalContext.primaryClassification && (
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<h3 className="font-semibold text-blue-800 mb-2">Region Classification</h3>
								<p className="text-blue-700">{regionalContext.primaryClassification}</p>
								{regionalContext.secondaryClassifications && regionalContext.secondaryClassifications.length > 0 && (
									<div className="mt-2">
										<p className="text-sm text-blue-600">Additional factors:</p>
										<ul className="list-disc pl-5 text-sm text-blue-600">
											{regionalContext.secondaryClassifications?.map((classification: string, index: number) => (
												<li key={index}>{classification}</li>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
						
						{regionalContext.climateZone && (
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<h3 className="font-semibold text-blue-800 mb-2">Climate Zone</h3>
								<p className="text-blue-700">{regionalContext.climateZone}</p>
							</div>
						)}

						{regionalContext.seasonalFactors && (
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<h3 className="font-semibold text-blue-800 mb-2">Seasonal Considerations</h3>
								<div className="space-y-2 text-sm text-blue-700">
									{regionalContext.seasonalFactors.winterLimitations && (
										<p>❄️ Winter construction limitations</p>
									)}
									{regionalContext.seasonalFactors.summerChallenges && (
										<p>☀️ Summer construction challenges</p>
									)}
									{regionalContext.seasonalFactors.optimalConstructionMonths && regionalContext.seasonalFactors.optimalConstructionMonths.length > 0 && (
										<div>
											<p className="font-medium">Optimal months:</p>
											<p>{regionalContext.seasonalFactors.optimalConstructionMonths.join(', ')}</p>
										</div>
									)}
								</div>
							</div>
						)}

						{regionalContext.regulatoryEnvironment && (
							<div className="bg-white p-4 rounded-lg border border-blue-100">
								<h3 className="font-semibold text-blue-800 mb-2">Regulatory Environment</h3>
								<div className="space-y-2 text-sm text-blue-700">
									<p><strong>Permit Complexity:</strong> {regionalContext.regulatoryEnvironment.permitComplexity}</p>
									<p><strong>Inspection Frequency:</strong> {regionalContext.regulatoryEnvironment.inspectionFrequency}</p>
									<p><strong>Code Strictness:</strong> {regionalContext.regulatoryEnvironment.codeStrictness}</p>
									{regionalContext.regulatoryEnvironment.specialRequirements && regionalContext.regulatoryEnvironment.specialRequirements.length > 0 && (
										<div>
											<p className="font-medium">Special Requirements:</p>
											<ul className="list-disc pl-5">
												{regionalContext.regulatoryEnvironment.specialRequirements?.map((req: string, index: number) => (
													<li key={index}>{req}</li>
												))}
											</ul>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
			
			{data.phases && data.phases.length > 0 ? (data.phases
				// Filter out roofing phase for Post Frame construction since it's covered in post-frame-structure
				.filter(phase => {
					if (profile?.constructionMethod === "post-frame" && phase.id === "roofing") {
						return false;
					}
					return true;
				})
				.map(phase => {
				// Get the correct phases based on user's construction method
				const userPhases = profile ? getPhasesForMethod(profile.constructionMethod) : CONSTRUCTION_PHASES;
				const phaseInfo = userPhases.find((p: any) => p.id === phase.id);
				
				// Debug logging for phase info lookup
				console.log(`🔍 Phase lookup for "${phase.title}" (ID: ${phase.id}):`, {
					constructionMethod: profile?.constructionMethod,
					userPhasesCount: userPhases.length,
					phaseInfoFound: !!phaseInfo,
					phaseInfoOrder: phaseInfo?.order,
					phaseInfoTitle: phaseInfo?.title
				});
				return (
					<section key={phase.id} className="border rounded-lg p-6 bg-white shadow-sm">
						<div 
							className="flex items-center justify-between mb-6 cursor-pointer hover:bg-gray-100 p-3 rounded-lg transition-all duration-200 ease-in-out"
							onClick={() => togglePhase(phase.id)}
						>
							<div className="flex-1">
								{/* Phase Number Badge */}
								<div className="flex items-center gap-3 mb-2">
									<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
										<span className="text-lg font-bold text-blue-600" style={{
											textShadow: '0 0 8px rgba(147, 51, 234, 0.6), 0 0 4px rgba(147, 51, 234, 0.4)'
										}}>
											{phaseInfo?.order !== undefined ? phaseInfo.order : (phase.id === 'just-starting' ? 0 : '?')}
										</span>
									</div>
									<h2 className="text-2xl font-semibold text-gray-900">
										{phase.title}
									</h2>
								</div>
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

						{/* Accordion Content - Tasks and AI-Generated Content */}
						{expandedPhases.has(phase.id) && (
							<div className="space-y-6">
								{/* Tasks */}
								{phaseInfo?.tasks && (
									<div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
										<h3 className="font-semibold text-blue-900 mb-3">Tasks</h3>
										<ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
											{phaseInfo.tasks?.map((task: any, index: number) => (
												<li key={index} className="flex items-start gap-2 text-sm text-blue-800">
													<span className="text-blue-600 mt-0.5">•</span>
													<span>{task}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Expert Insights from Hybrid Approach */}
								{expertInsights[phase.id] && (
									<div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
										<h3 className="font-semibold text-green-900 mb-3">Expert Insights</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{expertInsights[phase.id].proTips && expertInsights[phase.id].proTips.length > 0 && (
												<div className="bg-white p-3 rounded border border-green-100">
													<h4 className="font-medium text-green-800 mb-2">Pro Tips</h4>
													<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
														{expertInsights[phase.id].proTips?.map((tip: string, i: number) => (
															<li key={i}>{tip}</li>
														))}
													</ul>
												</div>
											)}
											
											{expertInsights[phase.id].commonMistakes && expertInsights[phase.id].commonMistakes.length > 0 && (
												<div className="bg-white p-3 rounded border border-green-100">
													<h4 className="font-medium text-green-800 mb-2">Common Mistakes to Avoid</h4>
													<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
														{expertInsights[phase.id].commonMistakes?.map((mistake: string, i: number) => (
															<li key={i}>{mistake}</li>
														))}
													</ul>
												</div>
											)}
											
											{expertInsights[phase.id].costSavingTips && expertInsights[phase.id].costSavingTips.length > 0 && (
												<div className="bg-white p-3 rounded border border-green-100">
													<h4 className="font-medium text-green-800 mb-2">Cost-Saving Tips</h4>
													<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
														{expertInsights[phase.id].costSavingTips?.map((tip: string, i: number) => (
															<li key={i}>{tip}</li>
														))}
													</ul>
												</div>
											)}
											
											{expertInsights[phase.id].qualityCheckpoints && expertInsights[phase.id].qualityCheckpoints.length > 0 && (
												<div className="bg-white p-3 rounded border border-green-100">
													<h4 className="font-medium text-green-800 mb-2">Quality Checkpoints</h4>
													<ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
														{expertInsights[phase.id].qualityCheckpoints?.map((checkpoint: string, i: number) => (
															<li key={i}>{checkpoint}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Helpful Information from Hardcoded Data */}
								{phaseInfo?.helpfulInformation && phaseInfo.helpfulInformation.length > 0 && (
									<div className="space-y-4">
										<h3 className="font-semibold text-gray-900 border-b pb-2">Helpful Information</h3>
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
										
										<div className="bg-white p-4 rounded border">
											<div className="text-sm font-semibold text-gray-700 mb-3">Steps:</div>
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

								{/* Helpful Information from Hardcoded Data */}
								{phaseInfo?.helpfulInformation && phaseInfo.helpfulInformation.length > 0 && (
									<div className="space-y-4">
										<h3 className="font-semibold text-gray-900 border-b pb-2">Helpful Information</h3>
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
										
										<div className="bg-white p-4 rounded border">
											<div className="text-sm font-semibold text-gray-700 mb-3">Steps:</div>
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
						)}
					</section>
				)
			})) : (
				<div className="text-center py-12">
					<p className="text-gray-500 text-lg">No roadmap phases available.</p>
					<p className="text-gray-400 text-sm mt-2">Please generate a roadmap to see construction phases.</p>
				</div>
			)}
		</div>
	)
}


