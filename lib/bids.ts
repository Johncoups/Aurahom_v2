"use server";

import { createServerSupabaseClient } from "@/lib/supabase-server";
import { sendBidReceivedNotification } from "@/lib/email";
import { VENDOR_CSV_HEADERS, calculateBidComparison } from "./bids-utils";
import type { AddVendorToUserInput, UserVendor, UpdateUserVendorInput, TradeCategory } from "./bids-types";

// Re-export all types from bids-types.ts for convenience
export type * from "./bids-types";

// ============================================================================
// TYPE DEFINITIONS (imported from bids-types.ts)
// ============================================================================
// All types are now imported from ./bids-types.ts and re-exported above

// ============================================================================
// TRADE CATEGORIES
// ============================================================================

/**
 * Get all trade categories (e.g., Plumbing, Electrical, Foundation & Concrete).
 * Used for bucketing vendors by type.
 */
export async function getTradeCategories(): Promise<{
  success: boolean;
  tradeCategories?: TradeCategory[];
  error?: string;
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("trade_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, tradeCategories: (data || []) as TradeCategory[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load trade categories",
    };
  }
}

// ============================================================================
// VENDOR CRUD OPERATIONS
// ============================================================================

/**
 * Create a new vendor in the shared directory
 * @param vendorData - Vendor information to create
 * @param userId - User ID of the person creating the vendor (for created_by_user_id audit)
 * @returns VendorResult with the created vendor or error
 */
export async function createVendor(
  vendorData: CreateVendorInput,
  userId: string
): Promise<VendorResult> {
  try {
    if (!vendorData.name?.trim()) {
      return { success: false, error: "Vendor name is required" };
    }

    const supabase = await createServerSupabaseClient();

    // Check if vendor with same email already exists (optional check)
    if (vendorData.email?.trim()) {
      const { data: existing } = await supabase
        .from("vendors")
        .select("id, name")
        .eq("email", vendorData.email.trim())
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          error: `Vendor with email ${vendorData.email} already exists: ${existing.name}`,
        };
      }
    }

    // Prepare insert data
    const insertData: any = {
      created_by_user_id: userId,
      name: vendorData.name.trim(),
      company_name: vendorData.company_name?.trim() || null,
      email: vendorData.email?.trim() || null,
      phone: vendorData.phone?.trim() || null,
      website: vendorData.website?.trim() || null,
      address: vendorData.address?.trim() || null,
      city: vendorData.city?.trim() || null,
      state: vendorData.state?.trim() || null,
      zip_code: vendorData.zip_code?.trim() || null,
      rating_platform: vendorData.rating_platform || null,
      rating_score: vendorData.rating_score ?? null,
      rating_reviews: vendorData.rating_reviews ?? null,
      social_media: vendorData.social_media || null,
      services_offered: vendorData.services_offered || null,
      specialties: vendorData.specialties || null,
      service_area: vendorData.service_area || null,
      licensed: vendorData.licensed ?? false,
      insured: vendorData.insured ?? false,
      license_number: vendorData.license_number?.trim() || null,
      insurance_info: vendorData.insurance_info?.trim() || null,
    };

    const { data, error } = await supabase
      .from("vendors")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, vendor: data as Vendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create vendor",
    };
  }
}

/**
 * Update an existing vendor
 * Only the user who created the vendor (created_by_user_id) can update it per RLS
 * @param vendorId - UUID of the vendor to update
 * @param vendorData - Partial vendor data to update
 * @returns VendorResult with the updated vendor or error
 */
export async function updateVendor(
  vendorId: string,
  vendorData: UpdateVendorInput
): Promise<VendorResult> {
  try {
    if (!vendorId) {
      return { success: false, error: "Vendor ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    // Prepare update data (only include provided fields)
    const updateData: any = {};
    
    if (vendorData.name !== undefined) updateData.name = vendorData.name.trim();
    if (vendorData.company_name !== undefined) updateData.company_name = vendorData.company_name?.trim() || null;
    if (vendorData.email !== undefined) updateData.email = vendorData.email?.trim() || null;
    if (vendorData.phone !== undefined) updateData.phone = vendorData.phone?.trim() || null;
    if (vendorData.website !== undefined) updateData.website = vendorData.website?.trim() || null;
    if (vendorData.address !== undefined) updateData.address = vendorData.address?.trim() || null;
    if (vendorData.city !== undefined) updateData.city = vendorData.city?.trim() || null;
    if (vendorData.state !== undefined) updateData.state = vendorData.state?.trim() || null;
    if (vendorData.zip_code !== undefined) updateData.zip_code = vendorData.zip_code?.trim() || null;
    if (vendorData.rating_platform !== undefined) updateData.rating_platform = vendorData.rating_platform || null;
    if (vendorData.rating_score !== undefined) updateData.rating_score = vendorData.rating_score ?? null;
    if (vendorData.rating_reviews !== undefined) updateData.rating_reviews = vendorData.rating_reviews ?? null;
    if (vendorData.social_media !== undefined) updateData.social_media = vendorData.social_media || null;
    if (vendorData.services_offered !== undefined) updateData.services_offered = vendorData.services_offered || null;
    if (vendorData.specialties !== undefined) updateData.specialties = vendorData.specialties || null;
    if (vendorData.service_area !== undefined) updateData.service_area = vendorData.service_area || null;
    if (vendorData.licensed !== undefined) updateData.licensed = vendorData.licensed;
    if (vendorData.insured !== undefined) updateData.insured = vendorData.insured;
    if (vendorData.license_number !== undefined) updateData.license_number = vendorData.license_number?.trim() || null;
    if (vendorData.insurance_info !== undefined) updateData.insurance_info = vendorData.insurance_info?.trim() || null;

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No fields to update" };
    }

    const { data, error } = await supabase
      .from("vendors")
      .update(updateData)
      .eq("id", vendorId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: "Vendor not found or you don't have permission to update it" };
    }

    return { success: true, vendor: data as Vendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update vendor",
    };
  }
}

/**
 * Add a vendor to a user's directory (insert user_vendors).
 * Idempotent: if the link already exists, returns success without error.
 * Use for the Vendors nav page (personal vendor directory).
 */
export async function addVendorToUser(
  userId: string,
  vendorId: string,
  options?: AddVendorToUserInput
): Promise<{ success: boolean; userVendor?: UserVendor; error?: string }> {
  try {
    if (!userId?.trim()) {
      return { success: false, error: "User ID is required" };
    }
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const insertData: Record<string, unknown> = {
      user_id: userId.trim(),
      vendor_id: vendorId.trim(),
      trade_category_id: options?.trade_category_id?.trim() || null,
      notes: options?.notes?.trim() || null,
      tags: options?.tags ?? null,
      preferred_contact_method: options?.preferred_contact_method?.trim() || "email",
      contact_hours: options?.contact_hours?.trim() || null,
      found_via: options?.found_via ?? null,
      is_favorite: options?.is_favorite ?? false,
      is_active: options?.is_active ?? true,
    };

    const { data, error } = await supabase
      .from("user_vendors")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        const { data: existing } = await supabase
          .from("user_vendors")
          .select("*")
          .eq("user_id", userId.trim())
          .eq("vendor_id", vendorId.trim())
          .single();
        return { success: true, userVendor: existing as UserVendor };
      }
      return { success: false, error: error.message };
    }

    return { success: true, userVendor: data as UserVendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add vendor to user directory",
    };
  }
}

/**
 * Update a user–vendor link (notes, found_via, etc.).
 * @param userId - User ID
 * @param vendorId - Vendor ID
 * @param data - Fields to update
 */
export async function updateUserVendor(
  userId: string,
  vendorId: string,
  data: UpdateUserVendorInput
): Promise<{ success: boolean; userVendor?: UserVendor; error?: string }> {
  try {
    if (!userId?.trim()) {
      return { success: false, error: "User ID is required" };
    }
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) updates[k] = v;
    }
    if (Object.keys(updates).length === 0) {
      return { success: false, error: "No fields to update" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: updated, error } = await supabase
      .from("user_vendors")
      .update(updates)
      .eq("user_id", userId.trim())
      .eq("vendor_id", vendorId.trim())
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!updated) {
      return { success: false, error: "User–vendor link not found or access denied" };
    }

    return { success: true, userVendor: updated as UserVendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update user vendor",
    };
  }
}

/**
 * Remove a vendor from a user's vendor list (deletes user_vendors association)
 * This does NOT delete the vendor from the vendors table - vendors are shared
 * @param userId - User ID removing the vendor
 * @param vendorId - UUID of the vendor to remove from user's list
 * @returns Result with success status or error
 */
export async function removeVendorFromUser(
  userId: string,
  vendorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!userId || !vendorId) {
      return { success: false, error: "User ID and Vendor ID are required" };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("user_vendors")
      .delete()
      .eq("user_id", userId)
      .eq("vendor_id", vendorId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove vendor from user",
    };
  }
}

/**
 * Remove a vendor from a project (deletes project_vendors association)
 * This does NOT delete the vendor from the vendors table - vendors are shared
 * @param projectId - Project ID removing the vendor from
 * @param vendorId - UUID of the vendor to remove from project
 * @returns Result with success status or error
 */
export async function removeVendorFromProject(
  projectId: string,
  vendorId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!projectId || !vendorId) {
      return { success: false, error: "Project ID and Vendor ID are required" };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from("project_vendors")
      .delete()
      .eq("project_id", projectId)
      .eq("vendor_id", vendorId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to remove vendor from project",
    };
  }
}

/**
 * Add a vendor to a project (insert project_vendors).
 * Idempotent: if the link already exists, returns success without error.
 * @param projectId - Project to add the vendor to
 * @param vendorId - Vendor to add
 * @param addedByUserId - User adding the vendor (for added_by_user_id)
 * @param options - Optional project-specific data (notes, tags, trade_category_id, etc.)
 */
export async function addVendorToProject(
  projectId: string,
  vendorId: string,
  addedByUserId: string,
  options?: AddVendorToProjectInput
): Promise<{ success: boolean; projectVendor?: ProjectVendor; error?: string }> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }
    if (!addedByUserId?.trim()) {
      return { success: false, error: "Added-by user ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const insertData: Record<string, unknown> = {
      project_id: projectId.trim(),
      vendor_id: vendorId.trim(),
      added_by_user_id: addedByUserId.trim(),
      trade_category_id: options?.trade_category_id?.trim() || null,
      notes: options?.notes?.trim() || null,
      tags: options?.tags ?? null,
      preferred_contact_method: options?.preferred_contact_method?.trim() || "email",
      found_via: options?.found_via ?? null,
      is_favorite: options?.is_favorite ?? false,
      is_active: options?.is_active ?? true,
    };

    const { data, error } = await supabase
      .from("project_vendors")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique violation = already on project; treat as success (idempotent)
        const { data: existing } = await supabase
          .from("project_vendors")
          .select("*")
          .eq("project_id", projectId.trim())
          .eq("vendor_id", vendorId.trim())
          .single();
        return { success: true, projectVendor: existing as ProjectVendor };
      }
      return { success: false, error: error.message };
    }

    return { success: true, projectVendor: data as ProjectVendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add vendor to project",
    };
  }
}

/**
 * Ensure a project_vendors row exists for (projectId, vendorId). Create if missing.
 * Use when adding a vendor to a project or when sending a bid request so the vendor is "on the project."
 * @param projectId - Project ID
 * @param vendorId - Vendor ID
 * @param userId - User ID (for added_by_user_id when creating); optional
 */
export async function ensureProjectVendor(
  projectId: string,
  vendorId: string,
  userId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: existing } = await supabase
      .from("project_vendors")
      .select("id")
      .eq("project_id", projectId.trim())
      .eq("vendor_id", vendorId.trim())
      .maybeSingle();

    if (existing?.id) {
      return { success: true };
    }

    const { error } = await supabase.from("project_vendors").insert({
      project_id: projectId.trim(),
      vendor_id: vendorId.trim(),
      added_by_user_id: userId?.trim() || null,
      is_active: true,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to ensure project vendor",
    };
  }
}

/**
 * Update a project–vendor link (notes, tags, trade_category_id, etc.).
 * @param projectId - Project ID
 * @param vendorId - Vendor ID
 * @param data - Fields to update
 */
export async function updateProjectVendor(
  projectId: string,
  vendorId: string,
  data: UpdateProjectVendorInput
): Promise<{ success: boolean; projectVendor?: ProjectVendor; error?: string }> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) updates[k] = v;
    }
    if (Object.keys(updates).length === 0) {
      return { success: false, error: "No fields to update" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: updated, error } = await supabase
      .from("project_vendors")
      .update(updates)
      .eq("project_id", projectId.trim())
      .eq("vendor_id", vendorId.trim())
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!updated) {
      return { success: false, error: "Project–vendor link not found or access denied" };
    }

    return { success: true, projectVendor: updated as ProjectVendor };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update project vendor",
    };
  }
}

/**
 * Get all vendors from the shared directory.
 * This returns ALL vendors (not filtered by user) with optional user-specific data
 * from user_vendors if the user has linked/favorited them.
 * @param userId - User ID to get user-specific data for (favorites, notes, etc.)
 * @returns VendorWithUserDataResult with all vendors and any user-specific data
 */
export async function getVendorsByUser(
  userId: string
): Promise<VendorWithUserDataResult> {
  try {
    if (!userId) {
      return { success: false, error: "User ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    // Get ALL vendors from the shared directory
    const { data: vendorsData, error: vendorsError } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (vendorsError) {
      return { success: false, error: vendorsError.message };
    }

    // Get user-specific data for this user (favorites, notes, etc.)
    const { data: userVendorsData, error: userVendorsError } = await supabase
      .from("user_vendors")
      .select("*")
      .eq("user_id", userId);

    if (userVendorsError) {
      // Non-fatal: we can still return vendors without user-specific data
      console.warn("Failed to load user_vendors:", userVendorsError.message);
    }

    // Create a map of vendor_id -> user_vendor data for quick lookup
    const userVendorMap = new Map<string, any>();
    if (userVendorsData) {
      for (const uv of userVendorsData) {
        userVendorMap.set(uv.vendor_id, uv);
      }
    }

    // Transform the data to match VendorWithUserData interface
    const vendors: VendorWithUserData[] = (vendorsData || []).map((vendor: any) => {
      const userVendor = userVendorMap.get(vendor.id);
      return {
        ...vendor,
        user_vendor: userVendor ? {
          id: userVendor.id,
          user_id: userVendor.user_id,
          vendor_id: userVendor.vendor_id,
          trade_category_id: userVendor.trade_category_id,
          notes: userVendor.notes,
          tags: userVendor.tags,
          preferred_contact_method: userVendor.preferred_contact_method,
          contact_hours: userVendor.contact_hours,
          found_via: userVendor.found_via,
          is_favorite: userVendor.is_favorite,
          is_active: userVendor.is_active,
          created_at: userVendor.created_at,
          updated_at: userVendor.updated_at,
        } : undefined,
      };
    });

    return { success: true, vendors };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get vendors",
    };
  }
}

/**
 * Get all vendors associated with a project (via project_vendors bridge)
 * Returns vendors with project-specific data (notes, tags, trade_category, etc.)
 * @param projectId - Project ID to get vendors for
 * @returns VendorWithProjectDataResult with vendors and their project-specific data
 */
export async function getVendorsByProject(
  projectId: string
): Promise<VendorWithProjectDataResult> {
  try {
    if (!projectId) {
      return { success: false, error: "Project ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("project_vendors")
      .select(`
        *,
        vendor:vendors(*)
      `)
      .eq("project_id", projectId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform the data to match VendorWithProjectData interface
    const vendors: VendorWithProjectData[] = (data || []).map((row: any) => ({
      ...(row.vendor as Vendor),
      project_vendor: {
        id: row.id,
        project_id: row.project_id,
        vendor_id: row.vendor_id,
        trade_category_id: row.trade_category_id,
        notes: row.notes,
        tags: row.tags,
        preferred_contact_method: row.preferred_contact_method,
        found_via: row.found_via,
        is_favorite: row.is_favorite,
        is_active: row.is_active,
        added_by_user_id: row.added_by_user_id,
        created_at: row.created_at,
        updated_at: row.updated_at,
      },
    }));

    return { success: true, vendors };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get vendors by project",
    };
  }
}

/**
 * Search vendors with optional filters
 * Searches across vendor name, company_name, email, and services_offered
 * @param query - Search query string (searches name, company_name, email)
 * @param filters - Optional filters (trade_category, services, location, etc.)
 * @returns VendorListResult with matching vendors
 */
export async function searchVendors(
  query?: string,
  filters?: VendorSearchFilters
): Promise<VendorListResult> {
  try {
    const supabase = await createServerSupabaseClient();

    let queryBuilder = supabase.from("vendors").select("*");

    // Text search on name, company_name, email
    if (query?.trim()) {
      const searchTerm = query.trim().toLowerCase();
      // Use PostgREST or() syntax: field.operator.value,field2.operator.value2
      queryBuilder = queryBuilder.or(
        `name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
      );
    }

    // Apply filters
    if (filters) {
      if (filters.trade_category_id) {
        // Filter by trade_category_id requires joining through user_vendors or project_vendors
        // We'll do this as a separate query and filter by vendor IDs
        // Note: This searches across all users' vendor classifications
        const { data: userVendors } = await supabase
          .from("user_vendors")
          .select("vendor_id")
          .eq("trade_category_id", filters.trade_category_id);
        
        if (userVendors && userVendors.length > 0) {
          const vendorIds = userVendors.map((uv) => uv.vendor_id);
          queryBuilder = queryBuilder.in("id", vendorIds);
        } else {
          // No vendors match this trade category - return empty result
          return { success: true, vendors: [] };
        }
      }

      if (filters.services_offered && filters.services_offered.length > 0) {
        // Use array overlap operator for PostgreSQL arrays
        queryBuilder = queryBuilder.overlaps("services_offered", filters.services_offered);
      }

      if (filters.licensed !== undefined) {
        queryBuilder = queryBuilder.eq("licensed", filters.licensed);
      }

      if (filters.insured !== undefined) {
        queryBuilder = queryBuilder.eq("insured", filters.insured);
      }

      if (filters.rating_min !== undefined) {
        queryBuilder = queryBuilder.gte("rating_score", filters.rating_min);
      }

      if (filters.city) {
        queryBuilder = queryBuilder.ilike("city", `%${filters.city}%`);
      }

      if (filters.state) {
        queryBuilder = queryBuilder.ilike("state", `%${filters.state}%`);
      }

      if (filters.service_area && filters.service_area.length > 0) {
        queryBuilder = queryBuilder.overlaps("service_area", filters.service_area);
      }
    }

    const { data, error } = await queryBuilder.order("name", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, vendors: (data || []) as Vendor[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to search vendors",
    };
  }
}

// ============================================================================
// BID REQUEST OPERATIONS
// ============================================================================

/**
 * Find an existing bid request for the same (project, vendor, scope/phases) that is in a "sendable" state.
 * Use this for idempotency: don't create duplicate requests for the same scope.
 * @param options - Search criteria (projectId, vendorId required; phaseIds, scopeTitle optional)
 * @returns The existing bid request if found, or null
 */
export async function findExistingBidRequest(
  options: FindExistingBidRequestOptions
): Promise<BidRequestResult> {
  try {
    if (!options.projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!options.vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    // Default: look for requests in sendable states (not yet responded to or still pending)
    const sendableStatuses: BidRequestStatus[] = options.statuses ?? [
      "not_requested",
      "pending",
    ];

    let query = supabase
      .from("bid_requests")
      .select("*")
      .eq("project_id", options.projectId.trim())
      .eq("vendor_id", options.vendorId.trim())
      .in("status", sendableStatuses)
      .order("created_at", { ascending: false })
      .limit(1);

    // If phaseIds provided, find requests with overlapping phases
    if (options.phaseIds?.length) {
      // Use array overlap: bid_request.phase_ids && options.phaseIds
      query = query.overlaps("phase_ids", options.phaseIds);
    }

    // If scopeTitle provided, exact match
    if (options.scopeTitle?.trim()) {
      query = query.eq("scope_title", options.scopeTitle.trim());
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      // No existing request found — that's fine, just return success with no bidRequest
      return { success: true, bidRequest: undefined };
    }

    return { success: true, bidRequest: data as BidRequest };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to find existing bid request",
    };
  }
}

/**
 * Create a new bid request.
 * RLS: user_id must match auth.uid() on insert.
 * @param input - Bid request data (project_id, vendor_id, phase_ids, request_method required)
 * @param userId - User ID creating the request (must match authenticated user for RLS)
 */
export async function createBidRequest(
  input: CreateBidRequestInput,
  userId: string
): Promise<BidRequestResult> {
  try {
    if (!input.project_id?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!input.vendor_id?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }
    if (!input.phase_ids?.length) {
      return { success: false, error: "At least one phase ID is required" };
    }
    if (!input.request_method?.trim()) {
      return { success: false, error: "Request method is required" };
    }

    const validMethods: RequestMethod[] = ["manual", "aurahom", "user_email"];
    if (!validMethods.includes(input.request_method as RequestMethod)) {
      return { success: false, error: "Invalid request method" };
    }

    const supabase = await createServerSupabaseClient();

    const insertData: Record<string, unknown> = {
      project_id: input.project_id.trim(),
      user_id: userId,
      vendor_id: input.vendor_id.trim(),
      phase_ids: input.phase_ids,
      request_method: input.request_method,
      trade_category_id: input.trade_category_id?.trim() || null,
      scope_title: input.scope_title?.trim() || null,
      scope_description: input.scope_description?.trim() || null,
      status: input.status ?? "not_requested",
      due_date: input.due_date || null,
      expires_at: input.expires_at || null,
      message_sent: input.message_sent?.trim() || null,
      email_subject: input.email_subject?.trim() || null,
      requested_at: input.requested_at || null,
    };

    const { data, error } = await supabase
      .from("bid_requests")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bidRequest: data as BidRequest };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create bid request",
    };
  }
}

/**
 * Update a bid request's status.
 * RLS: only the user who created the request can update it.
 */
export async function updateBidRequestStatus(
  requestId: string,
  status: BidRequestStatus
): Promise<BidRequestResult> {
  try {
    if (!requestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const validStatuses: BidRequestStatus[] = [
      "not_requested",
      "pending",
      "bid_received",
      "accepted",
      "rejected",
      "expired",
    ];
    if (!validStatuses.includes(status)) {
      return { success: false, error: "Invalid status" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bid_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Bid request not found or access denied" };
    }

    return { success: true, bidRequest: data as BidRequest };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update bid request status",
    };
  }
}

/**
 * Get all bid requests for a project (for the current user per RLS).
 */
export async function getBidRequestsByProject(
  projectId: string
): Promise<BidRequestListResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bid_requests")
      .select("*")
      .eq("project_id", projectId)
      .order("requested_at", { ascending: false, nullsFirst: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bidRequests: (data || []) as BidRequest[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bid requests by project",
    };
  }
}

/**
 * Get all bid requests for a vendor (for the current user per RLS).
 */
export async function getBidRequestsByVendor(
  vendorId: string
): Promise<BidRequestListResult> {
  try {
    if (!vendorId?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bid_requests")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("requested_at", { ascending: false, nullsFirst: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bidRequests: (data || []) as BidRequest[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bid requests by vendor",
    };
  }
}

/**
 * Delete a bid request.
 * RLS: only the user who created the request can delete it.
 * Cascades: bids and email_communications referencing this request may be affected by DB CASCADE.
 */
export async function deleteBidRequest(
  requestId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!requestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.from("bid_requests").delete().eq("id", requestId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete bid request",
    };
  }
}

// ============================================================================
// BID SUBMISSION FUNCTIONS
// ============================================================================

const VALID_BID_STATUSES: BidStatus[] = [
  "submitted",
  "under_review",
  "accepted",
  "rejected",
  "expired",
  "withdrawn",
];

/**
 * Submit a new bid (vendor's response to a bid request).
 * Optionally sets the bid_request status to "bid_received" when first bid is created.
 */
export async function submitBid(
  input: CreateBidInput,
  _userId?: string
): Promise<BidResult> {
  try {
    if (!input.bid_request_id?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }
    if (!input.vendor_id?.trim()) {
      return { success: false, error: "Vendor ID is required" };
    }
    if (!input.project_id?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (input.total_amount == null || Number(input.total_amount) < 0) {
      return { success: false, error: "Total amount is required and must be >= 0" };
    }

    const supabase = await createServerSupabaseClient();

    const insertData: Record<string, unknown> = {
      bid_request_id: input.bid_request_id.trim(),
      vendor_id: input.vendor_id.trim(),
      project_id: input.project_id.trim(),
      total_amount: Number(input.total_amount),
      materials_cost: input.materials_cost ?? 0,
      labor_cost: input.labor_cost ?? 0,
      phase_costs: input.phase_costs ?? {},
      timeline_days: input.timeline_days ?? null,
      timeline_description: input.timeline_description?.trim() || null,
      start_date: input.start_date || null,
      completion_date: input.completion_date || null,
      notes: input.notes?.trim() || null,
      warranty_info: input.warranty_info?.trim() || null,
      payment_terms: input.payment_terms?.trim() || null,
      exclusions: input.exclusions?.trim() || null,
      assumptions: input.assumptions?.trim() || null,
      attachments: input.attachments ?? [],
      status: input.status && VALID_BID_STATUSES.includes(input.status) ? input.status : "submitted",
    };

    const { data, error } = await supabase
      .from("bids")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Optionally set bid_request status to "bid_received" when first bid is created
    const { count } = await supabase
      .from("bids")
      .select("*", { count: "exact", head: true })
      .eq("bid_request_id", input.bid_request_id.trim());
    const bidCount = count ?? 0;
    if (bidCount === 1) {
      await updateBidRequestStatus(input.bid_request_id.trim(), "bid_received");
    }

    const bid = data as Bid;

    // Notify project owner (bid_request owner) that a bid was received (best-effort)
    try {
      const { data: br } = await supabase
        .from("bid_requests")
        .select("user_id, scope_title")
        .eq("id", input.bid_request_id.trim())
        .single();
      if (br?.user_id) {
        const { data: vendor } = await supabase
          .from("vendors")
          .select("name")
          .eq("id", input.vendor_id.trim())
          .single();
        const { data: projectOwner } = await supabase
          .from("users")
          .select("id, email, first_name, last_name")
          .eq("id", br.user_id)
          .single();
        let projectName: string | null = null;
        const { data: project } = await supabase
          .from("projects")
          .select("name")
          .eq("id", input.project_id.trim())
          .single();
        if (project?.name) projectName = project.name;

        if (projectOwner?.email?.trim()) {
          const fullName = [projectOwner.first_name, projectOwner.last_name].filter(Boolean).join(" ") || null;
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
          const viewBidUrl = baseUrl ? `${baseUrl}/dashboard?tab=bids` : null;

          await sendBidReceivedNotification(
            {
              id: bid.id,
              bid_request_id: bid.bid_request_id,
              project_id: bid.project_id,
              vendor_id: bid.vendor_id,
              total_amount: bid.total_amount,
              notes: bid.notes ?? null,
              submitted_at: bid.submitted_at ?? null,
            },
            {
              id: projectOwner.id,
              email: projectOwner.email.trim(),
              full_name: fullName,
            },
            {
              vendorName: vendor?.name?.trim() || "A vendor",
              projectName: projectName ?? null,
              scopeTitle: br.scope_title?.trim() || null,
              viewBidUrl,
            },
            { recordInDatabase: true }
          );
        }
      }
    } catch {
      // Non-fatal: bid was created; notification is best-effort
    }

    return { success: true, bid };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to submit bid",
    };
  }
}

/**
 * Add line items to a bid (bid_items) with optional budget_item_id for budget linking.
 */
export async function addBidItems(
  bidId: string,
  items: CreateBidItemInput[]
): Promise<BidItemResult> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }
    if (!items?.length) {
      return { success: false, error: "At least one bid item is required" };
    }

    for (const item of items) {
      if (!item.description?.trim()) {
        return { success: false, error: "Each bid item must have a description" };
      }
      if (!item.phase_id?.trim()) {
        return { success: false, error: "Each bid item must have a phase_id" };
      }
      if (item.total_cost == null || Number(item.total_cost) < 0) {
        return { success: false, error: "Each bid item must have total_cost >= 0" };
      }
    }

    const supabase = await createServerSupabaseClient();

    const rows = items.map((item) => ({
      bid_id: bidId.trim(),
      budget_item_id: item.budget_item_id?.trim() || null,
      description: item.description.trim(),
      phase_id: item.phase_id.trim(),
      materials_cost: item.materials_cost ?? 0,
      labor_cost: item.labor_cost ?? 0,
      total_cost: Number(item.total_cost),
    }));

    const { data, error } = await supabase.from("bid_items").insert(rows).select();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bidItems: (data || []) as BidItem[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add bid items",
    };
  }
}

/**
 * Update an existing bid.
 */
export async function updateBid(
  bidId: string,
  data: UpdateBidInput
): Promise<BidResult> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }
    const updates: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) updates[k] = v;
    }
    if (Object.keys(updates).length === 0) {
      return { success: false, error: "No fields to update" };
    }
    if (data.status != null && !VALID_BID_STATUSES.includes(data.status)) {
      return { success: false, error: "Invalid bid status" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: updated, error } = await supabase
      .from("bids")
      .update(updates)
      .eq("id", bidId.trim())
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!updated) {
      return { success: false, error: "Bid not found or access denied" };
    }

    return { success: true, bid: updated as Bid };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update bid",
    };
  }
}

/**
 * Get all bids for a project.
 */
export async function getBidsByProject(
  projectId: string
): Promise<BidListResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("project_id", projectId.trim())
      .order("submitted_at", { ascending: false, nullsFirst: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bids: (data || []) as Bid[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bids by project",
    };
  }
}

/**
 * Get all bids for a bid request.
 */
export async function getBidsByRequest(
  bidRequestId: string
): Promise<BidListResult> {
  try {
    if (!bidRequestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("bid_request_id", bidRequestId.trim())
      .order("submitted_at", { ascending: false, nullsFirst: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bids: (data || []) as Bid[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bids by request",
    };
  }
}

/**
 * Accept a bid: set this bid to accepted, reject others for the same request, set bid_request status to accepted.
 * Does not push to budget_items in this implementation (no budget_items API in scope).
 */
export async function acceptBid(
  bidId: string,
  userId: string
): Promise<BidResult> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: bid, error: fetchError } = await supabase
      .from("bids")
      .select("id, bid_request_id, project_id, status")
      .eq("id", bidId.trim())
      .single();

    if (fetchError || !bid) {
      return { success: false, error: "Bid not found or access denied" };
    }

    const requestId = bid.bid_request_id as string;

    const { error: updateBidError } = await supabase
      .from("bids")
      .update({
        status: "accepted",
        reviewed_at: new Date().toISOString(),
        reviewed_by: userId,
        rejection_reason: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bidId.trim());

    if (updateBidError) {
      return { success: false, error: updateBidError.message };
    }

    const { error: rejectOthersError } = await supabase
      .from("bids")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq("bid_request_id", requestId)
      .neq("id", bidId.trim());

    if (rejectOthersError) {
      return { success: false, error: rejectOthersError.message };
    }

    await updateBidRequestStatus(requestId, "accepted");

    const { data: updatedBid } = await supabase
      .from("bids")
      .select("*")
      .eq("id", bidId.trim())
      .single();

    return { success: true, bid: updatedBid as Bid };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to accept bid",
    };
  }
}

/**
 * Reject a bid: set status to rejected and optional rejection_reason.
 */
export async function rejectBid(
  bidId: string,
  userId: string,
  rejectionReason?: string | null
): Promise<BidResult> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bids")
      .update({
        status: "rejected",
        reviewed_at: new Date().toISOString(),
        reviewed_by: userId,
        rejection_reason: rejectionReason?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bidId.trim())
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    if (!data) {
      return { success: false, error: "Bid not found or access denied" };
    }

    return { success: true, bid: data as Bid };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to reject bid",
    };
  }
}

/**
 * Get bids for a request with comparison info (lowest bid, ordering).
 */
export async function compareBids(
  bidRequestId: string
): Promise<BidComparisonResult> {
  try {
    if (!bidRequestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const listResult = await getBidsByRequest(bidRequestId.trim());
    if (!listResult.success || !listResult.bids?.length) {
      return {
        success: true,
        bidRequestId: bidRequestId.trim(),
        bids: listResult.bids ?? [],
        lowestBidId: null,
      };
    }

    const bids = listResult.bids;
    const sorted = [...bids].sort(
      (a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0)
    );
    const lowestBidId = sorted[0]?.id ?? null;

    return {
      success: true,
      bidRequestId: bidRequestId.trim(),
      bids: sorted,
      lowestBidId,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to compare bids",
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// calculateBidComparison moved to lib/bids-utils.ts
// VENDOR_CSV_HEADERS moved to lib/bids-utils.ts

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Import vendors from CSV string. First row = headers (name, company_name, email, phone, ...).
 * Creates vendors and optionally links to user via user_vendors (not done here; caller can add).
 */
export async function importVendorsFromCSV(
  csvData: string,
  userId: string
): Promise<ImportVendorsResult> {
  try {
    if (!csvData?.trim()) {
      return { success: false, error: "CSV data is required" };
    }
    if (!userId?.trim()) {
      return { success: false, error: "User ID is required" };
    }

    const lines = csvData.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return { success: false, error: "CSV must have a header row and at least one data row" };
    }

    const headerLine = lines[0];
    const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
    const nameIdx = headers.indexOf("name");
    if (nameIdx === -1) {
      return { success: false, error: "CSV must have a 'name' column" };
    }

    let imported = 0;
    let skipped = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const name = row[nameIdx]?.trim();
      if (!name) {
        skipped++;
        continue;
      }
      const get = (key: string) => {
        const idx = headers.indexOf(key);
        return idx >= 0 ? row[idx]?.trim() ?? "" : "";
      };
      const vendorData: CreateVendorInput = {
        name,
        company_name: get("company_name") || undefined,
        email: get("email") || undefined,
        phone: get("phone") || undefined,
        website: get("website") || undefined,
        address: get("address") || undefined,
        city: get("city") || undefined,
        state: get("state") || undefined,
        zip_code: get("zip_code") || undefined,
      };
      const result = await createVendor(vendorData, userId);
      if (result.success && result.vendor?.id) {
        const linkResult = await addVendorToUser(userId, result.vendor.id);
        if (linkResult.success) {
          imported++;
        } else {
          errors.push({ row: i + 1, message: linkResult.error ?? "Failed to add to your directory" });
        }
      } else {
        errors.push({ row: i + 1, message: result.error ?? "Unknown error" });
      }
    }

    return {
      success: true,
      imported,
      skipped,
      ...(errors.length ? { errors } : {}),
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to import vendors from CSV",
    };
  }
}

/**
 * Export the user's vendors to a CSV string (name, company_name, email, phone, ...).
 */
export async function exportVendorsToCSV(
  userId: string
): Promise<ExportVendorsResult> {
  try {
    if (!userId?.trim()) {
      return { success: false, error: "User ID is required" };
    }

    const listResult = await getVendorsByUser(userId.trim());
    if (!listResult.success) {
      return { success: false, error: listResult.error ?? "Failed to load vendors" };
    }

    const vendors = listResult.vendors ?? [];
    const headerRow = VENDOR_CSV_HEADERS.join(",");
    const escape = (v: string | number | boolean | null | undefined): string => {
      if (v == null) return "";
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = vendors.map((v) => {
      const uv = v.user_vendor;
      return VENDOR_CSV_HEADERS.map((h) => {
        if (h === "name") return escape(v.name);
        const val = (v as Record<string, unknown>)[h];
        return escape(val);
      }).join(",");
    });
    const csv = [headerRow, ...rows].join("\n");

    return { success: true, csv };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to export vendors to CSV",
    };
  }
}

/**
 * Generate printable HTML for a bid request (vendor, scope, phases). Use browser "Print to PDF" or a PDF service.
 */
export async function generateBidRequestPDF(
  bidRequestId: string
): Promise<GenerateBidRequestPDFResult> {
  try {
    if (!bidRequestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data: br, error: brError } = await supabase
      .from("bid_requests")
      .select("id, project_id, vendor_id, phase_ids, scope_title, scope_description, status, request_method, due_date, requested_at")
      .eq("id", bidRequestId.trim())
      .single();

    if (brError || !br) {
      return { success: false, error: "Bid request not found or access denied" };
    }

    const { data: vendor } = await supabase
      .from("vendors")
      .select("name, company_name, email, phone, address, city, state, zip_code")
      .eq("id", br.vendor_id)
      .single();

    const { data: project } = await supabase
      .from("projects")
      .select("name")
      .eq("id", br.project_id)
      .single();

    const scopeTitle = (br.scope_title as string)?.trim() || "Bid request";
    const scopeDesc = (br.scope_description as string)?.trim() || "";
    const phaseIds = (br.phase_ids as string[]) ?? [];
    const vendorName = (vendor?.name ?? vendor?.company_name) ?? "Vendor";
    const projectName = (project?.name as string) ?? "Project";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Bid Request – ${escapeHtml(scopeTitle)}</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; color: #1f2937; max-width: 700px; margin: 2rem auto; padding: 0 1rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .section { margin-bottom: 1.5rem; }
    .section h2 { font-size: 1rem; margin-bottom: 0.5rem; color: #374151; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0.25rem 0.5rem 0; border-bottom: 1px solid #e5e7eb; }
    th { color: #6b7280; font-weight: 500; }
  </style>
</head>
<body>
  <h1>Bid Request</h1>
  <div class="meta">${escapeHtml(projectName)} · ${escapeHtml(vendorName)}</div>
  <div class="section">
    <h2>Scope</h2>
    <p><strong>${escapeHtml(scopeTitle)}</strong></p>
    ${scopeDesc ? `<p>${escapeHtml(scopeDesc)}</p>` : ""}
  </div>
  ${phaseIds.length ? `<div class="section"><h2>Phases</h2><p>${escapeHtml(phaseIds.join(", "))}</p></div>` : ""}
  <div class="section">
    <h2>Vendor</h2>
    <table>
      <tr><th>Name</th><td>${escapeHtml(vendorName)}</td></tr>
      ${(vendor?.company_name as string) ? `<tr><th>Company</th><td>${escapeHtml(String(vendor.company_name))}</td></tr>` : ""}
      ${(vendor?.email as string) ? `<tr><th>Email</th><td>${escapeHtml(String(vendor.email))}</td></tr>` : ""}
      ${(vendor?.phone as string) ? `<tr><th>Phone</th><td>${escapeHtml(String(vendor.phone))}</td></tr>` : ""}
      ${(vendor?.address as string) ? `<tr><th>Address</th><td>${escapeHtml(String(vendor.address))}</td></tr>` : ""}
    </table>
  </div>
  ${(br.due_date as string) ? `<div class="meta">Due date: ${escapeHtml(String(br.due_date))}</div>` : ""}
</body>
</html>`;

    return { success: true, html };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to generate bid request PDF",
    };
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ============================================================================
// BUDGET ITEM HELPERS (for linking bids to budget)
// ============================================================================
// Budget item types moved to lib/bids-types.ts

/**
 * Get all budget items for a project.
 * Useful for linking bid_items to budget_items.
 */
export async function getBudgetItemsByProject(
  projectId: string
): Promise<BudgetItemListResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .eq("project_id", projectId.trim())
      .order("sort_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, budgetItems: (data || []) as BudgetItem[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get budget items",
    };
  }
}

/**
 * Get budget items for a specific phase within a project.
 * Use this to resolve budget_item_id when recording bid line items.
 */
export async function getBudgetItemsByPhase(
  projectId: string,
  phaseId: string
): Promise<BudgetItemListResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!phaseId?.trim()) {
      return { success: false, error: "Phase ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .eq("project_id", projectId.trim())
      .eq("phase_id", phaseId.trim())
      .order("sort_order", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, budgetItems: (data || []) as BudgetItem[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get budget items by phase",
    };
  }
}

/**
 * Find a single budget item by project and phase, optionally matching description.
 * Returns the first match if multiple exist.
 */
export async function findBudgetItem(
  projectId: string,
  phaseId: string,
  description?: string
): Promise<{ success: boolean; budgetItem?: BudgetItem; error?: string }> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }
    if (!phaseId?.trim()) {
      return { success: false, error: "Phase ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    let query = supabase
      .from("budget_items")
      .select("*")
      .eq("project_id", projectId.trim())
      .eq("phase_id", phaseId.trim());

    if (description?.trim()) {
      query = query.ilike("description", `%${description.trim()}%`);
    }

    const { data, error } = await query.limit(1).maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, budgetItem: data as BudgetItem | undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to find budget item",
    };
  }
}

// ============================================================================
// ACCEPT BID → BUDGET INTEGRATION
// ============================================================================
// PushBidItemsToBudgetResult moved to lib/bids-types.ts

/**
 * Push accepted bid's line items to budget_items.
 * For each bid_item with a budget_item_id, update the corresponding budget_item:
 * - actual_cost from bid_item.total_cost
 * - materials from bid_item.materials_cost (if provided)
 * - labor from bid_item.labor_cost (if provided)
 * - vendor from the bid's vendor name (if provided)
 */
export async function pushBidItemsToBudget(
  bidId: string,
  vendorName?: string | null
): Promise<PushBidItemsToBudgetResult> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    // 1. Fetch bid_items for this bid
    const { data: bidItems, error: fetchError } = await supabase
      .from("bid_items")
      .select("id, budget_item_id, materials_cost, labor_cost, total_cost")
      .eq("bid_id", bidId.trim());

    if (fetchError) {
      return { success: false, error: fetchError.message };
    }

    if (!bidItems || bidItems.length === 0) {
      // No items to push - that's fine
      return { success: true, updatedCount: 0, skippedCount: 0 };
    }

    // 2. Update each budget_item where budget_item_id is not null
    let updatedCount = 0;
    let skippedCount = 0;

    for (const item of bidItems) {
      const budgetItemId = item.budget_item_id;
      if (!budgetItemId) {
        skippedCount++;
        continue;
      }

      const updateData: Record<string, unknown> = {
        actual_cost: Number(item.total_cost) || 0,
        updated_at: new Date().toISOString(),
      };

      // Optionally update materials and labor breakdown
      if (item.materials_cost != null) {
        updateData.materials = Number(item.materials_cost);
      }
      if (item.labor_cost != null) {
        updateData.labor = Number(item.labor_cost);
      }

      // Optionally set vendor name
      if (vendorName?.trim()) {
        updateData.vendor = vendorName.trim();
      }

      const { error: updateError } = await supabase
        .from("budget_items")
        .update(updateData)
        .eq("id", budgetItemId);

      if (updateError) {
        // Log but don't fail the whole operation for one item
        console.error(`Failed to update budget_item ${budgetItemId}:`, updateError.message);
        skippedCount++;
      } else {
        updatedCount++;
      }
    }

    return { success: true, updatedCount, skippedCount };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to push bid items to budget",
    };
  }
}

/**
 * Get the accepted bid for a bid request.
 * Returns the bid with status = 'accepted' for the given request, if any.
 */
export async function getAcceptedBidForRequest(
  bidRequestId: string
): Promise<BidResult> {
  try {
    if (!bidRequestId?.trim()) {
      return { success: false, error: "Bid request ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("bid_request_id", bidRequestId.trim())
      .eq("status", "accepted")
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bid: data as Bid | undefined };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get accepted bid",
    };
  }
}

/**
 * Get all accepted bids for a project (across all bid requests).
 * Useful for showing "selected vendors" in project overview.
 */
export async function getAcceptedBidsByProject(
  projectId: string
): Promise<BidListResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bids")
      .select("*")
      .eq("project_id", projectId.trim())
      .eq("status", "accepted")
      .order("reviewed_at", { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bids: (data || []) as Bid[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get accepted bids",
    };
  }
}

/**
 * Get bid items for an accepted bid with their linked budget items.
 * Returns bid_items joined with budget_items for the "what was selected" view.
 */
export async function getBidItemsWithBudgetLinks(
  bidId: string
): Promise<{ success: boolean; items?: Array<BidItem & { budget_item?: BudgetItem }>; error?: string }> {
  try {
    if (!bidId?.trim()) {
      return { success: false, error: "Bid ID is required" };
    }

    const supabase = await createServerSupabaseClient();

    // Fetch bid_items with their linked budget_items
    const { data, error } = await supabase
      .from("bid_items")
      .select(`
        *,
        budget_item:budget_items(*)
      `)
      .eq("bid_id", bidId.trim())
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform the data
    const items = (data || []).map((row: any) => ({
      id: row.id,
      bid_id: row.bid_id,
      budget_item_id: row.budget_item_id,
      description: row.description,
      phase_id: row.phase_id,
      materials_cost: row.materials_cost,
      labor_cost: row.labor_cost,
      total_cost: row.total_cost,
      created_at: row.created_at,
      budget_item: row.budget_item as BudgetItem | undefined,
    }));

    return { success: true, items };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bid items with budget links",
    };
  }
}
