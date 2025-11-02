-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR EXISTING TABLES
-- ============================================================================
-- This adds RLS policies to existing tables
-- RLS has already been enabled on all tables - this script just adds the policies
-- ============================================================================

-- ============================================================================
-- TABLE: PROJECTS
-- ============================================================================
-- Users can only access their own projects
-- (RLS already enabled)

-- Select: Users can view their own projects
CREATE POLICY "Users can view their own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Insert: Users can create their own projects
CREATE POLICY "Users can create their own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own projects
CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: BUDGET_ITEMS
-- ============================================================================
-- Users can only access budget items for their own projects
-- (RLS already enabled)

-- Select: Users can view budget items for their own projects
CREATE POLICY "Users can view budget items for their projects"
  ON budget_items FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Insert: Users can create budget items for their own projects
CREATE POLICY "Users can create budget items for their projects"
  ON budget_items FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Update: Users can update budget items for their own projects
CREATE POLICY "Users can update budget items for their projects"
  ON budget_items FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- Delete: Users can delete budget items for their own projects
CREATE POLICY "Users can delete budget items for their projects"
  ON budget_items FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM projects WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: ROADMAP_DATA
-- ============================================================================
-- Users can only access their own roadmap data
-- (RLS already enabled)

-- Select: Users can view their own roadmap data
CREATE POLICY "Users can view their own roadmap data"
  ON roadmap_data FOR SELECT
  USING (auth.uid() = user_id);

-- Insert: Users can create their own roadmap data
CREATE POLICY "Users can create their own roadmap data"
  ON roadmap_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own roadmap data
CREATE POLICY "Users can update their own roadmap data"
  ON roadmap_data FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own roadmap data
CREATE POLICY "Users can delete their own roadmap data"
  ON roadmap_data FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: ROADMAPS
-- ============================================================================
-- Users can only access their own roadmaps
-- (RLS already enabled)

-- Select: Users can view their own roadmaps
CREATE POLICY "Users can view their own roadmaps"
  ON roadmaps FOR SELECT
  USING (auth.uid() = user_id);

-- Insert: Users can create their own roadmaps
CREATE POLICY "Users can create their own roadmaps"
  ON roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own roadmaps
CREATE POLICY "Users can update their own roadmaps"
  ON roadmaps FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own roadmaps
CREATE POLICY "Users can delete their own roadmaps"
  ON roadmaps FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: ROADMAP_PHASES
-- ============================================================================
-- Users can access roadmap phases for their own roadmaps
-- (RLS already enabled)

-- Select: Users can view phases for their own roadmaps
CREATE POLICY "Users can view their roadmap phases"
  ON roadmap_phases FOR SELECT
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Insert: Users can create phases for their own roadmaps
CREATE POLICY "Users can create their roadmap phases"
  ON roadmap_phases FOR INSERT
  WITH CHECK (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Update: Users can update phases for their own roadmaps
CREATE POLICY "Users can update their roadmap phases"
  ON roadmap_phases FOR UPDATE
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Delete: Users can delete phases for their own roadmaps
CREATE POLICY "Users can delete their roadmap phases"
  ON roadmap_phases FOR DELETE
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: ROADMAP_GENERATIONS
-- ============================================================================
-- Users can access roadmap generations for their own roadmaps
-- (RLS already enabled)

-- Select: Users can view generations for their own roadmaps
CREATE POLICY "Users can view their roadmap generations"
  ON roadmap_generations FOR SELECT
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Insert: Users can create generations for their own roadmaps
CREATE POLICY "Users can create their roadmap generations"
  ON roadmap_generations FOR INSERT
  WITH CHECK (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Update: Users can update generations for their own roadmaps
CREATE POLICY "Users can update their roadmap generations"
  ON roadmap_generations FOR UPDATE
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- Delete: Users can delete generations for their own roadmaps
CREATE POLICY "Users can delete their roadmap generations"
  ON roadmap_generations FOR DELETE
  USING (
    roadmap_id IN (
      SELECT id FROM roadmaps WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TABLE: PROJECT_PROFILES
-- ============================================================================
-- Users can only access their own project profiles
-- (RLS already enabled)

-- Select: Users can view their own project profiles
CREATE POLICY "Users can view their own project profiles"
  ON project_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Insert: Users can create their own project profiles
CREATE POLICY "Users can create their own project profiles"
  ON project_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own project profiles
CREATE POLICY "Users can update their own project profiles"
  ON project_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own project profiles
CREATE POLICY "Users can delete their own project profiles"
  ON project_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- TABLE: BASELINE_CONSTRUCTION_PHASES
-- ============================================================================
-- Baseline phases are reference data - read-only for all users
-- (RLS already enabled)

-- Select: All authenticated users can view baseline phases
CREATE POLICY "Authenticated users can view baseline construction phases"
  ON baseline_construction_phases FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies - these are reference data managed by admins

-- ============================================================================
-- TABLE: USERS
-- ============================================================================
-- Users can only access their own user record
-- (RLS already enabled)

-- Select: Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Update: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No INSERT policy - users are created via auth.users, then mirrored
-- No DELETE policy - deletion should be handled by Supabase auth

-- ============================================================================
-- ADDITIONAL TRIGGERS FOR UPDATED_AT
-- ============================================================================
-- Add updated_at triggers to tables that don't have them

-- Projects
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Budget Items  
CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Roadmap Data
CREATE TRIGGER update_roadmap_data_updated_at BEFORE UPDATE ON roadmap_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Roadmaps
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Roadmap Phases
CREATE TRIGGER update_roadmap_phases_updated_at BEFORE UPDATE ON roadmap_phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Roadmap Generations
CREATE TRIGGER update_roadmap_generations_updated_at BEFORE UPDATE ON roadmap_generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Project Profiles
CREATE TRIGGER update_project_profiles_updated_at BEFORE UPDATE ON project_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Users
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ADD MISSING UPDATED_AT COLUMNS (if needed)
-- ============================================================================
-- Run these only if the tables don't already have updated_at columns

-- Check if columns exist first, then add if missing:

-- Projects
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'projects' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Budget Items
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'budget_items' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE budget_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Roadmap Data
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'roadmap_data' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE roadmap_data ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Roadmaps
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'roadmaps' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE roadmaps ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Roadmap Phases
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'roadmap_phases' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE roadmap_phases ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Roadmap Generations
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'roadmap_generations' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE roadmap_generations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Project Profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'project_profiles' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE project_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Users
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these after applying policies to verify they're working

-- Check which tables have RLS enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- NOTES
-- ============================================================================
-- 
-- TABLES COVERED:
-- ✅ projects - User's projects
-- ✅ budget_items - Budget line items (via project ownership)
-- ✅ roadmap_data - Roadmap data (direct user ownership)
-- ✅ roadmaps - Roadmaps (direct user ownership)
-- ✅ roadmap_phases - Phases (via roadmap ownership)
-- ✅ roadmap_generations - Generations (via roadmap ownership)
-- ✅ project_profiles - Project profiles (direct user ownership)
-- ✅ baseline_construction_phases - Reference data (read-only)
-- ✅ users - User profiles (own record only)
--
-- SECURITY MODEL:
-- - Users own their projects directly
-- - Users access related data (budget_items, etc.) through project ownership
-- - Roadmap_data has direct user_id for backward compatibility
-- - Reference tables (baseline_construction_phases) are read-only
--
-- TESTING:
-- 1. Sign in as User A
-- 2. Try to query projects, budget_items, roadmap_data
-- 3. Should only see own data
-- 4. Try to insert/update other user's data
-- 5. Should fail with permission error
--
-- IMPORTANT:
-- - Service role key bypasses RLS (use for admin operations only)
-- - Anon key respects RLS (use in client-side code)
-- - Test thoroughly before deploying to production
--
-- ============================================================================

