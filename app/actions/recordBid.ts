"use server";

import {
  submitBid,
  addBidItems,
  findBudgetItem,
  type CreateBidInput,
  type CreateBidItemInput,
  type Bid,
  type BidItem,
} from "@/lib/bids";

/**
 * Input for a bid line item, with optional auto-resolve of budget_item_id.
 * If budget_item_id is not provided but phase_id is, we can attempt to resolve it.
 */
export interface RecordBidItemInput {
  /** Optional: explicit link to budget_items.id */
  budget_item_id?: string | null;
  /** Required: description of the line item */
  description: string;
  /** Required: phase this line item belongs to */
  phase_id: string;
  /** Optional: materials cost */
  materials_cost?: number;
  /** Optional: labor cost */
  labor_cost?: number;
  /** Required: total cost for this line item */
  total_cost: number;
  /** If true and budget_item_id not provided, attempt to auto-resolve from phase_id */
  autoResolveBudgetItem?: boolean;
}

export interface RecordBidParams {
  /** Required: ID of the bid request this bid responds to */
  bid_request_id: string;
  /** Required: ID of the vendor submitting the bid */
  vendor_id: string;
  /** Required: ID of the project */
  project_id: string;
  /** Required: total bid amount */
  total_amount: number;
  /** Optional: materials cost breakdown */
  materials_cost?: number;
  /** Optional: labor cost breakdown */
  labor_cost?: number;
  /** Optional: cost breakdown by phase (phase_id -> amount) */
  phase_costs?: Record<string, number>;
  /** Optional: estimated days to complete */
  timeline_days?: number | null;
  /** Optional: timeline description */
  timeline_description?: string | null;
  /** Optional: proposed start date */
  start_date?: string | null;
  /** Optional: proposed completion date */
  completion_date?: string | null;
  /** Optional: vendor notes */
  notes?: string | null;
  /** Optional: warranty information */
  warranty_info?: string | null;
  /** Optional: payment terms */
  payment_terms?: string | null;
  /** Optional: exclusions from bid */
  exclusions?: string | null;
  /** Optional: assumptions made */
  assumptions?: string | null;
  /** Optional: attached files */
  attachments?: Array<{ name: string; url: string; type?: string; size?: number }> | null;
  /** Optional: line items with budget linking */
  items?: RecordBidItemInput[];
}

export interface RecordBidResult {
  success: boolean;
  bid?: Bid;
  bidItems?: BidItem[];
  error?: string;
  /** If some items failed to auto-resolve budget_item_id, they're listed here */
  unresolvedItems?: Array<{ description: string; phase_id: string }>;
}

/**
 * Record a bid submission with optional line items.
 * 
 * This server action:
 * 1. Creates the bid record via submitBid()
 * 2. If items are provided, creates bid_items via addBidItems()
 * 3. Optionally auto-resolves budget_item_id from phase_id
 * 4. Sets bid_request status to 'bid_received' (handled by submitBid)
 * 5. Sends notification to project owner (handled by submitBid)
 * 
 * Auth model: Currently GC-entered (the general contractor records bids they receive).
 * RLS enforces that only the project owner can create bids for their projects.
 */
export async function recordBid(
  params: RecordBidParams
): Promise<RecordBidResult> {
  const {
    bid_request_id,
    vendor_id,
    project_id,
    total_amount,
    materials_cost,
    labor_cost,
    phase_costs,
    timeline_days,
    timeline_description,
    start_date,
    completion_date,
    notes,
    warranty_info,
    payment_terms,
    exclusions,
    assumptions,
    attachments,
    items,
  } = params;

  // 1. Create the bid record
  const bidInput: CreateBidInput = {
    bid_request_id,
    vendor_id,
    project_id,
    total_amount,
    materials_cost,
    labor_cost,
    phase_costs,
    timeline_days,
    timeline_description,
    start_date,
    completion_date,
    notes,
    warranty_info,
    payment_terms,
    exclusions,
    assumptions,
    attachments,
  };

  const bidResult = await submitBid(bidInput);

  if (!bidResult.success || !bidResult.bid) {
    return {
      success: false,
      error: bidResult.error ?? "Failed to create bid",
    };
  }

  const bid = bidResult.bid;

  // 2. If no items, we're done
  if (!items || items.length === 0) {
    return { success: true, bid };
  }

  // 3. Process items - optionally auto-resolve budget_item_id
  const unresolvedItems: Array<{ description: string; phase_id: string }> = [];
  const processedItems: CreateBidItemInput[] = [];

  for (const item of items) {
    let resolvedBudgetItemId = item.budget_item_id?.trim() || null;

    // Auto-resolve budget_item_id if requested and not provided
    if (!resolvedBudgetItemId && item.autoResolveBudgetItem && item.phase_id) {
      const findResult = await findBudgetItem(
        project_id,
        item.phase_id,
        item.description
      );
      if (findResult.success && findResult.budgetItem?.id) {
        resolvedBudgetItemId = findResult.budgetItem.id;
      } else {
        // Track unresolved items but still create the bid_item without budget link
        unresolvedItems.push({
          description: item.description,
          phase_id: item.phase_id,
        });
      }
    }

    processedItems.push({
      budget_item_id: resolvedBudgetItemId,
      description: item.description,
      phase_id: item.phase_id,
      materials_cost: item.materials_cost,
      labor_cost: item.labor_cost,
      total_cost: item.total_cost,
    });
  }

  // 4. Create bid items
  const itemsResult = await addBidItems(bid.id, processedItems);

  if (!itemsResult.success) {
    // Bid was created but items failed - return partial success
    return {
      success: true,
      bid,
      error: `Bid created but failed to add items: ${itemsResult.error}`,
      unresolvedItems: unresolvedItems.length > 0 ? unresolvedItems : undefined,
    };
  }

  return {
    success: true,
    bid,
    bidItems: itemsResult.bidItems,
    unresolvedItems: unresolvedItems.length > 0 ? unresolvedItems : undefined,
  };
}

/**
 * Get bid items for a specific bid (useful for viewing/editing).
 */
export async function getBidItems(
  bidId: string
): Promise<{ success: boolean; bidItems?: BidItem[]; error?: string }> {
  if (!bidId?.trim()) {
    return { success: false, error: "Bid ID is required" };
  }

  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase-server");
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from("bid_items")
      .select("*")
      .eq("bid_id", bidId.trim())
      .order("created_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, bidItems: (data || []) as BidItem[] };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to get bid items",
    };
  }
}
