"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import budgetPhaseAlignment from "@/budget-phase-alignment.json"
import { supabase } from "@/lib/supabase"

interface BudgetItem {
  id: string
  projectId?: string
  phaseId: string
  category: string
  description: string
  materials: number
  labor: number
  vendor: string
  estimatedCost: number
  actualCost: number
  currentPaid: number
  due: number
  variance: number
  sortOrder: number
  isCustom: boolean
}

type BudgetPhaseDefinition = {
  order: number
  phaseId: string
  title: string
  duration?: string
  budgetItems: number[]
}

type BudgetPhaseAlignmentFile = {
  budgetItems: string[]
  constructionMethods: Record<string, { phases: BudgetPhaseDefinition[] }>
  notes?: {
    missingCategories?: string[]
  }
}

const DEFAULT_CONSTRUCTION_METHOD = "traditional-frame"

type BudgetPageProps = {
  projectId?: string
  constructionMethod?: string
}

const buildInitialBudgetData = (
  alignment: BudgetPhaseAlignmentFile,
  constructionMethod: string,
): { seed: BudgetItem[]; phaseIdByTitle: Map<string, string>; phaseTitleById: Map<string, string> } => {
  const phases = alignment.constructionMethods?.[constructionMethod]?.phases ?? []
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order)
  const budgetItems = alignment.budgetItems ?? []
  const phaseTitleByIndex = new Map<number, string>()
  const phaseIdByIndex = new Map<number, string>()
  const phaseIdByTitle = new Map<string, string>()
  const phaseTitleById = new Map<string, string>()

  sortedPhases.forEach((phase) => {
    phaseIdByTitle.set(phase.title, phase.phaseId)
    phaseTitleById.set(phase.phaseId, phase.title)
    phase.budgetItems.forEach((budgetIndex) => {
      if (budgetIndex < 0 || budgetIndex >= budgetItems.length) {
        return
      }

      if (!phaseTitleByIndex.has(budgetIndex)) {
        phaseTitleByIndex.set(budgetIndex, phase.title)
        phaseIdByIndex.set(budgetIndex, phase.phaseId)
      }
    })
  })

  const fallbackPhase = sortedPhases[0]
  const fallbackCategory = fallbackPhase?.title ?? "Uncategorized"
  const fallbackPhaseId = fallbackPhase?.phaseId ?? "uncategorized"

  const seed = budgetItems.map((description, index) => {
    const category = phaseTitleByIndex.get(index) ?? fallbackCategory
    const phaseId = phaseIdByIndex.get(index) ?? fallbackPhaseId

    return {
      id: `${index + 1}`,
      projectId: undefined,
      phaseId,
      category,
      description,
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
      sortOrder: index,
      isCustom: false,
    }
  })
  return { seed, phaseIdByTitle, phaseTitleById }
}

const mergeBudgetItems = (
  seeded: BudgetItem[],
  stored: BudgetItem[],
  phasesByTitle: Map<string, string>,
  phasesById: Map<string, string>,
): BudgetItem[] => {
  if (stored.length === 0) {
    return seeded
  }

  const storedMap = new Map<string, BudgetItem>()
  stored.forEach((item) => {
    storedMap.set(`${item.phaseId}::${item.description.toLowerCase()}`, item)
  })

  const mergedSeeded = seeded.map((item) => {
    const key = `${item.phaseId}::${item.description.toLowerCase()}`
    const storedItem = storedMap.get(key)

    if (!storedItem) {
      return item
    }

    return {
      ...item,
      ...storedItem,
      category: item.category,
      sortOrder: storedItem.sortOrder ?? item.sortOrder,
    }
  })

  const seededKeys = new Set(mergedSeeded.map((item) => `${item.phaseId}::${item.description.toLowerCase()}`))
  const customItems = stored.filter((item) => {
    if (item.isCustom) {
      return true
    }

    const key = `${item.phaseId}::${item.description.toLowerCase()}`
    if (seededKeys.has(key)) {
      return false
    }

    const backupPhaseId = phasesByTitle.get(item.category)
    return !backupPhaseId || backupPhaseId === item.phaseId
  })

  return [...mergedSeeded, ...customItems].sort((a, b) => a.sortOrder - b.sortOrder)
}

const isUuid = (value: string): boolean => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)

export function BudgetPage({ projectId, constructionMethod }: BudgetPageProps) {
  const [livingAreaSqFt, setLivingAreaSqFt] = useState(2500)
  const [structureSqFt, setStructureSqFt] = useState(2800)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const budgetAlignment = budgetPhaseAlignment as BudgetPhaseAlignmentFile
  const availableMethods = useMemo(
    () => Object.keys(budgetAlignment.constructionMethods ?? {}),
    [budgetAlignment],
  )
  const selectedMethod = useMemo(() => {
    if (constructionMethod && availableMethods.includes(constructionMethod)) {
      return constructionMethod
    }
    if (availableMethods.includes(DEFAULT_CONSTRUCTION_METHOD)) {
      return DEFAULT_CONSTRUCTION_METHOD
    }
    return availableMethods[0] ?? DEFAULT_CONSTRUCTION_METHOD
  }, [availableMethods, constructionMethod])
  const categoriesFromJson = useMemo(() => {
    const phases = budgetAlignment.constructionMethods?.[selectedMethod]?.phases ?? []
    const titles = phases.map((phase) => phase.title)
    const missing = budgetAlignment.notes?.missingCategories ?? []
    return Array.from(new Set([...titles, ...missing]))
  }, [budgetAlignment, selectedMethod])

  const phaseMaps = useMemo(() => buildInitialBudgetData(budgetAlignment, selectedMethod), [budgetAlignment, selectedMethod])
  const [budgetData, setBudgetData] = useState<BudgetItem[]>(() => phaseMaps.seed.map((item) => ({ ...item, projectId })))
  const [isLoadingBudget, setIsLoadingBudget] = useState(false)
  const [budgetError, setBudgetError] = useState<string | null>(null)
  const [pendingSaves, setPendingSaves] = useState<Set<string>>(new Set())
  const saveQueueRef = useRef<Set<string>>(new Set())
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(true)
  const budgetDataRef = useRef<BudgetItem[]>([])

  // Keep budgetDataRef in sync with budgetData
  useEffect(() => {
    budgetDataRef.current = budgetData
  }, [budgetData])

  const saveBudgetItem = useCallback(
    async (item: BudgetItem) => {
      if (!projectId) {
        console.warn("Budget not saved: missing projectId")
        return item
      }

      setPendingSaves((prev) => new Set(prev).add(item.id))

      try {
        const isPersisted = isUuid(item.id)

        const payload = {
          id: isPersisted ? item.id : undefined,
          project_id: projectId,
          phase_id: item.phaseId,
          description: item.description,
          materials: item.materials,
          labor: item.labor,
          vendor: item.vendor,
          estimated_cost: item.estimatedCost,
          actual_cost: item.actualCost,
          current_paid: item.currentPaid,
          due: item.due,
          sort_order: item.sortOrder,
          is_custom: item.isCustom,
        }

        const conflictTarget = isPersisted ? "id" : "project_id,phase_id,description"

        const { data, error } = await supabase
          .from("budget_items")
          .upsert(payload, { onConflict: conflictTarget })
          .select()
          .single()

        if (error) {
          console.error("Failed to save budget item", error)
          console.warn("Failed to save budget item to Supabase")
          throw error
        }

        const savedItem: BudgetItem = {
          ...item,
          id: data.id,
          projectId: data.project_id,
          phaseId: data.phase_id,
          materials: Number(data.materials ?? 0),
          labor: Number(data.labor ?? 0),
          vendor: data.vendor ?? "",
          estimatedCost: Number(data.estimated_cost ?? 0),
          actualCost: Number(data.actual_cost ?? 0),
          currentPaid: Number(data.current_paid ?? 0),
          due: Number(data.due ?? 0),
          variance: Number(data.estimated_cost ?? 0) - Number(data.current_paid ?? 0),
          sortOrder: Number.isFinite(data.sort_order) ? Number(data.sort_order) : item.sortOrder,
          isCustom: data.is_custom ?? item.isCustom,
        }

        if (isMountedRef.current) {
          // Only update the ID if it changed (temp -> UUID), but preserve local state
          setBudgetData((prev) =>
            prev.map((existing) => {
              if (existing.id === item.id || existing.id === savedItem.id) {
                // If the ID changed (temp to UUID), update it but keep local values
                if (existing.id !== savedItem.id) {
                  return { ...existing, id: savedItem.id }
                }
                // ID didn't change, keep existing local state
                return existing
              }
              return existing
            }),
          )
          setBudgetError(null)
          setPendingSaves((prev) => {
            const next = new Set(prev)
            next.delete(item.id)
            next.delete(savedItem.id)
            return next
          })
        }

        saveQueueRef.current.delete(item.id)
        saveQueueRef.current.delete(savedItem.id)

        return savedItem
      } catch (error) {
        console.error("Save failed for item:", item.id, error)
        if (isMountedRef.current) {
          setBudgetError("Unable to save budget item. Please retry.")
          setPendingSaves((prev) => {
            const next = new Set(prev)
            next.delete(item.id)
            return next
          })
        }
        saveQueueRef.current.delete(item.id)
        throw error
      }
    },
    [projectId, supabase],
  )

  const deleteBudgetItemFromSupabase = useCallback(
    async (id: string) => {
      if (!projectId || !isUuid(id)) {
        return
      }

      const { error } = await supabase.from("budget_items").delete().eq("id", id)

      if (error) {
        console.error("Failed to delete budget item", error)
        console.warn("Failed to delete budget item from Supabase")
        throw error
      }
    },
    [projectId, supabase],
  )

  const loadBudgetData = useCallback(async () => {
    if (!projectId) {
      console.warn("Cannot load budget: missing projectId")
      return
    }

    setIsLoadingBudget(true)
    setBudgetError(null)

    try {
      const { data, error } = await supabase
        .from("budget_items")
        .select("*")
        .eq("project_id", projectId)

      if (error) {
        console.error("Failed to load budget items", error)
        throw error
      }

      const storedItems: BudgetItem[] = (data || []).map((row) => ({
        id: row.id,
        projectId: row.project_id,
        phaseId: row.phase_id,
        category: phaseMaps.phaseTitleById.get(row.phase_id) ?? "Uncategorized",
        description: row.description,
        materials: Number(row.materials ?? 0),
        labor: Number(row.labor ?? 0),
        vendor: row.vendor ?? "",
        estimatedCost: Number(row.estimated_cost ?? 0),
        actualCost: Number(row.actual_cost ?? 0),
        currentPaid: Number(row.current_paid ?? 0),
        due: Number(row.due ?? 0),
        variance: Number(row.estimated_cost ?? 0) - Number(row.current_paid ?? 0),
        sortOrder: Number.isFinite(row.sort_order) ? Number(row.sort_order) : 0,
        isCustom: row.is_custom ?? false,
      }))

      const merged = mergeBudgetItems(
        phaseMaps.seed.map((item) => ({ ...item, projectId })),
        storedItems,
        phaseMaps.phaseIdByTitle,
        phaseMaps.phaseTitleById,
      )

      setBudgetData(merged)
    } catch (error) {
      console.error("Error loading budget data", error)
      setBudgetError("Failed to load budget data. Please refresh the page.")
    } finally {
      setIsLoadingBudget(false)
    }
  }, [projectId, supabase, phaseMaps])

  // Load budget data on mount and when projectId or construction method changes
  useEffect(() => {
    async function fetchBudgetData() {
      if (!projectId) {
        // No projectId, just use seeded data
        setBudgetData(phaseMaps.seed.map((item) => ({ ...item, projectId })))
        return
      }

      await loadBudgetData()
    }

    void fetchBudgetData()
  }, [projectId, selectedMethod, loadBudgetData, phaseMaps])

  const flushPendingSaves = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    const itemIdsToSave = Array.from(saveQueueRef.current)
    if (itemIdsToSave.length === 0) {
      return
    }

    saveQueueRef.current.clear()

    // Get the CURRENT state of items to save (not the stale queued version)
    const itemsToSave = itemIdsToSave
      .map((id) => budgetDataRef.current.find((item) => item.id === id))
      .filter((item): item is BudgetItem => item !== undefined)

    void Promise.all(itemsToSave.map((item) => saveBudgetItem(item))).catch((error) => {
      console.error("Failed to save debounced budget items", error)
      if (isMountedRef.current) {
        setBudgetError("Some changes could not be saved. Please retry.")
      }
    })
  }, [saveBudgetItem])

  const updateBudgetItem = useCallback(
    (id: string, field: keyof BudgetItem, value: string | number) => {
      setBudgetData((prev) => {
        return prev.map((item) => {
          if (item.id !== id) {
            return item
          }

          const nextValue =
            typeof value === "number"
              ? value
              : field === "materials" || field === "labor" || field === "estimatedCost" || field === "actualCost" || field === "currentPaid" || field === "due"
              ? Number.parseFloat(value) || 0
              : value

          const updatedItem = {
            ...item,
            [field]: nextValue,
          } as BudgetItem

          updatedItem.variance = (updatedItem.estimatedCost || 0) - (updatedItem.currentPaid || 0)

          return updatedItem
        })
      })

      if (!projectId) {
        return
      }

      // Queue just the ID, not the full item (we'll get current state when flushing)
      saveQueueRef.current.add(id)
      setPendingSaves((prev) => new Set(prev).add(id))

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        flushPendingSaves()
      }, 1500)
    },
    [flushPendingSaves, projectId],
  )

  const handleInputBlur = useCallback(() => {
    flushPendingSaves()
  }, [flushPendingSaves])

  const calculateTotals = () => {
    const totalEstimated = budgetData.reduce((sum, item) => sum + item.estimatedCost, 0)
    const totalActual = budgetData.reduce((sum, item) => sum + item.actualCost, 0)
    const estimatedPPSF = livingAreaSqFt > 0 ? totalEstimated / livingAreaSqFt : 0
    const actualPPSF = livingAreaSqFt > 0 ? totalActual / livingAreaSqFt : 0

    return { totalEstimated, totalActual, estimatedPPSF, actualPPSF }
  }

  const deleteBudgetItem = useCallback(
    async (id: string) => {
    setBudgetData((prev) => prev.filter((item) => item.id !== id))

      try {
        await deleteBudgetItemFromSupabase(id)
      } catch (error) {
        console.error("Error deleting budget item", error)
        // Optionally reload data if deletion fails
        if (projectId) {
          setBudgetError("Unable to delete budget item. Please refresh and try again.")
        }
      }
    },
    [deleteBudgetItemFromSupabase, projectId],
  )

  const handleAddCustomItem = useCallback(
    (categoryName: string) => {
      const phaseItems = budgetData.filter((item) => item.category === categoryName)
      const inferredPhaseId = phaseItems[0]?.phaseId ?? phaseMaps.phaseIdByTitle.get(categoryName)
      const phaseId = inferredPhaseId ?? phaseMaps.seed[0]?.phaseId

      if (!phaseId) {
        console.warn("Unable to determine phase for custom item", { categoryName })
        return
      }

      const highestSortOrder = phaseItems.reduce((max, item) => Math.max(max, item.sortOrder ?? 0), -1)
      const defaultDescription = "Custom Item"
      const existingDescriptions = new Set(
        phaseItems.map((item) => item.description.trim().toLowerCase()).filter((value) => value.length > 0),
      )

      let description = defaultDescription
      let counter = 1
      while (existingDescriptions.has(description.trim().toLowerCase())) {
        counter += 1
        description = `${defaultDescription} ${counter}`
      }

      const tempId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? `temp-${crypto.randomUUID()}`
          : `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

      const newItem: BudgetItem = {
        id: tempId,
        projectId,
        phaseId,
        category: categoryName,
        description,
        materials: 0,
        labor: 0,
        vendor: "",
        estimatedCost: 0,
        actualCost: 0,
        currentPaid: 0,
        due: 0,
        variance: 0,
        sortOrder: highestSortOrder + 1,
        isCustom: true,
      }

      setBudgetData((prev) => [...prev, newItem])

      if (projectId) {
        saveQueueRef.current.add(newItem.id)
        setPendingSaves((prev) => new Set(prev).add(newItem.id))

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
          flushPendingSaves()
        }, 1500)
      }
    },
    [budgetData, flushPendingSaves, phaseMaps, projectId],
  )

  // Manage mounted state - runs only once on mount/unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // Cleanup pending saves on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      if (saveQueueRef.current.size > 0) {
        const itemIdsToSave = Array.from(saveQueueRef.current)
        saveQueueRef.current.clear()
        
        // Get current state of items to save
        const itemsToSave = itemIdsToSave
          .map((id) => budgetDataRef.current.find((item) => item.id === id))
          .filter((item): item is BudgetItem => item !== undefined)
          
        void Promise.all(itemsToSave.map((item) => saveBudgetItem(item))).catch((error) => {
          console.error("Failed to save debounced budget items", error)
        })
      }
    }
  }, [saveBudgetItem])

  const { totalEstimated, totalActual, estimatedPPSF, actualPPSF } = calculateTotals()
  const categories = categoriesFromJson.length > 0 ? categoriesFromJson : ["Uncategorized"]

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  const renderCategorySection = (categoryName: string) => {
    const categoryItems = budgetData.filter((item) => item.category === categoryName)
    const categoryEstimated = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0)
    const categoryActual = categoryItems.reduce((sum, item) => sum + item.actualCost, 0)
    const categoryVariance = categoryEstimated - categoryActual
    const variancePercent = categoryEstimated > 0 ? ((categoryActual - categoryEstimated) / categoryEstimated) * 100 : 0
    const isExpanded = expandedCategories[categoryName]

    // Determine variance color and status
    let varianceColor = "text-green-700"
    let varianceBgColor = "bg-green-100"
    let varianceLabel = "under"
    
    if (variancePercent > 5) {
      varianceColor = "text-red-700"
      varianceBgColor = "bg-red-100"
      varianceLabel = "over"
    } else if (variancePercent > -5 && variancePercent <= 5) {
      varianceColor = "text-yellow-700"
      varianceBgColor = "bg-yellow-100"
      varianceLabel = "on track"
    }

    return (
      <div key={categoryName} className="mb-2 border border-gray-200 rounded-lg">
        <div
          className="bg-cyan-50 border-b border-cyan-200 p-3 rounded-t-lg cursor-pointer hover:bg-cyan-100 transition-colors"
          onClick={() => toggleCategory(categoryName)}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <h3 className="font-semibold text-cyan-800 text-base">{categoryName}</h3>
            </div>
            <div className="flex items-center gap-8 text-base flex-1 justify-center">
              <span className="text-gray-700">
                <span className="font-semibold">Est:</span> ${categoryEstimated.toLocaleString()}
              </span>
              <span className="text-gray-700">
                <span className="font-semibold">Actual:</span> ${categoryActual.toLocaleString()}
              </span>
              <span className={`${varianceColor} font-semibold`}>
                <span>Variance:</span> {categoryVariance >= 0 ? "-" : "+"}$
                {Math.abs(categoryVariance).toLocaleString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${varianceBgColor} ${varianceColor}`}>
                {Math.abs(variancePercent).toFixed(1)}% {varianceLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isExpanded && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleAddCustomItem(categoryName)
                  }}
                >
                  Add Custom Item
                </Button>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-white">
            <div className="grid grid-cols-11 gap-2 p-3 bg-gray-50 border-b text-xs font-semibold text-gray-700 uppercase tracking-wide">
              <div className="col-span-2 text-center font-medium">Description</div>
              <div className="col-span-1 text-center font-medium">
                <div>Vendor/</div>
                <div>Subcontractor</div>
              </div>
              <div className="col-span-1 text-center font-medium">Materials</div>
              <div className="col-span-1 text-center font-medium">Labor</div>
              <div className="col-span-1 text-center font-medium">Total</div>
              <div className="col-span-1 text-center font-medium">Estimated Cost</div>
              <div className="col-span-1 text-center font-medium">Actual Cost</div>
              <div className="col-span-1 text-center font-medium">Current Paid</div>
              <div className="col-span-1 text-center font-medium">Due</div>
              <div className="col-span-1 text-center font-medium">Variance</div>
            </div>

            {categoryItems.map((item) => (
              <div key={item.id} className="grid grid-cols-11 gap-2 p-3 border-b hover:bg-gray-50 group">
                <div className="col-span-2">
                  <Input
                    value={item.description}
                    onChange={(e) => updateBudgetItem(item.id, "description", e.target.value)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={item.vendor}
                    onChange={(e) => updateBudgetItem(item.id, "vendor", e.target.value)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.materials || ""}
                    onChange={(e) => updateBudgetItem(item.id, "materials", Number.parseFloat(e.target.value) || 0)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.labor || ""}
                    onChange={(e) => updateBudgetItem(item.id, "labor", Number.parseFloat(e.target.value) || 0)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1 text-center text-xs font-medium">
                  ${((item.materials || 0) + (item.labor || 0)).toLocaleString()}
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.estimatedCost || ""}
                    onChange={(e) => updateBudgetItem(item.id, "estimatedCost", Number.parseFloat(e.target.value) || 0)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.actualCost || ""}
                    onChange={(e) => updateBudgetItem(item.id, "actualCost", Number.parseFloat(e.target.value) || 0)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.currentPaid || ""}
                    onChange={(e) => updateBudgetItem(item.id, "currentPaid", Number.parseFloat(e.target.value) || 0)}
                    onBlur={handleInputBlur}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1 text-center text-xs font-medium">
                  ${((item.actualCost || 0) - (item.currentPaid || 0)).toLocaleString()}
                </div>
                <div className="col-span-1 relative">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium">
                    <span>${item.variance.toLocaleString()}</span>
                    {pendingSaves.has(item.id) && (
                      <Loader2 className="h-3 w-3 animate-spin text-cyan-600" aria-label="Saving" />
                    )}
                  </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete budget item?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove “{item.description}” from the {item.category} phase. You can’t undo
                  this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    try {
                      await deleteBudgetItem(item.id)
                    } catch (error) {
                      console.error("Deletion failed", error)
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-x-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HOME BUILD BUDGET</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Living Area Sq Ft</div>
              <Input
                type="number"
                value={livingAreaSqFt}
                onChange={(e) => setLivingAreaSqFt(Number.parseInt(e.target.value) || 0)}
                className="mt-1 font-semibold"
                step="any"
                inputMode="numeric"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Structure Sq Ft</div>
              <Input
                type="number"
                value={structureSqFt}
                onChange={(e) => setStructureSqFt(Number.parseInt(e.target.value) || 0)}
                className="mt-1 font-semibold"
                step="any"
                inputMode="numeric"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Estimated Living PPSF</div>
              <div className="text-xl font-bold text-cyan-600">${estimatedPPSF.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">Finished Living PPSF</div>
              <div className="text-xl font-bold text-violet-600">${actualPPSF.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">TOTAL Estimated Cost</div>
              <div className="text-xl font-bold text-cyan-600">${totalEstimated.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-600">TOTAL Final Cost</div>
              <div className="text-xl font-bold text-violet-600">${totalActual.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-t-lg">
        <div className="grid grid-cols-12 gap-1 p-3 text-sm font-semibold text-gray-700">
          <div className="col-span-2">DESCRIPTION</div>
          <div className="col-span-1">MATERIALS</div>
          <div className="col-span-1">LABOR</div>
          <div className="col-span-1">TOTAL</div>
          <div className="col-span-2">VENDOR/SUBCONTRACTOR</div>
          <div className="col-span-1">ESTIMATED COST</div>
          <div className="col-span-1">ACTUAL COST</div>
          <div className="col-span-1">CURRENT PAID</div>
          <div className="col-span-2">% COMPLETE</div>
        </div>
      </div>

      <div className="border border-gray-300 border-t-0 rounded-b-lg bg-white p-4">
        {budgetError && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {budgetError}
          </div>
        )}
        {categories.map((category) => renderCategorySection(category))}
      </div>
    </div>
  )
}


