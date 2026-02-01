-- ============================================================================
-- SEED DATA: user_vendors and project_vendors
-- ============================================================================
-- Prerequisites:
-- 1. Run missing-bids-tables.sql (creates user_vendors, project_vendors)
-- 2. vendors table must have rows (at least Chatfield Poured Walls, Johnson Concrete)
-- 3. projects table must have at least one row
-- 4. trade_categories must exist (e.g. Foundation & Concrete)
--
-- IDs used (from seed-bids-test-data.sql / Supabase):
-- - Project: 8f1d56e1-51c6-4d94-bc01-91c06f006a07
-- - User:   201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f
-- - Vendor (Chatfield): 72099694-ae90-4454-b626-55d619b9099b
-- - Vendor (Johnson):   0302f08e-6607-40cd-98ac-6f1ea2a8baee
-- - Trade (Foundation): 05186e0d-03cd-4092-9664-b55daf98612f
-- ============================================================================

-- ============================================================================
-- USER_VENDORS (user's personal vendor list with notes, favorites, etc.)
-- ============================================================================

INSERT INTO user_vendors (
  user_id,
  vendor_id,
  trade_category_id,
  notes,
  preferred_contact_method,
  found_via,
  is_favorite,
  is_active
) VALUES
('201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', '72099694-ae90-4454-b626-55d619b9099b', '05186e0d-03cd-4092-9664-b55daf98612f', 'Great work on previous foundation projects. Recommended by local builder.', 'email', ARRAY['referral', 'google'], true, true),
('201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', '0302f08e-6607-40cd-98ac-6f1ea2a8baee', '05186e0d-03cd-4092-9664-b55daf98612f', 'Competitive pricing. Quick to respond.', 'email', ARRAY['referral'], false, true)
ON CONFLICT (user_id, vendor_id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  notes = EXCLUDED.notes,
  preferred_contact_method = EXCLUDED.preferred_contact_method,
  found_via = EXCLUDED.found_via,
  is_favorite = EXCLUDED.is_favorite,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================================================
-- PROJECT_VENDORS (vendors assigned to this project – "vendors on this job")
-- ============================================================================

INSERT INTO project_vendors (
  project_id,
  vendor_id,
  trade_category_id,
  notes,
  preferred_contact_method,
  found_via,
  is_favorite,
  is_active,
  added_by_user_id
) VALUES
('8f1d56e1-51c6-4d94-bc01-91c06f006a07', '72099694-ae90-4454-b626-55d619b9099b', '05186e0d-03cd-4092-9664-b55daf98612f', 'Requesting bid for pier-and-beam foundation.', 'email', ARRAY['referral'], true, true, '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f'),
('8f1d56e1-51c6-4d94-bc01-91c06f006a07', '0302f08e-6607-40cd-98ac-6f1ea2a8baee', '05186e0d-03cd-4092-9664-b55daf98612f', NULL, 'email', NULL, false, true, '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f')
ON CONFLICT (project_id, vendor_id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  notes = EXCLUDED.notes,
  preferred_contact_method = EXCLUDED.preferred_contact_method,
  found_via = EXCLUDED.found_via,
  is_favorite = EXCLUDED.is_favorite,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- ============================================================================
-- VERIFICATION
-- ============================================================================
-- SELECT uv.*, v.name as vendor_name FROM user_vendors uv JOIN vendors v ON v.id = uv.vendor_id WHERE uv.user_id = '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f';
-- SELECT pv.*, v.name as vendor_name FROM project_vendors pv JOIN vendors v ON v.id = pv.vendor_id WHERE pv.project_id = '8f1d56e1-51c6-4d94-bc01-91c06f006a07';
