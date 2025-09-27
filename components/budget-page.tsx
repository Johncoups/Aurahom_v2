"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import budgetPhaseAlignment from "@/budget-phase-alignment.json"

interface BudgetItem {
  id: string
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

const buildInitialBudgetData = (
  alignment: BudgetPhaseAlignmentFile,
  constructionMethod: string,
): BudgetItem[] => {
  const phases = alignment.constructionMethods?.[constructionMethod]?.phases ?? []
  const sortedPhases = [...phases].sort((a, b) => a.order - b.order)
  const budgetItems = alignment.budgetItems ?? []
  const categoryByIndex = new Map<number, string>()

  sortedPhases.forEach((phase) => {
    phase.budgetItems.forEach((budgetIndex) => {
      if (budgetIndex < 0 || budgetIndex >= budgetItems.length) {
        return
      }

      if (!categoryByIndex.has(budgetIndex)) {
        categoryByIndex.set(budgetIndex, phase.title)
      }
    })
  })

  const fallbackCategory = sortedPhases[0]?.title ?? "Uncategorized"

  return budgetItems.map((description, index) => ({
    id: `${index + 1}`,
    category: categoryByIndex.get(index) ?? fallbackCategory,
    description,
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
  }))
}

export function BudgetPage() {
  const [livingAreaSqFt, setLivingAreaSqFt] = useState(2500)
  const [structureSqFt, setStructureSqFt] = useState(2800)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})
  const budgetAlignment = budgetPhaseAlignment as BudgetPhaseAlignmentFile
  const categoriesFromJson = useMemo(() => {
    const phases = budgetAlignment.constructionMethods?.[DEFAULT_CONSTRUCTION_METHOD]?.phases ?? []
    const titles = phases.map((phase) => phase.title)
    const missing = budgetAlignment.notes?.missingCategories ?? []
    return Array.from(new Set([...titles, ...missing]))
  }, [budgetAlignment])

  const [budgetData, setBudgetData] = useState<BudgetItem[]>(() =>
    buildInitialBudgetData(budgetAlignment, DEFAULT_CONSTRUCTION_METHOD),
  )

  const updateBudgetItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setBudgetData((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          // Calculate variance as estimatedCost - currentPaid
          updatedItem.variance = (updatedItem.estimatedCost || 0) - (updatedItem.currentPaid || 0)
          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const totalEstimated = budgetData.reduce((sum, item) => sum + item.estimatedCost, 0)
    const totalActual = budgetData.reduce((sum, item) => sum + item.actualCost, 0)
    const estimatedPPSF = livingAreaSqFt > 0 ? totalEstimated / livingAreaSqFt : 0
    const actualPPSF = livingAreaSqFt > 0 ? totalActual / livingAreaSqFt : 0

    return { totalEstimated, totalActual, estimatedPPSF, actualPPSF }
  }

  const deleteBudgetItem = (id: string) => {
    setBudgetData((prev) => prev.filter((item) => item.id !== id))
  }

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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteBudgetItem(item.id)}
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
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
