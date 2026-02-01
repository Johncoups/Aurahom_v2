"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ChevronRight,
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

export function VendorsPage() {
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
    const categoryOrder: string[] = ["uncategorized"];

    for (const tc of tradeCategories) {
      byCategory[tc.id] = [];
      categoryOrder.push(tc.id);
    }

    for (const v of filtered) {
      // Use vendor's trade_category_id, with user_vendor override if set
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

  const handleAddVendor = async (data: CreateVendorInput & { notes?: string; found_via?: string[]; trade_category_id?: string | null }) => {
    if (!user?.id) return;
    const result = await addVendorToUserDirectory(user.id, data);
    if (result.success) {
      setIsAddModalOpen(false);
      await loadData();
      toast.success("Vendor added to your directory.");
    } else {
      toast.error(result.error ?? "Failed to add vendor");
    }
  };

  const handleUpdateVendor = async (
    vendorId: string,
    vendorData: Partial<CreateVendorInput>,
    userData?: { notes?: string; found_via?: string[] }
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
    await loadData();
    toast.success("Vendor updated.");
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete || !user?.id) return;
    const result = await removeVendorFromUserAction(user.id, vendorToDelete.id);
    if (result.success) {
      setVendorToDelete(null);
      await loadData();
      toast.success("Vendor removed from your directory.");
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
      toast.success("Exported vendors to CSV.");
    } else {
      toast.error(result.error ?? "Failed to export");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>
          <p className="text-sm text-gray-600 mt-1">
            Add contractors, suppliers, and rentals to your directory. Use them when requesting bids on the Bids page.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={(el) => setImportFileRef(el)}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleImport}
          />
          <Button variant="outline" size="sm" onClick={() => importFileRef?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport} disabled={vendors.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-600" />
        </div>
      ) : vendors.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-600 mb-4">
              No vendors yet. Add contractors, suppliers, and rentals to your directory.
            </p>
            <Button onClick={() => setIsAddModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Vendor
            </Button>
          </CardContent>
        </Card>
      ) : vendorsByCategory.categoryOrder.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-600">No vendors match your search.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {vendorsByCategory.categoryOrder.map((categoryId) => {
            const categoryVendors = vendorsByCategory.byCategory[categoryId] ?? [];
            const categoryName = getCategoryName(categoryId);
            const tc = tradeCategories.find((t) => t.id === categoryId);
            const TradeIcon = getTradeIcon(tc?.name ?? categoryName);

            return (
              <section key={categoryId}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">{categoryName}</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {categoryVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="flex-shrink-0 w-[180px] group"
                    >
                      <div className="rounded-xl border bg-white shadow-sm hover:shadow-md transition-all overflow-hidden">
                        <div className="aspect-square bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center relative">
                          <TradeIcon className="h-16 w-16 text-cyan-600/80" strokeWidth={1.5} />
                          <div className="absolute top-2 right-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setEditingVendor(vendor); }}
                              className="h-7 w-7 p-0"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setVendorToDelete(vendor); }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-sm text-gray-900 truncate" title={vendor.name}>
                            {vendor.name}
                          </p>
                          {vendor.company_name && (
                            <p className="text-xs text-gray-500 truncate" title={vendor.company_name}>
                              {vendor.company_name}
                            </p>
                          )}
                          {vendor.rating_score != null && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-amber-500 fill-current" />
                              <span className="text-xs">{vendor.rating_score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex-shrink-0 w-[180px] flex items-center">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-cyan-400 hover:bg-cyan-50/50 flex flex-col items-center justify-center gap-2 transition-colors text-gray-500 hover:text-cyan-600"
                    >
                      <Plus className="h-10 w-10" />
                      <span className="text-xs font-medium">Add vendor</span>
                    </button>
                  </div>
                </div>
              </section>
            );
          })}
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
                trade_category_id: editingVendor.user_vendor?.trade_category_id ?? undefined,
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
            Remove <strong>{vendorToDelete?.name}</strong> from your directory? This will not delete the vendor from the
            system—you can add them again later.
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
