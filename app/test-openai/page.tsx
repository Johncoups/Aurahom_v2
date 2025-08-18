"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { generateRoadmap } from "@/app/actions/generateRoadmap"

import type { OnboardingProfile, RoadmapData } from "@/lib/roadmap-types"
import { getEnhancedTaskBreakdown } from "@/lib/enhanced-task-breakdown"
import { getBuildingCodeRequirements, getInspectionRequirements } from "@/lib/building-codes-richmond-va"

function TestOpenAIInner() {
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [profile, setProfile] = useState<OnboardingProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const testProfile: OnboardingProfile = {
    role: "owner_plus_diy",
    experience: "diy_maintenance",
    subcontractorHelp: "yes",
    constructionMethod: "traditional-frame",
    currentPhaseId: "foundation",
    diyPhaseIds: ["interior-framing", "plumbing-rough", "electrical-rough", "flooring", "kitchen-bath"],
    weeklyHourlyCommitment: "10-20",
    cityState: "Chesterfield County, VA",
    propertyAddress: "456 Oak Lane, Chesterfield County, VA 23832",
    houseSize: "2,400 sq ft",
    foundationType: "crawlspace",
    numberOfStories: "1-story",
    background: "Owner-builder with DIY experience, comfortable with power tools, built a deck and shed before"
  }

  const licensedGCProfile: OnboardingProfile = {
    role: "gc_plus_diy",
    experience: "diy_permitting",
    subcontractorHelp: "yes",
    constructionMethod: "post-frame",
    currentPhaseId: "pre-construction",
    diyPhaseIds: ["interior-framing-post-frame", "plumbing-rough", "electrical-rough", "hvac-rough", "flooring", "kitchen-bath", "radiant-heat"],
    weeklyHourlyCommitment: "20-30",
    cityState: "Richmond City, VA",
    propertyAddress: "123 Main Street, Richmond City, VA 23220",
    houseSize: "3,200 sq ft",
    foundationType: "slab-on-grade",
    numberOfStories: "2-story",
    background: "Licensed GC with DIY experience, testing OpenAI integration for roadmap generation with post-frame construction and DIY phases"
  }

  const handleTestGeneration = async () => {
    try {
      setIsLoading(true)
      setProfile(testProfile)
      
      console.log('Starting roadmap generation...')
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out after 60 seconds')), 60000)
      )
      
      // Generate roadmap with timeout
      const dataPromise = generateRoadmap(testProfile)
      const data = await Promise.race([dataPromise, timeoutPromise]) as RoadmapData
      
      setRoadmap(data)
      console.log('Roadmap generated successfully:', data)
    } catch (error) {
      console.error('Test generation failed:', error)
      alert(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDetailedDIYGeneration = async () => {
    try {
      setIsLoading(true)
      setProfile(testProfile)
      
      console.log('Starting detailed DIY phases generation via API route...')
      
      // Call the new API route instead of client-side function
      const response = await fetch('/api/generate-detailed-diy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userProfile: testProfile })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success && result.phases) {
        // Create a roadmap structure with the detailed phases
        const detailedRoadmap: RoadmapData = {
          phases: result.phases
        }
        
        setRoadmap(detailedRoadmap)
        console.log('Detailed DIY phases generated successfully via API route:', result.phases)
      } else {
        throw new Error('API returned invalid response format')
      }
    } catch (error) {
      console.error('Detailed DIY generation failed:', error)
      alert(`Detailed generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">OpenAI Roadmap Test</h1>
          <p className="text-gray-600 mb-6">
            This page tests the OpenAI integration for generating construction roadmaps.
          </p>
          
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="text-lg font-semibold mb-3">Test Profile</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Role:</span> {testProfile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
                  testProfile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
                  "Owner-builder acting as General Contractor (will self-perform some phases)"}
              </div>
              <div>
                <span className="font-medium">Construction Method:</span> {testProfile.constructionMethod === "" ? "Not selected" :
                   testProfile.constructionMethod === "traditional-frame" ? "Traditional Wood Frame" :
                   testProfile.constructionMethod === "post-frame" ? "Post Frame/Pole Barn" :
                   testProfile.constructionMethod === "icf" ? "ICF (Insulated Concrete Forms)" :
                   testProfile.constructionMethod === "sip" ? "SIP (Structural Insulated Panels)" :
                   testProfile.constructionMethod === "modular" ? "Modular/Prefab" :
                   testProfile.constructionMethod === "other" ? "Other" :
                   "Not specified"}
              </div>
              <div>
                <span className="font-medium">Experience:</span> {testProfile.experience === "" ? "Not selected" :
                   testProfile.experience === "gc_experienced" ? "General contractor" : 
                   testProfile.experience === "house_builder" ? "Has built a house before" :
                   testProfile.experience === "trades_familiar" ? "Trades background, familiar with building process" :
                   testProfile.experience === "diy_permitting" ? "DIY - Tackled large projects requiring permitting" :
                   testProfile.experience === "diy_maintenance" ? "DIY - Maintenance tasks, no permits needed" :
                   "Complete novice with tools and building"}
              </div>
              <div>
                <span className="font-medium">Current Phase:</span> {testProfile.currentPhaseId === "" ? "Not selected" : testProfile.currentPhaseId}
              </div>
              <div>
                <span className="font-medium">Weekly Commitment:</span> {testProfile.weeklyHourlyCommitment === "" ? "Not selected" : `${testProfile.weeklyHourlyCommitment} hours`}
              </div>
              <div>
                <span className="font-medium">Location:</span> {testProfile.cityState === "" ? "Not provided" : testProfile.cityState}
              </div>
                             <div>
                 <span className="font-medium">Property Address:</span> {testProfile.propertyAddress === "" ? "Not provided" : testProfile.propertyAddress}
               </div>
                               <div>
                  <span className="font-medium">House Size:</span> {testProfile.houseSize === "" ? "Not provided" : testProfile.houseSize}
                </div>
                <div>
                  <span className="font-medium">Foundation Type:</span> {testProfile.foundationType === "" ? "Not selected" :
                     testProfile.foundationType === "slab-on-grade" ? "Slab on Grade" :
                     testProfile.foundationType === "crawlspace" ? "Crawlspace" :
                     testProfile.foundationType === "full-basement" ? "Full Basement" :
                     testProfile.foundationType === "partial-basement" ? "Partial Basement" :
                     testProfile.foundationType === "pier-and-beam" ? "Pier and Beam" :
                     testProfile.foundationType === "other" ? "Other" :
                     "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Number of Stories:</span> {testProfile.numberOfStories === "" ? "Not selected" :
                     testProfile.numberOfStories === "1-story" ? "1 Story" :
                     testProfile.numberOfStories === "1.5-story" ? "1.5 Story (Split Level)" :
                     testProfile.numberOfStories === "2-story" ? "2 Story" :
                     testProfile.numberOfStories === "2.5-story" ? "2.5 Story" :
                     testProfile.numberOfStories === "3-story" ? "3 Story" :
                     testProfile.numberOfStories === "other" ? "Other" :
                     "Not specified"}
                </div>
                <div>
                  <span className="font-medium">DIY Phases:</span> {testProfile.diyPhaseIds.length > 0 ?   
                  testProfile.diyPhaseIds.map(id => {
                    const phaseNames: { [key: string]: string } = {
                      "interior-framing": "Interior Framing & Blocking",
                      "plumbing-rough": "Plumbing Rough-In",
                      "electrical-rough": "Electrical Rough-In", 
                      "hvac-rough": "HVAC Rough-In",
                      "flooring": "Flooring",
                      "kitchen-bath": "Kitchen & Bath",
                      "radiant-heat": "In-Floor Heat (Optional)"
                    };
                    return phaseNames[id] || id;
                  }).join(", ") : "None"
                }
              </div>
            </div>
            <div className="mt-3">
              <span className="font-medium">Background:</span> {testProfile.background}
            </div>

            {/* Enhanced Details Section */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Enhanced System Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-blue-600 mb-2">Building Code Requirements (Richmond City, VA)</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="mb-2">
                      <strong>Interior Framing:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{getBuildingCodeRequirements("interior-framing")}</pre>
                    </div>
                    <div className="mb-2">
                      <strong>Inspection Requirements:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{getInspectionRequirements("interior-framing")}</pre>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-green-600 mb-2">Enhanced Task Breakdown - Interior Framing</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <div className="mb-3">
                      <strong>Layout Tasks:</strong>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {getEnhancedTaskBreakdown("interior-framing").layout?.map((task: string, index: number) => (
                          <li key={index} className="text-xs">{task}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <strong>Cutting Tasks:</strong>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {getEnhancedTaskBreakdown("interior-framing").cutting?.map((task: string, index: number) => (
                          <li key={index} className="text-xs">{task}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <strong>Assembly Tasks:</strong>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {getEnhancedTaskBreakdown("interior-framing").assembly?.map((task: string, index: number) => (
                          <li key={index} className="text-xs">{task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Quality Control Tasks:</strong>
                      <ul className="list-disc list-inside mt-1 ml-4">
                        {getEnhancedTaskBreakdown("interior-framing").quality_control?.map((task: string, index: number) => (
                          <li key={index} className="text-xs">{task}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
                     <div className="flex gap-4 mb-6 flex-wrap">
            <Button 
              onClick={handleTestGeneration} 
              disabled={isLoading}
            >
              {isLoading ? "Generating Roadmap..." : "Generate Test Roadmap with OpenAI"}
            </Button>
            
            <Button 
              onClick={handleDetailedDIYGeneration}
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? "Generating Detailed DIY..." : "Generate Detailed DIY Phases (Loop Approach)"}
            </Button>
            
            <Button 
              onClick={async () => {
                try {
                  setIsLoading(true)
                  setProfile(licensedGCProfile)
                  
                  console.log('Starting licensed GC roadmap generation...')
                  
                  // Add timeout to prevent hanging
                  const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timed out after 60 seconds')), 60000)
                  )
                  
                  // Generate roadmap with timeout
                  const dataPromise = generateRoadmap(licensedGCProfile)
                  const data = await Promise.race([dataPromise, timeoutPromise]) as RoadmapData
                  
                  setRoadmap(data)
                  console.log('Licensed GC roadmap generated successfully:', data)
                } catch (error) {
                  console.error('Licensed GC generation failed:', error)
                  alert(`Licensed GC generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                } finally {
                  setIsLoading(false)
                }
              }}
              disabled={isLoading}
              variant="secondary"
            >
              {isLoading ? "Generating Licensed GC..." : "Test Licensed GC Profile"}
            </Button>
            
                         <Button 
               onClick={async () => {
                 try {
                   setIsLoading(true)
                   console.log('Testing simple OpenAI call...')
                   
                   const response = await fetch('/api/test-openai')
                   const result = await response.json()
                   console.log('Simple test result:', result)
                   alert(`OpenAI test: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.response || result.error}`)
                 } catch (error) {
                   console.error('Simple test failed:', error)
                   alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
                 } finally {
                   setIsLoading(false)
                 }
               }}
               disabled={isLoading}
               variant="outline"
             >
               Test OpenAI API
             </Button>
             
             <Button 
               onClick={() => {
                 if (roadmap) {
                   // Create Markdown content
                   let markdown = `# AI Generated Construction Roadmap\n\n`
                   markdown += `Generated on: ${new Date().toLocaleString()}\n\n`
                   
                   roadmap.phases.forEach((phase, index) => {
                     markdown += `## ${index + 1}. ${phase.title}\n\n`
                     markdown += `**Detail Level:** ${phase.detailLevel}\n\n`
                     
                     phase.tasks.forEach((task, taskIndex) => {
                       markdown += `### ${taskIndex + 1}. ${task.title}\n\n`
                       if (task.notes) {
                         markdown += `${task.notes}\n\n`
                       }
                       if (task.steps && task.steps.length > 0) {
                         markdown += `**Steps:**\n`
                         task.steps.forEach((step, stepIndex) => {
                           markdown += `${stepIndex + 1}. ${step.description}\n`
                         })
                         markdown += `\n`
                       }
                     })
                     markdown += `---\n\n`
                   })
                   
                   // Create and download the file
                   const blob = new Blob([markdown], { type: 'text/markdown' })
                   const url = URL.createObjectURL(blob)
                   const a = document.createElement('a')
                   a.href = url
                   a.download = `construction-roadmap-${new Date().toISOString().split('T')[0]}.md`
                   document.body.appendChild(a)
                   a.click()
                   document.body.removeChild(a)
                   URL.revokeObjectURL(url)
                   
                   alert('Markdown file downloaded successfully!')
                 } else {
                   alert('No roadmap data to export. Please generate a roadmap first.')
                 }
               }}
               disabled={!roadmap}
               variant="outline"
               className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
             >
               📥 Export to Markdown
             </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              <li>Click the button above to generate a roadmap using OpenAI</li>
              <li>Check the console for any AI generation logs</li>
              <li>Look for AI-generated notes in the roadmap tasks (marked with ✨)</li>
              <li>Try the "Regenerate with AI" button on individual phases</li>
              <li>Verify that the AI content is relevant to construction</li>
            </ol>
          </div>

          {profile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">Test Profile Loaded:</h3>
              <p className="text-sm text-green-800">
                Role: {profile.role === "gc_only" ? "Licensed General Contractor (hiring all subcontractors)" : 
                  profile.role === "gc_plus_diy" ? "Licensed General Contractor (will self-perform some phases)" :
                  "Owner-builder acting as General Contractor (will self-perform some phases)"} • 
                Experience: {profile.experience === "" ? "Not selected" :
                   profile.experience === "gc_experienced" ? "General contractor" : 
                   profile.experience === "house_builder" ? "Has built a house before" :
                   profile.experience === "trades_familiar" ? "Trades background, familiar with building process" :
                   profile.experience === "diy_permitting" ? "DIY - Tackled large projects requiring permitting" :
                   profile.experience === "diy_maintenance" ? "DIY - Maintenance tasks, no permits needed" :
                   "Complete novice with tools and building"} •  
                Current Phase: {profile.currentPhaseId === "" ? "Not selected" : profile.currentPhaseId} • 
                Weekly Commitment: {profile.weeklyHourlyCommitment === "" ? "Not selected" : `${profile.weeklyHourlyCommitment} hours`} • 
                Location: {profile.cityState === "" ? "Not provided" : profile.cityState}
              </p>
              {profile.diyPhaseIds && profile.diyPhaseIds.length > 0 && (
                <p className="text-sm text-green-800 mt-2">
                                     <strong>DIY Phases:</strong> {profile.diyPhaseIds.map(id => {
                     const phaseNames: { [key: string]: string } = {
                       "interior-framing": "Interior Framing & Blocking",
                       "interior-framing-post-frame": "Interior Framing & Blocking",
                       "interior-framing-icf": "Interior Framing & Blocking",
                       "plumbing-rough": "Plumbing Rough-In",
                       "electrical-rough": "Electrical Rough-In", 
                       "hvac-rough": "HVAC Rough-In",
                       "flooring": "Flooring",
                       "kitchen-bath": "Kitchen & Bath",
                       "radiant-heat": "In-Floor Heat (Optional)"
                     };
                     return phaseNames[id] || id;
                   }).join(", ")}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Display the generated roadmap */}
        {roadmap && (
          <div className="bg-white rounded-lg border p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">Generated Roadmap</h2>
            <p className="text-sm text-gray-600 mb-4">
              AI-enhanced roadmap with {roadmap.phases.length} phases
            </p>
            
            {/* Custom Roadmap Display */}
            <div className="space-y-4">
              {roadmap.phases.map((phase) => (
                <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {phase.detailLevel} detail
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="border border-gray-100 rounded-lg p-3">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-4 h-4 rounded border-2 border-gray-300 flex items-center justify-center mt-0.5">
                            <span className="text-gray-400 text-xs">○</span>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-700">{task.title}</h5>
                                                         {task.notes && (
                               <div className="mt-1 bg-purple-50 p-3 rounded">
                                 <div className="flex items-center gap-2 mb-2">
                                   <span className="text-purple-600">✨</span>
                                   <span className="text-sm font-medium text-purple-800">AI Generated Detailed Guide:</span>
                                 </div>
                                 <pre className="text-xs text-purple-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border overflow-auto max-h-96">
                                   {task.notes}
                                 </pre>
                               </div>
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TestOpenAIPage() {
  return <TestOpenAIInner />
}
