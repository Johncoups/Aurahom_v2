-- ============================================================================
-- MISSING BIDS TABLES - Run this in Supabase SQL Editor
-- ============================================================================
-- These tables were defined in database-schema-bids.sql but not yet created.
-- ============================================================================

-- ============================================================================
-- TABLE: USER_VENDORS (bridge – links users to vendors, user-specific data)
-- ============================================================================
-- "My vendors": user adds a vendor (existing or new) and stores their own
-- classification, notes, favorites, and how they found them.

CREATE TABLE IF NOT EXISTS user_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,

  trade_category_id UUID REFERENCES trade_categories(id) ON DELETE SET NULL, -- user's classification for this vendor

  -- User-specific
  notes TEXT,
  tags TEXT[],
  preferred_contact_method TEXT DEFAULT 'email',
  contact_hours TEXT,
  found_via TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_user_vendors_user_id ON user_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vendors_vendor_id ON user_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_user_vendors_trade_category ON user_vendors(trade_category_id);
CREATE INDEX IF NOT EXISTS idx_user_vendors_tags ON user_vendors USING GIN(tags);

-- ============================================================================
-- TABLE: PROJECT_VENDORS (bridge – ties vendors to a specific project)
-- ============================================================================
-- "Vendors on this project": which subs are used for this job.

CREATE TABLE IF NOT EXISTS project_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,

  trade_category_id UUID REFERENCES trade_categories(id) ON DELETE SET NULL,

  -- Project-specific
  notes TEXT,
  tags TEXT[],
  preferred_contact_method TEXT DEFAULT 'email',
  found_via TEXT[],
  is_favorite BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  added_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(project_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_project_vendors_project_id ON project_vendors(project_id);
CREATE INDEX IF NOT EXISTS idx_project_vendors_vendor_id ON project_vendors(vendor_id);
CREATE INDEX IF NOT EXISTS idx_project_vendors_trade_category ON project_vendors(trade_category_id);
CREATE INDEX IF NOT EXISTS idx_project_vendors_added_by ON project_vendors(added_by_user_id);

-- ============================================================================
-- ENABLE RLS & POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE user_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_vendors ENABLE ROW LEVEL SECURITY;

-- User Vendors (users see only their own links)
CREATE POLICY "Users can view their own user_vendors"
  ON user_vendors FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own user_vendors"
  ON user_vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own user_vendors"
  ON user_vendors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_vendors"
  ON user_vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Project Vendors (users see only for their projects)
CREATE POLICY "Users can view project_vendors for their projects"
  ON project_vendors FOR SELECT
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create project_vendors for their projects"
  ON project_vendors FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update project_vendors for their projects"
  ON project_vendors FOR UPDATE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete project_vendors for their projects"
  ON project_vendors FOR DELETE
  USING (
    project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
  );

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

CREATE TRIGGER update_user_vendors_updated_at BEFORE UPDATE ON user_vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_vendors_updated_at BEFORE UPDATE ON project_vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_vendors IS 'Bridge: links users to vendors (global "my list") with user-specific notes, trade classification, favorites';
COMMENT ON TABLE project_vendors IS 'Bridge: ties vendors to a specific project; "vendors on this job"';

-- ============================================================================
-- DONE
-- ============================================================================
-- After running this script:
-- 1. Verify tables created: SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_vendors', 'project_vendors');
-- 2. Test the Bids page in your application
-- ============================================================================
