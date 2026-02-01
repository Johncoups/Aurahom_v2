"use server";

import {
  acceptBid,
  pushBidItemsToBudget,
  type Bid,
  type PushBidItemsToBudgetResult,
} from "@/lib/bids";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export interface AcceptBidParams {
  /** Required: ID of the bid to accept */
  bidId: string;
  /** Required: ID of the user accepting the bid (for audit trail) */
  userId: string;
  /** If true, push bid_items costs to budget_items (default: true) */
  updateBudget?: boolean;
}

export interface AcceptBidResult {
  success: boolean;
  bid?: Bid;
  budgetUpdate?: PushBidItemsToBudgetResult;
  error?: string;
}

/**
 * Accept a bid and optionally push costs to budget.
 * 
 * This server action:
 * 1. Validates the user can accept this bid (RLS + ownership check)
 * 2. Calls acceptBid() to:
 *    - Set bid status to 'accepted'
 *    - Reject other bids for same request
 *    - Set bid_request status to 'accepted'
 * 3. If updateBudget is true (default):
 *    - Fetches vendor name for the bid
 *    - Calls pushBidItemsToBudget() to update budget_items with actual costs
 * 
 * Auth: RLS enforces that only the project owner can accept bids.
 */
export async function acceptBidAction(
  params: AcceptBidParams
): Promise<AcceptBidResult> {
  const { bidId, userId, updateBudget = true } = params;

  if (!bidId?.trim()) {
    return { success: false, error: "Bid ID is required" };
  }
  if (!userId?.trim()) {
    return { success: false, error: "User ID is required" };
  }

  // 1. Get bid details for validation and vendor lookup
  const supabase = await createServerSupabaseClient();

  const { data: bidData, error: bidFetchError } = await supabase
    .from("bids")
    .select("id, bid_request_id, vendor_id, project_id, status")
    .eq("id", bidId.trim())
    .single();

  if (bidFetchError || !bidData) {
    return { success: false, error: "Bid not found or access denied" };
  }

  // Check if bid is already accepted
  if (bidData.status === "accepted") {
    // Return the already-accepted bid
    const { data: existingBid } = await supabase
      .from("bids")
      .select("*")
      .eq("id", bidId.trim())
      .single();
    return {
      success: true,
      bid: existingBid as Bid,
      budgetUpdate: { success: true, updatedCount: 0, skippedCount: 0 },
    };
  }

  // Check if bid is in a state that can be accepted
  if (bidData.status === "rejected" || bidData.status === "withdrawn" || bidData.status === "expired") {
    return {
      success: false,
      error: `Cannot accept a bid with status '${bidData.status}'`,
    };
  }

  // 2. Get vendor name for budget update
  let vendorName: string | null = null;
  if (updateBudget && bidData.vendor_id) {
    const { data: vendor } = await supabase
      .from("vendors")
      .select("name, company_name")
      .eq("id", bidData.vendor_id)
      .single();
    vendorName = vendor?.name || vendor?.company_name || null;
  }

  // 3. Accept the bid (updates statuses)
  const acceptResult = await acceptBid(bidId.trim(), userId.trim());

  if (!acceptResult.success) {
    return {
      success: false,
      error: acceptResult.error ?? "Failed to accept bid",
    };
  }

  // 4. Push bid items to budget (if enabled)
  let budgetUpdateResult: PushBidItemsToBudgetResult | undefined;
  if (updateBudget) {
    budgetUpdateResult = await pushBidItemsToBudget(bidId.trim(), vendorName);
    
    // Budget update is best-effort - don't fail the accept if it fails
    if (!budgetUpdateResult.success) {
      console.error("Budget update failed (non-fatal):", budgetUpdateResult.error);
    }
  }

  return {
    success: true,
    bid: acceptResult.bid,
    budgetUpdate: budgetUpdateResult,
  };
}

/**
 * Reject a bid with an optional reason.
 * This is a convenience wrapper around the rejectBid function.
 */
export async function rejectBidAction(
  bidId: string,
  userId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  if (!bidId?.trim()) {
    return { success: false, error: "Bid ID is required" };
  }
  if (!userId?.trim()) {
    return { success: false, error: "User ID is required" };
  }

  const { rejectBid } = await import("@/lib/bids");
  const result = await rejectBid(bidId.trim(), userId.trim(), reason);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  return { success: true };
}
