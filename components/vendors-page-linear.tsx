"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Star,
  Upload,
  Download,
  ChevronDown,
  ChevronRight,
  MapPin,
  Globe,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { VendorForm } from "@/components/vendor-form";
import {
  addVendorToUserDirectory,
  updateVendorAction,
  updateUserVendorAction,
  removeVendorFromUserAction,
  loadUserVendors,
  loadTradeCategoriesAction,
  importVendorsFromCSVAction,
  exportVendorsToCSVAction,
} from "@/app/actions/vendorsDirectory";
import { toast } from "sonner";
import type { VendorWithUserData } from "@/lib/bids-types";
import type { CreateVendorInput } from "@/lib/bids-types";
import type { TradeCategory } from "@/lib/bids-types";
import { getTradeIcon } from "@/lib/trade-category-icons";

export function VendorsPageLinear() {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<VendorWithUserData[]>([]);
  const [tradeCategories, setTradeCategories] = useState<TradeCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorWithUserData | null>(null);
  const [vendorToDelete, setVendorToDelete] = useState<VendorWithUserData | null>(null);
  const [importFileRef, setImportFileRef] = useState<HTMLInputElement | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedVendor, setSelectedVendor] = useState<VendorWithUserData | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.id) {
      setVendors([]);
      setTradeCategories([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const [vendorsResult, categoriesResult] = await Promise.all([
      loadUserVendors(user.id),
      loadTradeCategoriesAction(),
    ]);

    if (vendorsResult.success && vendorsResult.vendors) {
      setVendors(vendorsResult.vendors);
    } else {
      setError(vendorsResult.error ?? "Failed to load vendors");
    }

    if (categoriesResult.success && categoriesResult.tradeCategories) {
      setTradeCategories(categoriesResult.tradeCategories);
    }

    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Group vendors by trade category
  const vendorsByCategory = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = vendors.filter((v) => {
      if (!q) return true;
      const name = (v.name ?? "").toLowerCase();
      const company = (v.company_name ?? "").toLowerCase();
      const email = (v.email ?? "").toLowerCase();
      const phone = (v.phone ?? "").toLowerCase();
      return name.includes(q) || company.includes(q) || email.includes(q) || phone.includes(q);
    });

    const byCategory: Record<string, VendorWithUserData[]> = { uncategorized: [] };

    for (const tc of tradeCategories) {
      byCategory[tc.id] = [];
    }

    for (const v of filtered) {
      const catId = v.user_vendor?.trade_category_id ?? v.trade_category_id;
      if (catId && byCategory[catId]) {
        byCategory[catId].push(v);
      } else {
        byCategory.uncategorized.push(v);
      }
    }

    const ordered: string[] = [];
    for (const tc of tradeCategories) {
      if (byCategory[tc.id]?.length) ordered.push(tc.id);
    }
    if (byCategory.uncategorized?.length) ordered.push("uncategorized");

    return { byCategory, categoryOrder: ordered };
  }, [vendors, searchQuery, tradeCategories]);

  const getCategoryName = (id: string) =>
    id === "uncategorized" ? "Uncategorized" : tradeCategories.find((t) => t.id === id)?.name ?? id;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleAddVendor = async (data: CreateVendorInput & { notes?: string; found_via?: string[]; trade_category_id?: string | null }) => {
    if (!user?.id) return;
    const result = await addVendorToUserDirectory(user.id, data);
    if (result.success) {
      setIsAddModalOpen(false);
      await loadData();
      toast.success("Vendor added.");
    } else {
      toast.error(result.error ?? "Failed to add vendor");
    }
  };

  const handleUpdateVendor = async (
    vendorId: string,
    vendorData: Partial<CreateVendorInput>,
    userData?: { notes?: string; found_via?: string[]; trade_category_id?: string | null }
  ) => {
    const vendorResult = await updateVendorAction(vendorId, vendorData);
    if (!vendorResult.success) {
      toast.error(vendorResult.error ?? "Failed to update vendor");
      return;
    }
    if (user?.id && userData && (userData.notes !== undefined || userData.found_via !== undefined || userData.trade_category_id !== undefined)) {
      const userResult = await updateUserVendorAction(user.id, vendorId, {
        notes: userData.notes ?? null,
        found_via: userData.found_via ?? null,
        trade_category_id: userData.trade_category_id ?? null,
      });
      if (!userResult.success) {
        toast.error(userResult.error ?? "Failed to update notes");
        return;
      }
    }
    setEditingVendor(null);
    setSelectedVendor(null);
    await loadData();
    toast.success("Vendor updated.");
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete || !user?.id) return;
    const result = await removeVendorFromUserAction(user.id, vendorToDelete.id);
    if (result.success) {
      setVendorToDelete(null);
      setSelectedVendor(null);
      await loadData();
      toast.success("Vendor removed.");
    } else {
      toast.error(result.error ?? "Failed to remove vendor");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;
    const text = await file.text();
    const result = await importVendorsFromCSVAction(text, user.id);
    if (result.success) {
      await loadData();
      toast.success(`Imported ${result.imported ?? 0} vendors.`);
    } else {
      toast.error(result.error ?? "Failed to import");
    }
    e.target.value = "";
  };

  const handleExport = async () => {
    if (!user?.id) return;
    const result = await exportVendorsToCSVAction(user.id);
    if (result.success && result.csv) {
      const blob = new Blob([result.csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "vendors.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Exported vendors.");
    } else {
      toast.error(result.error ?? "Failed to export");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Vendors {vendors.length > 0 && <span className="text-gray-500 font-normal">{vendors.length}</span>}
              </h1>
            </div>
            <div className="flex gap-2">
              <input
                ref={(el) => setImportFileRef(el)}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImport}
              />
              <Button variant="outline" size="sm" onClick={() => importFileRef?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={vendors.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600" />
            </div>
          ) : vendors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-gray-600 mb-4">No vendors yet.</p>
              <Button onClick={() => setIsAddModalOpen(true)} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Vendor
              </Button>
            </div>
          ) : vendorsByCategory.categoryOrder.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No vendors match your search.</div>
          ) : (
            <div className="space-y-1">
              {vendorsByCategory.categoryOrder.map((categoryId) => {
                const categoryVendors = vendorsByCategory.byCategory[categoryId] ?? [];
                const categoryName = getCategoryName(categoryId);
                const isCollapsed = !expandedCategories.has(categoryId);
                const tc = tradeCategories.find((t) => t.id === categoryId);
                const TradeIcon = getTradeIcon(tc?.name ?? categoryName);

                return (
                  <div key={categoryId} className="border-b border-gray-200 last:border-b-0">
                    {/* Category Header */}
                    <div className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors group">
                      <button
                        type="button"
                        onClick={() => toggleCategory(categoryId)}
                        className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {categoryName}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded"
                      >
                        <Plus className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    </div>

                    {/* Vendor Rows */}
                    {!isCollapsed && (
                      <div>
                        {categoryVendors.map((vendor) => (
                          <button
                            key={vendor.id}
                            onClick={() => setSelectedVendor(vendor)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors border-t border-gray-100 group text-left"
                          >
                            {/* Icon */}
                            <div className="flex-shrink-0 w-8 h-8 rounded bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
                              <TradeIcon className="h-4 w-4 text-cyan-600" strokeWidth={2} />
                            </div>

                            {/* Name & Company */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-900 truncate">{vendor.name}</div>
                              {vendor.company_name && (
                                <div className="text-xs text-gray-500 truncate">{vendor.company_name}</div>
                              )}
                            </div>

                            {/* Rating */}
                            {vendor.rating_score != null && (
                              <div className="flex items-center gap-1 text-xs text-gray-600">
                                <Star className="h-3 w-3 text-amber-500 fill-current" />
                                <span>{vendor.rating_score}</span>
                              </div>
                            )}

                            {/* Location */}
                            {vendor.city && vendor.state && (
                              <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3" />
                                <span>{vendor.city}, {vendor.state}</span>
                              </div>
                            )}

                            {/* Phone */}
                            {vendor.phone && (
                              <div className="hidden lg:flex items-center gap-1 text-xs text-gray-500">
                                <Phone className="h-3 w-3" />
                                <span>{vendor.phone}</span>
                              </div>
                            )}

                            {/* Arrow */}
                            <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {selectedVendor && (
        <div className="w-[480px] border-l border-gray-200 bg-white flex flex-col overflow-hidden">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Vendor Details</h2>
            <button
              onClick={() => setSelectedVendor(null)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{selectedVendor.name}</h3>
              {selectedVendor.company_name && (
                <p className="text-sm text-gray-600">{selectedVendor.company_name}</p>
              )}
            </div>

            {/* Rating */}
            {selectedVendor.rating_score != null && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="font-medium text-gray-900">{selectedVendor.rating_score}</span>
                </div>
                {selectedVendor.rating_reviews != null && selectedVendor.rating_reviews > 0 && (
                  <span className="text-sm text-gray-500">
                    ({selectedVendor.rating_reviews} reviews on {selectedVendor.rating_platform})
                  </span>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Contact</h4>
              {selectedVendor.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${selectedVendor.phone}`} className="text-cyan-600 hover:underline">
                    {selectedVendor.phone}
                  </a>
                </div>
              )}
              {selectedVendor.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${selectedVendor.email}`} className="text-cyan-600 hover:underline">
                    {selectedVendor.email}
                  </a>
                </div>
              )}
              {selectedVendor.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a
                    href={selectedVendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:underline flex items-center gap-1"
                  >
                    {selectedVendor.website.replace(/^https?:\/\//, "")}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Address */}
            {(selectedVendor.address || selectedVendor.city || selectedVendor.state) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Location</h4>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    {selectedVendor.address && <div>{selectedVendor.address}</div>}
                    <div>
                      {selectedVendor.city && selectedVendor.city}
                      {selectedVendor.city && selectedVendor.state && ", "}
                      {selectedVendor.state && selectedVendor.state}
                      {selectedVendor.zip_code && ` ${selectedVendor.zip_code}`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Services */}
            {selectedVendor.services_offered && selectedVendor.services_offered.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Services Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.services_offered.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Specialties */}
            {selectedVendor.specialties && selectedVendor.specialties.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-cyan-50 text-cyan-700 text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* License & Insurance */}
            {(selectedVendor.licensed || selectedVendor.insured) && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Credentials</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  {selectedVendor.licensed && <div>✓ Licensed {selectedVendor.license_number && `(${selectedVendor.license_number})`}</div>}
                  {selectedVendor.insured && <div>✓ Insured {selectedVendor.insurance_info && `- ${selectedVendor.insurance_info}`}</div>}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedVendor.user_vendor?.notes && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedVendor.user_vendor.notes}</p>
              </div>
            )}
          </div>

          {/* Panel Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingVendor(selectedVendor)}
              className="flex-1"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVendorToDelete(selectedVendor)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Vendor</DialogTitle>
          </DialogHeader>
          <VendorForm
            tradeCategories={tradeCategories.map((t) => ({ id: t.id, name: t.name }))}
            onSubmit={handleAddVendor}
            onCancel={() => setIsAddModalOpen(false)}
            submitLabel="Add Vendor"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Modal */}
      <Dialog open={!!editingVendor} onOpenChange={(open) => !open && setEditingVendor(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          {editingVendor && (
            <VendorForm
              tradeCategories={tradeCategories.map((t) => ({ id: t.id, name: t.name }))}
              initialData={{
                name: editingVendor.name,
                company_name: editingVendor.company_name ?? undefined,
                email: editingVendor.email ?? undefined,
                phone: editingVendor.phone ?? undefined,
                website: editingVendor.website ?? undefined,
                address: editingVendor.address ?? undefined,
                city: editingVendor.city ?? undefined,
                state: editingVendor.state ?? undefined,
                zip_code: editingVendor.zip_code ?? undefined,
                rating_platform: editingVendor.rating_platform ?? undefined,
                rating_score: editingVendor.rating_score ?? undefined,
                rating_reviews: editingVendor.rating_reviews ?? undefined,
                social_media: editingVendor.social_media ?? undefined,
                notes: editingVendor.user_vendor?.notes ?? undefined,
                found_via: editingVendor.user_vendor?.found_via ?? undefined,
                trade_category_id: editingVendor.user_vendor?.trade_category_id ?? editingVendor.trade_category_id ?? undefined,
              }}
              onSubmit={async (data) => {
                await handleUpdateVendor(
                  editingVendor.id,
                  {
                    name: data.name,
                    company_name: data.company_name,
                    email: data.email,
                    phone: data.phone,
                    website: data.website,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zip_code,
                    rating_platform: data.rating_platform,
                    rating_score: data.rating_score,
                    rating_reviews: data.rating_reviews,
                    social_media: data.social_media,
                  },
                  { notes: data.notes, found_via: data.found_via, trade_category_id: data.trade_category_id ?? null }
                );
              }}
              onCancel={() => setEditingVendor(null)}
              submitLabel="Save"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!vendorToDelete} onOpenChange={(open) => !open && setVendorToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Vendor</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Remove <strong>{vendorToDelete?.name}</strong>? This will not delete the vendor from the system.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setVendorToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVendor}>
              Remove
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
