-- ============================================================================
-- BIDS FEATURE - DATABASE SCHEMA
-- ============================================================================
-- This schema supports:
-- - Trade-based contractor organization (not phase-based)
-- - All 6 construction methods (Traditional, Post-Frame, ICF, SIP, Modular, Other)
-- - 3 email methods (Manual, Aurahöm, User's Email via OAuth)
-- - Multi-phase bid requests (e.g., Plumber covering Under-Slab + Rough-In + Finish)
-- ============================================================================

-- ============================================================================
-- TABLE 1: TRADE CATEGORIES
-- ============================================================================
-- Defines the types of contractors (Plumber, Electrician, Framing, etc.)
-- These are the primary groupings shown in the Bids UI

CREATE TABLE trade_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- 'Plumbing', 'Electrical', 'Framing', etc.
  display_order INTEGER NOT NULL, -- Order to display in UI
  icon TEXT, -- Emoji or icon name for UI
  description TEXT,
  -- Construction method applicability
  applies_to_methods TEXT[] DEFAULT ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], -- Which construction methods need this trade
  -- Multi-phase indicator
  is_multi_phase BOOLEAN DEFAULT false, -- true for Plumbing, Electrical, HVAC
  typical_phases TEXT[], -- Phase IDs this trade typically covers
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed the standard trade categories
INSERT INTO trade_categories (name, display_order, icon, description, applies_to_methods, is_multi_phase, typical_phases) VALUES
('Professional Services', 1, '📋', 'Architects, Engineers, Designers', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['pre-construction']),
('Site Work & Excavation', 2, '🚜', 'Excavation, Septic, Well, Utilities', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['site-prep-excavation', 'utilities-septic']),
('Foundation & Concrete', 3, '🏗️', 'Foundation, Concrete Work', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['foundation', 'under-slab-services', 'concrete-slabs']),
('Post-Frame Builder', 4, '🏗️', 'Post-Frame Shell & Structure', ARRAY['post-frame'], false, ARRAY['rough-framing']),
('ICF Installer', 5, '🧱', 'ICF Forms & Installation', ARRAY['icf'], false, ARRAY['foundation']),
('SIP Installer', 6, '🏗️', 'SIP Panel Installation', ARRAY['sip'], false, ARRAY['rough-framing']),
('Modular Home Dealer', 7, '🏠', 'Modular Home Delivery & Set', ARRAY['modular'], false, ARRAY['rough-framing']),
('Framing Contractor', 8, '🔨', 'Traditional Framing', ARRAY['traditional-frame', 'icf'], false, ARRAY['rough-framing', 'porches-decks']),
('Roofing', 9, '🏠', 'Roofing Installation', ARRAY['traditional-frame', 'icf', 'sip'], false, ARRAY['roofing']),
('Plumbing', 10, '🚰', 'Plumbing - All Phases', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], true, ARRAY['under-slab-services', 'plumbing-rough', 'kitchen-bath']),
('Electrical', 11, '⚡', 'Electrical - All Phases', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], true, ARRAY['under-slab-services', 'electrical-rough', 'kitchen-bath', 'final-touches']),
('HVAC', 12, '❄️', 'HVAC - All Phases', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], true, ARRAY['hvac-rough', 'kitchen-bath']),
('Exterior Finishes', 13, '🎨', 'Siding, Windows, Doors', ARRAY['traditional-frame', 'icf', 'sip'], false, ARRAY['exterior']),
('Insulation', 14, '🧱', 'Insulation & Air Sealing', ARRAY['traditional-frame', 'post-frame', 'icf', 'modular', 'other'], false, ARRAY['insulation']),
('Drywall', 15, '🪟', 'Drywall Installation', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['drywall']),
('Trim Carpentry', 16, '🪚', 'Interior Trim & Doors', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['trim-carpentry']),
('Painting', 17, '🎨', 'Interior & Exterior Paint', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['paint']),
('Flooring', 18, '🏠', 'Finish Flooring', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['flooring']),
('Cabinets & Countertops', 19, '🍳', 'Kitchen & Bath Finishes', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['kitchen-bath']),
('Decks & Outdoor', 20, '🏡', 'Decks, Porches', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['porches-decks']),
('Final Finishes', 21, '✨', 'Cleaning, Hardware, Accessories', ARRAY['traditional-frame', 'post-frame', 'icf', 'sip', 'modular', 'other'], false, ARRAY['final-touches']);

-- ============================================================================
-- TABLE 2: VENDORS
-- ============================================================================
-- Stores contractor/vendor information with contact details and ratings

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trade_category_id UUID REFERENCES trade_categories(id) ON DELETE SET NULL,
  
  -- Basic Information
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Ratings & Reviews
  rating_platform TEXT, -- 'Google', 'Facebook', 'Angi', etc.
  rating_score DECIMAL(2,1) CHECK (rating_score >= 0 AND rating_score <= 5),
  rating_reviews INTEGER DEFAULT 0,
  
  -- Social Media & Discovery
  social_media JSONB DEFAULT '[]'::jsonb, -- [{platform: 'Facebook', handle: '@example'}]
  found_via TEXT[], -- ['Google', 'Facebook', 'Referral']
  
  -- Contact Preferences
  preferred_contact_method TEXT DEFAULT 'email', -- 'email', 'phone', 'text'
  contact_hours TEXT, -- 'M-F 9am-5pm'
  
  -- Capabilities
  services_offered TEXT[], -- ['Plumbing', 'HVAC', 'Electrical'] - array of trade_categories this vendor offers
  specialties TEXT[], -- ['ICF', 'SIP', 'Post-Frame'] for construction methods
  service_area TEXT[], -- ['County A', 'County B'] or ZIP codes
  licensed BOOLEAN DEFAULT false,
  insured BOOLEAN DEFAULT false,
  license_number TEXT,
  insurance_info TEXT,
  
  -- Internal Notes
  notes TEXT, -- Private notes about vendor
  tags TEXT[], -- User-defined tags for filtering
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_favorite BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_vendors_trade_category ON vendors(trade_category_id);
CREATE INDEX idx_vendors_active ON vendors(is_active);
CREATE INDEX idx_vendors_tags ON vendors USING GIN(tags);
CREATE INDEX idx_vendors_services_offered ON vendors USING GIN(services_offered); -- For searching vendors by service

-- ============================================================================
-- TABLE 3: BID REQUESTS
-- ============================================================================
-- Tracks bid requests sent to vendors (one request can cover multiple phases)

CREATE TABLE bid_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  trade_category_id UUID REFERENCES trade_categories(id) ON DELETE SET NULL,
  
  -- Scope of Work
  phase_ids TEXT[] NOT NULL, -- Array of phase IDs covered by this request (e.g., ['under-slab-services', 'plumbing-rough', 'kitchen-bath'])
  scope_title TEXT, -- 'Complete Plumbing Package' or custom title
  scope_description TEXT, -- Detailed description of work
  
  -- Request Status
  status TEXT NOT NULL DEFAULT 'not_requested', 
    -- Values: 'not_requested', 'pending', 'bid_received', 'accepted', 'rejected', 'expired'
  
  -- Email Method Used (CRITICAL FOR YOUR 3 OPTIONS)
  request_method TEXT NOT NULL,
    -- Values: 'manual' (user sends), 'aurahom' (platform sends), 'user_email' (OAuth)
  
  -- Timing
  requested_at TIMESTAMP WITH TIME ZONE, -- When bid request was sent
  due_date TIMESTAMP WITH TIME ZONE, -- When bid is due
  reminder_sent_at TIMESTAMP WITH TIME ZONE, -- Last reminder sent
  expires_at TIMESTAMP WITH TIME ZONE, -- When request expires
  
  -- Communication Tracking
  message_sent TEXT, -- The actual message/email sent to vendor
  email_subject TEXT, -- Email subject line
  follow_up_count INTEGER DEFAULT 0, -- Number of follow-ups sent
  
  -- For OAuth Email Method
  user_email_account TEXT, -- Which email account was used (e.g., 'john@gmail.com')
  email_thread_id TEXT, -- Gmail/Outlook thread ID for tracking replies
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bid_requests_project_id ON bid_requests(project_id);
CREATE INDEX idx_bid_requests_vendor_id ON bid_requests(vendor_id);
CREATE INDEX idx_bid_requests_user_id ON bid_requests(user_id);
CREATE INDEX idx_bid_requests_status ON bid_requests(status);
CREATE INDEX idx_bid_requests_phase_ids ON bid_requests USING GIN(phase_ids);

-- ============================================================================
-- TABLE 4: BIDS
-- ============================================================================
-- Tracks actual bid submissions from vendors (multiple bids per request possible)

CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_request_id UUID REFERENCES bid_requests(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  
  -- Bid Amounts
  total_amount DECIMAL(12,2) NOT NULL,
  materials_cost DECIMAL(12,2) DEFAULT 0,
  labor_cost DECIMAL(12,2) DEFAULT 0,
  
  -- Cost Breakdown by Phase (for multi-phase bids)
  phase_costs JSONB DEFAULT '{}'::jsonb, 
    -- Example: {"under-slab-services": 2000, "plumbing-rough": 3200, "kitchen-bath": 4500}
  
  -- Timeline
  timeline_days INTEGER, -- Total days to complete
  timeline_description TEXT, -- Detailed timeline description
  start_date DATE, -- When vendor can start
  completion_date DATE, -- Estimated completion
  
  -- Additional Details
  notes TEXT, -- Vendor's notes/comments
  warranty_info TEXT, -- Warranty details
  payment_terms TEXT, -- Payment schedule (e.g., '50% upfront, 50% completion')
  exclusions TEXT, -- What's NOT included in bid
  assumptions TEXT, -- Vendor's assumptions about the work
  
  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb, 
    -- Example: [{"name": "quote.pdf", "url": "...", "type": "pdf", "size": 12345}]
  
  -- Status & Review
  status TEXT NOT NULL DEFAULT 'submitted',
    -- Values: 'submitted', 'under_review', 'accepted', 'rejected', 'expired', 'withdrawn'
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  
  -- Comparison Metrics (auto-calculated)
  is_lowest_bid BOOLEAN DEFAULT false, -- Auto-updated when new bids come in
  is_highest_rated_vendor BOOLEAN DEFAULT false,
  comparison_rank INTEGER, -- 1 = best, 2 = second best, etc.
  
  -- Metadata
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bids_bid_request_id ON bids(bid_request_id);
CREATE INDEX idx_bids_vendor_id ON bids(vendor_id);
CREATE INDEX idx_bids_project_id ON bids(project_id);
CREATE INDEX idx_bids_status ON bids(status);

-- ============================================================================
-- TABLE 5: EMAIL COMMUNICATIONS
-- ============================================================================
-- Tracks ALL email communications for bid requests (supports all 3 methods)

CREATE TABLE email_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_request_id UUID REFERENCES bid_requests(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  
  -- Email Details
  email_type TEXT NOT NULL,
    -- Values: 'bid_request', 'reminder', 'follow_up', 'bid_received_notification', 'acceptance', 'rejection'
  
  -- Sender/Recipient
  from_email TEXT NOT NULL, -- Who sent it
  to_email TEXT NOT NULL, -- Who received it
  cc_emails TEXT[], -- CC recipients
  bcc_emails TEXT[], -- BCC recipients
  
  -- Email Content
  subject TEXT NOT NULL,
  body_text TEXT, -- Plain text version
  body_html TEXT, -- HTML version
  
  -- Method Used (MATCHES THE 3 OPTIONS)
  send_method TEXT NOT NULL,
    -- Values: 'manual' (user copied draft), 'aurahom' (platform sent), 'user_email_oauth' (sent from user's email)
  
  -- OAuth Email Integration (for 'user_email_oauth' method)
  oauth_provider TEXT, -- 'gmail', 'outlook', 'other'
  oauth_account_email TEXT, -- Which user email account was used
  message_id TEXT, -- Provider's message ID
  thread_id TEXT, -- Provider's thread/conversation ID
  
  -- Delivery Status
  status TEXT NOT NULL DEFAULT 'draft',
    -- Values: 'draft', 'queued', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  bounced_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  
  -- Tracking
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- Reply Tracking (for OAuth method)
  reply_received BOOLEAN DEFAULT false,
  reply_at TIMESTAMP WITH TIME ZONE,
  reply_body TEXT,
  
  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_communications_bid_request ON email_communications(bid_request_id);
CREATE INDEX idx_email_communications_project ON email_communications(project_id);
CREATE INDEX idx_email_communications_user ON email_communications(user_id);
CREATE INDEX idx_email_communications_vendor ON email_communications(vendor_id);
CREATE INDEX idx_email_communications_status ON email_communications(status);
CREATE INDEX idx_email_communications_thread ON email_communications(thread_id);

-- ============================================================================
-- TABLE 6: USER_EMAIL_ACCOUNTS
-- ============================================================================
-- Stores OAuth tokens for user's email accounts (Gmail, Outlook, etc.)
-- Required for "Send from My Email Address" option

CREATE TABLE user_email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Email Provider
  provider TEXT NOT NULL, -- 'gmail', 'outlook', 'yahoo', 'other'
  email_address TEXT NOT NULL,
  display_name TEXT,
  
  -- OAuth Tokens (ENCRYPTED!)
  access_token_encrypted TEXT, -- Store encrypted
  refresh_token_encrypted TEXT, -- Store encrypted
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Scopes & Permissions
  granted_scopes TEXT[], -- What permissions were granted
  
  -- Settings
  is_primary BOOLEAN DEFAULT false, -- Primary email for this user
  auto_sync BOOLEAN DEFAULT true, -- Auto-sync replies/threads
  signature TEXT, -- Email signature to append
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  sync_error TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, email_address)
);

CREATE INDEX idx_user_email_accounts_user ON user_email_accounts(user_id);
CREATE INDEX idx_user_email_accounts_active ON user_email_accounts(is_active);

-- ============================================================================
-- TABLE 7: VENDOR_REVIEWS
-- ============================================================================
-- User reviews of vendors after project completion

CREATE TABLE vendor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bid_id UUID REFERENCES bids(id) ON DELETE SET NULL, -- Link to the bid that was accepted
  
  -- Ratings (1-5 scale)
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeline_rating INTEGER CHECK (timeline_rating >= 1 AND timeline_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  -- Review Content
  review_title TEXT,
  review_text TEXT,
  pros TEXT,
  cons TEXT,
  
  -- Recommendations
  would_recommend BOOLEAN,
  would_hire_again BOOLEAN,
  
  -- Project Context
  work_completed TEXT, -- Description of work done
  final_cost DECIMAL(12,2), -- Actual cost paid
  project_duration_days INTEGER, -- How long it actually took
  
  -- Photos (optional)
  photos JSONB DEFAULT '[]'::jsonb, -- [{url: '...', caption: '...'}]
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vendor_reviews_vendor ON vendor_reviews(vendor_id);
CREATE INDEX idx_vendor_reviews_user ON vendor_reviews(user_id);
CREATE INDEX idx_vendor_reviews_project ON vendor_reviews(project_id);

-- ============================================================================
-- TABLE 8: BID_ITEMS
-- ============================================================================
-- Links bids to specific budget line items (granular cost tracking)

CREATE TABLE bid_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES bids(id) ON DELETE CASCADE NOT NULL,
  budget_item_id UUID REFERENCES budget_items(id) ON DELETE SET NULL, -- Link to existing budget item
  
  -- Item Details
  description TEXT NOT NULL,
  phase_id TEXT NOT NULL,
  
  -- Costs
  materials_cost DECIMAL(12,2) DEFAULT 0,
  labor_cost DECIMAL(12,2) DEFAULT 0,
  total_cost DECIMAL(12,2) NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bid_items_bid ON bid_items(bid_id);
CREATE INDEX idx_bid_items_budget_item ON bid_items(budget_item_id);

-- ============================================================================
-- TABLE 9: EMAIL_TEMPLATES
-- ============================================================================
-- Customizable email templates for bid requests

CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trade_category_id UUID REFERENCES trade_categories(id) ON DELETE CASCADE,
  
  -- Template Details
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_text TEXT NOT NULL, -- Plain text version
  body_html TEXT, -- HTML version
  
  -- Variables supported in template
  -- {{vendor_name}}, {{project_address}}, {{scope_description}}, {{due_date}}, etc.
  
  -- Settings
  is_default BOOLEAN DEFAULT false, -- Default template for this trade category
  is_system BOOLEAN DEFAULT false, -- System-provided template (can't delete)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_templates_user ON email_templates(user_id);
CREATE INDEX idx_email_templates_trade ON email_templates(trade_category_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE trade_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_email_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Trade Categories (public read, admin write)
CREATE POLICY "Trade categories are viewable by everyone"
  ON trade_categories FOR SELECT
  USING (true);

-- Vendors (users can only see their own)
CREATE POLICY "Users can view their own vendors"
  ON vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vendors"
  ON vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendors"
  ON vendors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendors"
  ON vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Bid Requests (users can only see their own)
CREATE POLICY "Users can view their own bid requests"
  ON bid_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bid requests"
  ON bid_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bid requests"
  ON bid_requests FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bid requests"
  ON bid_requests FOR DELETE
  USING (auth.uid() = user_id);

-- Bids (users can only see bids for their projects)
CREATE POLICY "Users can view bids for their projects"
  ON bids FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bids for their projects"
  ON bids FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update bids for their projects"
  ON bids FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete bids for their projects"
  ON bids FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Email Communications (users can only see their own)
CREATE POLICY "Users can view their own email communications"
  ON email_communications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email communications"
  ON email_communications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email communications"
  ON email_communications FOR UPDATE
  USING (auth.uid() = user_id);

-- User Email Accounts (users can only see their own)
CREATE POLICY "Users can view their own email accounts"
  ON user_email_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own email accounts"
  ON user_email_accounts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Vendor Reviews (users can see all, but only create their own)
CREATE POLICY "Users can view all vendor reviews"
  ON vendor_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reviews"
  ON vendor_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON vendor_reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON vendor_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Bid Items (follow parent bid permissions)
CREATE POLICY "Users can view bid items for their bids"
  ON bid_items FOR SELECT
  USING (
    bid_id IN (
      SELECT id FROM bids WHERE project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can create bid items for their bids"
  ON bid_items FOR INSERT
  WITH CHECK (
    bid_id IN (
      SELECT id FROM bids WHERE project_id IN (
        SELECT id FROM projects WHERE user_id = auth.uid()
      )
    )
  );

-- Email Templates (users can see system templates and their own)
CREATE POLICY "Users can view system templates and their own"
  ON email_templates FOR SELECT
  USING (is_system = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own templates"
  ON email_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can update their own templates"
  ON email_templates FOR UPDATE
  USING (auth.uid() = user_id AND is_system = false);

CREATE POLICY "Users can delete their own templates"
  ON email_templates FOR DELETE
  USING (auth.uid() = user_id AND is_system = false);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bid_requests_updated_at BEFORE UPDATE ON bid_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_communications_updated_at BEFORE UPDATE ON email_communications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_email_accounts_updated_at BEFORE UPDATE ON user_email_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trade_categories_updated_at BEFORE UPDATE ON trade_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Bid Request Summary with Vendor Info
CREATE VIEW bid_request_summary AS
SELECT 
  br.id,
  br.project_id,
  br.user_id,
  br.status,
  br.request_method,
  br.requested_at,
  br.due_date,
  v.name as vendor_name,
  v.email as vendor_email,
  v.phone as vendor_phone,
  v.rating_score,
  tc.name as trade_category_name,
  ARRAY_LENGTH(br.phase_ids, 1) as phase_count,
  br.phase_ids,
  (SELECT COUNT(*) FROM bids WHERE bid_request_id = br.id) as bid_count,
  (SELECT MIN(total_amount) FROM bids WHERE bid_request_id = br.id) as lowest_bid_amount
FROM bid_requests br
LEFT JOIN vendors v ON br.vendor_id = v.id
LEFT JOIN trade_categories tc ON br.trade_category_id = tc.id;

-- View: Vendor Performance Summary
CREATE VIEW vendor_performance_summary AS
SELECT 
  v.id,
  v.user_id,
  v.name,
  v.trade_category_id,
  -- Bid statistics
  COUNT(DISTINCT br.id) as total_requests_sent,
  COUNT(DISTINCT b.id) as total_bids_received,
  COUNT(DISTINCT CASE WHEN b.status = 'accepted' THEN b.id END) as bids_accepted,
  AVG(b.total_amount) as avg_bid_amount,
  -- Review statistics
  COUNT(DISTINCT vr.id) as review_count,
  AVG(vr.overall_rating) as avg_overall_rating,
  AVG(vr.quality_rating) as avg_quality_rating,
  AVG(vr.timeline_rating) as avg_timeline_rating,
  COUNT(DISTINCT CASE WHEN vr.would_recommend THEN vr.id END) as recommend_count
FROM vendors v
LEFT JOIN bid_requests br ON v.id = br.vendor_id
LEFT JOIN bids b ON br.id = b.bid_request_id
LEFT JOIN vendor_reviews vr ON v.id = vr.vendor_id
GROUP BY v.id, v.user_id, v.name, v.trade_category_id;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE trade_categories IS 'Defines contractor types (Plumber, Electrician, etc.) with construction method applicability';
COMMENT ON TABLE vendors IS 'Stores contractor/vendor information with ratings and contact details';
COMMENT ON TABLE bid_requests IS 'Tracks bid requests sent to vendors, supports 3 email methods';
COMMENT ON TABLE bids IS 'Actual bid submissions from vendors with detailed cost breakdowns';
COMMENT ON TABLE email_communications IS 'Tracks all email communications for bid requests across all 3 send methods';
COMMENT ON TABLE user_email_accounts IS 'OAuth tokens for user email accounts (Gmail, Outlook) for Send from My Email option';
COMMENT ON TABLE vendor_reviews IS 'User reviews and ratings of vendors after project completion';
COMMENT ON TABLE bid_items IS 'Links bids to specific budget line items for granular cost tracking';
COMMENT ON TABLE email_templates IS 'Customizable email templates for bid requests';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- USAGE INSTRUCTIONS:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Verify all tables created successfully
-- 3. Test RLS policies by querying as different users
-- 4. Create seed data for testing (optional)
-- 5. Update .env.local with any new environment variables needed for email OAuth

-- SECURITY NOTES:
-- - OAuth tokens must be encrypted before storage (use Supabase Vault or app-level encryption)
-- - Never expose access tokens in API responses
-- - Implement rate limiting for email sending
-- - Validate all user inputs before database insertion

