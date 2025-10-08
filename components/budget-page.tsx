"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
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
 
   useEffect(() => {
     async function loadBudgetData() {
       setIsLoadingBudget(true)
       setBudgetError(null)

      try {
        const seeded = phaseMaps.seed.map((item, index) => ({
          ...item,
          projectId,
          sortOrder: index,
        }))

        if (!projectId) {
          console.warn("Budget not saved: missing projectId")
          return
        }

        const { data, error } = await supabase
          .from("budget_items")
          .select("*")
          .eq("project_id", projectId)
          .order("sort_order", { ascending: true })

        if (error) {
          console.error("Failed to load budget items", error)
          setBudgetError("Unable to load saved budget items")
          console.warn("Unable to load budget data from Supabase")
          return
        }

        const storedItems: BudgetItem[] = (data ?? []).map((row) => {
          const matchingPhase = budgetAlignment.constructionMethods?.[selectedMethod]?.phases.find(
            (phase) => phase.phaseId === row.phase_id,
          )
          const parsedSortOrder = Number(row.sort_order ?? 0)
          const sortOrderValue = Number.isFinite(parsedSortOrder) ? parsedSortOrder : 0

          return {
            id: row.id,
            projectId: row.project_id,
            phaseId: row.phase_id,
            category: matchingPhase?.title ?? row.phase_id,
            description: row.description ?? "",
            materials: Number(row.materials ?? 0),
            labor: Number(row.labor ?? 0),
            vendor: row.vendor ?? "",
            estimatedCost: Number(row.estimated_cost ?? 0),
            actualCost: Number(row.actual_cost ?? 0),
            currentPaid: Number(row.current_paid ?? 0),
            due: Number(row.due ?? 0),
            variance: Number(row.estimated_cost ?? 0) - Number(row.current_paid ?? 0),
            sortOrder: sortOrderValue,
            isCustom: row.is_custom ?? false,
          }
        })

        // Merge stored data with seeded defaults
        const merged = mergeBudgetItems(seeded, storedItems, phaseMaps.phaseIdByTitle, phaseMaps.phaseTitleById)
        setBudgetData(merged)
      } finally {
        setIsLoadingBudget(false)
      }
    }

    loadBudgetData()
  }, [budgetAlignment, projectId, phaseMaps, selectedMethod])

  const saveBudgetItem = useCallback(
    async (item: BudgetItem) => {
      if (!projectId) {
        console.warn("Budget not saved: missing projectId")
        return item
      }

      setPendingSaves((prev) => new Set(prev).add(item.id))

      try {
        const payload = {
          id: isUuid(item.id) ? item.id : undefined,
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

        const { data, error } = await supabase
          .from("budget_items")
          .upsert(payload, { onConflict: "project_id,phase_id,description" })
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

        setBudgetData((prev) =>
          prev.map((existing) => (existing.id === item.id || existing.id === savedItem.id ? savedItem : existing)),
        )

        return savedItem
      } finally {
        setPendingSaves((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
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

          if (projectId) {
            void saveBudgetItem({ ...updatedItem, projectId })
          }

          return updatedItem
        })
      })
    },
    [projectId, saveBudgetItem],
  )

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
    const categoryTotal = categoryItems.reduce((sum, item) => sum + item.actualCost, 0)
    const isExpanded = expandedCategories[categoryName]

    return (
      <div key={categoryName} className="mb-2 border border-gray-200 rounded-lg">
        <div
          className="bg-cyan-50 border-b border-cyan-200 p-3 rounded-t-lg cursor-pointer hover:bg-cyan-100 transition-colors"
          onClick={() => toggleCategory(categoryName)}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <h3 className="font-semibold text-cyan-800">{categoryName}</h3>
            </div>
            <span className="font-semibold text-cyan-800">${categoryTotal.toLocaleString()}</span>
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
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    value={item.vendor}
                    onChange={(e) => updateBudgetItem(item.id, "vendor", e.target.value)}
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                  />
                </div>
                <div className="col-span-1">
                  <Input
                    type="number"
                    value={item.materials || ""}
                    onChange={(e) => updateBudgetItem(item.id, "materials", Number.parseFloat(e.target.value) || 0)}
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
                    className="border border-gray-300 p-1 h-auto bg-transparent focus:bg-white focus:border-cyan-500 text-center text-xs"
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1 text-center text-xs font-medium">
                  ${((item.actualCost || 0) - (item.currentPaid || 0)).toLocaleString()}
                </div>
                <div className="col-span-1 relative">
                  <div className="text-center text-xs font-medium">${item.variance.toLocaleString()}</div>
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
        {categories.map((category) => renderCategorySection(category))}
      </div>
    </div>
  )
}


