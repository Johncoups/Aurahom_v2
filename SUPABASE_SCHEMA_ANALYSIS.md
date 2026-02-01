# Supabase schema re-analysis (from updated SupabaseSchema.csv)

**Source:** `Supabase_Structure/SupabaseSchema.csv` (updated export from your Supabase project).  
**Last re-analyzed:** 2025-01-30.

---

## 1. Tables and views currently in Supabase (from CSV)

**Total:** 20 objects — 18 tables, 2 views (`bid_request_summary`, `vendor_performance_summary`).

| Table / view | Type | Purpose (from columns) |
|--------------|------|------------------------|
| **baseline_construction_phases** | table | id, version, phases (jsonb), is_active, created_at |
| **bid_items** | table | Links bids to budget/phase; bid_id, budget_item_id, description, phase_id, materials_cost, labor_cost, total_cost, created_at |
| **bid_request_summary** | view | Summary of bid_requests + vendor/trade info (id, project_id, user_id, status, request_method, requested_at, due_date, vendor_name, vendor_email, vendor_phone, rating_score, trade_category_name, phase_count, phase_ids, bid_count, lowest_bid_amount) |
| **bid_requests** | table | project_id, user_id, vendor_id, trade_category_id, phase_ids, scope_title, scope_description, status, request_method, requested_at, due_date, reminder_sent_at, expires_at, message_sent, email_subject, follow_up_count, user_email_account, email_thread_id, created_at, updated_at |
| **bids** | table | bid_request_id, vendor_id, project_id, total_amount, materials_cost, labor_cost, phase_costs, timeline_days, timeline_description, start_date, completion_date, notes, warranty_info, payment_terms, exclusions, assumptions, attachments, status, reviewed_at, reviewed_by, rejection_reason, is_lowest_bid, is_highest_rated_vendor, comparison_rank, submitted_at, created_at, updated_at |
| **budget_items** | table | project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, due, sort_order, is_custom, created_at, updated_at |
| **email_communications** | table | bid_request_id, project_id, user_id, vendor_id, email_type, from_email, to_email, cc_emails, bcc_emails, subject, body_text, body_html, send_method, oauth_*, message_id, thread_id, status, sent_at, delivered_at, opened_at, clicked_at, bounced_at, failed_at, error_message, open_count, click_count, reply_received, reply_at, reply_body, attachments, created_at, updated_at |
| **email_templates** | table | user_id, trade_category_id, name, subject, body_text, body_html, is_default, is_system, created_at, updated_at |
| **project_profiles** | table | user_id, project_id, role, experience, subcontractor_help, construction_method, weekly_hourly_commitment, current_phase_id, diy_phase_ids, created_at, updated_at |
| **projects** | table | user_id, name, city_state, property_address, house_size, foundation_type, number_of_stories, target_start_date, background, created_at, updated_at |
| **roadmap_data** | table | user_id, project_id, raw_api_response, needs_timeline_resubmission, resubmission_reason, created_at, updated_at, friendly_name |
| **roadmap_generations** | table | roadmap_id, generation_type, raw_api_response, parsed_data, metadata, created_at, updated_at |
| **roadmap_phases** | table | roadmap_id, phase_id, title, detail_level, ai_generated_content, created_at, updated_at |
| **roadmaps** | table | user_id, project_id, status, needs_timeline_resubmission, timeline_resubmission_reason, created_at, updated_at |
| **trade_categories** | table | name, display_order, icon, description, applies_to_methods, is_multi_phase, typical_phases, created_at, updated_at |
| **user_email_accounts** | table | user_id, provider, email_address, display_name, access_token_encrypted, refresh_token_encrypted, token_expires_at, granted_scopes, is_primary, auto_sync, signature, is_active, last_synced_at, sync_error, created_at, updated_at |
| **users** | table | id, email, first_name, last_name, phone, is_active, created_at, updated_at (public.users – app profile, not auth.users) |
| **vendor_performance_summary** | view | id, user_id, name, trade_category_id, total_requests_sent, total_bids_received, bids_accepted, avg_bid_amount, review_count, avg_overall_rating, avg_quality_rating, avg_timeline_rating, recommend_count |
| **vendor_reviews** | table | vendor_id, project_id, user_id, bid_id, overall_rating, quality_rating, timeline_rating, communication_rating, price_rating, professionalism_rating, review_title, review_text, pros, cons, would_recommend, would_hire_again, work_completed, final_cost, project_duration_days, photos, created_at, updated_at |
| **vendors** | table | **user_id** (who entered it), **trade_category_id**, name, company_name, email, phone, website, address, city, state, zip_code, rating_platform, rating_score, rating_reviews, social_media, found_via, preferred_contact_method, contact_hours, services_offered, specialties, service_area, licensed, insured, license_number, insurance_info, notes, tags, is_active, is_favorite, created_at, updated_at |

**Quick verdict:** Supabase has no **user_vendors** or **project_vendors**. On `vendors`, **user_id** is “who entered it” (audit); the repo renames that to **created_by_user_id** and moves user/project-specific data into the bridge tables.

---

## 2. Bids-related comparison: Supabase vs repo (database-schema-bids.sql)

### In Supabase and in repo (aligned)

- **trade_categories** – present in both; repo also has seed INSERTs.
- **bid_requests** – columns match (project_id, user_id, vendor_id, trade_category_id, phase_ids, scope_*, status, request_method, timestamps, etc.).
- **bids** – columns match (bid_request_id, vendor_id, project_id, amounts, phase_costs, timeline_*, status, etc.).
- **bid_items** – repo uses `bid_id`; CSV has `bid_id` (same).
- **email_communications** – full set of columns in CSV (from_email, to_email, send_method, oauth_*, status, sent_at, etc.) matches repo intent.
- **email_templates** – in both.
- **user_email_accounts** – in both.
- **vendor_reviews** – in both (CSV has `final_cost`; repo may use `final_cost` – same).
- **bid_request_summary** – view in both (CSV: vendor_name, vendor_email, vendor_phone, rating_score, trade_category_name, phase_count, phase_ids, bid_count, lowest_bid_amount).
- **vendor_performance_summary** – view in both; repo version uses **user_vendors** (see below).

### In Supabase but different in repo (vendors)

| Aspect | Supabase (current) | Repo (database-schema-bids.sql) |
|--------|---------------------|-----------------------------------|
| **vendors** | **user_id** = who entered it (audit). **trade_category_id**, notes, tags, found_via, preferred_contact_method, is_active, is_favorite on the same row. | **created_by_user_id** = who entered it (audit, optional). No trade_category_id or user-specific fields on vendors; those live on bridge tables. |
| **user_vendors** | **Does not exist** | **Exists in repo:** user_id, vendor_id, trade_category_id, notes, tags, found_via, is_favorite, is_active (bridge: “my vendors”). |
| **project_vendors** | **Does not exist** | **Exists in repo:** project_id, vendor_id, trade_category_id, notes, tags, added_by_user_id, is_favorite, is_active (bridge: “vendors on this project”). |

So: **Supabase** = one `vendors` row with user_id (who entered) + trade/category and user-specific fields on that row; no "my vendors" or "project vendors" bridge. **Repo** = same "who entered" idea as **created_by_user_id**, plus **user_vendors** ("my list") and **project_vendors** ("on this job"), with shared vendor rows.

### In repo but not in Supabase

- **user_vendors** (table)
- **project_vendors** (table)

---

## 3. Summary

- You’ve already implemented most of the bids schema in Supabase: **trade_categories**, **vendors** (with user_id = who entered it), **bid_requests**, **bids**, **bid_items**, **email_communications**, **email_templates**, **user_email_accounts**, **vendor_reviews**, and the views **bid_request_summary** and **vendor_performance_summary**.
- **Vendors in Supabase:** **user_id** is “who entered it” (audit), not “one vendor per user.” The gap is: no **user_vendors** (“my vendors”) or **project_vendors** (“vendors on this project”), and user-specific fields (trade_category_id, notes, tags, is_favorite, etc.) live on `vendors` instead of bridge tables.
- **Repo** keeps “who entered” as **created_by_user_id** on `vendors` and adds **user_vendors** and **project_vendors** for “my list” and “on this job,” with user/project-specific data on the bridges.
- To adopt the repo design in Supabase you’d need a **migration**: add **user_vendors** and **project_vendors**, migrate existing data (e.g. one row per (user_id, vendor_id) into user_vendors from current vendors), then rename **user_id** → **created_by_user_id** on vendors (and make it nullable), move user-specific columns off vendors into the bridges, drop **trade_category_id** from vendors, and adjust **vendor_performance_summary** and RLS.

If you want, next step can be a concrete **migration script** (SQL) that does the above against your current Supabase schema.

---

**Re-analysis note:** This document was re-run against the updated `Supabase_Structure/SupabaseSchema.csv`. Clarification: **user_id** on `vendors` in Supabase is intended as “who entered it” (audit), not “one vendor per user.” The repo design keeps that intent as **created_by_user_id** and adds bridge tables for “my vendors” and “vendors on this project.”
