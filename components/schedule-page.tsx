"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { useBids } from "@/contexts/bids-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Plus, X, FileText, AlertCircle } from "lucide-react"

type Category = "material" | "subcontractor" | "inspection" | "payment"
type Activity = {
  id: number
  phase: string
  task: string
  vendor?: string
  estimatedArrival?: string
  duration?: string
  status: string
  category: Category
}

// Sample activity data
const sampleActivities: Record<string, Activity[]> = {
  "2024-01-15": [
    {
      id: 1,
      phase: "Foundation & Framing",
      task: "Pour concrete foundation",
      vendor: "ABC Concrete Co.",
      estimatedArrival: "8:00 AM",
      duration: "4 hours",
      status: "scheduled",
      category: "material",
    },
  ],
  "2024-01-18": [
    {
      id: 2,
      phase: "Foundation & Framing",
      task: "Frame inspection",
      vendor: "City Inspector",
      estimatedArrival: "2:00 PM",
      duration: "1 hour",
      status: "scheduled",
      category: "inspection",
    },
  ],
  "2024-01-22": [
    {
      id: 3,
      phase: "Foundation & Framing",
      task: "Install floor joists",
      vendor: "XYZ Framing",
      estimatedArrival: "7:00 AM",
      duration: "6 hours",
      status: "scheduled",
      category: "subcontractor",
    },
  ],
  "2024-01-25": [
    {
      id: 4,
      phase: "Exterior & Interior Rough-in",
      task: "Electrical rough-in",
      vendor: "Elite Electric",
      estimatedArrival: "9:00 AM",
      duration: "8 hours",
      status: "scheduled",
      category: "payment",
    },
  ],
}

// Gantt chart data
const ganttPhases = [
  {
    id: 1,
    name: "Planning & Design",
    startDate: "2024-01-01",
    endDate: "2024-01-14",
    progress: 100,
    color: "bg-green-500",
  },
  {
    id: 2,
    name: "Foundation & Framing",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    progress: 30,
    color: "bg-cyan-500",
  },
  {
    id: 3,
    name: "Exterior & Interior Rough-in",
    startDate: "2024-02-16",
    endDate: "2024-03-30",
    progress: 0,
    color: "bg-gray-400",
  },
  {
    id: 4,
    name: "Interior Finishes",
    startDate: "2024-04-01",
    endDate: "2024-05-15",
    progress: 0,
    color: "bg-gray-400",
  },
  {
    id: 5,
    name: "Final Fixtures & Landscaping",
    startDate: "2024-05-16",
    endDate: "2024-06-15",
    progress: 0,
    color: "bg-gray-400",
  },
]

export function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [activities, setActivities] = useState<Record<string, Activity[]>>(sampleActivities)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formDate, setFormDate] = useState<string>("")
  const [newActivity, setNewActivity] = useState({
    phase: "",
    task: "",
    vendor: "",
    estimatedArrival: "",
    duration: "",
    category: undefined as Category | undefined,
  })
  const { selectedVendor } = useBids()

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getActivitiesForDate = (date: Date): Activity[] => {
    const dateKey = formatDateKey(date)
    return activities[dateKey] || []
  }

  const hasActivities = (date: Date) => {
    const dateKey = formatDateKey(date)
    return activities[dateKey] && activities[dateKey].length > 0
  }

  const getCategoryForDate = (date: Date): Category | null => {
    const dateKey = formatDateKey(date)
    const items = activities[dateKey] || []
    if (items.length === 0) return null
    // Priority: inspection > subcontractor > material > payment
    if (items.some((a) => a.category === "inspection")) return "inspection"
    if (items.some((a) => a.category === "subcontractor")) return "subcontractor"
    if (items.some((a) => a.category === "material")) return "material"
    if (items.some((a) => a.category === "payment")) return "payment"
    return null
  }

  const handleAddActivity = () => {
    if (!selectedDate || !newActivity.phase || !newActivity.task || !newActivity.category) return

    const dateKey = formatDateKey(selectedDate)
    const activity: Activity = {
      id: Date.now(),
      phase: newActivity.phase,
      task: newActivity.task,
      vendor: newActivity.vendor,
      estimatedArrival: newActivity.estimatedArrival,
      duration: newActivity.duration,
      status: "scheduled",
      category: newActivity.category,
    }

    setActivities((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), activity],
    }))

    setNewActivity({
      phase: "",
      task: "",
      vendor: "",
      estimatedArrival: "",
      duration: "",
      category: undefined,
    })
    setShowAddForm(false)
  }

  const selectedDateActivities: Activity[] = selectedDate ? getActivitiesForDate(selectedDate) : []

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header with Add Event */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Calendar</h1>
          <p className="text-gray-600">Select a date to view its events.</p>
        </div>
      </div>

      {/* Calendar, Events, and Important Notes - equal width */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar card */}
        <div>
          <Card className="h-[400px]">
            <CardContent className="h-full p-4 flex items-center justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  materialDay: (date) => getCategoryForDate(date) === "material",
                  subcontractorDay: (date) => getCategoryForDate(date) === "subcontractor",
                  inspectionDay: (date) => getCategoryForDate(date) === "inspection",
                  paymentDay: (date) => getCategoryForDate(date) === "payment",
                }}
                modifiersStyles={{
                  materialDay: { backgroundColor: "#f59e0b", color: "white", fontWeight: "bold" },
                  subcontractorDay: { backgroundColor: "#06b6d4", color: "white", fontWeight: "bold" },
                  inspectionDay: { backgroundColor: "#a855f7", color: "white", fontWeight: "bold" },
                  paymentDay: { backgroundColor: "#10b981", color: "white", fontWeight: "bold" },
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Events card */}
        <div>
          <Card className="h-[400px]">
            <CardHeader className="pb-3 flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}` : "Events"}
              </CardTitle>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700" onClick={() => { setShowAddForm(true) }}>
                <Plus className="h-4 w-4 mr-1" />
                Add Event
              </Button>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] flex flex-col p-4">
              {/* Inline Add Form when clicking Add Event */}
              {showAddForm && (
                <div className="p-3 border rounded bg-gray-50 space-y-2 mb-3 -mt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Add Event</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Task</Label>
                      <Input className="h-8" value={newActivity.task} onChange={(e) => setNewActivity((prev) => ({ ...prev, task: e.target.value }))} placeholder="Task description" />
                    </div>
                    <div>
                      <Label className="text-xs">Phase</Label>
                      <Select value={newActivity.phase} onValueChange={(value) => setNewActivity((prev) => ({ ...prev, phase: value }))}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planning & Design">Planning & Design</SelectItem>
                          <SelectItem value="Foundation & Framing">Foundation & Framing</SelectItem>
                          <SelectItem value="Exterior & Interior Rough-in">Exterior & Interior Rough-in</SelectItem>
                          <SelectItem value="Interior Finishes">Interior Finishes</SelectItem>
                          <SelectItem value="Final Fixtures & Landscaping">Final Fixtures & Landscaping</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Category</Label>
                      <Select value={newActivity.category} onValueChange={(value) => setNewActivity((prev) => ({ ...prev, category: value as Category }))}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="material">Material Delivery</SelectItem>
                          <SelectItem value="subcontractor">Subcontractor On Site</SelectItem>
                          <SelectItem value="inspection">Inspection</SelectItem>
                          <SelectItem value="payment">Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Vendor</Label>
                      <Input className="h-8" value={newActivity.vendor} onChange={(e) => setNewActivity((prev) => ({ ...prev, vendor: e.target.value }))} placeholder="Vendor name"
                        onFocus={() => {
                          if (selectedVendor && !newActivity.vendor) {
                            setNewActivity((prev) => ({ ...prev, vendor: selectedVendor.name }))
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">ETA</Label>
                      <Input className="h-8" value={newActivity.estimatedArrival} onChange={(e) => setNewActivity((prev) => ({ ...prev, estimatedArrival: e.target.value }))} placeholder="9:00 AM" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={handleAddActivity} className="flex-1 bg-cyan-600 hover:bg-cyan-700 h-8" disabled={!newActivity.phase || !newActivity.task || !selectedDate}>
                      Add
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="h-8">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {selectedDate && selectedDateActivities.length > 0 ? (
                  <div className="space-y-2">
                    {selectedDateActivities.map((activity: Activity) => (
                      <div key={activity.id} className="p-2 border rounded space-y-1">
                        <Badge variant="outline" className="text-xs">{activity.phase}</Badge>
                        <h4 className="font-medium text-sm">{activity.task}</h4>
                        {activity.vendor && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <User className="h-3 w-3" />
                            {activity.vendor}
                          </div>
                        )}
                        {activity.estimatedArrival && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {activity.estimatedArrival}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No events for this day.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-[400px]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 h-[calc(100%-4rem)] flex flex-col p-4">
              <div className="flex-1 space-y-3 overflow-y-auto min-h-0">
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Weather Alert</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Rain expected Jan 20-22. Consider rescheduling outdoor concrete work.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Permit Status</h4>
                  <p className="text-sm text-gray-600">
                    Electrical permit approved. Plumbing permit pending review (expected by Jan 25).
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Material Delivery</h4>
                  <p className="text-sm text-gray-600">
                    Lumber delivery scheduled for Jan 16. Ensure site access is clear.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Budget Update</h4>
                  <p className="text-sm text-gray-600">
                    Foundation phase completed 5% under budget. Savings allocated to contingency fund.
                  </p>
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline - Gantt Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ganttPhases.map((phase) => (
              <div key={phase.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{phase.name}</h4>
                  <div className="text-sm text-gray-600">
                    {phase.startDate} - {phase.endDate}
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`h-6 rounded-full ${phase.color} flex items-center justify-end pr-2`}
                      style={{ width: `${phase.progress}%` }}
                    >
                      {phase.progress > 0 && <span className="text-white text-xs font-medium">{phase.progress}%</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
