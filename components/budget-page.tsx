"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function BudgetPage() {
  const [livingAreaSqFt, setLivingAreaSqFt] = useState(2500)
  const [structureSqFt, setStructureSqFt] = useState(2800)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const [budgetData, setBudgetData] = useState<BudgetItem[]>([
    // General Requirements
    {
      id: "1",
      category: "GENERAL REQUIREMENTS",
      description: "Plans and Specifications",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "2",
      category: "GENERAL REQUIREMENTS",
      description: "Plan Review",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "3",
      category: "GENERAL REQUIREMENTS",
      description: "Permits: Zoning, Building, Environmental, Other",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "4",
      category: "GENERAL REQUIREMENTS",
      description: "Survey",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "5",
      category: "GENERAL REQUIREMENTS",
      description: "Impact Fee",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "6",
      category: "GENERAL REQUIREMENTS",
      description: "Administrative Costs",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "7",
      category: "GENERAL REQUIREMENTS",
      description: "Financing Costs",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "8",
      category: "GENERAL REQUIREMENTS",
      description: "Legal Fees",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "9",
      category: "GENERAL REQUIREMENTS",
      description: "Engineering Fees",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "10",
      category: "GENERAL REQUIREMENTS",
      description: "Insurance",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Site Prep
    {
      id: "11",
      category: "SITE PREP",
      description: "Demolition (Remodel)",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "12",
      category: "SITE PREP",
      description: "Jacking & Shoring (Remodel)",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "13",
      category: "SITE PREP",
      description: "Dust control, Surface Protection (Remodel)",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "14",
      category: "SITE PREP",
      description: "Job-Site Access",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "15",
      category: "SITE PREP",
      description: "Job-Site Security",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "16",
      category: "SITE PREP",
      description: "Dumpster & Removal",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "17",
      category: "SITE PREP",
      description: "Clear Lot",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "18",
      category: "SITE PREP",
      description: "Storage On Site",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "19",
      category: "SITE PREP",
      description: "Portable Toilet",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "20",
      category: "SITE PREP",
      description: "Temporary Power",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "21",
      category: "SITE PREP",
      description: "Temporary Heat",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "22",
      category: "SITE PREP",
      description: "Scaffolding Rental",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "23",
      category: "SITE PREP",
      description: "Tool/Equipment Rental",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // On-Site Water/Sewer
    {
      id: "24",
      category: "ON-SITE WATER/SEWER",
      description: "Soil & Perc Tests",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "25",
      category: "ON-SITE WATER/SEWER",
      description: "Septic System Design",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "26",
      category: "ON-SITE WATER/SEWER",
      description: "Septic Permits, Inspections, Fees",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "27",
      category: "ON-SITE WATER/SEWER",
      description: "Septic System Installation, Tie In To House",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "28",
      category: "ON-SITE WATER/SEWER",
      description: "Well, Pump, Trenching, Plumbing To House, Pressure Tank",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "29",
      category: "ON-SITE WATER/SEWER",
      description: "Well Permits & Fees",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Utilities
    {
      id: "30",
      category: "UTILITIES",
      description: "Town Water: Tap Fees & Hookup",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "31",
      category: "UTILITIES",
      description: "Town Sewer: Tap Fees & Hookup",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "32",
      category: "UTILITIES",
      description: "Electrical: Permit, Connection Fee, Installation",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "33",
      category: "UTILITIES",
      description: "Gas: Permit, Connection Fee, Hookup",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "34",
      category: "UTILITIES",
      description: "LPN: Tank Installation, Hookup",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "35",
      category: "UTILITIES",
      description: "Oil Tank Installation",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "36",
      category: "UTILITIES",
      description: "Telecom Hookup",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Excavation & Earthwork
    {
      id: "37",
      category: "EXCAVATION & EARTHWORK",
      description: "Cut & Fill",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "38",
      category: "EXCAVATION & EARTHWORK",
      description: "Blasting",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "39",
      category: "EXCAVATION & EARTHWORK",
      description: "Removal Of Stone/Dirt",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "40",
      category: "EXCAVATION & EARTHWORK",
      description: "Rough Grading",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "41",
      category: "EXCAVATION & EARTHWORK",
      description: "Trenching For Utility Hookups",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "42",
      category: "EXCAVATION & EARTHWORK",
      description: "Foundation Excavation",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "43",
      category: "EXCAVATION & EARTHWORK",
      description: "Foundation Footing Drains",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "44",
      category: "EXCAVATION & EARTHWORK",
      description: "Backfill",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "45",
      category: "EXCAVATION & EARTHWORK",
      description: "Compaction",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "46",
      category: "EXCAVATION & EARTHWORK",
      description: "Curtain Drains",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "47",
      category: "EXCAVATION & EARTHWORK",
      description: "Swales",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "48",
      category: "EXCAVATION & EARTHWORK",
      description: "Retaining Walls",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "49",
      category: "EXCAVATION & EARTHWORK",
      description: "Ponds",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "50",
      category: "EXCAVATION & EARTHWORK",
      description: "Other Site Drainage",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "51",
      category: "EXCAVATION & EARTHWORK",
      description: "Topsoil",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "52",
      category: "EXCAVATION & EARTHWORK",
      description: "Finish Grading",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "53",
      category: "EXCAVATION & EARTHWORK",
      description: "Seeding/Sod",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "54",
      category: "EXCAVATION & EARTHWORK",
      description: "Plantings, Landscaping",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Foundation
    {
      id: "55",
      category: "FOUNDATION",
      description: "Footings/Pads",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "56",
      category: "FOUNDATION",
      description: "Foundation walls/stem walls/grade beams",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "57",
      category: "FOUNDATION",
      description: "Piers",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "58",
      category: "FOUNDATION",
      description: "Slabs: Foundation, Basement, Garage",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "59",
      category: "FOUNDATION",
      description: "Steel Reinforcing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "60",
      category: "FOUNDATION",
      description: "Anchor Bolts, Hold Downs",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "61",
      category: "FOUNDATION",
      description: "Bulkheads",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "62",
      category: "FOUNDATION",
      description: "Sub-Slab Vapor Barrier",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "63",
      category: "FOUNDATION",
      description: "Sump Pump",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "64",
      category: "FOUNDATION",
      description: "Crawlspace Vapor Barrier",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "65",
      category: "FOUNDATION",
      description: "Crawlspace Vents",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "66",
      category: "FOUNDATION",
      description: "Foundation Windows",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "67",
      category: "FOUNDATION",
      description: "Dampproofing, Waterproofing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "68",
      category: "FOUNDATION",
      description: "Foundation Drain Board",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "69",
      category: "FOUNDATION",
      description: "Slab insulation: Edge/Below",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "70",
      category: "FOUNDATION",
      description: "Exterior Foundation Insulation",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "71",
      category: "FOUNDATION",
      description: "Exterior Insulation Coating/Protection",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Other Masonry/Paving
    {
      id: "72",
      category: "OTHER MASONRY/PAVING",
      description: "Patios",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "73",
      category: "OTHER MASONRY/PAVING",
      description: "Exterior Stairs",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "74",
      category: "OTHER MASONRY/PAVING",
      description: "Masonry Chimneys",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "75",
      category: "OTHER MASONRY/PAVING",
      description: "Fireplaces/Hearths",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "76",
      category: "OTHER MASONRY/PAVING",
      description: "Driveway",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "77",
      category: "OTHER MASONRY/PAVING",
      description: "Walkways",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Rough Framing
    {
      id: "78",
      category: "ROUGH FRAMING",
      description: "Sill & Seal",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "79",
      category: "ROUGH FRAMING",
      description: "Steel/Wood Carrying Beam, Lolly columns",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "80",
      category: "ROUGH FRAMING",
      description: "Floor Framing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "81",
      category: "ROUGH FRAMING",
      description: "Exterior & Interior Walls, Rough Stairs",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "82",
      category: "ROUGH FRAMING",
      description: "Sheathing, Subflooring",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "83",
      category: "ROUGH FRAMING",
      description: "Roof Framing/Trusses",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "84",
      category: "ROUGH FRAMING",
      description: "Subfascia",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "85",
      category: "ROUGH FRAMING",
      description: "Steel Framing Connectors",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "86",
      category: "ROUGH FRAMING",
      description: "Nails, Screws, Fasteners",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "87",
      category: "ROUGH FRAMING",
      description: "Prep for Plaster, Drywall",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "88",
      category: "ROUGH FRAMING",
      description: "Rough Framing - Labor Only",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Roofing
    {
      id: "89",
      category: "ROOFING",
      description: "Underlayment",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "90",
      category: "ROOFING",
      description: "Membrane",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "91",
      category: "ROOFING",
      description: "Flashing: Chimney, Vent Pipes, Sidewalls, Other Penetrations",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "92",
      category: "ROOFING",
      description: "Drip Edge",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "93",
      category: "ROOFING",
      description: "Roofing Installation",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "94",
      category: "ROOFING",
      description: "Gutters & Downspouts",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "95",
      category: "ROOFING",
      description: "Skylights",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "96",
      category: "ROOFING",
      description: "Ridge and roof vents",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Plumbing
    {
      id: "97",
      category: "PLUMBING",
      description: "Drain/Waste/Vent",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "98",
      category: "PLUMBING",
      description: "Water Supply Piping",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "99",
      category: "PLUMBING",
      description: "Gas Piping",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "100",
      category: "PLUMBING",
      description: "Water Treatment",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "101",
      category: "PLUMBING",
      description: "Water Heater",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "102",
      category: "PLUMBING",
      description: "Fixtures: Toilets, Tubs, Sinks, Showers",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "103",
      category: "PLUMBING",
      description: "Faucets, Mixing Valves, Shower Heads",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "104",
      category: "PLUMBING",
      description: "Disposal",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Electrical
    {
      id: "105",
      category: "ELECTRICAL",
      description: "Service Panel, Sub-Panels",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "106",
      category: "ELECTRICAL",
      description: "Rough Wiring",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "107",
      category: "ELECTRICAL",
      description: "Phone, Cable, Internet Wiring",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "108",
      category: "ELECTRICAL",
      description: "Lighting Fixtures",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "109",
      category: "ELECTRICAL",
      description: "Devices: outlets, switches, dimmers",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "110",
      category: "ELECTRICAL",
      description: "Smoke, CO2 Alarms",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // HVAC
    {
      id: "111",
      category: "HVAC",
      description: "Furnace/Heat Pump",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "112",
      category: "HVAC",
      description: "Central AC",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "113",
      category: "HVAC",
      description: "Ductwork, Grilles, Registers",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "114",
      category: "HVAC",
      description: "HVAC Controls",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Kitchen & Bath
    {
      id: "115",
      category: "Kitchen & Bath",
      description: "Kitchen Cabinets",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "116",
      category: "Kitchen & Bath",
      description: "Bath Cabinets",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "117",
      category: "Kitchen & Bath",
      description: "Countertops, Backsplash",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // Appliances
    {
      id: "118",
      category: "Appliances",
      description: "Refrigerator",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "119",
      category: "Appliances",
      description: "Range, Cooktop",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "120",
      category: "Appliances",
      description: "Dishwasher",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },

    // EXTERIOR
    {
      id: "121",
      category: "EXTERIOR",
      description: "Exterior Foam Sheathing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "122",
      category: "EXTERIOR",
      description: "Weather Barrier (Tyvek, etc.)",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "123",
      category: "EXTERIOR",
      description: "Membrane & Flashing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "124",
      category: "EXTERIOR",
      description: "Siding Finish",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "125",
      category: "EXTERIOR",
      description: "Stone/Brick Veneer",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "126",
      category: "EXTERIOR",
      description: "Fascia, Soffit, Frieze, Corner Boards, Water Table",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "127",
      category: "EXTERIOR",
      description: "Soffit/Gable vents",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "128",
      category: "EXTERIOR",
      description: "Window/Door Trim",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "129",
      category: "EXTERIOR",
      description: "Other Exterior Trim",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "130",
      category: "EXTERIOR",
      description: "Exterior Stairs, Landing",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
    {
      id: "131",
      category: "EXTERIOR",
      description: "Exterior Paint, Stain, Caulk",
      materials: 0,
      labor: 0,
      vendor: "",
      estimatedCost: 0,
      actualCost: 0,
      currentPaid: 0,
      due: 0,
      variance: 0,
    },
  ])

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

  const categories = [
    "GENERAL REQUIREMENTS",
    "SITE PREP",
    "ON-SITE WATER/SEWER",
    "UTILITIES",
    "EXCAVATION & EARTHWORK",
    "FOUNDATION",
    "OTHER MASONRY/PAVING",
    "ROUGH FRAMING",
    "ROOFING",
    "EXTERIOR",
    "WINDOWS/EXTERIOR DOORS",
    "PLUMBING",
    "ELECTRICAL",
    "HVAC",
    "INSULATION & AIR SEALING",
    "DRYWALL/PLASTER",
    "INTERIOR FINISH",
    "Kitchen & Bath",
    "Porches & Decks",
    "Appliances",
  ]

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
