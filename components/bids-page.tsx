"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, ChevronRight, Edit2, Mail, Send, Phone, Star } from "lucide-react"

interface Vendor {
  id: string
  name: string
  email: string
  phone?: string
  status: "Not Requested" | "Pending" | "Bid Received"
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<string | null>(null)

  const togglePhase = (phaseId: string) => {
    setPhases(phases.map((phase) => (phase.id === phaseId ? { ...phase, isExpanded: !phase.isExpanded } : phase)))
  }

  const handleRequestBids = (subPhase: SubPhase) => {
    setSelectedSubPhase(subPhase)
    setIsModalOpen(true)
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

  const getStatusBadge = (status: Vendor["status"]) => {
    switch (status) {
      case "Bid Received":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Bid Received</Badge>
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      default:
        return <Badge variant="secondary">Not Requested</Badge>
    }
  }

  const handleBidOption = (option: string) => {
    // Mock implementation - in real app would handle different bid request methods
    console.log(`[v0] Bid option selected: ${option} for ${selectedSubPhase?.title}`)
    setIsModalOpen(false)

    // Update status to pending for demo
    if (selectedSubPhase) {
      setPhases(
        phases.map((phase) => ({
          ...phase,
          subPhases: phase.subPhases.map((subPhase) =>
            subPhase.id === selectedSubPhase.id
              ? {
                  ...subPhase,
                  vendors: subPhase.vendors.map((vendor) => ({
                    ...vendor,
                    status: "Pending" as const,
                  })),
                }
              : subPhase,
          ),
        })),
      )
    }
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
                              <div key={vendor.id} className="bg-white p-4 rounded-lg border shadow-sm">
                                <div className="flex items-start justify-between mb-3">
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
                                      <div className="flex-1">
                                        <p className="font-semibold text-sm mb-1">{vendor.name}</p>

                                        {/* Contact Information */}
                                        <div className="space-y-1 mb-2">
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
                                        </div>

                                        {/* Rating */}
                                        {vendor.rating && (
                                          <div className="flex items-center mb-2">
                                            <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                                            <span className="text-xs font-medium">{vendor.rating.score}</span>
                                            <span className="text-xs text-gray-500 ml-1">
                                              ({vendor.rating.reviews} {vendor.rating.platform} reviews)
                                            </span>
                                          </div>
                                        )}

                                        {/* Social Media */}
                                        {vendor.socialMedia && vendor.socialMedia.length > 0 && (
                                          <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Social:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {vendor.socialMedia.map((social, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                                  {social.platform}: {social.handle}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Found Via */}
                                        {vendor.foundVia && vendor.foundVia.length > 0 && (
                                          <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Found via:</p>
                                            <div className="flex flex-wrap gap-1">
                                              {vendor.foundVia.map((platform, idx) => (
                                                <Badge key={idx} variant="secondary" className="text-xs px-1 py-0">
                                                  {platform}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={() => setEditingVendor(vendor.id)}>
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                                {getStatusBadge(vendor.status)}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="ml-6">
                          <Button onClick={() => handleRequestBids(subPhase)} className="bg-cyan-600 hover:bg-cyan-700">
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Bids for {selectedSubPhase?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
