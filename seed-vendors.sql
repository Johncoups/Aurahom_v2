-- ============================================================================
-- SEED DATA: VENDORS TABLE
-- ============================================================================
-- Comprehensive vendor seed data including:
-- - One contractor for each trade category
-- - Suppliers for materials needed at each phase
-- - Equipment rental companies
-- All vendors linked to appropriate trade_category_id
-- ============================================================================

-- User ID for user_id (the individual who entered the vendor)
-- 201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f

-- ============================================================================
-- CONTRACTORS BY TRADE CATEGORY
-- ============================================================================

-- 1. Professional Services (Architects, Engineers, Designers)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000001-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Professional Services'),
 'Michael Torres', 'Torres Architecture & Design', 'michael@torresarchitecture.com', '(555) 101-0001', 'https://torresarchitecture.com', 'Austin', 'TX', '78701', 
 ARRAY['Architectural Design', 'Residential Plans', 'Barndominium Design', 'Permitting Support'],
 ARRAY['Barndominiums', 'Custom Homes', 'Rural Properties'],
 true, true, 'Google', 4.9, 127),

('a0000001-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Professional Services'),
 'Sarah Chen', 'Chen Structural Engineering', 'sarah@chenengineering.com', '(555) 101-0002', 'https://chenengineering.com', 'Houston', 'TX', '77002',
 ARRAY['Structural Engineering', 'Foundation Design', 'Steel Design', 'Load Calculations'],
 ARRAY['Post-Frame Structures', 'Metal Buildings', 'Residential'],
 true, true, 'Google', 4.8, 89)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 2. Site Work & Excavation
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000002-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'James Miller', 'Miller Excavation & Grading', 'james@millerexcavation.com', '(555) 102-0001', 'https://millerexcavation.com', 'Round Rock', 'TX', '78664',
 ARRAY['Excavation', 'Grading', 'Land Clearing', 'Drainage', 'Pond Construction'],
 ARRAY['Rural Sites', 'Large Acreage', 'Difficult Terrain'],
 true, true, 'Thumbtack', 4.7, 156),

('a0000002-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'Robert Johnson', 'Johnson Septic Systems', 'robert@johnsonseptic.com', '(555) 102-0002', 'https://johnsonseptic.com', 'Georgetown', 'TX', '78626',
 ARRAY['Septic Installation', 'Septic Design', 'Aerobic Systems', 'Septic Repair'],
 ARRAY['Aerobic Systems', 'Large Capacity', 'Commercial'],
 true, true, 'Google', 4.6, 203),

('a0000002-0001-4000-8000-000000000003', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'David Williams', 'Williams Well Drilling', 'david@williamswells.com', '(555) 102-0003', 'https://williamswells.com', 'Dripping Springs', 'TX', '78620',
 ARRAY['Well Drilling', 'Pump Installation', 'Well Testing', 'Water Treatment'],
 ARRAY['Deep Wells', 'Low-Yield Solutions', 'Rural Properties'],
 true, true, 'HomeAdvisor', 4.8, 78)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 3. Foundation & Concrete
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000003-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
 'Carlos Garcia', 'Garcia Concrete & Foundation', 'carlos@garciafoundation.com', '(555) 103-0001', 'https://garciafoundation.com', 'San Antonio', 'TX', '78201',
 ARRAY['Slab Foundations', 'Pier and Beam', 'Concrete Flatwork', 'Footings', 'Retaining Walls'],
 ARRAY['Post-Tension Slabs', 'Large Slabs', 'Stamped Concrete'],
 true, true, 'Google', 4.9, 312),

('a0000003-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
 'Miguel Rodriguez', 'Rodriguez Concrete Pumping', 'miguel@rodriguezpumping.com', '(555) 103-0002', 'https://rodriguezpumping.com', 'Austin', 'TX', '78745',
 ARRAY['Concrete Pumping', 'Boom Pumping', 'Line Pumping'],
 ARRAY['Residential', 'Hard-to-Access Sites'],
 true, true, 'Yelp', 4.7, 45)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 4. Post-Frame Builder
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000004-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Post-Frame Builder'),
 'Billy Thompson', 'Thompson Post-Frame Builders', 'billy@thompsonpostframe.com', '(555) 104-0001', 'https://thompsonpostframe.com', 'Waco', 'TX', '76701',
 ARRAY['Post-Frame Construction', 'Barndominium Shells', 'Agricultural Buildings', 'Workshops'],
 ARRAY['Barndominiums', 'Large Clear Spans', 'Custom Designs'],
 true, true, 'Google', 4.8, 234),

('a0000004-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Post-Frame Builder'),
 'Wayne Nelson', 'Nelson Metal Buildings', 'wayne@nelsonmetal.com', '(555) 104-0002', 'https://nelsonmetalbuildings.com', 'Temple', 'TX', '76501',
 ARRAY['Metal Building Erection', 'Steel Framing', 'Pre-Engineered Buildings'],
 ARRAY['Commercial', 'Agricultural', 'Residential Metal'],
 true, true, 'BBB', 4.6, 167)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 5. ICF Installer
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000005-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'ICF Installer'),
 'Steven Anderson', 'Anderson ICF Construction', 'steven@andersonicf.com', '(555) 105-0001', 'https://andersonicf.com', 'Dallas', 'TX', '75201',
 ARRAY['ICF Installation', 'ICF Foundations', 'Above-Grade ICF Walls', 'Energy-Efficient Building'],
 ARRAY['Nudura', 'Fox Blocks', 'Logix'],
 true, true, 'Google', 4.9, 56)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 6. SIP Installer
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000006-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'SIP Installer'),
 'Kevin White', 'White SIP Solutions', 'kevin@whitesip.com', '(555) 106-0001', 'https://whitesipsolutions.com', 'Fort Worth', 'TX', '76102',
 ARRAY['SIP Panel Installation', 'SIP Design', 'Energy-Efficient Construction'],
 ARRAY['Premier SIPs', 'Insulspan', 'Thermocore'],
 true, true, 'Houzz', 4.8, 42)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 7. Modular Home Dealer
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000007-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Modular Home Dealer'),
 'Patricia Brown', 'Texas Modular Homes', 'patricia@texasmodular.com', '(555) 107-0001', 'https://texasmodularhomes.com', 'San Marcos', 'TX', '78666',
 ARRAY['Modular Home Sales', 'Delivery & Set', 'Foundation Coordination', 'Finish Work'],
 ARRAY['Clayton Homes', 'Palm Harbor', 'Champion Homes'],
 true, true, 'Google', 4.5, 189)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 8. Framing Contractor
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000008-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Framing Contractor'),
 'Jose Martinez', 'Martinez Framing', 'jose@martinezframing.com', '(555) 108-0001', 'https://martinezframing.com', 'Austin', 'TX', '78748',
 ARRAY['Wood Framing', 'Stick-Built Construction', 'Deck Framing', 'Roof Framing'],
 ARRAY['Custom Homes', 'Complex Roof Lines', 'Large Homes'],
 true, true, 'Thumbtack', 4.7, 278),

('a0000008-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Framing Contractor'),
 'Antonio Lopez', 'Lopez Framing Crew', 'antonio@lopezframing.com', '(555) 108-0002', 'https://lopezframing.com', 'Kyle', 'TX', '78640',
 ARRAY['Residential Framing', 'Commercial Framing', 'Metal Stud Framing'],
 ARRAY['Production Homes', 'Fast Turnaround'],
 true, true, 'Google', 4.6, 145)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 9. Roofing
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000009-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Roofing'),
 'Mark Davis', 'Davis Roofing', 'mark@davisroofing.com', '(555) 109-0001', 'https://davisroofing.com', 'Austin', 'TX', '78758',
 ARRAY['Shingle Roofing', 'Metal Roofing', 'Flat Roofing', 'Roof Repair'],
 ARRAY['Standing Seam Metal', 'Architectural Shingles', 'Storm Damage'],
 true, true, 'Google', 4.8, 456),

('a0000009-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Roofing'),
 'Chris Wilson', 'Wilson Metal Roofing', 'chris@wilsonmetalroof.com', '(555) 109-0002', 'https://wilsonmetalroofing.com', 'New Braunfels', 'TX', '78130',
 ARRAY['Metal Roofing', 'Standing Seam', 'R-Panel', 'Corrugated Metal'],
 ARRAY['Agricultural', 'Barndominiums', 'Commercial'],
 true, true, 'Houzz', 4.9, 198)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 10. Plumbing
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000010-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Plumbing'),
 'Richard Taylor', 'Taylor Plumbing', 'richard@taylorplumbing.com', '(555) 110-0001', 'https://taylorplumbing.com', 'Austin', 'TX', '78704',
 ARRAY['New Construction Plumbing', 'Under-Slab Plumbing', 'Rough-In', 'Finish Plumbing', 'Water Heaters'],
 ARRAY['Tankless Water Heaters', 'PEX Systems', 'Gas Lines'],
 true, true, 'Google', 4.7, 523),

('a0000010-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Plumbing'),
 'Thomas Moore', 'Moore Plumbing Services', 'thomas@mooreplumbing.com', '(555) 110-0002', 'https://mooreplumbing.com', 'Pflugerville', 'TX', '78660',
 ARRAY['Residential Plumbing', 'Remodels', 'Service & Repair'],
 ARRAY['Fixture Installation', 'Bathroom Remodels'],
 true, true, 'Yelp', 4.6, 234)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 11. Electrical
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000011-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Electrical'),
 'Daniel Jackson', 'Jackson Electric', 'daniel@jacksonelectric.com', '(555) 111-0001', 'https://jacksonelectric.com', 'Austin', 'TX', '78731',
 ARRAY['New Construction Electrical', 'Rough-In', 'Panel Upgrades', 'Finish Electrical', 'Generator Installation'],
 ARRAY['Smart Home Wiring', 'Solar Ready', 'Whole-House Generators'],
 true, true, 'Google', 4.8, 389),

('a0000011-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Electrical'),
 'Brian Harris', 'Harris Electrical Contractors', 'brian@harriselectrical.com', '(555) 111-0002', 'https://harriselectrical.com', 'Cedar Park', 'TX', '78613',
 ARRAY['Commercial Electrical', 'Residential Electrical', 'EV Charger Installation'],
 ARRAY['Large Homes', 'Commercial', 'Industrial'],
 true, true, 'Angi', 4.7, 267)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 12. HVAC
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000012-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'HVAC'),
 'Paul Clark', 'Clark Heating & Air', 'paul@clarkair.com', '(555) 112-0001', 'https://clarkheatingandair.com', 'Austin', 'TX', '78759',
 ARRAY['HVAC Installation', 'Ductwork', 'Mini-Splits', 'Heat Pumps', 'HVAC Service'],
 ARRAY['High-Efficiency Systems', 'Zoned Systems', 'Mini-Splits'],
 true, true, 'Google', 4.8, 445),

('a0000012-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'HVAC'),
 'George Lewis', 'Lewis HVAC Solutions', 'george@lewishvac.com', '(555) 112-0002', 'https://lewishvac.com', 'Round Rock', 'TX', '78681',
 ARRAY['New Construction HVAC', 'System Replacement', 'Duct Cleaning'],
 ARRAY['Geothermal', 'Large Capacity Systems'],
 true, true, 'HomeAdvisor', 4.6, 178)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 13. Exterior Finishes (Siding, Windows, Doors)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000013-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Exterior Finishes'),
 'Ryan Walker', 'Walker Exteriors', 'ryan@walkerexteriors.com', '(555) 113-0001', 'https://walkerexteriors.com', 'Austin', 'TX', '78757',
 ARRAY['Siding Installation', 'Window Installation', 'Door Installation', 'Soffit & Fascia'],
 ARRAY['Hardie Board', 'LP SmartSide', 'Metal Siding'],
 true, true, 'Google', 4.7, 234),

('a0000013-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Exterior Finishes'),
 'Eric Hall', 'Texas Windows & Doors', 'eric@texaswindows.com', '(555) 113-0002', 'https://texaswindowsanddoors.com', 'San Antonio', 'TX', '78205',
 ARRAY['Window Installation', 'Entry Doors', 'Patio Doors', 'Garage Doors'],
 ARRAY['Energy-Efficient Windows', 'Impact-Resistant', 'Custom Sizes'],
 true, true, 'Houzz', 4.8, 312)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 14. Insulation
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000014-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Insulation'),
 'Scott Allen', 'Allen Insulation', 'scott@alleninsulation.com', '(555) 114-0001', 'https://alleninsulation.com', 'Austin', 'TX', '78753',
 ARRAY['Spray Foam Insulation', 'Batt Insulation', 'Blown-In Insulation', 'Air Sealing'],
 ARRAY['Closed-Cell Spray Foam', 'Open-Cell Spray Foam', 'Metal Buildings'],
 true, true, 'Google', 4.9, 287),

('a0000014-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Insulation'),
 'Jeff Young', 'Young Energy Solutions', 'jeff@youngenergy.com', '(555) 114-0002', 'https://youngenergy.com', 'Georgetown', 'TX', '78628',
 ARRAY['Insulation', 'Energy Audits', 'Weatherization'],
 ARRAY['Retrofits', 'Energy Efficiency'],
 true, true, 'Angi', 4.6, 145)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 15. Drywall
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000015-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Drywall'),
 'Frank King', 'King Drywall', 'frank@kingdrywall.com', '(555) 115-0001', 'https://kingdrywall.com', 'Austin', 'TX', '78741',
 ARRAY['Drywall Hanging', 'Drywall Finishing', 'Texture', 'Repairs'],
 ARRAY['Level 5 Finish', 'Knockdown Texture', 'High Ceilings'],
 true, true, 'Google', 4.7, 198),

('a0000015-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Drywall'),
 'Raymond Wright', 'Wright Drywall Services', 'raymond@wrightdrywall.com', '(555) 115-0002', 'https://wrightdrywall.com', 'Hutto', 'TX', '78634',
 ARRAY['Drywall Installation', 'Taping & Finishing', 'Acoustic Ceilings'],
 ARRAY['Commercial', 'Large Projects'],
 true, true, 'Thumbtack', 4.5, 89)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 16. Trim Carpentry
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000016-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Trim Carpentry'),
 'Dennis Scott', 'Scott Trim & Millwork', 'dennis@scotttrim.com', '(555) 116-0001', 'https://scotttrimandmillwork.com', 'Austin', 'TX', '78746',
 ARRAY['Trim Carpentry', 'Crown Molding', 'Wainscoting', 'Built-Ins', 'Stair Rails'],
 ARRAY['Custom Millwork', 'Coffered Ceilings', 'High-End Finishes'],
 true, true, 'Houzz', 4.9, 156),

('a0000016-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Trim Carpentry'),
 'Larry Green', 'Green Carpentry', 'larry@greencarpentry.com', '(555) 116-0002', 'https://greencarpentry.com', 'Dripping Springs', 'TX', '78619',
 ARRAY['Interior Trim', 'Door Installation', 'Closet Systems'],
 ARRAY['Production Work', 'Efficient Installation'],
 true, true, 'Google', 4.6, 234)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 17. Painting
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000017-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Painting'),
 'Jerry Adams', 'Adams Painting', 'jerry@adamspainting.com', '(555) 117-0001', 'https://adamspainting.com', 'Austin', 'TX', '78702',
 ARRAY['Interior Painting', 'Exterior Painting', 'Cabinet Painting', 'Staining'],
 ARRAY['New Construction', 'High-End Finishes', 'Color Consulting'],
 true, true, 'Google', 4.8, 567),

('a0000017-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Painting'),
 'Terry Baker', 'Baker Pro Painting', 'terry@bakerpropainting.com', '(555) 117-0002', 'https://bakerpropainting.com', 'Buda', 'TX', '78610',
 ARRAY['Residential Painting', 'Commercial Painting', 'Pressure Washing'],
 ARRAY['Fast Turnaround', 'Large Projects'],
 true, true, 'Yelp', 4.6, 289)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 18. Flooring
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000018-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Flooring'),
 'Roger Nelson', 'Nelson Flooring', 'roger@nelsonflooring.com', '(555) 118-0001', 'https://nelsonflooring.com', 'Austin', 'TX', '78749',
 ARRAY['Hardwood Installation', 'LVP Installation', 'Tile Installation', 'Carpet Installation'],
 ARRAY['Hardwood', 'Large Format Tile', 'Luxury Vinyl'],
 true, true, 'Google', 4.8, 412),

('a0000018-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Flooring'),
 'Keith Carter', 'Carter Tile & Stone', 'keith@cartertile.com', '(555) 118-0002', 'https://cartertileandstone.com', 'Lakeway', 'TX', '78734',
 ARRAY['Tile Installation', 'Stone Installation', 'Shower Tile', 'Backsplash'],
 ARRAY['Natural Stone', 'Large Format', 'Custom Patterns'],
 true, true, 'Houzz', 4.9, 198)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 19. Cabinets & Countertops
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000019-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Cabinets & Countertops'),
 'Harold Mitchell', 'Mitchell Cabinet Shop', 'harold@mitchellcabinets.com', '(555) 119-0001', 'https://mitchellcabinetshop.com', 'Austin', 'TX', '78756',
 ARRAY['Custom Cabinets', 'Cabinet Installation', 'Closet Systems', 'Built-In Furniture'],
 ARRAY['Custom Design', 'Solid Wood', 'Modern Styles'],
 true, true, 'Houzz', 4.9, 234),

('a0000019-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Cabinets & Countertops'),
 'Gerald Perez', 'Texas Granite & Stone', 'gerald@texasgranite.com', '(555) 119-0002', 'https://texasgraniteandstone.com', 'Austin', 'TX', '78728',
 ARRAY['Countertop Fabrication', 'Countertop Installation', 'Stone Selection'],
 ARRAY['Granite', 'Quartz', 'Quartzite', 'Marble'],
 true, true, 'Google', 4.8, 567)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 20. Decks & Outdoor
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000020-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Decks & Outdoor'),
 'Alan Roberts', 'Roberts Deck & Patio', 'alan@robertsdeck.com', '(555) 120-0001', 'https://robertsdeckandpatio.com', 'Austin', 'TX', '78733',
 ARRAY['Deck Building', 'Porch Construction', 'Pergolas', 'Outdoor Kitchens'],
 ARRAY['Composite Decking', 'Trex', 'TimberTech', 'Cedar'],
 true, true, 'Houzz', 4.8, 289),

('a0000020-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Decks & Outdoor'),
 'Bruce Turner', 'Turner Outdoor Living', 'bruce@turneroutdoor.com', '(555) 120-0002', 'https://turneroutdoorliving.com', 'Bee Cave', 'TX', '78738',
 ARRAY['Outdoor Living Spaces', 'Pool Decks', 'Covered Patios', 'Fencing'],
 ARRAY['High-End Outdoor', 'Pool Areas', 'Entertainment Spaces'],
 true, true, 'Google', 4.7, 178)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- 21. Final Finishes (Cleaning, Hardware, etc.)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('a0000021-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Final Finishes'),
 'Diana Phillips', 'Phillips Construction Cleaning', 'diana@phillipscleaning.com', '(555) 121-0001', 'https://phillipscleaning.com', 'Austin', 'TX', '78752',
 ARRAY['Post-Construction Cleaning', 'Final Clean', 'Window Cleaning', 'Pressure Washing'],
 ARRAY['New Construction', 'Detailed Cleaning', 'Move-In Ready'],
 true, true, 'Google', 4.7, 312),

('a0000021-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Final Finishes'),
 'Nancy Evans', 'Sparkle Clean Services', 'nancy@sparkleclean.com', '(555) 121-0002', 'https://sparklecleanservices.com', 'Round Rock', 'TX', '78665',
 ARRAY['Construction Cleaning', 'Office Cleaning', 'Deep Cleaning'],
 ARRAY['Large Projects', 'Fast Turnaround'],
 true, true, 'Yelp', 4.5, 189)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();


-- ============================================================================
-- SUPPLIERS BY CATEGORY (linked to trades they support)
-- ============================================================================

-- Lumber & Building Materials Supplier (supports Framing Contractor)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000001-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Framing Contractor'),
 'McCoy Building Supply', 'McCoy Building Supply', 'sales@mccoys.com', '(555) 201-0001', 'https://mccoys.com', 'San Marcos', 'TX', '78666',
 ARRAY['Lumber', 'Building Materials', 'Hardware', 'Tools', 'Delivery'],
 ARRAY['Contractor Accounts', 'Large Orders', 'Custom Millwork'],
 true, true, 'Google', 4.6, 456),

('b0000001-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Framing Contractor'),
 '84 Lumber', '84 Lumber', 'austin@84lumber.com', '(555) 201-0002', 'https://84lumber.com', 'Austin', 'TX', '78744',
 ARRAY['Lumber', 'Trusses', 'Engineered Wood', 'Doors', 'Windows'],
 ARRAY['Framing Packages', 'Custom Orders', 'Delivery'],
 true, true, 'Google', 4.5, 234),

('b0000001-0001-4000-8000-000000000003', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Framing Contractor'),
 'BMC Building Materials', 'BMC Building Materials', 'austin@buildwithbmc.com', '(555) 201-0003', 'https://buildwithbmc.com', 'Pflugerville', 'TX', '78660',
 ARRAY['Lumber', 'Trusses', 'Windows', 'Doors', 'Millwork'],
 ARRAY['Builder Programs', 'Large Volume', 'Just-In-Time Delivery'],
 true, true, 'BBB', 4.4, 123)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Concrete Supplier (supports Foundation & Concrete)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000002-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
 'Texas Concrete Ready Mix', 'Texas Concrete Ready Mix', 'orders@texasconcrete.com', '(555) 202-0001', 'https://texasconcretereadymix.com', 'Austin', 'TX', '78725',
 ARRAY['Ready Mix Concrete', 'Specialty Concrete', 'Same-Day Delivery'],
 ARRAY['Residential', 'Commercial', 'Large Pours'],
 true, true, 'Google', 4.7, 189),

('b0000002-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
 'Martin Marietta Materials', 'Martin Marietta', 'austin@martinmarietta.com', '(555) 202-0002', 'https://martinmarietta.com', 'Austin', 'TX', '78719',
 ARRAY['Ready Mix', 'Aggregates', 'Sand', 'Gravel'],
 ARRAY['Large Volume', 'Commercial', 'Infrastructure'],
 true, true, 'BBB', 4.5, 78)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Roofing Material Supplier (supports Roofing)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000003-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Roofing'),
 'ABC Supply Co.', 'ABC Supply Co.', 'austin@abcsupply.com', '(555) 203-0001', 'https://abcsupply.com', 'Austin', 'TX', '78754',
 ARRAY['Roofing Materials', 'Siding', 'Windows', 'Gutters', 'Tools'],
 ARRAY['Metal Roofing', 'Shingles', 'Commercial Roofing'],
 true, true, 'Google', 4.6, 345),

('b0000003-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Roofing'),
 'Beacon Building Products', 'Beacon Building Products', 'austin@becn.com', '(555) 203-0002', 'https://becn.com', 'San Antonio', 'TX', '78219',
 ARRAY['Roofing', 'Siding', 'Waterproofing', 'Insulation'],
 ARRAY['Contractor Programs', 'Fast Delivery'],
 true, true, 'BBB', 4.4, 167)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Plumbing Supply (supports Plumbing)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000004-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Plumbing'),
 'Ferguson Enterprises', 'Ferguson Plumbing Supply', 'austin@ferguson.com', '(555) 204-0001', 'https://ferguson.com', 'Austin', 'TX', '78758',
 ARRAY['Plumbing Supplies', 'Fixtures', 'Water Heaters', 'Pipe & Fittings'],
 ARRAY['Showroom', 'Contractor Accounts', 'Special Orders'],
 true, true, 'Google', 4.7, 234),

('b0000004-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Plumbing'),
 'Coburn Supply Company', 'Coburn Supply', 'austin@coburns.com', '(555) 204-0002', 'https://coburns.com', 'Austin', 'TX', '78745',
 ARRAY['Plumbing', 'HVAC', 'Electrical', 'PVF'],
 ARRAY['Contractor Focus', 'Technical Support'],
 true, true, 'Google', 4.5, 156)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Electrical Supply (supports Electrical)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000005-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Electrical'),
 'Graybar Electric', 'Graybar Electric', 'austin@graybar.com', '(555) 205-0001', 'https://graybar.com', 'Austin', 'TX', '78753',
 ARRAY['Electrical Supplies', 'Lighting', 'Wire & Cable', 'Automation'],
 ARRAY['Contractor Accounts', 'Project Support', 'Specialty Products'],
 true, true, 'Google', 4.6, 189),

('b0000005-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Electrical'),
 'Consolidated Electrical Distributors', 'CED Austin', 'austin@cedaustin.com', '(555) 205-0002', 'https://cedaustin.com', 'Austin', 'TX', '78757',
 ARRAY['Electrical Supplies', 'Lighting', 'Data/Comm', 'Solar'],
 ARRAY['Residential', 'Commercial', 'Solar Equipment'],
 true, true, 'BBB', 4.5, 123)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- HVAC Supply (supports HVAC)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000006-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'HVAC'),
 'Johnstone Supply', 'Johnstone Supply Austin', 'austin@johnstonesupply.com', '(555) 206-0001', 'https://johnstonesupply.com', 'Austin', 'TX', '78752',
 ARRAY['HVAC Equipment', 'Refrigeration', 'Parts & Supplies', 'Tools'],
 ARRAY['Mini-Splits', 'Heat Pumps', 'Contractor Training'],
 true, true, 'Google', 4.7, 267),

('b0000006-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'HVAC'),
 'Carrier Enterprise', 'Carrier Enterprise', 'austin@carrierenterprise.com', '(555) 206-0002', 'https://carrierenterprise.com', 'Round Rock', 'TX', '78681',
 ARRAY['HVAC Systems', 'Parts', 'Supplies', 'Training'],
 ARRAY['Carrier', 'Bryant', 'Payne'],
 true, true, 'BBB', 4.5, 145)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Insulation Supplier (supports Insulation)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000007-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Insulation'),
 'SPI - Service Partners', 'Service Partners Austin', 'austin@servicepartners.com', '(555) 207-0001', 'https://servicepartners.com', 'Austin', 'TX', '78744',
 ARRAY['Spray Foam Systems', 'Batt Insulation', 'Blown-In', 'Equipment'],
 ARRAY['Spray Foam', 'Contractor Training', 'Equipment Sales'],
 true, true, 'Google', 4.6, 89),

('b0000007-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Insulation'),
 'IDI Distributors', 'IDI Distributors', 'austin@idi-distributors.com', '(555) 207-0002', 'https://idi-distributors.com', 'San Antonio', 'TX', '78216',
 ARRAY['Insulation', 'Fiberglass', 'Cellulose', 'Foam'],
 ARRAY['Large Volume', 'Contractor Programs'],
 true, true, 'BBB', 4.4, 67)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Drywall Supplier (supports Drywall)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000008-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Drywall'),
 'L&W Supply', 'L&W Supply Austin', 'austin@lwsupply.com', '(555) 208-0001', 'https://lwsupply.com', 'Austin', 'TX', '78741',
 ARRAY['Drywall', 'Steel Studs', 'Acoustical Ceilings', 'Finishing Products'],
 ARRAY['Delivery', 'Boom Truck', 'Contractor Accounts'],
 true, true, 'Google', 4.6, 178),

('b0000008-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Drywall'),
 'Foundation Building Materials', 'Foundation Building Materials', 'austin@fbmsales.com', '(555) 208-0002', 'https://fbmsales.com', 'Pflugerville', 'TX', '78660',
 ARRAY['Drywall', 'Roofing', 'Siding', 'Stucco'],
 ARRAY['Full-Service Delivery', 'Large Projects'],
 true, true, 'BBB', 4.5, 134)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Paint Supplier (supports Painting)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000009-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Painting'),
 'Sherwin-Williams', 'Sherwin-Williams Austin', 'austin@sherwin.com', '(555) 209-0001', 'https://sherwin-williams.com', 'Austin', 'TX', '78756',
 ARRAY['Paint', 'Stains', 'Coatings', 'Applicators', 'Color Matching'],
 ARRAY['Contractor Accounts', 'Color Consulting', 'Large Orders'],
 true, true, 'Google', 4.7, 567),

('b0000009-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Painting'),
 'Benjamin Moore', 'Austin Paint & Paper', 'sales@austinpaint.com', '(555) 209-0002', 'https://austinpaintandpaper.com', 'Austin', 'TX', '78703',
 ARRAY['Paint', 'Wallpaper', 'Supplies', 'Color Services'],
 ARRAY['Premium Paints', 'Design Support'],
 true, true, 'Google', 4.8, 234)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Flooring Supplier (supports Flooring)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000010-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Flooring'),
 'Floor & Decor', 'Floor & Decor Austin', 'austin@flooranddecor.com', '(555) 210-0001', 'https://flooranddecor.com', 'Austin', 'TX', '78759',
 ARRAY['Tile', 'Hardwood', 'LVP', 'Stone', 'Installation Materials'],
 ARRAY['Large Selection', 'Contractor Pricing', 'Design Services'],
 true, true, 'Google', 4.5, 678),

('b0000010-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Flooring'),
 'MS International', 'MSI Austin', 'austin@msisurfaces.com', '(555) 210-0002', 'https://msisurfaces.com', 'Austin', 'TX', '78728',
 ARRAY['Tile', 'Natural Stone', 'LVT', 'Countertops', 'Hardscaping'],
 ARRAY['Premium Products', 'Design Trends', 'Contractor Focus'],
 true, true, 'Houzz', 4.6, 345)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Cabinet & Countertop Supplier (supports Cabinets & Countertops)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000011-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Cabinets & Countertops'),
 'Cabinets To Go', 'Cabinets To Go Austin', 'austin@cabinetstogo.com', '(555) 211-0001', 'https://cabinetstogo.com', 'Austin', 'TX', '78757',
 ARRAY['Stock Cabinets', 'Semi-Custom Cabinets', 'Design Services'],
 ARRAY['Quick Delivery', 'Affordable Options', 'Professional Quality'],
 true, true, 'Google', 4.4, 234),

('b0000011-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Cabinets & Countertops'),
 'Arizona Tile', 'Arizona Tile Austin', 'austin@arizonatile.com', '(555) 211-0002', 'https://arizonatile.com', 'Austin', 'TX', '78758',
 ARRAY['Countertops', 'Tile', 'Stone Slabs', 'Mosaics'],
 ARRAY['Natural Stone', 'Quartz', 'Porcelain Slabs'],
 true, true, 'Houzz', 4.7, 189)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Hardware & Fixtures Supplier (supports Final Finishes)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000012-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Final Finishes'),
 'Build.com / Ferguson', 'Build.com Austin Showroom', 'austin@build.com', '(555) 212-0001', 'https://build.com', 'Austin', 'TX', '78731',
 ARRAY['Plumbing Fixtures', 'Lighting', 'Hardware', 'Appliances'],
 ARRAY['Designer Brands', 'Showroom', 'Builder Programs'],
 true, true, 'Google', 4.6, 456),

('b0000012-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Final Finishes'),
 'Hardware Resources', 'Hardware Resources', 'sales@hardwareresources.com', '(555) 212-0002', 'https://hardwareresources.com', 'Dallas', 'TX', '75234',
 ARRAY['Cabinet Hardware', 'Functional Hardware', 'Decorative Hardware'],
 ARRAY['Bulk Orders', 'Contractor Pricing', 'Fast Shipping'],
 true, true, 'BBB', 4.5, 123)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Window & Door Supplier (supports Exterior Finishes)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000013-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Exterior Finishes'),
 'Pella Windows & Doors', 'Pella Austin', 'austin@pella.com', '(555) 213-0001', 'https://pella.com', 'Austin', 'TX', '78759',
 ARRAY['Windows', 'Entry Doors', 'Patio Doors', 'Installation'],
 ARRAY['Energy-Efficient', 'Custom Sizes', 'Showroom'],
 true, true, 'Google', 4.7, 345),

('b0000013-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Exterior Finishes'),
 'Andersen Windows', 'Renewal by Andersen Austin', 'austin@andersenwindows.com', '(555) 213-0002', 'https://andersenwindows.com', 'Austin', 'TX', '78752',
 ARRAY['Windows', 'Doors', 'Replacement Windows'],
 ARRAY['Premium Quality', 'Energy Star', 'Custom Options'],
 true, true, 'Google', 4.6, 267)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Trim & Millwork Supplier (supports Trim Carpentry)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000014-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Trim Carpentry'),
 'Metrie Millwork', 'Metrie Austin', 'austin@metrie.com', '(555) 214-0001', 'https://metrie.com', 'Austin', 'TX', '78744',
 ARRAY['Trim', 'Moldings', 'Interior Doors', 'Columns', 'Stair Parts'],
 ARRAY['Custom Profiles', 'Large Selection', 'Contractor Programs'],
 true, true, 'Google', 4.6, 123),

('b0000014-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Trim Carpentry'),
 'WindsorONE', 'WindsorONE Texas', 'texas@windsorone.com', '(555) 214-0002', 'https://windsorone.com', 'Houston', 'TX', '77001',
 ARRAY['Trim Boards', 'Shiplap', 'S4S Boards', 'Custom Millwork'],
 ARRAY['Protected Trim', 'High-End Projects'],
 true, true, 'Houzz', 4.7, 89)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();

-- Decking Supplier (supports Decks & Outdoor)
INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('b0000015-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Decks & Outdoor'),
 'Trex Pro Dealer', 'Austin Decking Supply', 'sales@austindecking.com', '(555) 215-0001', 'https://austindeckingsupply.com', 'Austin', 'TX', '78745',
 ARRAY['Composite Decking', 'Railing Systems', 'Deck Hardware', 'Fasteners'],
 ARRAY['Trex', 'TimberTech', 'Fiberon'],
 true, true, 'Google', 4.6, 145),

('b0000015-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Decks & Outdoor'),
 'Capitol Cedar', 'Capitol Cedar & Lumber', 'sales@capitolcedar.com', '(555) 215-0002', 'https://capitolcedar.com', 'Austin', 'TX', '78757',
 ARRAY['Cedar Decking', 'Fence Materials', 'Pergola Kits', 'Outdoor Lumber'],
 ARRAY['Natural Wood', 'Premium Cedar', 'Custom Cuts'],
 true, true, 'Yelp', 4.5, 98)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();


-- ============================================================================
-- EQUIPMENT RENTAL COMPANIES (supports Site Work & Excavation)
-- ============================================================================

INSERT INTO vendors (id, user_id, trade_category_id, name, company_name, email, phone, website, city, state, zip_code, services_offered, specialties, licensed, insured, rating_platform, rating_score, rating_reviews)
VALUES 
('c0000001-0001-4000-8000-000000000001', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'United Rentals', 'United Rentals Austin', 'austin@unitedrentals.com', '(555) 301-0001', 'https://unitedrentals.com', 'Austin', 'TX', '78744',
 ARRAY['Equipment Rental', 'Tool Rental', 'Delivery', 'Operator Training'],
 ARRAY['Heavy Equipment', 'Aerial Lifts', 'Earthmoving'],
 true, true, 'Google', 4.5, 234),

('c0000001-0001-4000-8000-000000000002', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'Sunbelt Rentals', 'Sunbelt Rentals Austin', 'austin@sunbeltrentals.com', '(555) 301-0002', 'https://sunbeltrentals.com', 'Round Rock', 'TX', '78681',
 ARRAY['Equipment Rental', 'Tools', 'Climate Control', 'Flooring Equipment'],
 ARRAY['Wide Selection', 'Contractor Accounts', 'Delivery'],
 true, true, 'Google', 4.4, 189),

('c0000001-0001-4000-8000-000000000003', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'ACME Tool & Equipment', 'ACME Tool Rental', 'rentals@acmetool.com', '(555) 301-0003', 'https://acmetoolrental.com', 'Austin', 'TX', '78757',
 ARRAY['Tool Rental', 'Small Equipment', 'Concrete Tools', 'Landscaping Equipment'],
 ARRAY['Local Service', 'Competitive Rates', 'Homeowner Friendly'],
 true, true, 'Yelp', 4.6, 145),

('c0000001-0001-4000-8000-000000000004', '201f3ed8-13cb-4afe-a6c8-bbbd6ce39a9f', 
 (SELECT id FROM trade_categories WHERE name = 'Site Work & Excavation'),
 'Herc Rentals', 'Herc Rentals Austin', 'austin@hercrentals.com', '(555) 301-0004', 'https://hercrentals.com', 'Austin', 'TX', '78753',
 ARRAY['Heavy Equipment', 'Trucks', 'Compaction Equipment', 'Trenchers'],
 ARRAY['Large Equipment', 'Long-Term Rentals', 'Project Support'],
 true, true, 'BBB', 4.3, 98)
ON CONFLICT (id) DO UPDATE SET
  trade_category_id = EXCLUDED.trade_category_id,
  name = EXCLUDED.name,
  company_name = EXCLUDED.company_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  updated_at = NOW();


-- ============================================================================
-- UPDATE EXISTING CONTRACTORS WITH COMPLETE DATA
-- ============================================================================

-- Chatfield Poured Walls - Foundation Contractor
UPDATE vendors SET
  trade_category_id = (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
  company_name = 'Chatfield Poured Walls LLC',
  phone = '(555) 401-0001',
  website = 'https://chatfieldpouredwalls.com',
  address = '1250 Industrial Blvd',
  city = 'Georgetown',
  state = 'TX',
  zip_code = '78626',
  rating_platform = 'Google',
  rating_score = 4.8,
  rating_reviews = 156,
  social_media = '[{"platform": "Facebook", "url": "https://facebook.com/chatfieldwalls"}]'::jsonb,
  found_via = ARRAY['Google Search', 'Referral'],
  preferred_contact_method = 'phone',
  contact_hours = 'Mon-Fri 7am-5pm',
  services_offered = ARRAY['Poured Concrete Walls', 'Foundation Walls', 'Basement Walls', 'Retaining Walls', 'ICF Alternative'],
  specialties = ARRAY['Residential Foundations', 'Poured Wall Systems', 'Waterproofing'],
  service_area = ARRAY['Georgetown', 'Round Rock', 'Austin', 'Cedar Park', 'Leander'],
  licensed = true,
  insured = true,
  license_number = 'TX-CON-2019-4521',
  insurance_info = 'General Liability $2M, Workers Comp',
  notes = 'Specializes in poured concrete wall systems. Fast turnaround, typically 2-3 days for residential.',
  tags = ARRAY['foundation', 'concrete', 'poured walls', 'residential'],
  updated_at = NOW()
WHERE id = '72099694-ae90-4454-b626-55d619b9099b';

-- Johnson Concrete - Foundation & Concrete Contractor
UPDATE vendors SET
  trade_category_id = (SELECT id FROM trade_categories WHERE name = 'Foundation & Concrete'),
  company_name = 'Johnson Concrete & Foundation',
  phone = '(555) 401-0002',
  website = 'https://johnsonconcrete.com',
  address = '890 Commerce Dr',
  city = 'Pflugerville',
  state = 'TX',
  zip_code = '78660',
  rating_platform = 'Google',
  rating_score = 4.6,
  rating_reviews = 89,
  social_media = '[{"platform": "Facebook", "url": "https://facebook.com/johnsonconcrete"}, {"platform": "Instagram", "url": "https://instagram.com/johnsonconcrete"}]'::jsonb,
  found_via = ARRAY['HomeAdvisor', 'Word of Mouth'],
  preferred_contact_method = 'email',
  contact_hours = 'Mon-Sat 6am-6pm',
  services_offered = ARRAY['Slab Foundations', 'Pier and Beam', 'Concrete Flatwork', 'Driveways', 'Patios', 'Sidewalks'],
  specialties = ARRAY['Post-Tension Slabs', 'Stamped Concrete', 'Colored Concrete', 'Large Residential'],
  service_area = ARRAY['Pflugerville', 'Austin', 'Round Rock', 'Hutto', 'Manor'],
  licensed = true,
  insured = true,
  license_number = 'TX-CON-2017-3892',
  insurance_info = 'General Liability $1M, Workers Comp, Vehicle Insurance',
  notes = 'Family-owned business, 15+ years experience. Known for quality flatwork and decorative concrete.',
  tags = ARRAY['foundation', 'concrete', 'flatwork', 'decorative', 'residential'],
  updated_at = NOW()
WHERE id = '0302f08e-6607-40cd-98ac-6f1ea2a8baee';


-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to see the count of vendors by category

SELECT 'Total Vendors' as category, COUNT(*) as count FROM vendors
UNION ALL
SELECT 'Contractors' as category, COUNT(*) FROM vendors WHERE id::text LIKE 'a%'
UNION ALL
SELECT 'Suppliers' as category, COUNT(*) FROM vendors WHERE id::text LIKE 'b%'
UNION ALL
SELECT 'Equipment Rental' as category, COUNT(*) FROM vendors WHERE id::text LIKE 'c%';

-- Verify all vendors have trade categories assigned
SELECT 
  'Vendors without trade_category' as check_type,
  COUNT(*) as count 
FROM vendors 
WHERE trade_category_id IS NULL;

-- Show breakdown by trade category
SELECT 
  tc.name as trade_category,
  COUNT(v.id) as vendor_count
FROM trade_categories tc
LEFT JOIN vendors v ON v.trade_category_id = tc.id
GROUP BY tc.name, tc.display_order
ORDER BY tc.display_order;
