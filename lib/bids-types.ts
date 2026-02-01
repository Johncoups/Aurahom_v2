/**
 * TypeScript type definitions for the bids feature
 * Shared types used across bids.ts, bids-utils.ts, and components
 */

// ============================================================================
// VENDOR TYPES
// ============================================================================

/**
 * Trade category (e.g., Plumbing, Electrical, Foundation & Concrete)
 */
export interface TradeCategory {
  id: string;
  name: string;
  display_order: number;
  icon?: string | null;
  description?: string | null;
  applies_to_methods?: string[] | null;
  is_multi_phase?: boolean;
  typical_phases?: string[] | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Vendor - Company-level vendor information (shared directory)
 */
export interface Vendor {
  id: string;
  created_by_user_id: string | null;
  
  // Basic Information
  name: string;
  company_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  
  // Ratings & Reviews
  rating_platform?: string | null;
  rating_score?: number | null;
  rating_reviews?: number | null;
  
  // Social Media
  social_media?: Array<{ platform: string; handle: string }> | null;
  
  // Capabilities
  services_offered?: string[] | null;
  specialties?: string[] | null;
  service_area?: string[] | null;
  licensed?: boolean;
  insured?: boolean;
  license_number?: string | null;
  insurance_info?: string | null;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
}

/**
 * UserVendor - User-specific vendor data (bridge table)
 */
export interface UserVendor {
  id: string;
  user_id: string;
  vendor_id: string;
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  contact_hours?: string | null;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * ProjectVendor - Project-specific vendor data (bridge table)
 */
export interface ProjectVendor {
  id: string;
  project_id: string;
  vendor_id: string;
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
  added_by_user_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Vendor with user-specific data (joined from vendors + user_vendors)
 */
export interface VendorWithUserData extends Vendor {
  user_vendor?: UserVendor | null;
}

/**
 * Vendor with project-specific data (joined from vendors + project_vendors)
 */
export interface VendorWithProjectData extends Vendor {
  project_vendor?: ProjectVendor | null;
}

/**
 * Input type for creating a vendor
 */
export interface CreateVendorInput {
  name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  rating_platform?: string;
  rating_score?: number;
  rating_reviews?: number;
  social_media?: Array<{ platform: string; handle: string }>;
  services_offered?: string[];
  specialties?: string[];
  service_area?: string[];
  licensed?: boolean;
  insured?: boolean;
  license_number?: string;
  insurance_info?: string;
}

/**
 * Input type for updating a vendor
 */
export interface UpdateVendorInput extends Partial<CreateVendorInput> {
  // All fields optional for updates
}

/**
 * Search filters for vendors
 */
export interface VendorSearchFilters {
  trade_category_id?: string;
  services_offered?: string[];
  licensed?: boolean;
  insured?: boolean;
  rating_min?: number;
  city?: string;
  state?: string;
  service_area?: string[];
}

/**
 * Input for adding a vendor to user's directory (user_vendors)
 */
export interface AddVendorToUserInput {
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  contact_hours?: string | null;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
}

/**
 * Input for adding a vendor to a project (project_vendors)
 */
export interface AddVendorToProjectInput {
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
}

/**
 * Input for updating a user–vendor link (user_vendors)
 */
export interface UpdateUserVendorInput {
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  contact_hours?: string | null;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
}

/**
 * Input for updating a project–vendor link (project_vendors)
 */
export interface UpdateProjectVendorInput {
  trade_category_id?: string | null;
  notes?: string | null;
  tags?: string[] | null;
  preferred_contact_method?: string;
  found_via?: string[] | null;
  is_favorite?: boolean;
  is_active?: boolean;
}

/**
 * Result types for CRUD operations
 */
export interface VendorResult {
  success: boolean;
  vendor?: Vendor;
  error?: string;
}

export interface VendorListResult {
  success: boolean;
  vendors?: Vendor[];
  error?: string;
}

export interface VendorWithUserDataResult {
  success: boolean;
  vendors?: VendorWithUserData[];
  error?: string;
}

export interface VendorWithProjectDataResult {
  success: boolean;
  vendors?: VendorWithProjectData[];
  error?: string;
}

// ============================================================================
// BID REQUEST TYPES
// ============================================================================

/** Bid request status values (matches DB constraint) */
export type BidRequestStatus =
  | "not_requested"
  | "pending"
  | "bid_received"
  | "accepted"
  | "rejected"
  | "expired";

/** Request method: how the bid request was sent */
export type RequestMethod = "manual" | "aurahom" | "user_email";

/**
 * BidRequest - Row from bid_requests table
 */
export interface BidRequest {
  id: string;
  project_id: string;
  user_id: string;
  vendor_id: string;
  trade_category_id?: string | null;

  phase_ids: string[];
  scope_title?: string | null;
  scope_description?: string | null;

  status: BidRequestStatus;
  request_method: RequestMethod;

  requested_at?: string | null;
  due_date?: string | null;
  reminder_sent_at?: string | null;
  expires_at?: string | null;

  message_sent?: string | null;
  email_subject?: string | null;
  follow_up_count?: number;
  user_email_account?: string | null;
  email_thread_id?: string | null;

  created_at?: string;
  updated_at?: string;
}

/**
 * Input for creating a bid request (required fields + optional)
 */
export interface CreateBidRequestInput {
  project_id: string;
  vendor_id: string;
  phase_ids: string[];
  request_method: RequestMethod;
  trade_category_id?: string | null;
  scope_title?: string | null;
  scope_description?: string | null;
  status?: BidRequestStatus;
  due_date?: string | null;
  expires_at?: string | null;
  message_sent?: string | null;
  email_subject?: string | null;
  requested_at?: string | null;
}

export interface BidRequestResult {
  success: boolean;
  bidRequest?: BidRequest;
  error?: string;
}

export interface BidRequestListResult {
  success: boolean;
  bidRequests?: BidRequest[];
  error?: string;
}

/**
 * Options for finding existing bid requests (idempotency check)
 */
export interface FindExistingBidRequestOptions {
  projectId: string;
  vendorId: string;
  /** Phase IDs to match. If provided, checks for overlap with existing request's phase_ids. */
  phaseIds?: string[];
  /** Scope title to match (optional). If provided, exact match. */
  scopeTitle?: string;
  /** Statuses to consider as "existing" (default: sendable states). */
  statuses?: BidRequestStatus[];
}

// ============================================================================
// BID (SUBMISSION) TYPES
// ============================================================================

/** Bid status values (matches DB) */
export type BidStatus =
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected"
  | "expired"
  | "withdrawn";

/**
 * Bid - Row from bids table (vendor's submitted bid for a request)
 */
export interface Bid {
  id: string;
  bid_request_id: string;
  vendor_id: string;
  project_id: string;

  total_amount: number;
  materials_cost?: number;
  labor_cost?: number;
  phase_costs?: Record<string, number>;

  timeline_days?: number | null;
  timeline_description?: string | null;
  start_date?: string | null;
  completion_date?: string | null;

  notes?: string | null;
  warranty_info?: string | null;
  payment_terms?: string | null;
  exclusions?: string | null;
  assumptions?: string | null;
  attachments?: Array<{ name: string; url: string; type?: string; size?: number }> | null;

  status: BidStatus;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  rejection_reason?: string | null;

  is_lowest_bid?: boolean;
  is_highest_rated_vendor?: boolean;
  comparison_rank?: number | null;

  submitted_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

/**
 * BidItem - Line item linking a bid to a budget item (bid_items table)
 */
export interface BidItem {
  id: string;
  bid_id: string;
  budget_item_id?: string | null;
  description: string;
  phase_id: string;
  materials_cost?: number;
  labor_cost?: number;
  total_cost: number;
  created_at?: string | null;
}

/**
 * Input for submitting a new bid (required: bid_request_id, vendor_id, project_id, total_amount)
 */
export interface CreateBidInput {
  bid_request_id: string;
  vendor_id: string;
  project_id: string;
  total_amount: number;
  materials_cost?: number;
  labor_cost?: number;
  phase_costs?: Record<string, number>;
  timeline_days?: number | null;
  timeline_description?: string | null;
  start_date?: string | null;
  completion_date?: string | null;
  notes?: string | null;
  warranty_info?: string | null;
  payment_terms?: string | null;
  exclusions?: string | null;
  assumptions?: string | null;
  attachments?: Array<{ name: string; url: string; type?: string; size?: number }> | null;
  status?: BidStatus;
}

/**
 * Input for creating bid line items (bid_items) linked to budget items
 */
export interface CreateBidItemInput {
  budget_item_id?: string | null;
  description: string;
  phase_id: string;
  materials_cost?: number;
  labor_cost?: number;
  total_cost: number;
}

/**
 * Input for updating a bid (all fields optional)
 */
export interface UpdateBidInput {
  total_amount?: number;
  materials_cost?: number;
  labor_cost?: number;
  phase_costs?: Record<string, number>;
  timeline_days?: number | null;
  timeline_description?: string | null;
  start_date?: string | null;
  completion_date?: string | null;
  notes?: string | null;
  warranty_info?: string | null;
  payment_terms?: string | null;
  exclusions?: string | null;
  assumptions?: string | null;
  attachments?: Array<{ name: string; url: string; type?: string; size?: number }> | null;
  status?: BidStatus;
  rejection_reason?: string | null;
}

export interface BidResult {
  success: boolean;
  bid?: Bid;
  error?: string;
}

export interface BidListResult {
  success: boolean;
  bids?: Bid[];
  error?: string;
}

export interface BidItemResult {
  success: boolean;
  bidItems?: BidItem[];
  error?: string;
}

/** Comparison result for bids on a single request */
export interface BidComparisonResult {
  success: boolean;
  bidRequestId?: string;
  bids?: Bid[];
  lowestBidId?: string | null;
  error?: string;
}

/** Result of calculateBidComparison(bids[]) – pure comparison data */
export interface BidComparisonData {
  sorted: Bid[];
  lowestBidId: string | null;
  highestBidId: string | null;
  averageAmount: number;
  count: number;
}

/** Result of importVendorsFromCSV */
export interface ImportVendorsResult {
  success: boolean;
  imported?: number;
  skipped?: number;
  errors?: Array<{ row: number; message: string }>;
  error?: string;
}

/** Result of exportVendorsToCSV */
export interface ExportVendorsResult {
  success: boolean;
  csv?: string;
  error?: string;
}

/** Result of generateBidRequestPDF */
export interface GenerateBidRequestPDFResult {
  success: boolean;
  html?: string;
  error?: string;
}

// ============================================================================
// BUDGET ITEM TYPES
// ============================================================================

/**
 * BudgetItem - Simplified representation of a budget_items row
 */
export interface BudgetItem {
  id: string;
  project_id: string;
  phase_id: string;
  description: string;
  materials?: number;
  labor?: number;
  vendor?: string | null;
  estimated_cost?: number;
  actual_cost?: number;
  current_paid?: number;
  due?: number;
  sort_order?: number;
  is_custom?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BudgetItemListResult {
  success: boolean;
  budgetItems?: BudgetItem[];
  error?: string;
}

// ============================================================================
// ACCEPT BID → BUDGET INTEGRATION
// ============================================================================

/**
 * Result of pushing bid items to budget
 */
export interface PushBidItemsToBudgetResult {
  success: boolean;
  updatedCount?: number;
  skippedCount?: number;
  error?: string;
}
