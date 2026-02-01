"use server";

import {
  createVendor,
  addVendorToProject,
  createBidRequest,
  updateVendor,
  removeVendorFromProject,
  deleteBidRequest,
  ensureProjectVendor,
  findExistingBidRequest,
  type CreateVendorInput,
  type UpdateVendorInput,
} from "@/lib/bids";

/**
 * Add a vendor to a phase (creates vendor, links to project, creates bid_request with not_requested).
 * Used when user clicks "Add New Vendor" in the Request Bids modal.
 */
export async function addVendorToPhase(params: {
  projectId: string;
  userId: string;
  phaseId: string;
  scopeTitle: string;
  vendor: CreateVendorInput;
}): Promise<{ success: boolean; vendorId?: string; bidRequestId?: string; error?: string }> {
  const { projectId, userId, phaseId, scopeTitle, vendor } = params;
  if (!projectId?.trim() || !userId?.trim() || !phaseId?.trim()) {
    return { success: false, error: "Project ID, User ID, and Phase ID are required" };
  }
  if (!vendor.name?.trim()) {
    return { success: false, error: "Vendor name is required" };
  }

  // 1. Create or find vendor
  const createResult = await createVendor(vendor, userId);
  if (!createResult.success || !createResult.vendor?.id) {
    return { success: false, error: createResult.error ?? "Failed to create vendor" };
  }
  const vendorId = createResult.vendor.id;

  // 2. Ensure vendor is on project
  const ensureResult = await addVendorToProject(projectId, vendorId, userId);
  if (!ensureResult.success) {
    return { success: false, error: ensureResult.error ?? "Failed to add vendor to project", vendorId };
  }

  // 3. Check idempotency - don't create duplicate bid request
  const existing = await findExistingBidRequest({
    projectId,
    vendorId,
    phaseIds: [phaseId],
    statuses: ["not_requested", "pending", "bid_received", "accepted"],
  });
  if (existing.success && existing.bidRequest?.id) {
    return { success: true, vendorId, bidRequestId: existing.bidRequest.id };
  }

  // 4. Create bid request with status not_requested
  const brResult = await createBidRequest(
    {
      project_id: projectId,
      vendor_id: vendorId,
      phase_ids: [phaseId],
      request_method: "manual",
      scope_title: scopeTitle,
      status: "not_requested",
    },
    userId
  );
  if (!brResult.success) {
    return { success: false, error: brResult.error ?? "Failed to create bid request", vendorId };
  }

  return {
    success: true,
    vendorId,
    bidRequestId: brResult.bidRequest?.id,
  };
}

/**
 * Update vendor details (name, email, phone, etc.)
 */
export async function updateVendorAction(
  vendorId: string,
  data: UpdateVendorInput
): Promise<{ success: boolean; error?: string }> {
  const result = await updateVendor(vendorId, data);
  return { success: result.success, error: result.error };
}

/**
 * Remove vendor from phase: delete the bid_request and optionally remove from project.
 * If vendor has other bid_requests for this project, we only delete this one bid_request.
 * If no other bid_requests, we remove from project_vendors.
 */
export async function removeVendorFromPhase(params: {
  projectId: string;
  vendorId: string;
  bidRequestId: string;
  /** If true, also remove from project_vendors (default: false - we only delete bid_request) */
  removeFromProject?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const { projectId, vendorId, bidRequestId, removeFromProject = false } = params;
  if (!bidRequestId?.trim()) {
    return { success: false, error: "Bid request ID is required" };
  }

  const delResult = await deleteBidRequest(bidRequestId);
  if (!delResult.success) {
    return { success: false, error: delResult.error };
  }

  if (removeFromProject && projectId?.trim() && vendorId?.trim()) {
    const removeResult = await removeVendorFromProject(projectId, vendorId);
    if (!removeResult.success) {
      return { success: false, error: removeResult.error };
    }
  }

  return { success: true };
}
