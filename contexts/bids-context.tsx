"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { loadBidsData } from "@/app/actions/loadBidsData";
import type {
  VendorWithProjectData,
  BidRequest,
  Bid,
} from "@/lib/bids-types";

export type SelectedVendor = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contactName?: string;
};

export type BidItemWithBudget = { id: string; description?: string; total_cost?: number; budget_item?: unknown };

export type VendorWithBidStatus = VendorWithProjectData & {
  /** bid_request_id for this vendor+phase (if any) */
  bidRequestId?: string;
  /** UI status derived from bid_request status */
  status: "Not Requested" | "Pending" | "Bid Received" | "Bid Accepted";
  /** accepted bid id (if status is Bid Accepted) */
  acceptedBidId?: string;
};

type BidsContextType = {
  selectedVendor: SelectedVendor | null;
  setSelectedVendor: (vendor: SelectedVendor | null) => void;
  // Data
  vendors: VendorWithProjectData[];
  bidRequests: BidRequest[];
  bidsByRequest: Record<string, Bid[]>;
  acceptedBidByRequest: Record<string, Bid | undefined>;
  bidItemsByBid: Record<string, Array<{ id: string; description?: string; total_cost?: number; budget_item?: unknown }>>;
  // Loading & error
  isLoading: boolean;
  error: string | null;
  // Actions
  loadProjectData: (projectId: string) => Promise<void>;
  refresh: () => Promise<void>;
  // Helpers - get vendors per phase with bid status
  getVendorsForPhase: (
    phaseId: string,
    projectId: string
  ) => VendorWithBidStatus[];
};

const BidsContext = createContext<BidsContextType | undefined>(undefined);

export function BidsProvider({ children }: { children: ReactNode }) {
  const [selectedVendor, setSelectedVendor] = useState<SelectedVendor | null>(
    null
  );
  const [vendors, setVendors] = useState<VendorWithProjectData[]>([]);
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [bidsByRequest, setBidsByRequest] = useState<
    Record<string, Bid[]>
  >({});
  const [acceptedBidByRequest, setAcceptedBidByRequest] = useState<
    Record<string, Bid | undefined>
  >({});
  const [bidItemsByBid, setBidItemsByBid] = useState<
    Record<string, BidItemWithBudget[]>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastProjectId, setLastProjectId] = useState<string | null>(null);

  const loadProjectData = useCallback(async (projectId: string) => {
    if (!projectId?.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await loadBidsData(projectId);
      if (result.success) {
        setVendors(result.vendors ?? []);
        setBidRequests(result.bidRequests ?? []);
        setBidsByRequest(result.bidsByRequest ?? {});
        setAcceptedBidByRequest(result.acceptedBidByRequest ?? {});
        setBidItemsByBid(result.bidItemsByBid ?? {});
        setLastProjectId(projectId);
      } else {
        setError(result.error ?? "Failed to load bids data");
        setVendors([]);
        setBidRequests([]);
        setBidsByRequest({});
        setAcceptedBidByRequest({});
        setBidItemsByBid({});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
      setVendors([]);
      setBidRequests([]);
      setBidsByRequest({});
      setAcceptedBidByRequest({});
      setBidItemsByBid({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (lastProjectId) {
      await loadProjectData(lastProjectId);
    }
  }, [lastProjectId, loadProjectData]);

  /** Map bid_request status to UI status */
  const mapStatus = (status: string): VendorWithBidStatus["status"] => {
    switch (status) {
      case "not_requested":
        return "Not Requested";
      case "pending":
        return "Pending";
      case "bid_received":
        return "Bid Received";
      case "accepted":
        return "Bid Accepted";
      case "rejected":
      case "expired":
        return "Bid Received"; // Show as received if they had bids before
      default:
        return "Not Requested";
    }
  };

  /** Get vendors for a phase with their bid status from bid_requests */
  const getVendorsForPhase = useCallback(
    (phaseId: string, projectId: string): VendorWithBidStatus[] => {
      // Find bid_requests that include this phase
      const phaseRequests = bidRequests.filter(
        (r) =>
          r.project_id === projectId &&
          Array.isArray(r.phase_ids) &&
          r.phase_ids.includes(phaseId)
      );

      const vendorMap = new Map<string, VendorWithBidStatus>();

      for (const req of phaseRequests) {
        const vendor = vendors.find((v) => v.id === req.vendor_id);
        if (!vendor) continue;

        const acceptedBid = acceptedBidByRequest[req.id];
        const status = mapStatus(req.status);

        // If we already have this vendor (e.g. multiple requests), prefer the one with accepted bid or higher status
        const existing = vendorMap.get(vendor.id);
        const isBetter =
          !existing ||
          status === "Bid Accepted" ||
          (status === "Bid Received" &&
            existing.status !== "Bid Accepted" &&
            existing.status !== "Bid Received") ||
          (status === "Pending" &&
            existing.status === "Not Requested");

        if (!existing || isBetter) {
          vendorMap.set(vendor.id, {
            ...vendor,
            bidRequestId: req.id,
            status,
            acceptedBidId: acceptedBid?.id,
          });
        }
      }

      return Array.from(vendorMap.values());
    },
    [vendors, bidRequests, acceptedBidByRequest]
  );

  return (
    <BidsContext.Provider
      value={{
        selectedVendor,
        setSelectedVendor,
        vendors,
        bidRequests,
        bidsByRequest,
        acceptedBidByRequest,
        bidItemsByBid,
        isLoading,
        error,
        loadProjectData,
        refresh,
        getVendorsForPhase,
      }}
    >
      {children}
    </BidsContext.Provider>
  );
}

export function useBids() {
  const ctx = useContext(BidsContext);
  if (!ctx) throw new Error("useBids must be used within a BidsProvider");
  return ctx;
}
