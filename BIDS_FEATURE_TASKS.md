# Bids Feature Development Tasks

## Overview
Transform the hardcoded bids UI into a fully functional vendor and bid management system with database persistence, email integration, and budget/schedule integration.

## User Persona & Direction
**The Bids page is designed for how a contractor (general contractor) would use it, not an owner-builder.**

- **Primary user:** General contractor (GC) managing projects and requesting/collecting bids from **subcontractors** (subs) for each trade or phase.
- **Workflow:** Contractor has **projects/jobs**; within each project they organize by **trades/phases** (e.g. Foundation, Framing, Roofing, Electrical, Plumbing, HVAC, Drywall, etc.). For each trade they add subs, send bid requests, compare bids, and award work.
- **Terminology and UI** should align with contractor usage where appropriate (e.g. "subs," "subcontractors," "projects," "trades," "bid requests out," "bids received") rather than owner-builder–centric language.
- **Scope:** Cover all trades needed to build a house (full construction phase list), not a shortened owner-builder–oriented subset.

---

## Future Enhancements (Phase 9) 🌟

*Planned for after core Bids feature is complete. See Phase 9 section below for full detail.*

### Vendor Bid Upload + OCR
*When vendors receive a bid request via Aurahom, allow them to upload their quote (PDF/image) and use OCR to extract data and auto-fill or create a draft bid. User reviews before submitting.*
- [ ] **Upload UI** — File input; optional vendor portal or reply-with-attachment flow
- [ ] **Storage** — Supabase Storage bucket; store PDFs/images; link to bids (e.g. `attachments` or `bid_documents`)
- [ ] **OCR** — Use a provider (e.g. OpenAI vision, Google Document AI, AWS Textract) or OSS (Tesseract); tune for bad scans/handwriting
- [ ] **Structured extraction** — Map OCR text → bid fields (total, materials, labor, notes, dates); LLM or rules + regex; validation and fallbacks
- [ ] **Create draft bid flow** — Prefill `submitBid` (or draft) from extracted data; user reviews/edits and submits
- [ ] **Vendor experience** — Decide: upload in email reply, upload in app, or both; auth/identity for vendor vs GC-entered
- [ ] **Testing & edge cases** — Many document layouts; partial failures; “couldn’t parse, please enter manually”
- [ ] Add `bid_requests.accepted_bid_id` (FK to bids); set in accept-bid flow.
- [ ] Add `budget_items.vendor_id` (FK to vendors); set in accept-bid flow when updating budget_items.
### Analytics & Reporting
- [ ] Add bid analytics dashboard
- [ ] Show average bid prices by category
- [ ] Show vendor response rates
- [ ] Show acceptance rates
- [ ] Export reports to PDF/Excel

### Vendor Marketplace
- [ ] Add public vendor directory
- [ ] Allow vendors to create profiles
- [ ] Add vendor search for other users
- [ ] Add vendor recommendations based on project

### Collaboration
- [ ] Allow sharing bids with team members
- [ ] Add comments on bids
- [ ] Add approval workflows
- [ ] Add multi-user editing

### AI Features
- [ ] Auto-categorize vendors by specialty
- [ ] Suggest vendors based on project type
- [ ] Predict bid amounts based on historical data
- [ ] Generate bid request descriptions

---

## Phase 1: Database Schema & Setup 🗄️

### Supabase Tables
- [x] Create `vendors` table (shared directory – **independent of users**)
  - [x] Company-level fields: name, email, phone, website, rating_platform, rating_score, rating_reviews, social_media, services_offered, licensed, insured, etc.
  - [x] Optional `created_by_user_id` for audit; no `user_id` ownership
- [x] Create `user_vendors` bridge table (global “my list” – links users to vendors)
  - [x] user_id, vendor_id, trade_category_id (user’s classification)
  - [x] User-specific: notes, tags, found_via, preferred_contact_method, is_favorite, is_active
  - [x] UNIQUE(user_id, vendor_id)
- [x] Create `project_vendors` bridge table (**ties vendors to a specific project**)
  - [x] project_id, vendor_id, trade_category_id, added_by_user_id, notes, is_favorite, is_active
  - [x] UNIQUE(project_id, vendor_id)
  - [x] Note: `vendors.created_by_user_id` = who first entered the vendor (audit only); `project_vendors` = which vendors are used on which project
- [x] Create `bid_requests` table
  - [x] Add project_id, user_id, vendor_id references
  - [x] Add phase_ids, scope_title (phase/subphase scope)
  - [x] Add status field with enum values
  - [x] Add request_method field
  - [x] Add requested_at, due_date timestamps
  - [x] Add message_sent field
- [x] Create `bids` table
  - [x] Add bid_request_id, vendor_id, project_id references
  - [x] Add cost fields (total, materials, labor)
  - [x] Add timeline fields (days, description)
  - [x] Add notes and attachments JSONB
  - [x] Add status field
  - [x] Add timestamps (submitted_at, reviewed_at)
- [x] Create `vendor_reviews` table (optional)
  - [x] Add vendor_id, project_id, user_id references
  - [x] Add rating fields (overall, quality, timeline, communication, price)
  - [x] Add review_text and would_recommend
  - [x] Add timestamp

### Database Indexes
- [x] Add index on `vendors(name)`, `vendors(services_offered)`
- [x] Add index on `user_vendors(user_id)`, `user_vendors(vendor_id)`, `user_vendors(trade_category_id)`
- [x] Add index on `bid_requests(project_id)`
- [x] Add index on `bid_requests(vendor_id)`
- [x] Add index on `bids(bid_request_id)`
- [x] Add index on `bids(project_id)`

### Row Level Security (RLS)
- [x] Enable RLS on `vendors`: authenticated can SELECT/INSERT; UPDATE/DELETE only for `created_by_user_id`
- [x] Enable RLS on `user_vendors`: users can only access their own rows (SELECT/INSERT/UPDATE/DELETE by user_id)
- [x] Enable RLS on `bid_requests` table
- [x] Add policy: Users can only access their own bid requests
- [x] Enable RLS on `bids` table
- [x] Add policy: Users can only access bids for their projects
- [x] Enable RLS on `vendor_reviews` table
- [x] Add policy: Users can only access their own reviews

### Test Data
- [x] Create seed data SQL for vendors (similar to budget seed files)
- [x] Create seed data SQL for bid_requests
- [x] Create seed data SQL for bids
- [x] Add to .gitignore (seed-bids-test-data*.sql)

**App impact:**  
- **Vendors on this project:** `project_vendors pv JOIN vendors v ON v.id = pv.vendor_id WHERE pv.project_id = :projectId`.  
- **My vendors (global list):** `user_vendors uv JOIN vendors v ON v.id = uv.vendor_id WHERE uv.user_id = auth.uid()`.  
- **Who entered the vendor:** `vendors.created_by_user_id` is audit-only (who first added to directory). **Which project:** use `project_vendors` (ties vendor to project).  
- When adding a vendor to a project: insert into `vendors` (or find existing), then insert into `project_vendors` (and optionally `user_vendors`). Bid requests still reference `vendors.id`.

---

## Phase 2: Backend API Functions ⚙️

*See **Workflow 2** for the recommended request → bid → accept → budget sequence and which APIs support each step.*

### Vendor CRUD (`lib/bids.ts`)
- [x] Create `lib/bids.ts` file
- [x] Implement `createVendor(vendorData)` function
- [x] Implement `updateVendor(vendorId, vendorData)` function
- [x] Implement `removeVendorFromUser(userId, vendorId)` function (removes association, doesn't delete vendor)
- [x] Implement `removeVendorFromProject(projectId, vendorId)` function (removes association, doesn't delete vendor)
- [x] Implement `getVendorsByUser(userId)` function
- [x] Implement `getVendorsByProject(projectId)` function
- [x] Implement `searchVendors(query, filters)` function
- [x] Add TypeScript interfaces for Vendor type

### Bid Request Functions
- [x] Implement `createBidRequest(bidRequestData)` function
- [x] Implement `updateBidRequestStatus(requestId, status)` function
- [x] Implement `getBidRequestsByProject(projectId)` function
- [x] Implement `getBidRequestsByVendor(vendorId)` function
- [x] Implement `deleteBidRequest(requestId)` function
- [x] Add TypeScript interfaces for BidRequest type

### Bid Submission Functions
- [x] Implement `submitBid(bidData)` function
- [x] Implement **create bid line items** (`bid_items`) with `budget_item_id` when recording a bid — links bid to budget (*Workflow 2 C*) — `addBidItems(bidId, items)`
- [x] Implement `updateBid(bidId, bidData)` function
- [x] Implement `getBidsByProject(projectId)` function
- [x] Implement `getBidsByRequest(bidRequestId)` function
- [x] Implement `acceptBid(bidId)` function — update bids + bid_requests status (*push to budget_items* deferred until budget API exists)
- [x] Implement `rejectBid(bidId)` function
- [x] Implement `compareBids(bidRequestId)` function
- [x] Add TypeScript interfaces for Bid type

### Email Functions
- [x] Choose email service (SendGrid, Resend, or AWS SES)
- [x] Set up email service API keys in environment variables
- [x] Create `lib/email.ts` file
- [x] Implement `sendBidRequestEmail(bidRequest, vendor)` function (via Send via Aurahom action + Resend)
- [x] Create email template for bid requests (AI-generated via prepareEmailDraft flow)
- [x] Implement `sendBidReceivedNotification(bid, user)` function
- [x] Create email template for bid received notifications
- [x] Add error handling and retry logic

### Utility Functions
- [x] Implement `importVendorsFromCSV(csvData)` function
- [x] Implement `exportVendorsToCSV(userId)` function
- [x] Implement `generateBidRequestPDF(bidRequestId)` function — returns printable HTML (use browser "Print to PDF" or a PDF service)
- [x] Implement `calculateBidComparison(bids[])` function

---

## Workflow 2: Backend Workflow (Request → Bid → Accept → Budget) 📋

*Implementation checklist derived from the recommended backend workflow. Bucketed with Phase 2 (Backend), Phase 3 (UI), and Phase 5 (Budget Integration) where applicable.*

### A. Vendors on this project
- [x] **Ensure `project_vendors` when adding vendor to project:** When user adds a vendor to a project (or sends a bid request for that project), create/update a `project_vendors` row if it doesn’t exist — `ensureProjectVendor(projectId, vendorId, userId)`; called in `sendBidRequestViaAurahom` before creating bid_request.
- [x] **List vendors for a project:** Query `project_vendors` (join vendors, trade_categories) — *see Phase 2: `getVendorsByProject`*
- [x] **Add vendor to project:** Insert `project_vendors` with validation and RLS — `addVendorToProject(projectId, vendorId, addedByUserId, options?)`; idempotent (returns success if link exists).
- [x] **Update/remove project–vendor link:** Update or delete `project_vendors` as needed — `updateProjectVendor(projectId, vendorId, data)`; remove via existing `removeVendorFromProject(projectId, vendorId)`.

### B. Request a bid
- [x] **Create bid request:** Server action/API that inserts `bid_requests` (project_id, user_id, vendor_id, trade_category_id, phase_ids, scope_title, scope_description, status, request_method, due_date, etc.) — *see Phase 2: `createBidRequest`*
- [x] **Send the request (all three methods):**
  - [x] **Manual:** Generate draft (subject/body); user copies. Save draft to `email_communications`. Mark as sent via `markBidRequestAsSent` — *done via `createBidRequestManual` server action*
  - [x] **Aurahom:** On send success set bid_request status to `pending`, set requested_at, message_sent, email_subject; insert `email_communications` — *done via Send via Aurahom + `ensureProjectVendor` + idempotency check*
  - [ ] **User email (OAuth):** Send via user’s connected email; on success same updates to `bid_requests` and `email_communications` (thread_id, user_email_account as needed).
- [x] **Idempotency:** Done via `findExistingBidRequest` function (checks project/vendor/phases overlap); integrated into both send methods

### C. Vendor submitted a bid (record bid)
- [x] **Record bid:** Server action/API that inserts `bids` — *done via `submitBid` in lib/bids.ts + `recordBid` server action (combines bid + items)*
- [x] **Record bid line items and link to budget:** Insert `bid_items` with `budget_item_id` linking — *done via `addBidItems` + `findBudgetItem`/`getBudgetItemsByPhase` helpers for resolving budget_item_id*
- [x] **Optional: set bid_request status to `bid_received`** when first bid is created — *done: `submitBid` auto-sets status to `bid_received` on first bid*
- [x] **Who can create bids:** GC-entered (project owner records bids they receive); RLS enforces project ownership — *documented in `recordBid` server action*

### D. GC selects a vendor (accept bid)
- [x] **Accept-bid operation (single transaction/sequence):**
  1. [x] Set chosen `bids` row to status = `accepted` — *done via `acceptBid`*
  2. [x] Set other `bids` for same bid_request to status = `rejected` — *done via `acceptBid`*
  3. [x] Set `bid_requests`.status = `accepted` — *done via `acceptBid` → `updateBidRequestStatus`*
  4. [x] **Push to budget:** Update `budget_items.actual_cost` (+ vendor, materials, labor) from `bid_items` — *done via `pushBidItemsToBudget`*
- [x] **Single "accept bid" server action/API:** `acceptBidAction` orchestrates all steps including budget update — *app/actions/acceptBidAction.ts*
- [x] **Validation:** RLS enforces project ownership; server action validates bid status before accepting — *done in `acceptBidAction`*

### E. Read: “Who was selected” and “Link to budget”
- [x] **Accepted bid for a request:** `getAcceptedBidForRequest(bidRequestId)` — returns bid with status = `accepted`
- [x] **Selected vendor per project/phase/trade:** `getAcceptedBidsByProject(projectId)` — returns all accepted bids for a project
- [x] **Budget lines tied to selected vendor:** `getBidItemsWithBudgetLinks(bidId)` — returns bid_items joined with budget_items
- [ ] **UI:** Budget page shows which budget_items are linked to an accepted bid (and vendor name); Bids/project page shows “accepted” bid and “linked budget items” — *see Phase 3: Bids page; Phase 5: Budget Integration*

---

## Phase 3: Update Existing Components 🎨

### Bids Page Updates (`components/bids-page.tsx`)
*Integrates with **Workflow 2** A (project vendors), B (create/send request), D (accept bid), E (show accepted + linked budget).*
- [x] Remove hardcoded vendor data — *vendors from context via getVendorsForPhase*
- [x] Add state management for loading/error states — *bidsLoading, bidsError from context*
- [x] Fetch vendors from database on component mount (project vendors: *Workflow 2 A*) — *loadProjectData(activeProjectId)*
- [x] Fetch bid requests from database — *loadBidsData server action*
- [x] Update `handleRequestBids` to create database records — *sendBidRequestViaAurahom, addVendorToPhase*
- [x] Update `handleVendorEdit` to save to database — *updateVendorAction*
- [x] Update status changes to persist to database (accept bid → budget update) — *acceptBidAction*
- [x] Show accepted bid and “linked budget items” (*Workflow 2 E*)
- [ ] Add real-time updates (Supabase subscriptions)
- [ ] Add loading skeletons
- [x] Add error handling and user feedback — *toasts, error banner, retry*
- [x] Add empty states (no vendors, no bids) — *"No vendors for this phase yet", "Please complete onboarding"*

### Bids Context Updates (`contexts/bids-context.tsx`)
- [x] Expand context to include vendors list
- [x] Add bid requests state
- [x] Add bids state
- [x] Add loading states
- [x] Add error states
- [x] Add CRUD action functions — *loadProjectData, refresh, getVendorsForPhase*
- [x] Add refresh/reload functions

### Phase Integration
- [x] Connect to roadmap phases (use actual phase IDs)
- [ ] Map sub-phases to budget categories
- [ ] Sync with construction timeline

---

## Phase 4: New Components & Features 🆕

### Vendor Management Page
- [ ] Create `components/vendors-page.tsx`
- [ ] Add vendor list view with search and filters
- [ ] Add "Add New Vendor" button and form
- [ ] Add edit vendor functionality
- [ ] Add delete vendor with confirmation
- [ ] Add vendor detail view
- [ ] Add vendor performance metrics
- [ ] Add import from CSV button
- [ ] Add export to CSV button

### Vendor Form Component
- [ ] Create `components/vendor-form.tsx`
- [ ] Add form fields (name, email, phone, website)
- [ ] Add rating fields (platform, score, reviews)
- [ ] Add social media fields (dynamic array)
- [ ] Add found via checkboxes
- [ ] Add notes textarea
- [ ] Add form validation
- [ ] Add submit/cancel buttons

### Bid Submission Form
- [ ] Create `components/bid-submission-form.tsx`
- [ ] Add cost input fields (materials, labor, total)
- [ ] Add timeline input fields
- [ ] Add notes textarea
- [ ] Add file upload for attachments
- [ ] Add form validation
- [ ] Add submit button
- [ ] Handle file uploads to Supabase Storage

### Bid Comparison View
- [ ] Create `components/bid-comparison.tsx`
- [ ] Add side-by-side comparison table
- [ ] Add sorting (by price, timeline, rating)
- [ ] Add highlighting (lowest price, best rating)
- [ ] Add accept/reject buttons
- [ ] Add notes/comments section
- [ ] Add export to PDF button

### Dashboard Widgets
- [ ] Create `components/dashboard-bids-widget.tsx`
- [ ] Show pending bid requests count
- [ ] Show received bids count
- [ ] Show recent bid activity
- [ ] Add "View All Bids" link
- [ ] Add to dashboard page

---

## Phase 5: Integration with Other Features 🔗

### Budget Integration
*Driven by **Workflow 2 D** (accept bid → push to budget) and **Workflow 2 E** (read selected + link to budget).*
- [ ] Add "Select Vendor from Bids" button in budget-page.tsx
- [ ] Populate `budget_items.vendor` from accepted bid (in accept-bid flow)
- [ ] Auto-fill `estimated_cost` from bid amount
- [ ] Auto-fill `actual_cost` when bid is accepted (update budget_items in accept-bid flow per bid_items.budget_item_id)
- [ ] Link budget line items to specific bids (bid_items.budget_item_id → budget_items)
- [ ] Show which budget_items are linked to an accepted bid and vendor name (*Workflow 2 E*)
- [ ] Show bid comparison in budget view

### Schedule Integration
- [ ] Add vendor timeline to schedule
- [ ] Show vendor availability
- [ ] Adjust schedule based on accepted bid timelines
- [ ] Add vendor contact info to schedule tasks
- [ ] Show vendor in schedule task details

### Document Integration
- [ ] Store bid attachments in Supabase Storage
- [ ] Add "Documents" tab to vendor detail view
- [ ] Add bid PDFs to project documents
- [ ] Create bid request PDF templates
- [ ] Add contract templates

### Roadmap Integration
- [ ] Map vendors to roadmap phases
- [ ] Show vendor recommendations per phase
- [ ] Track vendor completion of phases
- [ ] Add vendor to phase tasks

---

## Phase 6: Email & Notifications 📧

### Email Service Setup
- [x] Choose email provider (SendGrid/Resend/AWS SES)
- [x] Create account and get API keys
- [x] Add API keys to `.env.local`
- [x] Test email sending functionality

### Email Templates
- [x] Create bid request email template (HTML) — AI-generated via Prepare Email Draft flow
- [ ] **To Do:** Refine the actual email content sent via "Send via Aurahom" (copy, layout, branding)
- [ ] Create bid received notification template
- [ ] Create bid accepted notification template
- [ ] Create bid rejected notification template
- [ ] Add company branding to templates

### Email Functionality
- [x] Implement "Send via Aurahöm" option
- [ ] Implement "Send from My Email" option (OAuth)
- [x] Implement "Prepare Email Draft" option
- [ ] Add email tracking (opened, clicked)
- [ ] Add automatic follow-up reminders
- [x] Store sent emails in database

### In-App Notifications
- [ ] Add notification system (optional)
- [ ] Show notification badge for new bids
- [ ] Add notification center dropdown
- [ ] Mark notifications as read
- [ ] Add notification preferences

---

## Phase 7: Testing & Quality Assurance 🧪

### Unit Tests
- [ ] Write tests for `lib/bids.ts` functions
- [ ] Write tests for vendor CRUD operations
- [ ] Write tests for bid submission
- [ ] Write tests for email functions
- [ ] Write tests for bid comparison logic

### Integration Tests
- [ ] Test vendor creation → bid request → bid submission flow
- [ ] Test bid acceptance → budget update flow
- [ ] Test bid request → email sending flow
- [ ] Test vendor deletion (cascading deletes)
- [ ] Test RLS policies

### UI/UX Testing
- [ ] Test on mobile devices
- [ ] Test on different screen sizes
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test with real data at scale (100+ vendors)

### Edge Cases
- [ ] Test with no vendors
- [ ] Test with no bids
- [ ] Test duplicate vendor emails
- [ ] Test expired bid requests
- [ ] Test network failures
- [ ] Test concurrent edits

---

## Phase 8: Polish & Production 🚀

### Go-Live: Send via Aurahom
When taking the app live, implement the following for production email sending:

- [ ] **Resend (production):** In Resend dashboard, add and verify your production domain (e.g. `aurahom.com` or your sending domain). Use a verified FROM address (e.g. `bids@aurahom.com`).
- [ ] **Environment:** Set `RESEND_API_KEY` in production (Vercel/hosting) to your live Resend API key; do not use the test/sandbox key in production.
- [ ] **Rate limiting:** Keep or add rate limiting for the send-Bid-request action so users cannot abuse the Resend quota (see Phase 8 Security — "Add rate limiting for email sending").
- [ ] **Logging/monitoring:** Log send attempts (success/failure) and optionally track Resend webhooks for bounces/complaints so you can fix bad addresses or content.
- [ ] **Reply-to (optional):** If you want vendor replies to go to the homeowner, set the email’s Reply-To to the user’s email when sending via Aurahom.

### Performance
- [ ] Optimize database queries
- [ ] Add pagination for vendor list
- [ ] Add lazy loading for bid history
- [ ] Optimize image/attachment uploads
- [ ] Add caching where appropriate

### Security
- [ ] Audit RLS policies
- [ ] Add rate limiting for email sending
- [ ] Sanitize user inputs
- [ ] Validate file uploads (type, size)
- [ ] Add CSRF protection
- [ ] Review API error messages (no data leaks)

### Documentation
- [ ] Add JSDoc comments to all functions
- [ ] Create user guide for bids feature
- [ ] Document email template customization
- [ ] Document CSV import format
- [ ] Update README with bids feature

### User Experience
- [ ] Add helpful tooltips
- [ ] Add onboarding tour for first-time users
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add undo functionality where possible
- [ ] Add keyboard shortcuts
- [x] Add success/error toast messages


## Quick Commands Reference

```bash
# Create feature branch
git checkout -b feature/bids

# Create new components
touch lib/bids.ts
touch lib/email.ts
touch components/vendors-page.tsx
touch components/vendor-form.tsx
touch components/bid-submission-form.tsx
touch components/bid-comparison.tsx

# Run development server
npm run dev

# Run tests
npm test

# Commit frequently
git add <files>
git commit -m "Descriptive message"
git push origin feature/bids
```

---

## Notes
- **Workflow 2** defines the backend sequence: project vendors → request bid → record bid (with bid_items → budget_item_id) → accept bid (update budget_items). Use it to order implementation and bucket tasks.
- Prioritize database schema and backend functions first
- Test each function thoroughly before moving to UI
- Keep commits small and focused
- Document as you build
- Use existing UI patterns from budget-page.tsx
- Maintain cyan-800 and violet-500 color scheme
- Ensure mobile responsiveness

---

## Progress Tracking

**Phase 1 (Database):** ✅ Schema, indexes, RLS in place (`database-schema-bids.sql`)  
**Phase 2 (Backend):** ✅ Complete — All functions in `lib/bids.ts` done. **Workflow 2** A–E complete (project vendors, request bid, record bid, accept bid with budget push, query accepted bids).  
**Phase 3 (UI Updates):** ✅ Substantial — Bids page fetches from DB; vendors, bid requests, bids persist; accept bid + linked budget items shown; loading/error/empty states  
**Phase 4 (New Features):** ⬜ Not Started  
**Phase 5 (Integration):** ⬜ Not Started  
**Phase 6 (Email):** ✅ Send via Aurahom, Prepare Draft, Resend, store in DB  
**Phase 7 (Testing):** ⬜ Not Started  
**Phase 8 (Production):** 🔶 Partial — Toasts added  
**Phase 9 (Advanced):** ⬜ Not Started  

**Overall Completion:** ~85+ tasks done (schema, backend API, email flow, Send via Aurahom/Manual, Prepare Draft, idempotency, record bid with items, budget linking, accept bid with budget push, query accepted bids, toasts)

---

*Last Updated: January 2026*

