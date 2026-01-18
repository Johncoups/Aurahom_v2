-- Seed budget test data for SIP (Structural Insulated Panels) construction method
-- This creates sample budget items with realistic actual costs for testing budget variance tracking
-- 
-- INSTRUCTIONS:
-- 1. Replace 'YOUR_PROJECT_ID_HERE' with an actual project UUID from your projects table
-- 2. Run this in the Supabase SQL Editor
-- 3. Data includes mix of completed, in-progress, and estimated items for comprehensive testing

-- Pre-Construction Planning (11 items) - COMPLETED PHASE
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Survey', 500, 300, 'ABC Surveying', 800, 850, 850, 1, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Plans and Specifications', 3000, 2500, 'Smith Architects', 5500, 5800, 5800, 2, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Plan Review', 200, 100, 'County Building', 300, 300, 300, 3, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Engineering Fees', 1500, 1000, 'Jones Engineering', 2500, 2400, 2400, 4, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Permits: Zoning, Building, Environmental, Other', 1200, 0, 'County Building Dept', 1200, 1350, 1350, 5, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Impact Fee', 500, 0, 'County', 500, 500, 500, 6, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Legal Fees', 800, 0, 'Brown Law', 800, 750, 750, 7, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Administrative Costs', 300, 0, '', 300, 280, 280, 8, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Financing Costs', 2000, 0, 'First Bank', 2000, 2100, 2100, 9, false),
('YOUR_PROJECT_ID_HERE', 'pre-construction', 'Insurance', 1500, 0, 'State Farm', 1500, 1650, 1650, 10, false);

-- Site Preparation & Excavation (25 items) - COMPLETED PHASE
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'All Inclusive', 0, 0, '', 15000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Job-Site Access', 500, 1000, 'Driveway Co', 1500, 1650, 1650, 11, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Job-Site Security', 200, 0, 'Security Rental', 200, 240, 240, 12, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Clear Lot', 0, 2500, 'Land Clearing LLC', 2500, 2200, 2200, 14, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Dumpster & Removal', 400, 0, 'Waste Management', 400, 450, 450, 15, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Storage On Site', 150, 0, 'Storage Rental', 150, 150, 150, 16, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Portable Toilet', 200, 0, 'PortaPotty Inc', 200, 180, 180, 17, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Temporary Power', 300, 200, 'Electric Co', 500, 550, 550, 18, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Temporary Heat', 100, 0, '', 100, 95, 95, 19, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Cut & Fill', 0, 3000, 'Excavation Pro', 3000, 3200, 3200, 20, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Blasting', 0, 0, '', 0, 0, 0, 21, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Removal Of Stone/Dirt', 500, 1000, 'Excavation Pro', 1500, 1800, 1800, 22, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Rough Grading', 0, 2000, 'Grading Services', 2000, 1900, 1900, 23, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Trenching For Utility Hookups', 200, 800, 'Utility Trenching', 1000, 1100, 1100, 24, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Foundation Excavation', 0, 3500, 'Excavation Pro', 3500, 3400, 3400, 25, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Foundation Footing Drains', 400, 600, 'Drainage Inc', 1000, 1050, 1050, 26, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Backfill', 0, 800, 'Excavation Pro', 800, 750, 750, 27, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Compaction', 0, 500, 'Excavation Pro', 500, 500, 500, 28, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Curtain Drains', 300, 700, 'Drainage Inc', 1000, 950, 950, 29, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Swales', 0, 400, 'Grading Services', 400, 380, 380, 30, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Retaining Walls', 2000, 3000, 'Wall Masters', 5000, 5400, 5400, 31, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Ponds', 0, 0, '', 0, 0, 0, 32, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Other Site Drainage', 0, 0, '', 0, 0, 0, 33, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Topsoil', 800, 400, 'Landscape Supply', 1200, 1150, 1150, 34, false),
('YOUR_PROJECT_ID_HERE', 'site-prep-excavation', 'Finish Grading', 0, 1500, 'Grading Services', 1500, 1600, 1600, 35, false);

-- Utilities & Septic (14 items) - COMPLETED PHASE
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Soil & Perc Tests', 300, 200, 'Soil Testing Co', 500, 525, 525, 13, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Septic System Design', 500, 300, 'Septic Design Inc', 800, 850, 850, 43, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Septic Permits, Inspections, Fees', 350, 0, 'County Health Dept', 350, 350, 350, 44, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Septic System Installation, Tie In To House', 6000, 4000, 'Septic Pro', 10000, 10500, 10500, 45, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Well, Pump, Trenching, Plumbing To House, Pressure Tank', 4000, 3000, 'Well Services', 7000, 7200, 7200, 46, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Well Permits & Fees', 200, 0, 'County Water Dept', 200, 200, 200, 47, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Town Water: Tap Fees & Hookup', 0, 0, '', 0, 0, 0, 48, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Town Sewer: Tap Fees & Hookup', 0, 0, '', 0, 0, 0, 49, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Electrical: Permit, Connection Fee, Installation', 800, 1200, 'Power Company', 2000, 2100, 2100, 50, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Gas: Permit, Connection Fee, Hookup', 0, 0, '', 0, 0, 0, 51, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'LPN: Tank Installation, Hookup', 0, 0, '', 0, 0, 0, 52, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Oil Tank Installation', 0, 0, '', 0, 0, 0, 53, false),
('YOUR_PROJECT_ID_HERE', 'utilities-septic', 'Telecom Hookup', 150, 100, 'Cable/Internet Co', 250, 275, 275, 54, false);

-- Foundation (19 items) - IN PROGRESS (some paid, some not)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'foundation', 'All Inclusive', 0, 0, '', 25000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'LPN: Tank Installation, Hookup', 0, 0, '', 0, 0, 0, 52, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Oil Tank Installation', 0, 0, '', 0, 0, 0, 53, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Telecom Hookup', 0, 0, '', 0, 0, 0, 54, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Foundation walls/stem walls/grade beams', 8000, 7000, 'Foundation Masters', 15000, 15800, 7900, 56, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Steel Reinforcing', 1500, 0, 'Steel Supply', 1500, 1600, 1600, 57, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Anchor Bolts, Hold Downs', 300, 200, 'Hardware Supply', 500, 520, 520, 58, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Sump Pump', 400, 300, 'Plumbing Supply', 700, 730, 730, 63, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Sub-Slab Vapor Barrier', 400, 300, 'Foundation Masters', 700, 680, 680, 60, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Crawlspace Vapor Barrier', 300, 200, 'Foundation Masters', 500, 480, 240, 61, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Crawlspace Vents', 200, 150, 'HVAC Supply', 350, 360, 180, 62, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Slab insulation: Edge/Below', 800, 400, 'Insulation Co', 1200, 1250, 625, 66, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Footings/Pads', 2000, 2500, 'Foundation Masters', 4500, 4700, 4700, 55, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Rough Grading', 0, 500, 'Grading Services', 500, 480, 480, 26, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Dampproofing, Waterproofing', 600, 800, 'Waterproofing Pro', 1400, 1450, 725, 65, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Foundation Windows', 800, 400, 'Window Supply', 1200, 1180, 590, 64, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Foundation Drain Board', 400, 300, 'Foundation Masters', 700, 720, 360, 67, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Exterior Foundation Insulation', 900, 600, 'Insulation Co', 1500, 1550, 775, 68, false),
('YOUR_PROJECT_ID_HERE', 'foundation', 'Erosion control', 200, 300, 'Site Services', 500, 520, 520, 138, false);

-- Under-Slab Services (8 items) - IN PROGRESS
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Radon Mitigation', 300, 400, 'Radon Solutions', 700, 750, 375, 139, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Sub-Slab Vapor Barrier', 400, 300, 'Foundation Masters', 700, 720, 720, 59, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Under-Slab Plumbing', 800, 1200, 'Plumbers Inc', 2000, 2100, 1050, 140, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Slab insulation: Edge/Below', 600, 400, 'Insulation Co', 1000, 980, 490, 66, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Ridge and roof vents', 0, 0, '', 0, 0, 0, 87, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Rough electrical under slab', 200, 300, 'Electric Pro', 500, 520, 260, 163, false),
('YOUR_PROJECT_ID_HERE', 'under-slab-services', 'Sub-Slab Vapor Barrier', 0, 0, '', 0, 0, 0, 60, false);

-- SIP Shell & Framing (9 items) - IN PROGRESS - SIP SPECIFIC PHASE
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'All Inclusive', 0, 0, '', 45000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'SIP panels and materials', 25000, 0, 'SIP Supply Co', 25000, 26500, 13250, 154, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'SIP panel installation labor', 0, 12000, 'SIP Specialists', 12000, 13000, 6500, 155, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Exterior Insulation Coating/Protection', 400, 300, 'Insulation Co', 700, 720, 360, 69, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Sill & Seal', 200, 300, 'SIP Specialists', 500, 520, 260, 70, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Steel/Wood Carrying Beam, Lolly columns', 1500, 1000, 'Structural Steel', 2500, 2400, 1200, 71, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Sheathing and/or Subflooring', 2000, 1500, 'SIP Specialists', 3500, 3600, 1800, 74, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Subfascia', 300, 400, 'Framing Crew', 700, 680, 340, 76, false),
('YOUR_PROJECT_ID_HERE', 'rough-framing', 'Steel Framing Connectors', 400, 200, 'Hardware Supply', 600, 630, 315, 77, false);

-- Concrete Slabs & Flatwork (10 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Garage Slab', 2000, 1500, 'Concrete Co', 3500, 3450, 0, 160, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Porch Slab', 800, 600, 'Concrete Co', 1400, 1350, 0, 159, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Sidewalks', 600, 500, 'Concrete Co', 1100, 1120, 0, 161, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Concrete pump', 0, 500, 'Concrete Pumping', 500, 550, 0, 141, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Footings/Pads', 1000, 800, 'Concrete Co', 1800, 1750, 0, 55, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Driveway', 3000, 2000, 'Concrete Co', 5000, 5200, 0, 124, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Other Flatwork', 500, 400, 'Concrete Co', 900, 880, 0, 125, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Deck Footings', 400, 300, 'Concrete Co', 700, 720, 0, 121, false),
('YOUR_PROJECT_ID_HERE', 'concrete-slabs', 'Patio', 1500, 1200, 'Concrete Co', 2700, 2650, 0, 162, false);

-- Roofing (9 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'roofing', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Nails, Screws, Fasteners', 200, 0, 'Hardware Supply', 200, 210, 0, 79, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Prep for Plaster, Drywall', 0, 0, '', 0, 0, 0, 80, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Membrane', 800, 600, 'Roofing Supply', 1400, 1380, 0, 82, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Underlayment', 600, 400, 'Roofing Supply', 1000, 1050, 0, 81, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Flashing: Chimney, Vent Pipes, Sidewalls, Other Penetrations', 400, 500, 'Roofers Pro', 900, 920, 0, 83, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Roofing Installation', 4000, 5000, 'Roofers Pro', 9000, 9200, 0, 86, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Drip Edge', 200, 150, 'Roofing Supply', 350, 340, 0, 84, false),
('YOUR_PROJECT_ID_HERE', 'roofing', 'Gutters & Downspouts', 800, 600, 'Gutter Specialists', 1400, 1450, 0, 85, false);

-- Exterior Finishes (15 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'exterior', 'All Inclusive', 0, 0, '', 20000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Housewrap, Tyvek', 400, 300, 'Building Supply', 700, 720, 0, 111, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Siding Material', 5000, 0, 'Siding Supply', 5000, 5100, 0, 112, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Siding Installation', 0, 6000, 'Siding Contractors', 6000, 6200, 0, 113, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Brick/Stone Veneer', 0, 0, '', 0, 0, 0, 114, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Exterior Trim', 1200, 1800, 'Trim Carpenters', 3000, 2950, 0, 115, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Soffit and Fascia', 800, 1000, 'Siding Contractors', 1800, 1850, 0, 116, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Entry Doors', 1500, 500, 'Door Supply', 2000, 2100, 0, 117, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Windows', 6000, 2000, 'Window Supply', 8000, 8200, 0, 118, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Doors, Interior', 0, 0, '', 0, 0, 0, 119, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Chimney', 0, 0, '', 0, 0, 0, 126, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Garage Door', 1200, 500, 'Garage Door Co', 1700, 1750, 0, 122, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Garage Door Opener', 400, 200, 'Garage Door Co', 600, 580, 0, 123, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Screened Porch', 0, 0, '', 0, 0, 0, 142, false),
('YOUR_PROJECT_ID_HERE', 'exterior', 'Closet Shelving', 0, 0, '', 0, 0, 0, 120, false);

-- Plumbing Rough-In (4 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'plumbing-rough', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'plumbing-rough', 'Skylights', 0, 0, '', 0, 0, 0, 88, false),
('YOUR_PROJECT_ID_HERE', 'plumbing-rough', 'Drain/Waste/Vent', 1200, 2000, 'Plumbers Inc', 3200, 3300, 0, 89, false),
('YOUR_PROJECT_ID_HERE', 'plumbing-rough', 'Water Supply Piping', 800, 1500, 'Plumbers Inc', 2300, 2250, 0, 90, false),
('YOUR_PROJECT_ID_HERE', 'plumbing-rough', 'Gas Piping', 400, 600, 'Plumbers Inc', 1000, 1050, 0, 91, false);

-- Electrical Rough-In (9 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Service Panel, Sub-Panels', 1200, 800, 'Electric Supply', 2000, 2050, 0, 95, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Rough Wiring', 1500, 3000, 'Electricians Inc', 4500, 4600, 0, 96, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Phone, Cable, Internet Wiring', 300, 500, 'Low Voltage Tech', 800, 780, 0, 97, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Security Wiring', 200, 400, 'Security Systems', 600, 620, 0, 144, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Switches, Receptacles', 0, 0, '', 0, 0, 0, 99, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Smoke and CO Detectors', 0, 0, '', 0, 0, 0, 98, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Lighting Fixtures', 0, 0, '', 0, 0, 0, 100, false),
('YOUR_PROJECT_ID_HERE', 'electrical-rough', 'Generator Hook-up', 0, 0, '', 0, 0, 0, 145, false);

-- HVAC Rough-In (6 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'All Inclusive', 0, 0, '', 10000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'Furnace', 2500, 1000, 'HVAC Supply', 3500, 3600, 0, 101, false),
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'Air Conditioning', 3000, 1500, 'HVAC Supply', 4500, 4450, 0, 102, false),
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'Ductwork', 1200, 2000, 'HVAC Contractors', 3200, 3300, 0, 103, false),
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'Venting', 300, 400, 'HVAC Contractors', 700, 680, 0, 104, false),
('YOUR_PROJECT_ID_HERE', 'hvac-rough', 'Fireplace', 0, 0, '', 0, 0, 0, 143, false);

-- Insulation & Air Sealing (2 items) - ESTIMATED (SIPs provide insulation, but additional may be needed)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'insulation', 'All Inclusive', 0, 0, '', 3000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'insulation', 'Wall and Ceiling Insulation', 1000, 1000, 'Insulation Co', 2000, 1950, 0, 131, false),
('YOUR_PROJECT_ID_HERE', 'insulation', 'Air Sealing', 200, 300, 'Insulation Co', 500, 520, 0, 132, false);

-- Drywall (3 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'drywall', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'drywall', 'Prep for Plaster, Drywall', 200, 0, 'Drywall Supply', 200, 210, 0, 78, false),
('YOUR_PROJECT_ID_HERE', 'drywall', 'Drywall Installation, Taping, Finishing', 2500, 4500, 'Drywall Pros', 7000, 7100, 0, 133, false),
('YOUR_PROJECT_ID_HERE', 'drywall', 'Texture', 200, 400, 'Drywall Pros', 600, 580, 0, 134, false);

-- Trim Carpentry (4 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'trim-carpentry', 'All Inclusive', 0, 0, '', 6000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'trim-carpentry', 'Interior Trim, Baseboards', 1500, 2000, 'Trim Supply', 3500, 3450, 0, 127, false),
('YOUR_PROJECT_ID_HERE', 'trim-carpentry', 'Interior Doors, Closets', 2000, 1500, 'Door Supply', 3500, 3600, 0, 128, false),
('YOUR_PROJECT_ID_HERE', 'trim-carpentry', 'Stairs, Railings', 0, 0, '', 0, 0, 0, 129, false),
('YOUR_PROJECT_ID_HERE', 'trim-carpentry', 'Built-ins', 0, 0, '', 0, 0, 0, 135, false);

-- Paint (1 item) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'paint', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'paint', 'Interior Paint', 1500, 3000, 'Painters Inc', 4500, 4650, 0, 136, false);

-- Flooring (1 item) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'flooring', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'flooring', 'Finish Flooring', 6000, 4000, 'Flooring Specialists', 10000, 10200, 0, 130, false);

-- Kitchen & Bath (10 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'All Inclusive', 0, 0, '', 25000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Water Treatment', 0, 0, '', 0, 0, 0, 92, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Water Heater', 800, 500, 'Plumbing Supply', 1300, 1350, 0, 93, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Fixtures: Toilets, Tubs, Sinks, Showers', 3000, 1500, 'Plumbing Supply', 4500, 4600, 0, 94, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Kitchen Cabinets', 8000, 2000, 'Cabinet Makers', 10000, 10200, 0, 105, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Countertops', 3500, 1000, 'Stone Fabricators', 4500, 4650, 0, 106, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Bathroom Cabinets & Vanities', 2000, 800, 'Cabinet Supply', 2800, 2750, 0, 107, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Appliances', 4000, 0, 'Appliance Store', 4000, 4200, 0, 108, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Tile & Backsplash', 1500, 2000, 'Tile Setters', 3500, 3450, 0, 109, false),
('YOUR_PROJECT_ID_HERE', 'kitchen-bath', 'Mirrors, Shower Doors', 800, 400, 'Glass Shop', 1200, 1180, 0, 110, false);

-- Porches & Decks (3 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'porches-decks', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'porches-decks', 'Doors, Interior', 0, 0, '', 0, 0, 0, 119, false),
('YOUR_PROJECT_ID_HERE', 'porches-decks', 'Deck Footings', 0, 0, '', 0, 0, 0, 121, false),
('YOUR_PROJECT_ID_HERE', 'porches-decks', 'Stairs, Railings', 1500, 2000, 'Deck Builders', 3500, 3600, 0, 129, false);

-- Final Touches & Punch List (4 items) - ESTIMATED (not yet started but quoted)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('YOUR_PROJECT_ID_HERE', 'final-touches', 'All Inclusive', 0, 0, '', 3000, 0, 0, 0, false),
('YOUR_PROJECT_ID_HERE', 'final-touches', 'Final Cleaning', 0, 500, 'Cleaning Service', 500, 520, 0, 137, false),
('YOUR_PROJECT_ID_HERE', 'final-touches', 'Hardware, Bath Accessories', 400, 200, 'Hardware Supply', 600, 580, 0, 146, false),
('YOUR_PROJECT_ID_HERE', 'final-touches', 'Window Treatments', 800, 300, 'Window Coverings', 1100, 1120, 0, 147, false);

-- Done! This creates 154 budget items for SIP construction with ALL actual_cost populated:
-- - First 3 phases COMPLETED (all paid)
-- - Foundation IN PROGRESS (partial payments - 50% paid on some items)
-- - Under-slab IN PROGRESS (partial payments - 50% paid on some items)
-- - SIP Framing IN PROGRESS (partial payments - 50% paid on some items)
-- - Remaining phases ESTIMATED (contractor quotes, not yet started - 0% paid)
-- 
-- Total estimated: ~$230,000
-- Total actual costs (including estimates): ~$235,000 (slight overrun)
-- Total paid so far: ~$93,000 (only completed + partial in-progress items)
-- 
-- This provides comprehensive test data for:
-- - Completed work (3 phases)
-- - Work in progress with partial payments (3 phases)
-- - Future work with contractor quotes (14 phases)
-- - Budget variance tracking (some over, some under, some on-track)
