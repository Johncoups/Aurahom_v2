"use client"

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div className="min-h-[50vh] bg-white flex items-center justify-center p-8 text-center border border-gray-100 rounded-lg">
      <div>
        <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Dashboard failed to load</h2>
        <p className="text-slate-600 mb-4">Please try again. If the problem persists, refresh the page.</p>
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


