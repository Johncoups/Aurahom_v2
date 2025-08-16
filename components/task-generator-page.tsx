"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Wrench, Package, CheckCircle2, Clock } from "lucide-react"

interface TaskDetail {
  id: string
  title: string
  description: string
  materials: string[]
  steps: string[]
  estimatedTime: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export function TaskGeneratorPage() {
  const [taskInput, setTaskInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<TaskDetail | null>(null)

  const handleGenerateTask = async () => {
    if (!taskInput.trim()) return

    setIsGenerating(true)

    // Simulate AI generation with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock generated task based on input
    const mockTask: TaskDetail = {
      id: Date.now().toString(),
      title: taskInput,
      description: `Complete guide for ${taskInput.toLowerCase()} with professional standards and safety considerations.`,
      materials: [
        "Safety equipment (goggles, gloves, hard hat)",
        "Measuring tools (tape measure, level)",
        "Basic hand tools (hammer, screwdrivers, pliers)",
        "Power tools as needed",
        "Quality materials from approved suppliers",
        "Permits and documentation",
      ],
      steps: [
        "Review local building codes and obtain necessary permits",
        "Prepare the work area and ensure safety protocols are in place",
        "Gather all required materials and tools",
        "Measure and mark the work area according to specifications",
        "Begin installation/construction following manufacturer guidelines",
        "Perform quality checks at each major milestone",
        "Complete final inspection and cleanup",
        "Document completion and file any required paperwork",
      ],
      estimatedTime: "2-4 hours",
      difficulty: "Medium",
    }

    setGeneratedTask(mockTask)
    setIsGenerating(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Generator</h1>
        <p className="text-gray-600">
          Generate detailed task lists with materials and step-by-step instructions using AI
        </p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-cyan-600" />
              What task do you need help with?
            </CardTitle>
            <CardDescription>Describe the construction or home building task you want to accomplish</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="e.g., Install kitchen cabinets, Frame interior walls, Install electrical outlets..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="text-base"
              />
            </div>
            <Button
              onClick={handleGenerateTask}
              disabled={!taskInput.trim() || isGenerating}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Task Details...
                </>
              ) : (
                "Generate Task Details"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Task Section */}
        {generatedTask && (
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{generatedTask.title}</CardTitle>
                  <CardDescription className="text-base">{generatedTask.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(generatedTask.difficulty)}>{generatedTask.difficulty}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {generatedTask.estimatedTime}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Materials Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-violet-600" />
                  Required Materials & Tools
                </h3>
                <div className="grid gap-2">
                  {generatedTask.materials.map((material, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{material}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Steps Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Step-by-Step Instructions
                </h3>
                <div className="space-y-3">
                  {generatedTask.steps.map((step, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 bg-transparent">
                  Save to Project
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Add to Schedule
                </Button>
                <Button
                  onClick={() => {
                    setGeneratedTask(null)
                    setTaskInput("")
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Generate New Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Generated Tasks</CardTitle>
            <CardDescription>Your previously generated task lists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Install kitchen cabinets", "Frame interior walls", "Install electrical outlets"].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{task}</span>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
