# Bids schema – changes made today (this conversation)

Reference: **Supabase_Structure/SupabaseSchema.csv** = your current Supabase design.

---

## What’s already in Supabase (from CSV)

You already have these tables/views in Supabase:

- **baseline_construction_phases** – id, version, phases (jsonb), is_active, created_at  
- **bid_items** – id, bid_id, budget_item_id, description, phase_id, materials_cost, labor_cost, total_cost, created_at  
- **bid_request_summary** (view) – id, project_id, user_id, status, request_method, requested_at, due_date, vendor_name, vendor_email, vendor_phone, rating_score, trade_category_name, phase_count, phase_ids, bid_count, lowest_bid_amount  
- **bid_requests** – id, project_id, user_id, vendor_id, trade_category_id, phase_ids, scope_title, scope_description, status, request_method, requested_at, due_date, reminder_sent_at, expires_at, message_sent, email_subject, follow_up_count, user_email_account, email_thread_id, created_at, updated_at  
- **bids** – id, bid_request_id, vendor_id, project_id, total_amount, materials_cost, labor_cost, phase_costs, timeline_days, timeline_description, start_date, completion_date, notes, warranty_info, payment_terms, exclusions, assumptions, attachments, status, reviewed_at, reviewed_by, rejection_reason, is_lowest_bid, is_highest_rated_vendor, comparison_rank, submitted_at, created_at, updated_at  
- **budget_items** – id, project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, due, sort_order, is_custom, created_at, updated_at  
- **email_communications** – (partial in CSV) id, bid_request_id, project_id, user_id, vendor_id, email_type, …

So **bid_requests**, **bids**, **bid_items**, **budget_items**, **email_communications**, and the **bid_request_summary** view are already in place. The CSV does **not** show: **trade_categories**, **vendors**, **user_vendors**, **project_vendors**, **user_email_accounts**, **vendor_reviews**, **email_templates**.

---

## What was added or changed today (in the repo)

These edits were made in **this conversation** (in `database-schema-bids.sql`, seed, and BIDS_FEATURE_TASKS). They are **not** in your SupabaseSchema.csv; they are in the local schema file and docs.

### 1. **database-schema-bids.sql**

**Vendors table (restructured)**  
- **Removed:** `user_id`, `trade_category_id` from `vendors`.  
- **Added:** `created_by_user_id` (who first entered the vendor; audit only, not project).  
- **Removed from vendors (moved to bridges):** notes, tags, found_via, preferred_contact_method, contact_hours, is_favorite, is_active.  
- **Approx. lines:** vendors table ~57–101, related indexes ~100–101.

**New table: user_vendors (TABLE 2b)**  
- **Added:** Bridge table `user_vendors` (user_id, vendor_id, trade_category_id, notes, tags, preferred_contact_method, contact_hours, found_via, is_favorite, is_active, created_at, updated_at), UNIQUE(user_id, vendor_id).  
- **Approx. lines:** 103–134.

**New table: project_vendors (TABLE 2c)**  
- **Added:** Bridge table `project_vendors` (project_id, vendor_id, trade_category_id, notes, tags, preferred_contact_method, found_via, is_favorite, is_active, added_by_user_id, created_at, updated_at), UNIQUE(project_id, vendor_id).  
- **Approx. lines:** 136–168.

**RLS**  
- **Changed:** Vendors policies to “authenticated can read/insert; update/delete only when created_by_user_id = auth.uid()”.  
- **Added:** RLS for `user_vendors` (users only their own rows).  
- **Added:** RLS for `project_vendors` (users only for their projects).  
- **Approx. lines:** 507–508 (ALTER RLS), 524–582 (policies).

**Triggers**  
- **Added:** `update_user_vendors_updated_at`, `update_project_vendors_updated_at`.  
- **Approx. lines:** 730–733.

**View: vendor_performance_summary**  
- **Changed:** Now based on `user_vendors` + `vendors` (and joins to bids/vendor_reviews) instead of `vendors` alone.  
- **Approx. lines:** ~791–812.

**Comments**  
- **Added:** COMMENT for `user_vendors` and `project_vendors`.  
- **Approx. lines:** 811–812.

### 2. **seed-bids-test-data.sql**

- **Rewritten** for new structure:  
  - Insert into **vendors** (no user_id; optional created_by_user_id).  
  - Insert into **user_vendors** (user_id, vendor_id, trade_category_id, found_via, is_active).  
  - **New section 2b:** Insert into **project_vendors** (project_id, vendor_id, trade_category_id, found_via, is_active, added_by_user_id).  
  - Insert into **bid_requests** and **bids** unchanged in shape; vendor_id still from `vendors`.  
- **Verify steps** at end updated to mention project_vendors.

### 3. **BIDS_FEATURE_TASKS.md**

- Phase 1 “Supabase Tables” updated to describe:  
  - `vendors` (shared, no user_id; created_by_user_id).  
  - `user_vendors` (user ↔ vendor).  
  - `project_vendors` (project ↔ vendor; note that created_by_user_id on vendors is audit, not project).  
- Phase 1 “Database Indexes” updated for vendors and user_vendors (no vendors.user_id).  
- Phase 1 “Row Level Security” updated for vendors, user_vendors, project_vendors.  
- “App impact” paragraph updated: vendors on project = project_vendors; who entered = vendors.created_by_user_id; which project = project_vendors.

### 4. **SUPABASE_SCHEMA.md**

- **Created** as a blank .md for you to paste the current Supabase table & column list (no schema logic changed).

---

## Summary

- **Already in Supabase (from CSV):** baseline_construction_phases, bid_items, bid_request_summary, bid_requests, bids, budget_items, email_communications.  
- **Added/changed in the repo today:**  
  - **Vendors** made independent (no user_id; created_by_user_id for “who entered”).  
  - **user_vendors** and **project_vendors** added as bridges.  
  - RLS, triggers, vendor_performance_summary, seed, and BIDS_FEATURE_TASKS updated to match.  

If you want, next step can be a **migration script** that adds only `user_vendors` and `project_vendors` and (if you have an existing `vendors` with `user_id`) migrates that into the new structure without touching your existing bid_requests/bids/bid_items.
