"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full bg-white shadow-sm border border-gray-100 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome{user?.email ? `, ${user.email}` : ''}.</p>
        </div>
      </div>
    </ProtectedRoute>
  )
}


