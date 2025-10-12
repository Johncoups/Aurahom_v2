"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Loader2, Trash2, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Download, Upload } from "lucide-react"

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

interface ValidationError {
  field: string
  message: string
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
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // Load expanded state from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("budget-expanded-categories")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return {}
        }
      }
    }
    return {}
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState<"all" | "over" | "under" | "ontrack">("all")
  const [validationErrors, setValidationErrors] = useState<Map<string, ValidationError[]>>(new Map())
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importPreviewData, setImportPreviewData] = useState<BudgetItem[]>([])
  const [importDuplicates, setImportDuplicates] = useState<string[]>([])
  const [importStrategy, setImportStrategy] = useState<"skip" | "replace" | "merge">("skip")
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

  // Save expanded state to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("budget-expanded-categories", JSON.stringify(expandedCategories))
    }
  }, [expandedCategories])

  // Validation functions
  const validateBudgetItem = useCallback((item: BudgetItem): ValidationError[] => {
    const errors: ValidationError[] = []

    // Validate numeric fields are not negative
    if (item.materials < 0) {
      errors.push({ field: "materials", message: "Materials cost cannot be negative" })
    }
    if (item.labor < 0) {
      errors.push({ field: "labor", message: "Labor cost cannot be negative" })
    }
    if (item.estimatedCost < 0) {
      errors.push({ field: "estimatedCost", message: "Estimated cost cannot be negative" })
    }
    if (item.actualCost < 0) {
      errors.push({ field: "actualCost", message: "Actual cost cannot be negative" })
    }
    if (item.currentPaid < 0) {
      errors.push({ field: "currentPaid", message: "Current paid cannot be negative" })
    }

    // Validate currentPaid doesn't exceed actualCost
    if (item.currentPaid > item.actualCost && item.actualCost > 0) {
      errors.push({ field: "currentPaid", message: "Paid amount cannot exceed actual cost" })
    }

    // Validate description is not empty
    if (!item.description.trim()) {
      errors.push({ field: "description", message: "Description is required" })
    }

    return errors
  }, [])

  const updateValidationErrors = useCallback((itemId: string, errors: ValidationError[]) => {
    setValidationErrors((prev) => {
      const newMap = new Map(prev)
      if (errors.length > 0) {
        newMap.set(itemId, errors)
      } else {
        newMap.delete(itemId)
      }
      return newMap
    })
  }, [])

  const hasValidationError = useCallback((itemId: string, field: string): boolean => {
    const errors = validationErrors.get(itemId)
    return errors ? errors.some((e) => e.field === field) : false
  }, [validationErrors])

  const getValidationErrorMessage = useCallback((itemId: string, field: string): string | undefined => {
    const errors = validationErrors.get(itemId)
    return errors?.find((e) => e.field === field)?.message
  }, [validationErrors])

  const saveBudgetItem = useCallback(
    async (item: BudgetItem) => {
      if (!projectId) {
        console.warn("Budget not saved: missing projectId")
        return item
      }

      // Check for validation errors before saving
      const errors = validateBudgetItem(item)
      if (errors.length > 0) {
        console.warn("Budget not saved: validation errors present", errors)
        updateValidationErrors(item.id, errors)
        setPendingSaves((prev) => {
          const next = new Set(prev)
          next.delete(item.id)
          return next
        })
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
    [projectId, supabase, validateBudgetItem, updateValidationErrors],
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
      let updatedItem: BudgetItem | null = null

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

          updatedItem = {
            ...item,
            [field]: nextValue,
          } as BudgetItem

          updatedItem.variance = (updatedItem.estimatedCost || 0) - (updatedItem.currentPaid || 0)

          return updatedItem
        })
      })

      // Validate the updated item
      if (updatedItem) {
        const errors = validateBudgetItem(updatedItem)
        updateValidationErrors(id, errors)
      }

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
    [flushPendingSaves, projectId, validateBudgetItem, updateValidationErrors],
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

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {}
    categories.forEach((category) => {
      allExpanded[category] = true
    })
    setExpandedCategories(allExpanded)
  }

  const collapseAll = () => {
    setExpandedCategories({})
  }

  // Filter budget items based on search query
  const filterBySearch = (item: BudgetItem): boolean => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      item.description.toLowerCase().includes(query) ||
      item.vendor.toLowerCase().includes(query)
    )
  }

  // Filter categories based on active filter
  const filterCategory = (categoryName: string): boolean => {
    if (activeFilter === "all") return true

    const categoryItems = budgetData.filter((item) => item.category === categoryName)
    const categoryEstimated = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0)
    const categoryActual = categoryItems.reduce((sum, item) => sum + item.actualCost, 0)
    const variancePercent = categoryEstimated > 0 ? ((categoryActual - categoryEstimated) / categoryEstimated) * 100 : 0

    if (activeFilter === "over") return variancePercent > 5
    if (activeFilter === "under") return variancePercent < -5
    if (activeFilter === "ontrack") return variancePercent >= -5 && variancePercent <= 5

    return true
  }

  // Export functionality
  const exportToCSV = useCallback(() => {
    const filteredItems = budgetData.filter((item) => {
      const categoryMatch = filterCategory(item.category)
      const searchMatch = filterBySearch(item)
      return categoryMatch && searchMatch
    })

    // CSV Headers
    const headers = [
      "Phase",
      "Description",
      "Vendor",
      "Materials",
      "Labor",
      "Estimated Cost",
      "Actual Cost",
      "Current Paid",
      "Due",
      "Variance",
      "Custom Item"
    ]

    // CSV Rows
    const rows = filteredItems.map((item) => [
      item.category,
      item.description,
      item.vendor,
      item.materials,
      item.labor,
      item.estimatedCost,
      item.actualCost,
      item.currentPaid,
      (item.actualCost || 0) - (item.currentPaid || 0), // Due (calculated)
      item.variance,
      item.isCustom ? "Yes" : "No"
    ])

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => 
        row.map((cell) => 
          typeof cell === "string" && cell.includes(",") 
            ? `"${cell}"` 
            : cell
        ).join(",")
      )
    ].join("\n")

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `budget_export_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [budgetData, filterBySearch, filterCategory])

  const exportToJSON = useCallback(() => {
    const filteredItems = budgetData.filter((item) => {
      const categoryMatch = filterCategory(item.category)
      const searchMatch = filterBySearch(item)
      return categoryMatch && searchMatch
    })

    const exportData = {
      exportDate: new Date().toISOString(),
      projectId: projectId,
      constructionMethod: selectedMethod,
      itemCount: filteredItems.length,
      items: filteredItems.map((item) => ({
        phase: item.category,
        description: item.description,
        vendor: item.vendor,
        materials: item.materials,
        labor: item.labor,
        estimatedCost: item.estimatedCost,
        actualCost: item.actualCost,
        currentPaid: item.currentPaid,
        due: (item.actualCost || 0) - (item.currentPaid || 0),
        variance: item.variance,
        isCustom: item.isCustom
      }))
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `budget_export_${new Date().toISOString().split("T")[0]}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [budgetData, filterBySearch, filterCategory, projectId, selectedMethod])

  // Import functionality
  const parseCSV = (csvText: string): BudgetItem[] => {
    const lines = csvText.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""))
    const items: BudgetItem[] = []

    // Helper function to parse CSV line respecting quoted fields
    const parseCSVLine = (line: string): string[] => {
      const result: string[] = []
      let current = ""
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ""
        } else {
          current += char
        }
      }
      result.push(current.trim())
      return result
    }

    // Helper to parse currency/number strings (handles commas, dollar signs)
    const parseNumber = (value: string): number => {
      if (!value || value === "") return 0
      // Remove dollar signs, commas, and whitespace
      const cleaned = value.replace(/[$,\s]/g, "")
      const parsed = Number.parseFloat(cleaned)
      return isNaN(parsed) ? 0 : parsed
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      
      const item: BudgetItem = {
        id: `temp-${Date.now()}-${i}`,
        projectId: projectId,
        phaseId: "", // Will be set from category mapping
        category: values[0] || "",
        description: values[1] || "",
        vendor: values[2] || "",
        materials: parseNumber(values[3]),
        labor: parseNumber(values[4]),
        estimatedCost: parseNumber(values[5]),
        actualCost: parseNumber(values[6]),
        currentPaid: parseNumber(values[7]),
        due: parseNumber(values[8]),
        variance: parseNumber(values[9]),
        sortOrder: i,
        isCustom: values[10]?.toLowerCase() === "yes"
      }

      // Map category to phaseId
      const phaseMapping = categories.find(c => c === item.category)
      if (phaseMapping) {
        const phase = budgetAlignment.constructionMethods[selectedMethod]?.phases.find(
          p => p.title === item.category
        )
        item.phaseId = phase?.phaseId || "unknown"
      }

      items.push(item)
    }

    return items
  }

  const parseJSON = (jsonText: string): BudgetItem[] => {
    try {
      const data = JSON.parse(jsonText)
      const items = data.items || []

      return items.map((item: any, index: number) => {
        const budgetItem: BudgetItem = {
          id: `temp-${Date.now()}-${index}`,
          projectId: projectId,
          phaseId: "",
          category: item.phase || "",
          description: item.description || "",
          vendor: item.vendor || "",
          materials: Number.parseFloat(item.materials) || 0,
          labor: Number.parseFloat(item.labor) || 0,
          estimatedCost: Number.parseFloat(item.estimatedCost) || 0,
          actualCost: Number.parseFloat(item.actualCost) || 0,
          currentPaid: Number.parseFloat(item.currentPaid) || 0,
          due: Number.parseFloat(item.due) || 0,
          variance: Number.parseFloat(item.variance) || 0,
          sortOrder: index,
          isCustom: item.isCustom === true
        }

        // Map category to phaseId
        const phase = budgetAlignment.constructionMethods[selectedMethod]?.phases.find(
          p => p.title === budgetItem.category
        )
        budgetItem.phaseId = phase?.phaseId || "unknown"

        return budgetItem
      })
    } catch (error) {
      console.error("Failed to parse JSON:", error)
      return []
    }
  }

  const detectDuplicates = (importedItems: BudgetItem[]): string[] => {
    const duplicateIds: string[] = []
    
    importedItems.forEach((importItem) => {
      const exists = budgetData.some((existingItem) => 
        existingItem.projectId === importItem.projectId &&
        existingItem.phaseId === importItem.phaseId &&
        existingItem.description.toLowerCase() === importItem.description.toLowerCase()
      )
      
      if (exists) {
        duplicateIds.push(importItem.id)
      }
    })

    return duplicateIds
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      let items: BudgetItem[] = []

      if (file.name.endsWith(".csv")) {
        items = parseCSV(text)
      } else if (file.name.endsWith(".json")) {
        items = parseJSON(text)
      }

      if (items.length > 0) {
        console.log("📥 Parsed import items:", items.length)
        console.log("📄 Sample item:", items[0])
        const duplicates = detectDuplicates(items)
        console.log("🔍 Detected duplicates:", duplicates.length)
        setImportPreviewData(items)
        setImportDuplicates(duplicates)
        setShowImportDialog(true)
      } else {
        console.warn("⚠️ No items parsed from file")
      }
    }

    reader.readAsText(file)
    event.target.value = "" // Reset input
  }

  const commitImport = async () => {
    console.log("🚀 Starting import with strategy:", importStrategy)
    console.log("📦 Items to process:", importPreviewData.length)
    console.log("⚠️ Duplicates detected:", importDuplicates.length)

    const itemsToImport = importPreviewData.filter((item) => {
      if (importStrategy === "skip") {
        return !importDuplicates.includes(item.id)
      }
      return true // replace or merge strategy
    })

    console.log("✅ Items after filter:", itemsToImport.length)
    let updatedCount = 0
    let newCount = 0

    for (const item of itemsToImport) {
      const isDuplicate = importDuplicates.includes(item.id)
      
      if (isDuplicate) {
        // Find the existing item
        const existing = budgetData.find((e) => 
          e.phaseId === item.phaseId && 
          e.description.toLowerCase() === item.description.toLowerCase()
        )

        if (existing) {
          console.log(`🔄 ${importStrategy} duplicate:`, item.description, "| Vendor:", item.vendor)
          if (importStrategy === "replace") {
            // Replace: Update existing item with all imported data, keeping the real UUID
            const replacedItem: BudgetItem = {
              ...item,
              id: existing.id, // Keep the real UUID
              projectId: existing.projectId,
              phaseId: existing.phaseId,
              sortOrder: existing.sortOrder,
              isCustom: existing.isCustom,
            }
            
            // Validate before saving
            const errors = validateBudgetItem(replacedItem)
            if (errors.length === 0) {
              await saveBudgetItem(replacedItem)
              updatedCount++
            } else {
              console.warn("❌ Validation errors for", item.description, errors)
            }
          } else if (importStrategy === "merge") {
            // Merge: Update existing item with imported data, keeping the real UUID
            const mergedItem: BudgetItem = {
              ...existing, // Keep existing data including real UUID
              vendor: item.vendor.trim() !== "" ? item.vendor : existing.vendor,
              materials: item.materials,
              labor: item.labor,
              estimatedCost: item.estimatedCost,
              actualCost: item.actualCost,
              currentPaid: item.currentPaid,
              due: (item.actualCost || 0) - (item.currentPaid || 0), // Recalculate
              variance: (item.estimatedCost || 0) - (item.currentPaid || 0), // Recalculate
              // Keep existing id, projectId, phaseId, category, description, sortOrder, isCustom
            }

            console.log("  📝 Merged values:", {
              vendor: mergedItem.vendor,
              materials: mergedItem.materials,
              estimatedCost: mergedItem.estimatedCost,
              actualCost: mergedItem.actualCost
            })

            // Validate before saving
            const errors = validateBudgetItem(mergedItem)
            if (errors.length === 0) {
              await saveBudgetItem(mergedItem)
              updatedCount++
            } else {
              console.warn("❌ Validation errors for", item.description, errors)
            }
          }
        } else {
          console.warn("⚠️ Could not find existing item for:", item.description)
        }
      } else {
        // New item - just import it
        console.log("✨ Adding new item:", item.description)
        const errors = validateBudgetItem(item)
        if (errors.length === 0) {
          await saveBudgetItem(item)
          newCount++
        } else {
          console.warn("❌ Validation errors for", item.description, errors)
        }
      }
    }

    console.log(`✅ Import complete! Updated: ${updatedCount}, New: ${newCount}`)

    // Reload data
    await loadBudgetData()
    
    // Close dialog and reset
    setShowImportDialog(false)
    setImportPreviewData([])
    setImportDuplicates([])
  }

  // Get filtered categories
  const filteredCategories = categories.filter(filterCategory)

  const renderCategorySection = (categoryName: string) => {
    const categoryItems = budgetData.filter((item) => item.category === categoryName && filterBySearch(item))
    const categoryEstimated = categoryItems.reduce((sum, item) => sum + item.estimatedCost, 0)
    const categoryActual = categoryItems.reduce((sum, item) => sum + item.actualCost, 0)
    const categoryVariance = categoryEstimated - categoryActual
    const variancePercent = categoryEstimated > 0 ? ((categoryActual - categoryEstimated) / categoryEstimated) * 100 : 0
    
    // Auto-expand phases with search matches, otherwise use saved state
    const isExpanded = searchQuery.trim() 
      ? categoryItems.length > 0 
      : expandedCategories[categoryName]

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
          <div className="grid grid-cols-12 items-center gap-4 w-full">
            {/* Phase name - col 1-3 */}
            <div className="col-span-3 flex items-center gap-3">
              {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <h3 className="font-semibold text-cyan-800 text-base">{categoryName}</h3>
            </div>
            
            {/* Estimated - col 4-5 */}
            <div className="col-span-2 text-gray-700 text-base text-right">
              <span className="font-semibold">Est:</span> ${categoryEstimated.toLocaleString()}
            </div>
            
            {/* Actual - col 6-7 */}
            <div className="col-span-2 text-gray-700 text-base text-right">
              <span className="font-semibold">Actual:</span> ${categoryActual.toLocaleString()}
            </div>
            
            {/* Variance - col 8-9 */}
            <div className={`col-span-2 ${varianceColor} font-semibold text-base text-right`}>
              <span>Variance:</span> {categoryVariance >= 0 ? "-" : "+"}$
              {Math.abs(categoryVariance).toLocaleString()}
            </div>
            
            {/* Badge - col 10 */}
            <div className="col-span-2 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${varianceBgColor} ${varianceColor} whitespace-nowrap`}>
                {Math.abs(variancePercent).toFixed(1)}% {varianceLabel}
              </span>
            </div>
            
            {/* Button - col 11-12 */}
            <div className="col-span-1 flex items-center justify-end">
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white ${
                      hasValidationError(item.id, "description")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "description")}
                  />
                  {hasValidationError(item.id, "description") && (
                    <div className="text-xs text-red-600 mt-1">
                      {getValidationErrorMessage(item.id, "description")}
                    </div>
                  )}
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white text-center text-xs ${
                      hasValidationError(item.id, "materials")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "materials")}
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white text-center text-xs ${
                      hasValidationError(item.id, "labor")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "labor")}
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white text-center text-xs ${
                      hasValidationError(item.id, "estimatedCost")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "estimatedCost")}
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white text-center text-xs ${
                      hasValidationError(item.id, "actualCost")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "actualCost")}
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
                    className={`border p-1 h-auto bg-transparent focus:bg-white text-center text-xs ${
                      hasValidationError(item.id, "currentPaid")
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-cyan-500"
                    }`}
                    title={getValidationErrorMessage(item.id, "currentPaid")}
                    step="any"
                    inputMode="numeric"
                  />
                </div>
                <div className="col-span-1 text-center text-xs font-medium">
                  ${((item.actualCost || 0) - (item.currentPaid || 0)).toLocaleString()}
                </div>
                <div className="col-span-1 relative">
                  <div className={`flex items-center justify-center gap-2 text-xs font-medium ${
                    item.actualCost > item.estimatedCost && item.estimatedCost > 0
                      ? "text-red-600 font-bold bg-red-50 rounded px-2 py-1"
                      : ""
                  }`}>
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

      {/* Search and Filter Toolbar */}
      <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by description or vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Dropdown */}
          <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as typeof activeFilter)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter phases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Phases</SelectItem>
              <SelectItem value="over">Over Budget</SelectItem>
              <SelectItem value="under">Under Budget</SelectItem>
              <SelectItem value="ontrack">On Track</SelectItem>
            </SelectContent>
          </Select>

          {/* Expand/Collapse Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={expandAll}>
              <ChevronDown className="h-4 w-4 mr-1" />
              Expand All
            </Button>
            <Button variant="outline" size="sm" onClick={collapseAll}>
              <ChevronRight className="h-4 w-4 mr-1" />
              Collapse All
            </Button>
          </div>

          {/* Import/Export Buttons */}
          <div className="flex items-center gap-2 border-l pl-4 border-gray-300">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={exportToJSON}>
              <Download className="h-4 w-4 mr-1" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById("budget-import-file")?.click()}>
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
            <input
              id="budget-import-file"
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
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
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => renderCategorySection(category))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No phases match your current filters. Try adjusting your search or filter settings.
          </div>
        )}
      </div>

      {/* Import Preview Dialog */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Import Budget Data</h2>
              <p className="text-sm text-gray-600 mt-2">
                Review and configure import settings before adding items to your budget.
              </p>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Summary */}
              <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-cyan-800">{importPreviewData.length}</div>
                    <div className="text-sm text-gray-600">Total Items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-700">
                      {importPreviewData.length - importDuplicates.length}
                    </div>
                    <div className="text-sm text-gray-600">New Items</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-700">{importDuplicates.length}</div>
                    <div className="text-sm text-gray-600">Duplicates</div>
                  </div>
                </div>
              </div>

              {/* Duplicate Strategy */}
              {importDuplicates.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duplicate Handling Strategy:
                  </label>
                  <Select value={importStrategy} onValueChange={(value: any) => setImportStrategy(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Skip Duplicates - Keep existing items</SelectItem>
                      <SelectItem value="replace">Replace Duplicates - Overwrite with imported data</SelectItem>
                      <SelectItem value="merge">Merge - Update only non-empty fields</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Preview Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="font-semibold text-gray-900">Preview Items</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Phase</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">Description</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Estimated</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">Actual</th>
                        <th className="px-3 py-2 text-center font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importPreviewData.map((item) => {
                        const isDuplicate = importDuplicates.includes(item.id)
                        const willImport = importStrategy !== "skip" || !isDuplicate

                        return (
                          <tr
                            key={item.id}
                            className={`border-b ${
                              isDuplicate ? "bg-orange-50" : "bg-white"
                            } ${!willImport ? "opacity-50" : ""}`}
                          >
                            <td className="px-3 py-2 text-gray-700">{item.category}</td>
                            <td className="px-3 py-2 text-gray-700">{item.description}</td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              ${item.estimatedCost.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-right text-gray-700">
                              ${item.actualCost.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-center">
                              {isDuplicate ? (
                                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-semibold">
                                  Duplicate
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                  New
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImportDialog(false)
                  setImportPreviewData([])
                  setImportDuplicates([])
                }}
              >
                Cancel
              </Button>
              <Button onClick={commitImport} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Import {importStrategy === "skip" ? importPreviewData.length - importDuplicates.length : importPreviewData.length} Items
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


