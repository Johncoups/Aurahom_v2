"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, Edit2, Mail, Send, Phone, Star, Check, ArrowLeft, Plus, X, Trash2 } from "lucide-react"
import { useBids } from "@/contexts/bids-context"

interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
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

export function BidsPage() {
  const { setSelectedVendor, selectedVendor } = useBids()
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: "phase1",
      title: "Phase 1: Planning & Design",
      isExpanded: false,
      subPhases: [
        {
          id: "architectural",
          title: "Architectural Plans",
          vendors: [
            {
              id: "v1",
              name: "Design Studio Pro",
              email: "contact@designstudio.com",
              phone: "(555) 123-4567",
              status: "Bid Received",
              rating: { platform: "Google", score: 4.8, reviews: 127 },
              socialMedia: [
                { platform: "Facebook", handle: "@designstudiopro" },
                { platform: "Instagram", handle: "@designstudio_pro" },
              ],
              foundVia: ["Google", "Facebook"],
            },
            {
              id: "v2",
              name: "Modern Architecture Co",
              email: "bids@modernarch.com",
              phone: "(555) 234-5678",
              status: "Pending",
              rating: { platform: "Facebook", score: 4.6, reviews: 89 },
              socialMedia: [{ platform: "LinkedIn", handle: "@modern-architecture-co" }],
              foundVia: ["Google", "Reddit"],
            },
            {
              id: "v3",
              name: "Blueprint Masters",
              email: "info@blueprintmasters.com",
              phone: "(555) 345-6789",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.9, reviews: 203 },
              socialMedia: [
                { platform: "Facebook", handle: "@blueprintmasters" },
                { platform: "Instagram", handle: "@blueprint_masters" },
              ],
              foundVia: ["Google", "Quora"],
            },
          ],
        },
        {
          id: "permits",
          title: "Permit Services",
          vendors: [
            {
              id: "v4",
              name: "City Permit Solutions",
              email: "permits@citysolutions.com",
              phone: "(555) 456-7890",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.4, reviews: 56 },
              foundVia: ["Google"],
            },
            {
              id: "v5",
              name: "Fast Track Permits",
              email: "hello@fasttrack.com",
              phone: "(555) 567-8901",
              status: "Not Requested",
              socialMedia: [{ platform: "LinkedIn", handle: "@fasttrack-permits" }],
              foundVia: ["Facebook", "TikTok"],
            },
            {
              id: "v6",
              name: "Permit Pro Services",
              email: "bids@permitpro.com",
              phone: "(555) 678-9012",
              status: "Not Requested",
              rating: { platform: "Facebook", score: 4.7, reviews: 34 },
              foundVia: ["Google", "Reddit"],
            },
          ],
        },
      ],
    },
    {
      id: "phase2",
      title: "Phase 2: Foundation & Framing",
      isExpanded: true,
      subPhases: [
        {
          id: "concrete",
          title: "Concrete Foundation",
          vendors: [
            {
              id: "v7",
              name: "Johnson Concrete",
              email: "bids@johnsonconcrete.com",
              phone: "(555) 789-0123",
              status: "Pending",
              rating: { platform: "Google", score: 4.5, reviews: 78 },
              socialMedia: [{ platform: "Facebook", handle: "@johnsonconcrete" }],
              foundVia: ["Google", "Facebook"],
            },
            {
              id: "v8",
              name: "Midwest Foundations",
              email: "quotes@midwestfound.com",
              phone: "(555) 890-1234",
              status: "Bid Received",
              rating: { platform: "Google", score: 4.9, reviews: 156 },
              socialMedia: [
                { platform: "Instagram", handle: "@midwest_foundations" },
                { platform: "LinkedIn", handle: "@midwest-foundations" },
              ],
              foundVia: ["Google", "Snapchat"],
            },
            {
              id: "v9",
              name: "Chatfield Poured Walls",
              email: "info@chatfieldwalls.com",
              phone: "(555) 901-2345",
              status: "Not Requested",
              rating: { platform: "Facebook", score: 4.3, reviews: 42 },
              foundVia: ["Facebook", "Reddit"],
            },
          ],
        },
        {
          id: "framing",
          title: "Lumber & Framing",
          vendors: [
            {
              id: "v10",
              name: "Premier Framing Co",
              email: "estimates@premierframing.com",
              phone: "(555) 012-3456",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.7, reviews: 91 },
              socialMedia: [{ platform: "TikTok", handle: "@premierframing" }],
              foundVia: ["Google", "TikTok"],
            },
            {
              id: "v11",
              name: "Timber Works LLC",
              email: "bids@timberworks.com",
              phone: "(555) 123-4567",
              status: "Not Requested",
              socialMedia: [
                { platform: "Facebook", handle: "@timberworksllc" },
                { platform: "Instagram", handle: "@timber_works" },
              ],
              foundVia: ["Facebook", "Quora"],
            },
            {
              id: "v12",
              name: "Structural Solutions",
              email: "quotes@structuralsol.com",
              phone: "(555) 234-5678",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.6, reviews: 67 },
              foundVia: ["Google", "Reddit"],
            },
          ],
        },
      ],
    },
    {
      id: "phase3",
      title: "Phase 3: Exterior & Interior Rough-in",
      isExpanded: false,
      subPhases: [
        {
          id: "roofing",
          title: "Roofing",
          vendors: [
            {
              id: "v13",
              name: "Elite Roofing Systems",
              email: "bids@eliteroofing.com",
              phone: "(555) 345-6789",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.9, reviews: 203 },
              socialMedia: [
                { platform: "Facebook", handle: "@eliteroofingsystems" },
                { platform: "Instagram", handle: "@elite_roofing_systems" },
              ],
              foundVia: ["Google", "Quora"],
            },
            {
              id: "v14",
              name: "Weatherguard Roofing",
              email: "quotes@weatherguard.com",
              phone: "(555) 456-7890",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.4, reviews: 56 },
              foundVia: ["Google"],
            },
            {
              id: "v15",
              name: "Summit Roof Solutions",
              email: "info@summitroofs.com",
              phone: "(555) 567-8901",
              status: "Not Requested",
              socialMedia: [{ platform: "LinkedIn", handle: "@summitroofsolutions" }],
              foundVia: ["Facebook", "TikTok"],
            },
          ],
        },
        {
          id: "plumbing",
          title: "Plumbing Rough-in",
          vendors: [
            {
              id: "v16",
              name: "Master Plumbing Co",
              email: "bids@masterplumbing.com",
              phone: "(555) 678-9012",
              status: "Not Requested",
              rating: { platform: "Facebook", score: 4.7, reviews: 34 },
              foundVia: ["Google", "Reddit"],
            },
            {
              id: "v17",
              name: "Flow Right Plumbing",
              email: "estimates@flowright.com",
              phone: "(555) 789-0123",
              status: "Not Requested",
              socialMedia: [{ platform: "TikTok", handle: "@flowrightplumbing" }],
              foundVia: ["Google", "TikTok"],
            },
            {
              id: "v18",
              name: "Precision Pipe Works",
              email: "quotes@precisionpipe.com",
              phone: "(555) 890-1234",
              status: "Not Requested",
              rating: { platform: "Google", score: 4.5, reviews: 78 },
              socialMedia: [
                { platform: "Facebook", handle: "@precisionpipeworks" },
                { platform: "Instagram", handle: "@precision_pipe_works" },
              ],
              foundVia: ["Google", "Facebook"],
            },
          ],
        },
      ],
    },
  ])

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
    setNewVendor({ name: "", email: "", phone: "", website: "", tradeCategory: "", socialMedia: [], foundVia: [] })
    setNewSocialMedia({ platform: "", handle: "" })
    setIsAddingVendor(false)
  }

  const handleVendorEdit = (
    phaseId: string,
    subPhaseId: string,
    vendorId: string,
    newName: string,
    newEmail: string,
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
                        vendor.id === vendorId ? { ...vendor, name: newName, email: newEmail } : vendor,
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
        <SelectTrigger className={`${baseClasses} ${bgColor} ${textColor} hover:opacity-80 border-0 h-auto p-1 px-2`}>
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
    // Mock implementation - in real app would handle different bid request methods
    const selectedVendorIds = Array.from(selectedVendorsForBid)
    console.log(`[v0] Bid option selected: ${option} for ${selectedSubPhase?.title}`, {
      vendors: selectedVendorIds,
      vendorCount: selectedVendorIds.length
    })
    
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
                                      className={`w-full ${
                                        selectedVendor?.id === vendor.id 
                                          ? "bg-cyan-600 hover:bg-cyan-700 text-white" 
                                          : ""
                                      }`}
                                      onClick={() => setSelectedVendor({ id: vendor.id, name: vendor.name, email: vendor.email, phone: vendor.phone })}
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
          // Reset when closing
          setBidRequestStep("select-vendors")
          setSelectedVendorsForBid(new Set())
          setIsAddingVendor(false)
          setSelectedSubPhaseContext(null)
          setNewVendor({ name: "", email: "", phone: "", website: "", tradeCategory: "", socialMedia: [], foundVia: [] })
          setNewSocialMedia({ platform: "", handle: "" })
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {bidRequestStep === "select-vendors" 
                ? `Select Vendors for ${selectedSubPhase?.title}`
                : `How would you like to send bid requests?`}
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
                        setNewVendor({ name: "", email: "", phone: "", website: "", tradeCategory: "", socialMedia: [], foundVia: [] })
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
                            className={`text-xs h-7 ${
                              newVendor.foundVia.includes(source) ? "bg-cyan-600 hover:bg-cyan-700" : ""
                            }`}
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
                {selectedSubPhase?.vendors.map((vendor) => {
                  const isSelected = selectedVendorsForBid.has(vendor.id)
                  return (
                    <div
                      key={vendor.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        isSelected ? "border-cyan-500 bg-cyan-50" : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => toggleVendorSelection(vendor.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? "border-cyan-500 bg-cyan-500" : "border-gray-300"
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <p className="font-semibold text-sm">{vendor.name}</p>
                            {selectedSubPhaseContext ? (
                              getStatusBadge(vendor.status, vendor.id, selectedSubPhaseContext.phaseId, selectedSubPhaseContext.subPhaseId)
                            ) : (
                              <Badge className={`text-xs font-medium px-2 py-1 ${
                                vendor.status === "Bid Accepted" ? "bg-blue-100 text-blue-800" :
                                vendor.status === "Bid Received" ? "bg-green-100 text-green-800" :
                                vendor.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                "bg-gray-100 text-gray-800"
                              } border-0`}>
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
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setIsModalOpen(false)
                  setIsAddingVendor(false)
                  setNewVendor({ name: "", email: "", phone: "", website: "", tradeCategory: "", socialMedia: [], foundVia: [] })
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

              {/* Option 3: Send From My Email */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Send from My Email Address
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Authorize Aurahöm to send the bid request directly from your connected email account (e.g., Gmail,
                  Outlook). All correspondence, including replies, will be automatically saved and organized in your
                  project's 'Documents' folder.
                </p>
                <Button variant="outline" onClick={() => handleBidOption("send-from-email")}>
                  Send and Sync from My Email
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

      {/* Delete Confirmation Modal */}
      <Dialog open={!!vendorToDelete} onOpenChange={(open) => !open && setVendorToDelete(null)}>
        <DialogContent className="max-w-md">
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
