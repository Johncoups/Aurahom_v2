import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Calendar, Bell, StickyNote } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Budget</span>
                <span className="font-semibold text-lg">$125,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Spent</span>
                <span className="font-semibold text-lg text-red-600">$47,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining</span>
                <span className="font-semibold text-lg text-green-600">$77,750</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div className="bg-cyan-600 h-2 rounded-full" style={{ width: "38%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">38% of budget used</p>
            </div>
          </CardContent>
        </Card>

        {/* Current Phase Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Current Phase</CardTitle>
            <Calendar className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-xl text-cyan-700">Foundation Work</h3>
                <p className="text-sm text-gray-600 mt-1">Phase 2 of 8</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-violet-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">Expected completion: March 15, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Updates Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Recent Updates</CardTitle>
            <Bell className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-cyan-500 pl-3">
                <p className="text-sm font-medium">Foundation inspection passed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <div className="border-l-4 border-violet-500 pl-3">
                <p className="text-sm font-medium">Plumbing materials delivered</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="text-sm font-medium">Electrical permit approved</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="text-sm font-medium">Site preparation completed</p>
                <p className="text-xs text-gray-500">1 week ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Important Notes</CardTitle>
            <StickyNote className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm font-medium text-yellow-800">Weather Alert</p>
                <p className="text-xs text-yellow-700 mt-1">Rain expected next week - may delay concrete pour</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Permit Reminder</p>
                <p className="text-xs text-blue-700 mt-1">Framing inspection due by March 20th</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Budget Tip</p>
                <p className="text-xs text-green-700 mt-1">Consider bulk ordering materials for next phase</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
