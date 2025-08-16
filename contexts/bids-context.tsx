"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type SelectedVendor = {
  id: string
  name: string
  email?: string
  phone?: string
}

type BidsContextType = {
  selectedVendor: SelectedVendor | null
  setSelectedVendor: (vendor: SelectedVendor | null) => void
}

const BidsContext = createContext<BidsContextType | undefined>(undefined)

export function BidsProvider({ children }: { children: ReactNode }) {
  const [selectedVendor, setSelectedVendor] = useState<SelectedVendor | null>(null)

  return (
    <BidsContext.Provider value={{ selectedVendor, setSelectedVendor }}>
      {children}
    </BidsContext.Provider>
  )
}

export function useBids() {
  const ctx = useContext(BidsContext)
  if (!ctx) throw new Error("useBids must be used within a BidsProvider")
  return ctx
}


