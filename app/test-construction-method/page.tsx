"use client"

import { useState } from "react"
import { getPhasesForMethod, getPhasesForDropdownByMethod } from "@/lib/roadmap-phases"
import type { ConstructionMethod } from "@/lib/roadmap-types"

export default function TestConstructionMethod() {
  const [selectedMethod, setSelectedMethod] = useState<ConstructionMethod>("")

  const methods: { value: ConstructionMethod; label: string }[] = [
    { value: "traditional-frame", label: "Traditional Wood Frame" },
    { value: "post-frame", label: "Post Frame/Pole Barn" },
    { value: "icf", label: "ICF (Insulated Concrete Forms)" },
    { value: "sip", label: "SIP (Structural Insulated Panels)" },
    { value: "modular", label: "Modular/Prefab" },
    { value: "other", label: "Other" }
  ]

  const phases = selectedMethod ? getPhasesForMethod(selectedMethod) : []
  const dropdownPhases = selectedMethod ? getPhasesForDropdownByMethod(selectedMethod) : []

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Construction Method Test</h1>
        
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Construction Method</h2>
          <select 
            className="border rounded p-2 w-full max-w-xs"
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as ConstructionMethod)}
          >
            <option value="">Select a method</option>
            {methods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {selectedMethod && (
          <>
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Phases for {methods.find(m => m.value === selectedMethod)?.label}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phases.map(phase => (
                  <div key={phase.id} className="border rounded p-3 bg-gray-50">
                    <div className="font-medium text-gray-900">{phase.order}. {phase.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{phase.description}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      Dependencies: {phase.dependencies.length > 0 ? phase.dependencies.join(", ") : "None"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Dropdown Options</h2>
              <div className="space-y-2">
                {dropdownPhases.map(phase => (
                  <div key={phase.id} className="p-2 bg-blue-50 rounded border">
                    {phase.title}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
