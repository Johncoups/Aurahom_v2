/**
 * Pure utility functions for bids feature (no I/O, no side effects)
 * These are synchronous helper functions that can be used client-side or server-side.
 */

import type { Bid, BidComparisonData } from "./bids-types";

/**
 * Calculate bid comparison statistics from an array of bids.
 * Use this when you already have bids in memory; use compareBids(bidRequestId) to fetch and compare.
 */
export function calculateBidComparison(bids: Bid[]): BidComparisonData {
  if (!bids?.length) {
    return {
      sorted: [],
      lowestBidId: null,
      highestBidId: null,
      averageAmount: 0,
      count: 0,
    };
  }
  const sorted = [...bids].sort(
    (a, b) => (a.total_amount ?? 0) - (b.total_amount ?? 0)
  );
  const amounts = sorted.map((b) => b.total_amount ?? 0).filter((n) => typeof n === "number");
  const sum = amounts.reduce((acc, n) => acc + n, 0);
  const averageAmount = amounts.length ? sum / amounts.length : 0;
  return {
    sorted,
    lowestBidId: sorted[0]?.id ?? null,
    highestBidId: sorted[sorted.length - 1]?.id ?? null,
    averageAmount,
    count: sorted.length,
  };
}

/** Default CSV columns for vendor import/export (name required, others optional) */
export const VENDOR_CSV_HEADERS = [
  "name",
  "company_name",
  "email",
  "phone",
  "website",
  "address",
  "city",
  "state",
  "zip_code",
  "rating_platform",
  "rating_score",
  "rating_reviews",
  "services_offered",
  "licensed",
  "insured",
  "license_number",
  "notes",
  "tags",
  "found_via",
  "preferred_contact_method",
];
