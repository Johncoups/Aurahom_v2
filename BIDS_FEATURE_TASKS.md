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

## Phase 1: Database Schema & Setup 🗄️

### Supabase Tables
- [x] Create `vendors` table with all fields
  - [x] Add user_id, name, email, phone, website
  - [x] Add rating fields (platform, score, reviews)
  - [x] Add social_media JSONB field
  - [x] Add found_via array field
  - [x] Add preferred_contact_method and notes
  - [x] Add timestamps (created_at, updated_at)
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
- [x] Add index on `vendors(user_id)`
- [x] Add index on `bid_requests(project_id)`
- [x] Add index on `bid_requests(vendor_id)`
- [x] Add index on `bids(bid_request_id)`
- [x] Add index on `bids(project_id)`

### Row Level Security (RLS)
- [x] Enable RLS on `vendors` table
- [x] Add policy: Users can only access their own vendors
- [x] Enable RLS on `bid_requests` table
- [x] Add policy: Users can only access their own bid requests
- [x] Enable RLS on `bids` table
- [x] Add policy: Users can only access bids for their projects
- [x] Enable RLS on `vendor_reviews` table
- [x] Add policy: Users can only access their own reviews

### Test Data
- [ ] Create seed data SQL for vendors (similar to budget seed files)
- [ ] Create seed data SQL for bid_requests
- [ ] Create seed data SQL for bids
- [ ] Add to .gitignore (seed-bids-test-data*.sql)

---

## Phase 2: Backend API Functions ⚙️

### Vendor CRUD (`lib/bids.ts`)
- [ ] Create `lib/bids.ts` file
- [ ] Implement `createVendor(vendorData)` function
- [ ] Implement `updateVendor(vendorId, vendorData)` function
- [ ] Implement `deleteVendor(vendorId)` function
- [ ] Implement `getVendorsByUser(userId)` function
- [ ] Implement `getVendorsByProject(projectId)` function
- [ ] Implement `searchVendors(query, filters)` function
- [ ] Add TypeScript interfaces for Vendor type

### Bid Request Functions
- [ ] Implement `createBidRequest(bidRequestData)` function
- [ ] Implement `updateBidRequestStatus(requestId, status)` function
- [ ] Implement `getBidRequestsByProject(projectId)` function
- [ ] Implement `getBidRequestsByVendor(vendorId)` function
- [ ] Implement `deleteBidRequest(requestId)` function
- [ ] Add TypeScript interfaces for BidRequest type

### Bid Submission Functions
- [ ] Implement `submitBid(bidData)` function
- [ ] Implement `updateBid(bidId, bidData)` function
- [ ] Implement `getBidsByProject(projectId)` function
- [ ] Implement `getBidsByRequest(bidRequestId)` function
- [ ] Implement `acceptBid(bidId)` function
- [ ] Implement `rejectBid(bidId)` function
- [ ] Implement `compareBids(bidRequestId)` function
- [ ] Add TypeScript interfaces for Bid type

### Email Functions
- [x] Choose email service (SendGrid, Resend, or AWS SES)
- [x] Set up email service API keys in environment variables
- [x] Create `lib/email.ts` file
- [x] Implement `sendBidRequestEmail(bidRequest, vendor)` function (via Send via Aurahom action + Resend)
- [x] Create email template for bid requests (AI-generated via prepareEmailDraft flow)
- [ ] Implement `sendBidReceivedNotification(bid, user)` function
- [ ] Create email template for bid received notifications
- [x] Add error handling and retry logic

### Utility Functions
- [ ] Implement `importVendorsFromCSV(csvData)` function
- [ ] Implement `exportVendorsToCSV(userId)` function
- [ ] Implement `generateBidRequestPDF(bidRequestId)` function
- [ ] Implement `calculateBidComparison(bids[])` function

---

## Phase 3: Update Existing Components 🎨

### Bids Page Updates (`components/bids-page.tsx`)
- [ ] Remove hardcoded vendor data
- [ ] Add state management for loading/error states
- [ ] Fetch vendors from database on component mount
- [ ] Fetch bid requests from database
- [ ] Update `handleRequestBids` to create database records
- [ ] Update `handleVendorEdit` to save to database
- [ ] Update status changes to persist to database
- [ ] Add real-time updates (Supabase subscriptions)
- [ ] Add loading skeletons
- [ ] Add error handling and user feedback
- [ ] Add empty states (no vendors, no bids)

### Bids Context Updates (`contexts/bids-context.tsx`)
- [ ] Expand context to include vendors list
- [ ] Add bid requests state
- [ ] Add bids state
- [ ] Add loading states
- [ ] Add error states
- [ ] Add CRUD action functions
- [ ] Add refresh/reload functions

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
- [ ] Add "Select Vendor from Bids" button in budget-page.tsx
- [ ] Populate `budget_items.vendor` from accepted bid
- [ ] Auto-fill `estimated_cost` from bid amount
- [ ] Auto-fill `actual_cost` when bid is accepted
- [ ] Link budget line items to specific bids
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

---

## Phase 9: Advanced Features (Future Enhancements) 🌟

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
**Phase 2 (Backend):** 🔶 Partial — Email done; Vendor/Bid CRUD in `lib/bids.ts` not started  
**Phase 3 (UI Updates):** 🔶 Partial — Send via Aurahom + DB records; vendors still local state  
**Phase 4 (New Features):** ⬜ Not Started  
**Phase 5 (Integration):** ⬜ Not Started  
**Phase 6 (Email):** ✅ Send via Aurahom, Prepare Draft, Resend, store in DB  
**Phase 7 (Testing):** ⬜ Not Started  
**Phase 8 (Production):** 🔶 Partial — Toasts added  
**Phase 9 (Advanced):** ⬜ Not Started  

**Overall Completion:** ~50+ tasks done (schema, email flow, Send via Aurahom, Prepare Draft, toasts)

---

*Last Updated: January 2026*

