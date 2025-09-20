"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useRoadmap } from "@/contexts/roadmap-context"

export function DashboardHeader() {
  const { signOutUser } = useAuth()
  const { clearAllData } = useRoadmap()
  const router = useRouter()
  // Mock user data - replace with actual user data later
  const user = {
    name: "John Doe",
    avatar: null, // No avatar image for now
  }

  const userInitial = user.name.charAt(0).toUpperCase()

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-cyan-600">Aurahöm</h1>
        </div>

        {/* Right side - Clear Data, Quick add, Avatar, and Logout */}
        <div className="flex items-center gap-3">
          {/* Clear Data button - for debugging */}
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            onClick={async () => {
              if (confirm('Are you sure you want to clear all data? This will delete your roadmap and project data.')) {
                await clearAllData()
                window.location.reload()
              }
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Data
          </Button>

          {/* Quick add button */}
          <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>

          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback className="bg-cyan-100 text-cyan-700 text-sm font-medium">{userInitial}</AvatarFallback>
          </Avatar>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={async () => {
              await signOutUser()
              router.push("/login")
            }}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
