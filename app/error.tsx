"use client"

import { useEffect } from "react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-white flex items-center justify-center p-8 text-center">
      <div className="max-w-md w-full bg-white border border-gray-100 rounded-lg p-8 shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-slate-600 mb-6">An unexpected error occurred. You can try again.</p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}


