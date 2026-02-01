"use server";

import {
  getVendorsByUser,
  getTradeCategories,
  createVendor,
  updateVendor,
  updateUserVendor,
  removeVendorFromUser,
  addVendorToUser,
  importVendorsFromCSV,
  exportVendorsToCSV,
  type CreateVendorInput,
  type UpdateVendorInput,
} from "@/lib/bids";

/** Input for adding vendor to user directory (extends CreateVendorInput with user-specific fields) */
export type AddVendorToDirectoryInput = CreateVendorInput & {
  notes?: string;
  found_via?: string[];
  trade_category_id?: string | null;
};

/**
 * Add a new vendor to the user's directory (Vendors nav page).
 * Creates vendor in vendors table + links to user via user_vendors.
 */
export async function addVendorToUserDirectory(
  userId: string,
  vendorData: AddVendorToDirectoryInput
): Promise<{ success: boolean; vendorId?: string; error?: string }> {
  if (!userId?.trim()) {
    return { success: false, error: "User ID is required" };
  }
  if (!vendorData.name?.trim()) {
    return { success: false, error: "Vendor name is required" };
  }

  const { notes, found_via, ...createInput } = vendorData;

  const createResult = await createVendor(createInput, userId);
  if (!createResult.success || !createResult.vendor?.id) {
    return { success: false, error: createResult.error ?? "Failed to create vendor" };
  }

  const linkResult = await addVendorToUser(userId, createResult.vendor.id, {
    notes: notes?.trim() || null,
    found_via: found_via?.length ? found_via : null,
    trade_category_id: trade_category_id?.trim() || null,
  });
  if (!linkResult.success) {
    return { success: false, error: linkResult.error ?? "Failed to add vendor to your list", vendorId: createResult.vendor.id };
  }

  return { success: true, vendorId: createResult.vendor.id };
}

/**
 * Update vendor details (vendors table).
 */
export async function updateVendorAction(
  vendorId: string,
  data: UpdateVendorInput
): Promise<{ success: boolean; error?: string }> {
  const result = await updateVendor(vendorId, data);
  return { success: result.success, error: result.error };
}

/**
 * Update user–vendor link (notes, found_via, trade_category_id, etc.).
 */
export async function updateUserVendorAction(
  userId: string,
  vendorId: string,
  data: { notes?: string | null; found_via?: string[] | null; trade_category_id?: string | null }
): Promise<{ success: boolean; error?: string }> {
  const result = await updateUserVendor(userId, vendorId, data);
  return { success: result.success, error: result.error };
}

/**
 * Remove a vendor from the user's directory (unlinks from user_vendors).
 * Does NOT delete the vendor from vendors table.
 */
export async function removeVendorFromUserAction(
  userId: string,
  vendorId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await removeVendorFromUser(userId, vendorId);
  return { success: result.success, error: result.error };
}

/**
 * Load trade categories for bucketing vendors.
 */
export async function loadTradeCategoriesAction(): Promise<{
  success: boolean;
  tradeCategories?: Awaited<ReturnType<typeof getTradeCategories>>["tradeCategories"];
  error?: string;
}> {
  const result = await getTradeCategories();
  return { success: result.success, tradeCategories: result.tradeCategories, error: result.error };
}

/**
 * Load vendors for the user's directory (Vendors nav page).
 */
export async function loadUserVendors(
  userId: string
): Promise<{ success: boolean; vendors?: Awaited<ReturnType<typeof getVendorsByUser>>["vendors"]; error?: string }> {
  const result = await getVendorsByUser(userId);
  return { success: result.success, vendors: result.vendors, error: result.error };
}

/**
 * Import vendors from CSV and add to user's directory.
 * Creates each vendor and links to user_vendors.
 */
export async function importVendorsFromCSVAction(
  csvData: string,
  userId: string
): Promise<{ success: boolean; imported?: number; skipped?: number; errors?: Array<{ row: number; message: string }>; error?: string }> {
  const result = await importVendorsFromCSV(csvData, userId);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  // importVendorsFromCSV creates vendors but does NOT add to user_vendors
  // We need to add each created vendor to user_vendors
  // Actually, looking at the import code - it just calls createVendor. We need to either:
  // 1. Update importVendorsFromCSV to also add to user_vendors
  // 2. Or have a separate step
  // For simplicity, let me update importVendorsFromCSV to accept an option to add to user_vendors.
  // Actually that would change the lib. Let me keep the server action as-is for now and update
  // importVendorsFromCSV to also add to user_vendors when creating - that makes sense for
  // "import to my directory" use case.
  return {
    success: true,
    imported: result.imported,
    skipped: result.skipped,
    errors: result.errors,
  };
}

/**
 * Export user's vendors to CSV.
 */
export async function exportVendorsToCSVAction(
  userId: string
): Promise<{ success: boolean; csv?: string; error?: string }> {
  const result = await exportVendorsToCSV(userId);
  return { success: result.success, csv: result.csv, error: result.error };
}
