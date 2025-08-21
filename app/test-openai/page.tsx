"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types"

function TestOpenAIInner() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  
  // Test Profile: Owner-builder with DIY experience
  const testProfile: OnboardingProfile = {
    role: "owner_plus_diy",
    experience: "diy_maintenance",
    subcontractorHelp: "yes",
    constructionMethod: "traditional-frame",
    currentPhaseId: "pre-construction",
    diyPhaseIds: ["exterior-framing", "interior-framing", "roofing", "exterior", "plumbing-rough", "electrical-rough", "hvac-rough", "insulation", "interior-framing-blocking", "drywall", "paint", "trim-carpentry", "flooring", "kitchen-bath"],
    weeklyHourlyCommitment: "40",
    cityState: "Faribault, MN",
    propertyAddress: "123 Main Street, Faribault, MN 55021",
    houseSize: "2,400 sq ft",
    foundationType: "slab-on-grade",
    numberOfStories: "2-story",
    targetStartDate: "2025-03-15", // Spring start for weather planning
    background: "Owner-builder with DIY experience, comfortable with power tools, built a deck and shed before"
  }

  // Toggle phase expansion
  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev)
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId)
      } else {
        newSet.add(phaseId)
      }
      return newSet
    })
  }

  // Toggle task expansion
  const toggleTaskExpansion = (taskKey: string) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev)
      if (newSet.has(taskKey)) {
        newSet.delete(taskKey)
      } else {
        newSet.add(taskKey)
      }
      return newSet
    })
  }

  // Format task content with better structure
  const formatTaskContent = (content: string) => {
    // Clean up markdown symbols and split content into lines
    let cleanContent = content
      .replace(/^#+\s*/gm, '') // Remove markdown headers (# ## ###)
      .replace(/^\*\s*/gm, '') // Remove markdown bullets (*)
      .replace(/^-\s*/gm, '') // Remove markdown dashes (-)
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown (**text**)
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown (*text*)
      .replace(/`(.*?)`/g, '$1') // Remove code markdown (`text`)
    
    const lines = cleanContent.split('\n').filter(line => line.trim())
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim()
      
      // Check if line starts with a number
      if (/^\d+\./.test(trimmedLine)) {
        // Numbered list item - indented with blue left border
        return (
          <div key={index} className="mb-2 pl-6 border-l-2 border-blue-200">
            <span className="text-gray-700">{trimmedLine}</span>
          </div>
        )
      } else if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 3 && !/^\d/.test(trimmedLine)) {
        // Section headers (all caps, not numbers) - NO indentation
        return (
          <div key={index} className="mt-4 mb-2 font-semibold text-gray-800 text-sm uppercase tracking-wide">
            {trimmedLine}
          </div>
        )
      } else {
        // Regular body text - indented for hierarchy
        return (
          <div key={index} className="mb-2 pl-4 text-gray-700">
            {trimmedLine}
          </div>
        )
      }
    })
  }

  // Function to remove brackets from AI-generated text and redundant phase info
  const cleanBrackets = (text: string): string => {
    const cleaned = text
      .split('\n')
      .filter(line => {
        const trimmedLine = line.trim();
        // Remove redundant phase lines and mode headers
        return !trimmedLine.startsWith('Phase:') && 
               !trimmedLine.startsWith('**Phase:') &&
               !trimmedLine.startsWith('🔨') &&
               !trimmedLine.startsWith('🏗') &&
               !trimmedLine.startsWith('DIY Phase') &&
               !trimmedLine.startsWith('Contractor Phase');
      })
      .map(line => line
        .replace(/\[(\d+)\]/g, '$1') // Remove brackets from numbers [X] -> X
        .replace(/\[(\w+)\]\s*$/g, '$1') // Remove brackets from words [WORD] -> WORD
        .replace(/\[([^\]]+)\]/g, '$1') // Remove any remaining brackets with content
      )
      .join('\n')
      .trim(); // Remove leading/trailing whitespace
    
    console.log('cleanBrackets - Original:', text);
    console.log('cleanBrackets - Cleaned:', cleaned);
    
    return cleaned;
  };

  // Function to remove redundant duration for contractor phases
  const removeRedundantDuration = (text: string, isDIYPhase: boolean): string => {
    if (isDIYPhase) {
      return text; // Keep all duration info for DIY phases
    } else {
      // For contractor phases, remove redundant "Duration: X weeks" lines
      const cleaned = text
        .split('\n')
        .filter(line => !line.trim().startsWith('Duration:'))
        .join('\n')
        .trim();
      
      console.log('removeRedundantDuration - Original:', text);
      console.log('removeRedundantDuration - Cleaned:', cleaned);
      console.log('Is DIY Phase:', isDIYPhase);
      
      return cleaned;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Timeline Estimation Test</h1>
          <p className="text-gray-600 mb-6">
            This page tests the duration-only timeline estimation functionality for construction phases using parallel processing.
          </p>
          
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Questionnaire Inputs Used</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="p-3 border rounded bg-blue-50">
                  <h3 className="font-medium text-sm text-blue-800">Role & Experience</h3>
                  <p className="text-xs text-blue-600">Role: {testProfile.role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-blue-600">Experience: {testProfile.experience.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-blue-600">Subcontractor Help: {testProfile.subcontractorHelp === 'yes' ? 'Yes' : testProfile.subcontractorHelp === 'no' ? 'No' : 'Maybe'}</p>
                </div>
                
                <div className="p-3 border rounded bg-green-50">
                  <h3 className="font-medium text-sm text-green-800">Construction Details</h3>
                  <p className="text-xs text-green-600">Method: {testProfile.constructionMethod.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-green-600">Current Phase: {testProfile.currentPhaseId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-green-600">Foundation: {testProfile.foundationType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                  <p className="text-xs text-green-600">Stories: {testProfile.numberOfStories.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 border rounded bg-purple-50">
                  <h3 className="font-medium text-sm text-purple-800">Project Specifications</h3>
                  <p className="text-xs text-purple-600">House Size: {testProfile.houseSize}</p>
                  				<p className="text-xs text-purple-600">Weekly Commitment: {testProfile.weeklyHourlyCommitment} hours/week</p>
                  <p className="text-xs text-purple-600">Target Start: {testProfile.targetStartDate ? new Date(testProfile.targetStartDate).toLocaleDateString() : 'Not specified'}</p>
                  <p className="text-xs text-purple-600">Location: {testProfile.cityState}</p>
                </div>
                
                <div className="p-3 border rounded bg-orange-50">
                  <h3 className="font-medium text-sm text-orange-800">DIY Phases Selected</h3>
                  <div className="text-xs text-orange-600">
                    {testProfile.diyPhaseIds.map((phase, index) => (
                      <div key={index} className="mb-1">
                        • {phase.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {testProfile.background && (
              <div className="mt-4 p-3 border rounded bg-gray-50">
                <h3 className="font-medium text-sm text-gray-800">Additional Background</h3>
                <p className="text-xs text-gray-600">{testProfile.background}</p>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mb-6 flex-wrap">
            <Button 
              onClick={async () => {
                                 try {
                   setIsLoading(true)
                   
                   console.log('Starting timeline estimation generation...')
                  
                  // Call the new timeline estimation API
                  const response = await fetch('/api/generate-timeline-estimates', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userProfile: testProfile })
                  })
                  
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                  }
                  
                  const result = await response.json()
                  
                  if (result.success && result.timelines) {
                    console.log('Timeline estimation generated successfully:', result.timelines)
                    
                    // Display results in organized format
                    const timelineRoadmap: RoadmapData = {
                      phases: result.timelines.map((timeline: any, index: number) => ({
                        id: `timeline-phase-${index}`,
                        title: `${timeline.phaseTitle} - Timeline Estimate`,
                        detailLevel: index === 0 ? 'high' as const : 'low' as const, // First phase expanded, others collapsed
                        tasks: [{
                          id: `timeline-details-${index}`,
                          title: 'Timeline Details',
                          status: 'todo' as const,
                          notes: removeRedundantDuration(cleanBrackets(timeline.timeline), timeline.timeline.toLowerCase().includes('diy phase')),
                          steps: [],
                          qaChecks: [],
                          vendorQuestions: [],
                          vendorNeeds: []
                        }]
                      }))
                    }
                    
                    // Set the first phase as expanded by default
                    setExpandedPhases(new Set(['timeline-phase-0']))
                    setExpandedTasks(new Set(['timeline-phase-0-timeline-details-0']))
                    
                    setRoadmap(timelineRoadmap)
                    console.log('Timeline estimation completed successfully')
                  } else {
                    throw new Error(result.error || 'Failed to generate timeline estimates')
                  }
                  
                } catch (error) {
                  console.error('Timeline estimation failed:', error)
                  alert(`Timeline estimation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Generating..." : "⏱️ Generate Timeline Estimates (Parallel)"}
            </Button>
          </div>
        </div>

        {/* Display the generated roadmap */}
        {roadmap && (
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Generated Timeline Estimates</h2>
            <p className="text-sm text-gray-600 mb-4">
              {roadmap.phases[0]?.id?.startsWith('timeline-phase-')
                ? '⏱️ Duration-Only Timeline Estimation - All phases processed in parallel for speed'
                : `AI-enhanced roadmap with ${roadmap.phases.length} phases`}
            </p>
            
            {/* Duration Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-semibold text-green-800 mb-2">Project Duration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {(() => {
                      let totalWeeks = 0;
                      roadmap.phases.forEach(phase => {
                        const timelineText = phase.tasks[0]?.notes || '';
                        const isDIYPhase = testProfile.diyPhaseIds.some(diyPhase => {
                          const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
                          return phase.title.toLowerCase().includes(diyPhaseFormatted);
                        });
                        
                        if (isDIYPhase) {
                          const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
                          const durationMatch = timelineText.match(durationPattern);
                          if (durationMatch) {
                            totalWeeks += parseInt(durationMatch[1]);
                          }
                        } else {
                          const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
                          const contractorMatch = timelineText.match(contractorPattern);
                          if (contractorMatch) {
                            totalWeeks += parseInt(contractorMatch[1]);
                          }
                        }
                      });
                      return totalWeeks;
                    })()}
                  </div>
                  <div className="text-xs text-green-600">Total Weeks</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-700">
                    {(() => {
                      let diyWeeks = 0;
                      roadmap.phases.forEach(phase => {
                        const timelineText = phase.tasks[0]?.notes || '';
                        const isDIYPhase = testProfile.diyPhaseIds.some(diyPhase => {
                          const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
                          return phase.title.toLowerCase().includes(diyPhaseFormatted);
                        });
                        
                        if (isDIYPhase) {
                          const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
                          const durationMatch = timelineText.match(durationPattern);
                          if (durationMatch) {
                            diyWeeks += parseInt(durationMatch[1]);
                          }
                        }
                      });
                      return diyWeeks;
                    })()}
                  </div>
                  <div className="text-xs text-blue-600">DIY Weeks</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">
                    {(() => {
                      let contractorWeeks = 0;
                      roadmap.phases.forEach(phase => {
                        const timelineText = phase.tasks[0]?.notes || '';
                        const isDIYPhase = testProfile.diyPhaseIds.some(diyPhase => {
                          const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
                          return phase.title.toLowerCase().includes(diyPhaseFormatted);
                        });
                        
                        if (!isDIYPhase) {
                          const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
                          const contractorMatch = timelineText.match(contractorPattern);
                          if (contractorMatch) {
                            contractorWeeks += parseInt(contractorMatch[1]);
                          }
                        }
                      });
                      return contractorWeeks;
                    })()}
                  </div>
                  <div className="text-xs text-purple-600">Contractor Weeks</div>
                </div>
              </div>
            </div>
            
            {/* Custom Roadmap Display */}
            <div className="space-y-4">
              {roadmap.phases.map((phase) => {
                const isExpanded = expandedPhases.has(phase.id)
                return (
                  <div key={phase.id} className="border border-gray-200 rounded-lg">
                    {/* Phase Header - Clickable for accordion */}
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => togglePhaseExpansion(phase.id)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                      <div className="flex items-center gap-3">
                        {/* Duration Display */}
                        <span className={`text-sm px-3 py-1 rounded font-medium ${
                          (() => {
                            // Check if this phase is a DIY phase by looking at the phase title
                            const phaseTitle = phase.title.toLowerCase();
                            const isDIYPhase = testProfile.diyPhaseIds.some(diyPhase => {
                              const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
                              return phaseTitle.includes(diyPhaseFormatted);
                            });
                            
                            return isDIYPhase 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700';
                          })()
                        }`}>
                          {(() => {
                            // Check if this phase is a DIY phase by looking at the phase title
                            const phaseTitle = phase.title.toLowerCase();
                            console.log(`Checking phase: "${phase.title}"`);
                            console.log(`Phase title lowercase: "${phaseTitle}"`);
                            console.log(`DIY phase IDs: ${testProfile.diyPhaseIds.join(', ')}`);
                            
                            const isDIYPhase = testProfile.diyPhaseIds.some(diyPhase => {
                              const diyPhaseFormatted = diyPhase.replace(/-/g, ' ').toLowerCase();
                              const matches = phaseTitle.includes(diyPhaseFormatted);
                              console.log(`Checking "${diyPhaseFormatted}" against "${phaseTitle}": ${matches}`);
                              return matches;
                            });
                            
                            console.log(`Is DIY phase: ${isDIYPhase}`);
                            
                            const timelineText = phase.tasks[0]?.notes || '';
                            const weeklyCommitment = parseInt(testProfile.weeklyHourlyCommitment);
                            
                            console.log(`Phase: ${phase.title}`);
                            console.log(`Is DIY Phase: ${isDIYPhase}`);
                            console.log(`Timeline text: "${timelineText}"`);
                            console.log(`Phase ID: ${phase.id}`);
                            console.log(`DIY Phase IDs: [${testProfile.diyPhaseIds.join(', ')}]`);
                            console.log(`Is ${phase.id} in DIY list? ${testProfile.diyPhaseIds.includes(phase.id)}`);
                            
                            if (isDIYPhase) {
                              // For DIY phases, look for duration in clean format (brackets already removed)
                              const durationPattern = /.*\*\*Duration\*\*:\s*(\d+)\s*weeks/;
                              const durationMatch = timelineText.match(durationPattern);
                              
                              if (durationMatch) {
                                return `Duration: ${durationMatch[1]} weeks`;
                              }
                              
                              // Fallback: look for DIY hours and calculate weeks
                              const hoursPattern = /.*\*\*DIY Hours\*\*:\s*(\d+)\s*hours/;
                              const hoursMatch = timelineText.match(hoursPattern);
                              
                              if (hoursMatch) {
                                const totalHours = parseInt(hoursMatch[1]);
                                const calculatedWeeks = Math.ceil(totalHours / weeklyCommitment);
                                return `Duration: ${calculatedWeeks} weeks`;
                              }
                              
                              // Additional fallback: look for old calculation format (if AI still outputs it)
                              const oldCalculationPattern = /.*Duration:\s*(\d+)\s*hours\/\d+\s*=\s*(\d+)\s*weeks/;
                              const oldCalculationMatch = timelineText.match(oldCalculationPattern);
                              
                              if (oldCalculationMatch) {
                                return `Duration: ${oldCalculationMatch[2]} weeks`;
                              }
                            } else {
                              // For contractor phases, only look for Contractor Duration
                              console.log(`Parsing contractor phase: ${phase.title}`);
                              console.log(`Timeline text for parsing: "${timelineText}"`);
                              
                              const contractorPattern = /.*\*\*Contractor Duration\*\*:\s*(\d+)\s*weeks/;
                              const contractorMatch = timelineText.match(contractorPattern);
                              
                              console.log(`Contractor pattern match:`, contractorMatch);
                              
                              if (contractorMatch) {
                                return `Duration: ${contractorMatch[1]} weeks`;
                              }
                              
                              // If no contractor duration found, show error
                              return `Error: No contractor duration found`;
                            }
                            
                            // If we still can't extract, show the raw text for debugging
                            console.log(`Could not extract duration for phase: ${phase.title}`);
                            console.log(`Timeline text: ${timelineText}`);
                            console.log(`Is DIY phase: ${isDIYPhase}`);
                            console.log(`DIY phase IDs: ${testProfile.diyPhaseIds.join(', ')}`);
                            
                            // Show the raw text in the UI for debugging
                            return `Debug: ${timelineText.substring(0, 50)}...`;
                          })()}
                        </span>
                        
                        {/* Expand/Collapse Icon */}
                        <svg 
                          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Phase Content - Expandable */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3">
                        {phase.tasks.map((task) => (
                          <div key={task.id} className="border border-gray-200 rounded-lg">
                            {/* Task Header */}
                            <div 
                              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                              onClick={() => toggleTaskExpansion(`${phase.id}-${task.id}`)}
                            >
                              <h4 className="font-medium text-gray-900">{task.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {expandedTasks.has(`${phase.id}-${task.id}`) ? 'Expanded' : 'Collapsed'}
                                </span>
                                {/* Expand/Collapse Icon */}
                                <svg 
                                  className={`w-4 h-4 text-gray-500 transition-transform ${expandedTasks.has(`${phase.id}-${task.id}`) ? 'rotate-180' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                            
                            {/* Task Content - Expandable */}
                            {expandedTasks.has(`${phase.id}-${task.id}`) && (
                              <div className="px-3 pb-3">
                                                                 <div className="bg-gray-50 p-3 rounded text-sm">
                                   {task.notes ? formatTaskContent(task.notes) : 'No content available'}
                                 </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestOpenAI() {
  return <TestOpenAIInner />
}
