"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Plus, X, FileText, AlertCircle } from "lucide-react"

// Sample activity data
const sampleActivities = {
  "2024-01-15": [
    {
      id: 1,
      phase: "Foundation & Framing",
      task: "Pour concrete foundation",
      vendor: "ABC Concrete Co.",
      estimatedArrival: "8:00 AM",
      duration: "4 hours",
      status: "scheduled",
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
  const [activities, setActivities] = useState(sampleActivities)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newActivity, setNewActivity] = useState({
    phase: "",
    task: "",
    vendor: "",
    estimatedArrival: "",
    duration: "",
  })

  const formatDateKey = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getActivitiesForDate = (date: Date) => {
    const dateKey = formatDateKey(date)
    return activities[dateKey] || []
  }

  const hasActivities = (date: Date) => {
    const dateKey = formatDateKey(date)
    return activities[dateKey] && activities[dateKey].length > 0
  }

  const handleAddActivity = () => {
    if (!selectedDate || !newActivity.phase || !newActivity.task) return

    const dateKey = formatDateKey(selectedDate)
    const activity = {
      id: Date.now(),
      ...newActivity,
      status: "scheduled",
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
    })
    setShowAddForm(false)
  }

  const selectedDateActivities = selectedDate ? getActivitiesForDate(selectedDate) : []

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Schedule</h1>
        <p className="text-gray-600">Manage your construction timeline and activities</p>
      </div>

      {/* Calendar and Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar with Activities Panel */}
        <div className="lg:col-span-2">
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] px-6 pb-6 pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-0 h-full -mt-1">
                {/* Calendar */}
                <div className="flex items-start -mt-8">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      hasActivity: (date) => hasActivities(date),
                    }}
                    modifiersStyles={{
                      hasActivity: {
                        backgroundColor: "#06b6d4",
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </div>

                {/* Activity Details Panel */}
                <div className="flex flex-col h-full lg:ml-12">
                  <div className="border rounded-lg p-3 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">
                        {selectedDate ? `${selectedDate.toLocaleDateString()}` : "Select Date"}
                      </h3>
                      {selectedDate && selectedDateActivities.length === 0 && (
                        <Button
                          size="sm"
                          onClick={() => setShowAddForm(true)}
                          className="bg-cyan-600 hover:bg-cyan-700"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
                      {selectedDate && selectedDateActivities.length > 0 ? (
                        selectedDateActivities.map((activity) => (
                          <div key={activity.id} className="p-2 border rounded space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {activity.phase}
                            </Badge>
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
                        ))
                      ) : selectedDate && !showAddForm ? (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">No activities</p>
                          <Button
                            size="sm"
                            className="mt-2 bg-cyan-600 hover:bg-cyan-700"
                            onClick={() => setShowAddForm(true)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      ) : !selectedDate ? (
                        <div className="text-center py-4 text-gray-500">
                          <p className="text-sm">Select a date</p>
                        </div>
                      ) : null}

                      {/* Add Activity Form */}
                      {showAddForm && (
                        <div className="p-2 border rounded bg-gray-50 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-sm">Add Activity</h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <Label htmlFor="phase" className="text-xs">
                                Phase
                              </Label>
                              <Select
                                value={newActivity.phase}
                                onValueChange={(value) => setNewActivity((prev) => ({ ...prev, phase: value }))}
                              >
                                <SelectTrigger className="h-7">
                                  <SelectValue placeholder="Select phase" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Planning & Design">Planning & Design</SelectItem>
                                  <SelectItem value="Foundation & Framing">Foundation & Framing</SelectItem>
                                  <SelectItem value="Exterior & Interior Rough-in">
                                    Exterior & Interior Rough-in
                                  </SelectItem>
                                  <SelectItem value="Interior Finishes">Interior Finishes</SelectItem>
                                  <SelectItem value="Final Fixtures & Landscaping">
                                    Final Fixtures & Landscaping
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="task" className="text-xs">
                                Task
                              </Label>
                              <Input
                                id="task"
                                className="h-7"
                                value={newActivity.task}
                                onChange={(e) => setNewActivity((prev) => ({ ...prev, task: e.target.value }))}
                                placeholder="Task description"
                              />
                            </div>

                            <div>
                              <Label htmlFor="vendor" className="text-xs">
                                Vendor
                              </Label>
                              <Input
                                id="vendor"
                                className="h-7"
                                value={newActivity.vendor}
                                onChange={(e) => setNewActivity((prev) => ({ ...prev, vendor: e.target.value }))}
                                placeholder="Vendor name"
                              />
                            </div>

                            <div>
                              <Label htmlFor="eta" className="text-xs">
                                ETA
                              </Label>
                              <Input
                                id="eta"
                                className="h-7"
                                value={newActivity.estimatedArrival}
                                onChange={(e) =>
                                  setNewActivity((prev) => ({ ...prev, estimatedArrival: e.target.value }))
                                }
                                placeholder="9:00 AM"
                              />
                            </div>

                            <div className="flex gap-2 pt-1">
                              <Button
                                size="sm"
                                onClick={handleAddActivity}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-700 h-7"
                                disabled={!newActivity.phase || !newActivity.task}
                              >
                                Add
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)} className="h-7">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes Section */}
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
