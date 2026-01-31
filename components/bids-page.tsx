"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, Edit2, Mail, Send, Phone, Star, Check, ArrowLeft, Plus, X, Trash2 } from "lucide-react"
import { useBids } from "@/contexts/bids-context"
import { useRoadmap } from "@/contexts/roadmap-context"
import { useAuth } from "@/contexts/auth-context"
import { EmailDraftModal } from "@/components/email-draft-modal"
import { sendBidRequestViaAurahom, ensureVendorForUser } from "@/app/actions/sendBidRequestViaAurahom"
import { toast } from "sonner"
import { getPhasesForMethod } from "@/lib/roadmap-phases"
import type { ConstructionMethod } from "@/lib/roadmap-types"

interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  contactName?: string // Contact person at the vendor company
  status: "Not Requested" | "Pending" | "Bid Received" | "Bid Accepted"
  rating?: {
    platform: "Google" | "Facebook"
    score: number
    reviews: number
  }
  socialMedia?: {
    platform: "Facebook" | "Instagram" | "LinkedIn" | "TikTok" | "Snapchat" | "Reddit" | "Quora"
    handle: string
  }[]
  foundVia?: ("Google" | "Facebook" | "Snapchat" | "TikTok" | "Reddit" | "Quora")[]
}

interface SubPhase {
  id: string
  title: string
  vendors: Vendor[]
}

interface Phase {
  id: string
  title: string
  subPhases: SubPhase[]
  isExpanded: boolean
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function BidsPage() {
  const { setSelectedVendor, selectedVendor } = useBids()
  const { profile, roadmap, activeProjectId } = useRoadmap()
  const { user } = useAuth()
  const [isEmailDraftModalOpen, setIsEmailDraftModalOpen] = useState(false)
  // Build phases from full construction phase list (all trades needed to build a house)
  const constructionMethod = (profile?.constructionMethod && profile.constructionMethod !== ""
    ? profile.constructionMethod
    : "traditional-frame") as ConstructionMethod
  // Exclude "Just Starting" from Bids page; resequence display numbers (UI only, no DB change)
  const initialPhases = useMemo<Phase[]>(() => {
    const baseline = getPhasesForMethod(constructionMethod).filter((p) => p.id !== "just-starting")
    return baseline.map((phase, index) => ({
      id: phase.id,
      title: `${index + 1}. ${phase.title}`,
      isExpanded: false,
      subPhases: [{ id: phase.id, title: phase.title, vendors: [] as Vendor[] }],
    }))
  }, [constructionMethod])
  const [phases, setPhases] = useState<Phase[]>(initialPhases)
  const isInitialMount = useRef(true)
  // When construction method changes (e.g. profile loads), reinitialize phase list
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const baseline = getPhasesForMethod(constructionMethod).filter((p) => p.id !== "just-starting")
    setPhases(
      baseline.map((phase, index) => ({
        id: phase.id,
        title: `${index + 1}. ${phase.title}`,
        isExpanded: false,
        subPhases: [{ id: phase.id, title: phase.title, vendors: [] as Vendor[] }],
      }))
    )
  }, [constructionMethod])

  const [selectedSubPhase, setSelectedSubPhase] = useState<SubPhase | null>(null)
  const [selectedSubPhaseContext, setSelectedSubPhaseContext] = useState<{ phaseId: string; subPhaseId: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<string | null>(null)
  const [vendorToDelete, setVendorToDelete] = useState<{ phaseId: string; subPhaseId: string; vendorId: string; vendorName: string } | null>(null)
  const [selectedVendorsForBid, setSelectedVendorsForBid] = useState<Set<string>>(new Set())
  const [bidRequestStep, setBidRequestStep] = useState<"select-vendors" | "choose-method">("select-vendors")
  const [isAddingVendor, setIsAddingVendor] = useState(false)
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    contactName: "",
    tradeCategory: "",
    socialMedia: [] as { platform: string; handle: string }[],
    foundVia: [] as string[]
  })
  const [newSocialMedia, setNewSocialMedia] = useState({ platform: "", handle: "" })

  const togglePhase = (phaseId: string) => {
    setPhases(phases.map((phase) => (phase.id === phaseId ? { ...phase, isExpanded: !phase.isExpanded } : phase)))
  }

  const handleRequestBids = (subPhase: SubPhase, phaseId: string) => {
    setSelectedSubPhase(subPhase)
    setSelectedSubPhaseContext({ phaseId, subPhaseId: subPhase.id })
    // Pre-select vendors with "Not Requested" status
    const notRequestedVendors = subPhase.vendors
      .filter(v => v.status === "Not Requested")
      .map(v => v.id)
    setSelectedVendorsForBid(new Set(notRequestedVendors))
    setBidRequestStep("select-vendors")
    setIsModalOpen(true)
  }

  const toggleVendorSelection = (vendorId: string) => {
    setSelectedVendorsForBid(prev => {
      const newSet = new Set(prev)
      if (newSet.has(vendorId)) {
        newSet.delete(vendorId)
      } else {
        newSet.add(vendorId)
      }
      return newSet
    })
  }

  const handleContinueToMethod = () => {
    if (selectedVendorsForBid.size === 0) {
      // Could show an error message here
      return
    }
    setBidRequestStep("choose-method")
  }

  const handleAddSocialMedia = () => {
    if (newSocialMedia.platform && newSocialMedia.handle.trim()) {
      setNewVendor({
        ...newVendor,
        socialMedia: [...newVendor.socialMedia, {
          platform: newSocialMedia.platform as Vendor["socialMedia"][0]["platform"],
          handle: newSocialMedia.handle
        }]
      })
      setNewSocialMedia({ platform: "", handle: "" })
    }
  }

  const removeSocialMedia = (index: number) => {
    setNewVendor({
      ...newVendor,
      socialMedia: newVendor.socialMedia.filter((_, i) => i !== index)
    })
  }

  const toggleFoundVia = (source: string) => {
    setNewVendor({
      ...newVendor,
      foundVia: newVendor.foundVia.includes(source)
        ? newVendor.foundVia.filter(s => s !== source)
        : [...newVendor.foundVia, source]
    })
  }

  const handleAddVendor = () => {
    if (!selectedSubPhase || !newVendor.name.trim()) {
      return
    }

    // Create new vendor
    const vendorId = `v${Date.now()}`
    const newVendorData: Vendor = {
      id: vendorId,
      name: newVendor.name,
      email: newVendor.email,
      phone: newVendor.phone || undefined,
      contactName: newVendor.contactName || undefined,
      status: "Not Requested",
      socialMedia: newVendor.socialMedia.length > 0 ? newVendor.socialMedia : undefined,
      foundVia: newVendor.foundVia.length > 0 ? newVendor.foundVia as Vendor["foundVia"] : undefined,
    }

    // Add vendor to the sub-phase
    setPhases(
      phases.map((phase) => ({
        ...phase,
        subPhases: phase.subPhases.map((subPhase) =>
          subPhase.id === selectedSubPhase.id
            ? {
                ...subPhase,
                vendors: [...subPhase.vendors, newVendorData],
              }
            : subPhase,
        ),
      })),
    )

    // Auto-select the newly added vendor
    setSelectedVendorsForBid(prev => new Set([...prev, vendorId]))

    // Reset form
    setNewVendor({ name: "", email: "", phone: "", website: "", contactName: "", tradeCategory: "", socialMedia: [], foundVia: [] })
    setNewSocialMedia({ platform: "", handle: "" })
    setIsAddingVendor(false)
  }

  const handleVendorEdit = (
    phaseId: string,
    subPhaseId: string,
    vendorId: string,
    newName: string,
    newEmail: string,
    newContactName?: string,
  ) => {
    setPhases(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              subPhases: phase.subPhases.map((subPhase) =>
                subPhase.id === subPhaseId
                  ? {
                      ...subPhase,
                      vendors: subPhase.vendors.map((vendor) =>
                        vendor.id === vendorId 
                          ? { ...vendor, name: newName, email: newEmail, contactName: newContactName || undefined } 
                          : vendor,
                      ),
                    }
                  : subPhase,
              ),
            }
          : phase,
      ),
    )
    setEditingVendor(null)
  }

  const handleDeleteVendor = (phaseId: string, subPhaseId: string, vendorId: string, vendorName: string) => {
    setVendorToDelete({ phaseId, subPhaseId, vendorId, vendorName })
  }

  const handleCopyLetter = (vendorId: string) => {
    if (!selectedSubPhaseContext) return
    const { phaseId, subPhaseId } = selectedSubPhaseContext
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              subPhases: phase.subPhases.map((sp) =>
                sp.id === subPhaseId
                  ? {
                      ...sp,
                      vendors: sp.vendors.map((v) =>
                        v.id === vendorId ? { ...v, status: "Pending" as const } : v
                      ),
                    }
                  : sp
              ),
            }
          : phase
      )
    )
  }

  const confirmDeleteVendor = () => {
    if (!vendorToDelete) return

    setPhases(
      phases.map((phase) =>
        phase.id === vendorToDelete.phaseId
          ? {
              ...phase,
              subPhases: phase.subPhases.map((subPhase) =>
                subPhase.id === vendorToDelete.subPhaseId
                  ? {
                      ...subPhase,
                      vendors: subPhase.vendors.filter((vendor) => vendor.id !== vendorToDelete.vendorId),
                    }
                  : subPhase,
              ),
            }
          : phase,
      ),
    )

    // Also remove from selected vendors if it was selected
    setSelectedVendorsForBid(prev => {
      const newSet = new Set(prev)
      newSet.delete(vendorToDelete.vendorId)
      return newSet
    })

    setVendorToDelete(null)
  }

  const getStatusBadge = (status: Vendor["status"], vendorId: string, phaseId: string, subPhaseId: string) => {
    const baseClasses = "text-xs font-medium px-2 py-1 cursor-pointer transition-colors"
    
    // Check if any other vendor in this sub-phase already has "Bid Accepted" status
    const currentPhase = phases.find(p => p.id === phaseId)
    const currentSubPhase = currentPhase?.subPhases.find(sp => sp.id === subPhaseId)
    const hasOtherAcceptedBid = currentSubPhase?.vendors.some(
      v => v.id !== vendorId && v.status === "Bid Accepted"
    ) || false
    
    const handleStatusClick = (newStatus: Vendor["status"]) => {
      setPhases(
        phases.map((phase) =>
          phase.id === phaseId
            ? {
                ...phase,
                subPhases: phase.subPhases.map((subPhase) =>
                  subPhase.id === subPhaseId
                    ? {
                        ...subPhase,
                        vendors: subPhase.vendors.map((vendor) => {
                          // If setting to "Bid Accepted", ensure only one vendor can be accepted
                          if (newStatus === "Bid Accepted") {
                            // If this vendor is being accepted, reset any other accepted vendor to "Bid Received"
                            if (vendor.id === vendorId) {
                              return { ...vendor, status: newStatus }
                            } else if (vendor.status === "Bid Accepted") {
                              return { ...vendor, status: "Bid Received" }
                            }
                            return vendor
                          }
                          // For other status changes, just update this vendor
                          return vendor.id === vendorId ? { ...vendor, status: newStatus } : vendor
                        }),
                      }
                    : subPhase,
                ),
              }
            : phase,
        ),
      )
    }

    // Render status select with conditional "Bid Accepted" option
    const renderStatusSelect = (bgColor: string, textColor: string) => (
      <Select value={status} onValueChange={(value) => handleStatusClick(value as Vendor["status"])}>
        <SelectTrigger className={baseClasses + " " + bgColor + " " + textColor + " hover:opacity-80 border-0 h-auto p-1 px-2"}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Not Requested">Not Requested</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Bid Received">Bid Received</SelectItem>
          <SelectItem 
            value="Bid Accepted" 
            disabled={hasOtherAcceptedBid && status !== "Bid Accepted"}
            className={hasOtherAcceptedBid && status !== "Bid Accepted" ? "opacity-50 cursor-not-allowed" : ""}
          >
            Bid Accepted
            {hasOtherAcceptedBid && status !== "Bid Accepted" && (
              <span className="text-xs text-gray-500 ml-2">(Another bid already accepted)</span>
            )}
          </SelectItem>
        </SelectContent>
      </Select>
    )

    switch (status) {
      case "Bid Accepted":
        return renderStatusSelect("bg-blue-100", "text-blue-800")
      case "Bid Received":
        return renderStatusSelect("bg-green-100", "text-green-800")
      case "Pending":
        return renderStatusSelect("bg-yellow-100", "text-yellow-800")
      default:
        return renderStatusSelect("bg-gray-100", "text-gray-800")
    }
  }

  const handleBidOption = (option: string) => {
    const selectedVendorIds = Array.from(selectedVendorsForBid)
    console.log(`[v0] Bid option selected: ${option} for ${selectedSubPhase?.title}`, {
      vendors: selectedVendorIds,
      vendorCount: selectedVendorIds.length
    })
    
    if (option === "prepare-email") {
      // Open email draft modal
      const context = getEmailDraftContext()
      console.log("📧 Opening email draft modal...", {
        selectedSubPhaseContext,
        selectedVendorsForBid: Array.from(selectedVendorsForBid),
        selectedVendorsForBidSize: selectedVendorsForBid.size,
        hasSelectedSubPhase: !!selectedSubPhase,
        context: context,
        canOpen: !!context
      })
      
      if (!context) {
        console.error("❌ Cannot open email draft - context is null", {
          selectedSubPhaseContext,
          selectedVendorsForBid: Array.from(selectedVendorsForBid),
          selectedSubPhase: selectedSubPhase?.id,
          phases: phases.map(p => ({ id: p.id, title: p.title }))
        })
        // Don't open modal if context is missing
        return
      }
      
      setIsEmailDraftModalOpen(true)
      return // Don't close the bid request modal yet
    }

    if (option === "send-via-aurahom") {
      handleSendViaAurahom()
      return
    }
    
    // Update status to pending for selected vendors only
    if (selectedSubPhase) {
      setPhases(
        phases.map((phase) => ({
          ...phase,
          subPhases: phase.subPhases.map((subPhase) =>
            subPhase.id === selectedSubPhase.id
              ? {
                  ...subPhase,
                  vendors: subPhase.vendors.map((vendor) => 
                    selectedVendorsForBid.has(vendor.id)
                      ? { ...vendor, status: "Pending" as const }
                      : vendor
                  ),
                }
              : subPhase,
          ),
        })),
      )
    }

    // Reset and close modal
    setIsModalOpen(false)
    setBidRequestStep("select-vendors")
    setSelectedVendorsForBid(new Set())
  }

  // Get email draft context from current selection
  // Uses the first selected vendor for the email draft
  function getEmailDraftContext() {
    // Try to get context from selectedSubPhaseContext first, fallback to selectedSubPhase
    let phaseId: string | undefined
    let subPhaseId: string | undefined
    
    if (selectedSubPhaseContext) {
      phaseId = selectedSubPhaseContext.phaseId
      subPhaseId = selectedSubPhaseContext.subPhaseId
    } else if (selectedSubPhase) {
      // Fallback: try to find the phase/subphase from selectedSubPhase
      const phase = phases.find(p => p.subPhases.some(sp => sp.id === selectedSubPhase.id))
      if (phase) {
        phaseId = phase.id
        subPhaseId = selectedSubPhase.id
      }
    }
    
    if (!phaseId || !subPhaseId) {
      console.warn("⚠️ getEmailDraftContext: Cannot determine phase/subphase", {
        hasSelectedSubPhaseContext: !!selectedSubPhaseContext,
        hasSelectedSubPhase: !!selectedSubPhase
      })
      return null
    }
    
    if (selectedVendorsForBid.size === 0) {
      console.warn("⚠️ getEmailDraftContext: No vendors selected")
      return null
    }
    
    // Get current vendor data from phases state (not the snapshot)
    const selectedPhase = phases.find(p => p.id === phaseId)
    if (!selectedPhase) {
      console.warn("⚠️ getEmailDraftContext: Phase not found", phaseId)
      return null
    }
    
    const currentSubPhase = selectedPhase.subPhases.find(sp => sp.id === subPhaseId)
    if (!currentSubPhase) {
      console.warn("⚠️ getEmailDraftContext: SubPhase not found", subPhaseId)
      return null
    }
    
    // Get the first selected vendor from current state
    const selectedVendorId = Array.from(selectedVendorsForBid)[0]
    const selectedVendor = currentSubPhase.vendors.find(v => v.id === selectedVendorId)
    
    if (!selectedVendor) {
      console.warn("⚠️ getEmailDraftContext: Vendor not found", {
        selectedVendorId,
        availableVendorIds: currentSubPhase.vendors.map(v => v.id)
      })
      return null
    }

    // Get project info from profile/roadmap
    const houseSize = profile?.houseSize ? parseInt(profile.houseSize) : undefined
    const budgetRange = roadmap?.phases?.[0]?.duration // This is a placeholder - you may want to get actual budget from project context
    
    return {
      projectProfile: profile || undefined,
      phaseTitle: selectedPhase.title,
      subPhaseTitle: currentSubPhase.title,
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      vendorEmail: selectedVendor.email,
      vendorContactName: selectedVendor.contactName,
      constructionMethod: profile?.constructionMethod,
      location: profile?.cityState,
      houseSize,
      foundationType: profile?.foundationType,
      numberOfStories: profile?.numberOfStories,
      targetStartDate: profile?.targetStartDate,
      budgetRange: budgetRange || undefined
    }
  }

  async function handleSendViaAurahom() {
    if (!user?.id) {
      toast.error("Please sign in to send via Aurahom.")
      return
    }
    if (!activeProjectId) {
      toast.error("Please open or create a project first.")
      return
    }
    if (!selectedSubPhase || selectedVendorsForBid.size === 0) {
      toast.error("Please select at least one vendor.")
      return
    }

    const selectedPhase = phases.find((p) => p.subPhases.some((sp) => sp.id === selectedSubPhase.id))
    if (!selectedPhase) {
      toast.error("Could not find phase.")
      return
    }
    const currentSubPhase = selectedPhase.subPhases.find((sp) => sp.id === selectedSubPhase.id)
    if (!currentSubPhase) {
      toast.error("Could not find sub-phase.")
      return
    }

    const phaseIds = [selectedSubPhase.id]
    const scopeTitle = currentSubPhase.title
    const houseSize = profile?.houseSize ? parseInt(profile.houseSize) : undefined
    const budgetRange = roadmap?.phases?.[0]?.duration

    const vendorObjects = currentSubPhase.vendors.filter((v) => selectedVendorsForBid.has(v.id))
    let successCount = 0
    let failCount = 0

    try {
      for (const vendor of vendorObjects) {
        let vendorId: string | undefined
        if (UUID_REGEX.test(vendor.id)) {
          vendorId = vendor.id
        } else {
          const ensured = await ensureVendorForUser(user.id, { name: vendor.name, email: vendor.email })
          if (!ensured.success || !ensured.vendorId) {
            toast.error(vendor.name + ": " + (ensured.error ?? "Could not create vendor."))
            failCount++
            continue
          }
          vendorId = ensured.vendorId
        }

        const draftContext = {
          projectProfile: profile || undefined,
          phaseTitle: selectedPhase.title,
          subPhaseTitle: currentSubPhase.title,
          vendorName: vendor.name,
          vendorEmail: vendor.email,
          vendorContactName: vendor.contactName,
          constructionMethod: profile?.constructionMethod,
          location: profile?.cityState,
          houseSize,
          foundationType: profile?.foundationType,
          numberOfStories: profile?.numberOfStories,
          targetStartDate: profile?.targetStartDate,
          budgetRange: budgetRange || undefined,
        }

        const result = await sendBidRequestViaAurahom({
          projectId: activeProjectId,
          userId: user.id,
          vendorId,
          phaseIds,
          scopeTitle,
          draftContext,
          subject: "",
          bodyHtml: "",
        })

        if (result.success) successCount++
        else {
          toast.error(vendor.name + ": " + (result.error ?? "Send failed."))
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(successCount === vendorObjects.length ? "Bid requests sent." : successCount + " of " + vendorObjects.length + " sent.")
        if (selectedSubPhase) {
          setPhases(
            phases.map((phase) => ({
              ...phase,
              subPhases: phase.subPhases.map((sp) =>
                sp.id === selectedSubPhase.id
                  ? {
                      ...sp,
                      vendors: sp.vendors.map((v) =>
                        selectedVendorsForBid.has(v.id) ? { ...v, status: "Pending" as const } : v
                      ),
                    }
                  : sp
              ),
            }))
          )
        }
        setIsModalOpen(false)
        setBidRequestStep("select-vendors")
        setSelectedVendorsForBid(new Set())
      }
      if (failCount > 0 && successCount === 0) {
        toast.error("No emails sent. Check errors above.")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      toast.error(message)
    }
  }

  // Get email draft contexts for all selected vendors (for multi-letter navigation)
  function getEmailDraftContexts(): ReturnType<typeof getEmailDraftContext>[] {
    const first = getEmailDraftContext()
    if (!first) return []
    let phaseId: string | undefined
    let subPhaseId: string | undefined
    if (selectedSubPhaseContext) {
      phaseId = selectedSubPhaseContext.phaseId
      subPhaseId = selectedSubPhaseContext.subPhaseId
    } else if (selectedSubPhase) {
      const phase = phases.find(p => p.subPhases.some(sp => sp.id === selectedSubPhase!.id))
      if (phase) {
        phaseId = phase.id
        subPhaseId = selectedSubPhase.id
      }
    }
    if (!phaseId || !subPhaseId) return first ? [first] : []
    const selectedPhase = phases.find(p => p.id === phaseId)!
    const currentSubPhase = selectedPhase.subPhases.find(sp => sp.id === subPhaseId)!
    const houseSize = profile?.houseSize ? parseInt(profile.houseSize) : undefined
    const budgetRange = roadmap?.phases?.[0]?.duration
    const contexts: ReturnType<typeof getEmailDraftContext>[] = []
    for (const vendorId of selectedVendorsForBid) {
      const vendor = currentSubPhase.vendors.find(v => v.id === vendorId)
      if (!vendor) continue
      contexts.push({
        projectProfile: profile || undefined,
        phaseTitle: selectedPhase.title,
        subPhaseTitle: currentSubPhase.title,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorEmail: vendor.email,
        vendorContactName: vendor.contactName,
        constructionMethod: profile?.constructionMethod,
        location: profile?.cityState,
        houseSize,
        foundationType: profile?.foundationType,
        numberOfStories: profile?.numberOfStories,
        targetStartDate: profile?.targetStartDate,
        budgetRange: budgetRange || undefined
      })
    }
    return contexts.length > 0 ? contexts : (first ? [first] : [])
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bid Requests</h1>
        <p className="text-gray-600">Request and manage bids from contractors for each phase of your project.</p>
      </div>

      <div className="space-y-4">
        {phases.map((phase) => (
          <Card key={phase.id} className="overflow-hidden">
            <CardHeader
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => togglePhase(phase.id)}
            >
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">{phase.title}</span>
                {phase.isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </CardTitle>
            </CardHeader>

            {phase.isExpanded && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {phase.subPhases.map((subPhase) => (
                    <div key={subPhase.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-3">{subPhase.title}</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {subPhase.vendors.map((vendor, index) => (
                              <div key={vendor.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col h-full">
                                {/* Status Badge at Top */}
                                <div className="mb-3">
                                  {getStatusBadge(vendor.status, vendor.id, phase.id, subPhase.id)}
                                </div>

                                <div className="flex items-start justify-between mb-3 flex-1 min-h-0">
                                  {editingVendor === vendor.id ? (
                                    <div className="flex-1 space-y-2">
                                      <Input
                                        defaultValue={vendor.name}
                                        className="text-sm"
                                        onBlur={(e) =>
                                          handleVendorEdit(
                                            phase.id,
                                            subPhase.id,
                                            vendor.id,
                                            e.target.value,
                                            vendor.email,
                                            vendor.contactName,
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleVendorEdit(
                                              phase.id,
                                              subPhase.id,
                                              vendor.id,
                                              e.currentTarget.value,
                                              vendor.email,
                                              vendor.contactName,
                                            )
                                          }
                                        }}
                                      />
                                      <Input
                                        defaultValue={vendor.email}
                                        className="text-sm"
                                        onBlur={(e) =>
                                          handleVendorEdit(
                                            phase.id,
                                            subPhase.id,
                                            vendor.id,
                                            vendor.name,
                                            e.target.value,
                                          )
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter") {
                                            handleVendorEdit(
                                              phase.id,
                                              subPhase.id,
                                              vendor.id,
                                              vendor.name,
                                              e.currentTarget.value,
                                            )
                                          }
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                          <p className="font-semibold text-sm pr-2">{vendor.name}</p>
                                          <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" className="flex-shrink-0 h-6 w-6 p-0" onClick={() => setEditingVendor(vendor.id)}>
                                              <Edit2 className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="flex-shrink-0 h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50" 
                                              onClick={() => handleDeleteVendor(phase.id, subPhase.id, vendor.id, vendor.name)}
                                            >
                                              <Trash2 className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-1 mb-3">
                                          <p className="text-xs text-gray-600 flex items-center">
                                            <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
                                            <span className="truncate">{vendor.email}</span>
                                          </p>
                                          {vendor.phone && (
                                            <p className="text-xs text-gray-600 flex items-center">
                                              <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                                              <span className="truncate">{vendor.phone}</span>
                                            </p>
                                          )}
                                        </div>

                                        {/* Rating */}
                                        {vendor.rating && (
                                          <div className="flex items-center mb-3">
                                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1 flex-shrink-0" />
                                            <span className="text-xs font-medium">{vendor.rating.score}</span>
                                            <span className="text-xs text-gray-500 ml-1">
                                              ({vendor.rating.reviews} {vendor.rating.platform} reviews)
                                            </span>
                                          </div>
                                        )}

                                        {/* Social Media */}
                                        {vendor.socialMedia && vendor.socialMedia.length > 0 && (
                                          <div className="mb-3">
                                            <p className="text-xs text-gray-500 mb-1">Social:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {vendor.socialMedia.map((social, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                                                  {social.platform}: {social.handle}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Found Via */}
                                        {vendor.foundVia && vendor.foundVia.length > 0 && (
                                          <div className="mb-3">
                                            <p className="text-xs text-gray-500 mb-1">Found via:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {vendor.foundVia.map((platform, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0.5">
                                                  {platform}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                
                                {/* Full-width Button at Bottom - Only show for Bid Accepted */}
                                {vendor.status === "Bid Accepted" && (
                                  <div className="mt-auto pt-3 border-t">
                                    <Button
                                      variant={selectedVendor?.id === vendor.id ? "default" : "outline"}
                                      size="sm"
                                      className={
                                        "w-full " +
                                        (selectedVendor?.id === vendor.id
                                          ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                                          : "")
                                      }
                                      onClick={() => setSelectedVendor({ id: vendor.id, name: vendor.name, email: vendor.email, phone: vendor.phone, contactName: vendor.contactName })}
                                    >
                                      Use for Schedule
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="ml-6 flex-shrink-0">
                          <Button onClick={() => handleRequestBids(subPhase, phase.id)} className="bg-cyan-600 hover:bg-cyan-700 whitespace-nowrap">
                            Request Bids
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Bid Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        setIsModalOpen(open)
        if (!open) {
          // Reset when closing - but only if email draft modal is not open
          if (!isEmailDraftModalOpen) {
            setBidRequestStep("select-vendors")
            setSelectedVendorsForBid(new Set())
            setIsAddingVendor(false)
            // Don't clear selectedSubPhaseContext here - it might be needed for email draft
            // setSelectedSubPhaseContext(null)
            setNewVendor({ name: "", email: "", phone: "", website: "", contactName: "", tradeCategory: "", socialMedia: [], foundVia: [] })
            setNewSocialMedia({ platform: "", handle: "" })
          }
        }
      }}>
        <DialogContent className="max-w-2xl" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              {bidRequestStep === "select-vendors"
                ? "Select Vendors for " + (selectedSubPhase?.title ?? "")
                : "How would you like to send bid requests?"}
            </DialogTitle>
          </DialogHeader>

          {bidRequestStep === "select-vendors" ? (
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-600 mb-4">
                Select the contractors you'd like to request bids from. You can select multiple contractors or add a new one.
              </p>
              
              {/* Add New Vendor Form */}
              {isAddingVendor ? (
                <div className="border-2 border-dashed border-cyan-300 rounded-lg p-4 bg-cyan-50 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">Add New Vendor</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingVendor(false)
                        setNewVendor({ name: "", email: "", phone: "", website: "", contactName: "", tradeCategory: "", socialMedia: [], foundVia: [] })
                        setNewSocialMedia({ platform: "", handle: "" })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Vendor Name *</label>
                      <Input
                        placeholder="e.g., ABC Construction"
                        value={newVendor.name}
                        onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                        className="text-sm"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Email</label>
                      <Input
                        type="email"
                        placeholder="contact@example.com"
                        value={newVendor.email}
                        onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Phone</label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={newVendor.phone}
                        onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Contact Name (Optional)</label>
                      <Input
                        placeholder="e.g., John Smith, Sales Department"
                        value={newVendor.contactName}
                        onChange={(e) => setNewVendor({ ...newVendor, contactName: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Website (Optional)</label>
                      <Input
                        type="url"
                        placeholder="https://www.example.com"
                        value={newVendor.website}
                        onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                        className="text-sm"
                      />
                    </div>
                    
                    {/* Social Media */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-2 block">Social Media (Optional)</label>
                      {newVendor.socialMedia.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {newVendor.socialMedia.map((social, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
                              <Badge variant="outline" className="text-xs">{social.platform}</Badge>
                              <span className="text-xs flex-1">{social.handle}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => removeSocialMedia(idx)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Select value={newSocialMedia.platform} onValueChange={(value) => setNewSocialMedia({ ...newSocialMedia, platform: value })}>
                          <SelectTrigger className="text-xs h-8">
                            <SelectValue placeholder="Platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="TikTok">TikTok</SelectItem>
                            <SelectItem value="Snapchat">Snapchat</SelectItem>
                            <SelectItem value="Reddit">Reddit</SelectItem>
                            <SelectItem value="Quora">Quora</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="@handle"
                          value={newSocialMedia.handle}
                          onChange={(e) => setNewSocialMedia({ ...newSocialMedia, handle: e.target.value })}
                          className="text-sm flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newSocialMedia.platform && newSocialMedia.handle.trim()) {
                              handleAddSocialMedia()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddSocialMedia}
                          disabled={!newSocialMedia.platform || !newSocialMedia.handle.trim()}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Found Via */}
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-2 block">How did you find them? (Optional)</label>
                      <div className="flex flex-wrap gap-2">
                        {["Google", "Facebook", "Snapchat", "TikTok", "Reddit", "Quora", "Referral", "Other"].map((source) => (
                          <Button
                            key={source}
                            type="button"
                            variant={newVendor.foundVia.includes(source) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleFoundVia(source)}
                            className={
                              "text-xs h-7 " +
                              (newVendor.foundVia.includes(source) ? "bg-cyan-600 hover:bg-cyan-700" : "")
                            }
                          >
                            {source}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddVendor}
                      disabled={!newVendor.name.trim()}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                      size="sm"
                    >
                      Add Vendor
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsAddingVendor(true)}
                  className="w-full border-dashed border-2 border-gray-300 hover:border-cyan-500 hover:bg-cyan-50 mb-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Vendor
                </Button>
              )}
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {(() => {
                  // Get current vendor data from phases state to ensure we have the latest status
                  const currentPhase = phases.find(p => p.id === selectedSubPhaseContext?.phaseId)
                  const currentSubPhase = currentPhase?.subPhases.find(sp => sp.id === selectedSubPhaseContext?.subPhaseId)
                  const currentVendors = currentSubPhase?.vendors || selectedSubPhase?.vendors || []
                  
                  return currentVendors.map((vendor) => {
                  const isSelected = selectedVendorsForBid.has(vendor.id)
                  return (
                    <div
                      key={vendor.id}
                      className={
                        "border rounded-lg p-4 cursor-pointer transition-colors " +
                        (isSelected ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-gray-300")
                      }
                      onClick={() => toggleVendorSelection(vendor.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={
                                "w-5 h-5 rounded border-2 flex items-center justify-center " +
                                (isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300")
                              }
                            >
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <p className="font-semibold text-sm">{vendor.name}</p>
                            {selectedSubPhaseContext ? (
                              getStatusBadge(vendor.status, vendor.id, selectedSubPhaseContext.phaseId, selectedSubPhaseContext.subPhaseId)
                            ) : (
                              <Badge
                                className={
                                  "text-xs font-medium px-2 py-1 border-0 " +
                                  (vendor.status === "Bid Accepted"
                                    ? "bg-blue-100 text-blue-800"
                                    : vendor.status === "Bid Received"
                                      ? "bg-green-100 text-green-800"
                                      : vendor.status === "Pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800")
                                }
                              >
                                {vendor.status}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="ml-7 space-y-1">
                            <p className="text-xs text-gray-600 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {vendor.email}
                            </p>
                            {vendor.phone && (
                              <p className="text-xs text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {vendor.phone}
                              </p>
                            )}
                            {vendor.rating && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                                <span className="text-xs">{vendor.rating.score} ({vendor.rating.reviews} reviews)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                  })
                })()}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setIsModalOpen(false)
                  setIsAddingVendor(false)
                        setNewVendor({ name: "", email: "", phone: "", website: "", contactName: "", tradeCategory: "", socialMedia: [], foundVia: [] })
                  setNewSocialMedia({ platform: "", handle: "" })
                }}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleContinueToMethod}
                  disabled={selectedVendorsForBid.size === 0}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  Continue ({selectedVendorsForBid.size} {selectedVendorsForBid.size === 1 ? 'vendor' : 'vendors'} selected)
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Selected Vendors ({selectedVendorsForBid.size}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSubPhase?.vendors
                    .filter(v => selectedVendorsForBid.has(v.id))
                    .map(vendor => (
                      <Badge key={vendor.id} variant="secondary" className="text-xs">
                        {vendor.name}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Option 1: Manual Control */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Edit2 className="h-4 w-4 mr-2" />
                  I'll Send It Myself
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage the communication yourself. We can prepare a professional email draft for you to send, or you can
                  simply mark the bids as 'Pending' to track them here.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleBidOption("prepare-email")}>
                    Prepare Email Draft
                  </Button>
                  <Button variant="secondary" onClick={() => handleBidOption("mark-pending")}>
                    Just Mark as Pending
                  </Button>
                </div>
              </div>

              {/* Option 2: Send via Aurahöm (Recommended) */}
              <div className="border-2 border-cyan-200 rounded-lg p-4 bg-cyan-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold flex items-center">
                    <Send className="h-4 w-4 mr-2" />
                    Send via Aurahöm
                  </h3>
                  <Badge className="bg-cyan-600 hover:bg-cyan-600">Recommended</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  We will send a professional bid request to the selected vendors. Your email remains private, and you can
                  track everything automatically in your dashboard.
                </p>
                <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => handleBidOption("send-via-aurahom")}>
                  Send via Aurahöm
                </Button>
              </div>

              <div className="flex justify-start pt-4 border-t">
                <Button variant="ghost" onClick={() => setBidRequestStep("select-vendors")} className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Vendor Selection
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Draft Modal */}
      {(() => {
        // Only try to get contexts if modal is open
        if (!isEmailDraftModalOpen) return null
        
        const contexts = getEmailDraftContexts()
        if (!contexts.length) {
          console.error("⚠️ Cannot open email draft modal - missing context", {
            selectedSubPhaseContext,
            selectedVendorsForBid: Array.from(selectedVendorsForBid),
            selectedVendorsForBidSize: selectedVendorsForBid.size,
            hasSelectedSubPhase: !!selectedSubPhase,
            selectedSubPhaseId: selectedSubPhase?.id,
            phasesCount: phases.length,
            bidRequestStep,
            isModalOpen
          })
          return null
        }
        
        return (
          <EmailDraftModal
            open={isEmailDraftModalOpen}
            onClose={() => {
              setIsEmailDraftModalOpen(false)
            }}
            contexts={contexts}
            onCopyLetter={handleCopyLetter}
          />
        )
      })()}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!vendorToDelete} onOpenChange={(open) => !open && setVendorToDelete(null)}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Delete Contractor?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>{vendorToDelete?.vendorName}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setVendorToDelete(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDeleteVendor}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
