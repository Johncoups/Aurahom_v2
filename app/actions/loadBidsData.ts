"use server";

import {
  getVendorsByProject,
  getBidRequestsByProject,
  getBidsByRequest,
  getAcceptedBidForRequest,
  getBidItemsWithBudgetLinks,
  type VendorWithProjectData,
  type BidRequest,
  type Bid,
} from "@/lib/bids";

export interface LoadBidsDataResult {
  success: boolean;
  vendors?: VendorWithProjectData[];
  bidRequests?: BidRequest[];
  /** Map of bid_request_id -> bids for that request */
  bidsByRequest?: Record<string, Bid[]>;
  /** Map of bid_request_id -> accepted bid (if any) */
  acceptedBidByRequest?: Record<string, Bid | undefined>;
  /** Map of bid_id -> bid items with budget links (for accepted bids) */
  bidItemsByBid?: Record<string, Array<{ id: string; description?: string; total_cost?: number; budget_item?: unknown }>>;
  error?: string;
}

/**
 * Load all bids data for a project (vendors, bid requests, bids, accepted bids, bid items).
 * Used by Bids Context on mount when projectId is available.
 */
export async function loadBidsData(
  projectId: string
): Promise<LoadBidsDataResult> {
  try {
    if (!projectId?.trim()) {
      return { success: false, error: "Project ID is required" };
    }

    const [vendorsResult, bidRequestsResult] = await Promise.all([
      getVendorsByProject(projectId),
      getBidRequestsByProject(projectId),
    ]);

    if (!vendorsResult.success) {
      return { success: false, error: vendorsResult.error ?? "Failed to load vendors" };
    }
    if (!bidRequestsResult.success) {
      return { success: false, error: bidRequestsResult.error ?? "Failed to load bid requests" };
    }

    const vendors = vendorsResult.vendors ?? [];
    const bidRequests = bidRequestsResult.bidRequests ?? [];

    // Load bids for each bid request
    const bidsByRequest: Record<string, Bid[]> = {};
    const acceptedBidByRequest: Record<string, Bid | undefined> = {};
    const bidItemsByBid: Record<string, Awaited<ReturnType<typeof getBidItemsWithBudgetLinks>>["items"]> = {};

    const requestIds = bidRequests.map((r) => r.id);

    await Promise.all(
      requestIds.map(async (requestId) => {
        const [bidsResult, acceptedResult] = await Promise.all([
          getBidsByRequest(requestId),
          getAcceptedBidForRequest(requestId),
        ]);

        if (bidsResult.success && bidsResult.bids) {
          bidsByRequest[requestId] = bidsResult.bids;
        } else {
          bidsByRequest[requestId] = [];
        }

        if (acceptedResult.success && acceptedResult.bid) {
          acceptedBidByRequest[requestId] = acceptedResult.bid;
          // Load bid items with budget links for accepted bid
          const itemsResult = await getBidItemsWithBudgetLinks(acceptedResult.bid.id);
          if (itemsResult.success && itemsResult.items) {
            bidItemsByBid[acceptedResult.bid.id] = itemsResult.items;
          }
        } else {
          acceptedBidByRequest[requestId] = undefined;
        }
      })
    );

    return {
      success: true,
      vendors,
      bidRequests,
      bidsByRequest,
      acceptedBidByRequest,
      bidItemsByBid,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to load bids data",
    };
  }
}
