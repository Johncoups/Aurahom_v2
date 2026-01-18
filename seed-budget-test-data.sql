INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Survey', 500, 300, 'ABC Surveying', 800, 850, 850, 1, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Plans and Specifications', 3000, 2500, 'Smith Architects', 5500, 5500, 2750, 2, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Plan Review', 200, 100, '', 300, 300, 300, 3, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Engineering Fees', 1500, 1000, 'Jones Engineering', 2500, 2600, 2600, 4, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Permits: Zoning, Building, Environmental, Other', 1200, 0, 'County Building Dept', 1200, 1200, 1200, 5, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Impact Fee', 500, 0, '', 500, 500, 500, 6, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Legal Fees', 800, 0, 'Brown Law', 800, 0, 0, 7, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Administrative Costs', 300, 0, '', 300, 0, 0, 8, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Financing Costs', 2000, 0, 'First Bank', 2000, 0, 0, 9, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'pre-construction', 'Insurance', 1500, 0, 'State Farm', 1500, 0, 0, 10, false);

-- Site Preparation & Excavation (25 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'All Inclusive', 0, 0, '', 15000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Job-Site Access', 500, 1000, 'Driveway Co', 1500, 0, 0, 11, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Job-Site Security', 200, 0, '', 200, 0, 0, 12, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Clear Lot', 0, 2500, 'Land Clearing LLC', 2500, 0, 0, 14, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Dumpster & Removal', 400, 0, 'Waste Management', 400, 0, 0, 15, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Storage On Site', 150, 0, 'Storage Rental', 150, 0, 0, 16, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Portable Toilet', 200, 0, 'PortaPotty Inc', 200, 0, 0, 17, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Temporary Power', 300, 200, 'Electric Co', 500, 0, 0, 18, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Temporary Heat', 100, 0, '', 100, 0, 0, 19, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Cut & Fill', 0, 3000, 'Excavation Pro', 3000, 0, 0, 20, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Blasting', 0, 0, '', 0, 0, 0, 21, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Removal Of Stone/Dirt', 500, 1000, 'Excavation Pro', 1500, 0, 0, 22, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Rough Grading', 0, 2000, 'Grading Services', 2000, 0, 0, 23, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Trenching For Utility Hookups', 200, 800, 'Utility Trenching', 1000, 0, 0, 24, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Foundation Excavation', 0, 3500, 'Excavation Pro', 3500, 0, 0, 25, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Foundation Footing Drains', 400, 600, 'Drainage Inc', 1000, 0, 0, 26, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Backfill', 0, 800, 'Excavation Pro', 800, 0, 0, 27, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Compaction', 0, 500, 'Excavation Pro', 500, 0, 0, 28, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Curtain Drains', 300, 700, 'Drainage Inc', 1000, 0, 0, 29, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Swales', 0, 400, 'Grading Services', 400, 0, 0, 30, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Retaining Walls', 2000, 3000, 'Wall Masters', 5000, 0, 0, 31, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Ponds', 0, 0, '', 0, 0, 0, 32, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Other Site Drainage', 0, 0, '', 0, 0, 0, 33, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Topsoil', 800, 400, 'Landscape Supply', 1200, 0, 0, 34, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'site-prep-excavation', 'Finish Grading', 0, 1500, 'Grading Services', 1500, 0, 0, 35, false);

-- Utilities & Septic (14 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Soil & Perc Tests', 300, 200, 'Soil Testing Co', 500, 0, 0, 13, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Septic System Design', 500, 300, 'Septic Design Inc', 800, 0, 0, 43, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Septic Permits, Inspections, Fees', 350, 0, 'County Health Dept', 350, 0, 0, 44, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Septic System Installation, Tie In To House', 6000, 4000, 'Septic Pro', 10000, 0, 0, 45, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Well, Pump, Trenching, Plumbing To House, Pressure Tank', 4000, 3000, 'Well Services', 7000, 0, 0, 46, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Well Permits & Fees', 200, 0, 'County Water Dept', 200, 0, 0, 47, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Town Water: Tap Fees & Hookup', 0, 0, '', 0, 0, 0, 48, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Town Sewer: Tap Fees & Hookup', 0, 0, '', 0, 0, 0, 49, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Electrical: Permit, Connection Fee, Installation', 800, 1200, 'Power Company', 2000, 0, 0, 50, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Gas: Permit, Connection Fee, Hookup', 0, 0, '', 0, 0, 0, 51, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'LPN: Tank Installation, Hookup', 0, 0, '', 0, 0, 0, 52, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Oil Tank Installation', 0, 0, '', 0, 0, 0, 53, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'utilities-septic', 'Telecom Hookup', 150, 100, 'Cable/Internet Co', 250, 0, 0, 54, false);

-- Foundation (19 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'All Inclusive', 0, 0, '', 25000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'LPN: Tank Installation, Hookup', 0, 0, '', 0, 0, 0, 52, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Oil Tank Installation', 0, 0, '', 0, 0, 0, 53, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Telecom Hookup', 0, 0, '', 0, 0, 0, 54, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Foundation walls/stem walls/grade beams', 8000, 7000, 'Foundation Masters', 15000, 0, 0, 56, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Steel Reinforcing', 1500, 0, 'Steel Supply', 1500, 0, 0, 57, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Anchor Bolts, Hold Downs', 300, 200, 'Hardware Supply', 500, 0, 0, 58, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Sump Pump', 400, 300, 'Plumbing Supply', 700, 0, 0, 63, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Sub-Slab Vapor Barrier', 400, 300, 'Foundation Masters', 700, 0, 0, 60, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Crawlspace Vapor Barrier', 300, 200, 'Foundation Masters', 500, 0, 0, 61, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Crawlspace Vents', 200, 150, 'HVAC Supply', 350, 0, 0, 62, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Slab insulation: Edge/Below', 800, 400, 'Insulation Co', 1200, 0, 0, 66, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Footings/Pads', 2000, 2500, 'Foundation Masters', 4500, 0, 0, 55, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Rough Grading', 0, 500, 'Grading Services', 500, 0, 0, 26, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Dampproofing, Waterproofing', 600, 800, 'Waterproofing Pro', 1400, 0, 0, 65, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Foundation Windows', 800, 400, 'Window Supply', 1200, 0, 0, 64, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Foundation Drain Board', 400, 300, 'Foundation Masters', 700, 0, 0, 67, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Exterior Foundation Insulation', 900, 600, 'Insulation Co', 1500, 0, 0, 68, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'foundation', 'Erosion control', 200, 300, 'Site Services', 500, 0, 0, 138, false);

-- Under-Slab Services (8 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Radon Mitigation', 300, 400, 'Radon Solutions', 700, 0, 0, 139, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Sub-Slab Vapor Barrier', 400, 300, 'Foundation Masters', 700, 0, 0, 59, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Under-Slab Plumbing', 800, 1200, 'Plumbers Inc', 2000, 0, 0, 140, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Slab insulation: Edge/Below', 600, 400, 'Insulation Co', 1000, 0, 0, 66, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Ridge and roof vents', 0, 0, '', 0, 0, 0, 87, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Rough electrical under slab', 200, 300, 'Electric Pro', 500, 0, 0, 163, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'under-slab-services', 'Sub-Slab Vapor Barrier', 0, 0, '', 0, 0, 0, 60, false);

-- Rough Framing (10 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'All Inclusive', 0, 0, '', 35000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Exterior Insulation Coating/Protection', 400, 300, 'Insulation Co', 700, 0, 0, 69, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Sill & Seal', 200, 300, 'Framing Crew', 500, 0, 0, 70, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Steel/Wood Carrying Beam, Lolly columns', 1500, 1000, 'Structural Steel', 2500, 0, 0, 71, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Floor Framing', 6000, 8000, 'Framing Crew', 14000, 0, 0, 72, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Exterior & Interior Walls, Rough Stairs', 8000, 10000, 'Framing Crew', 18000, 0, 0, 73, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Sheathing and/or Subflooring', 4000, 3000, 'Framing Crew', 7000, 0, 0, 74, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Roof Framing/Trusses', 5000, 4000, 'Truss Company', 9000, 0, 0, 75, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Subfascia', 300, 400, 'Framing Crew', 700, 0, 0, 76, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'rough-framing', 'Steel Framing Connectors', 400, 200, 'Hardware Supply', 600, 0, 0, 77, false);

-- Concrete Slabs & Flatwork (10 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Garage Slab', 2000, 1500, 'Concrete Co', 3500, 0, 0, 160, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Porch Slab', 800, 600, 'Concrete Co', 1400, 0, 0, 159, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Sidewalks', 600, 500, 'Concrete Co', 1100, 0, 0, 161, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Concrete pump', 0, 500, 'Concrete Pumping', 500, 0, 0, 141, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Footings/Pads', 1000, 800, 'Concrete Co', 1800, 0, 0, 55, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Driveway', 3000, 2000, 'Concrete Co', 5000, 0, 0, 124, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Other Flatwork', 500, 400, 'Concrete Co', 900, 0, 0, 125, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Deck Footings', 400, 300, 'Concrete Co', 700, 0, 0, 121, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'concrete-slabs', 'Patio', 1500, 1200, 'Concrete Co', 2700, 0, 0, 162, false);

-- Roofing (9 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Nails, Screws, Fasteners', 200, 0, 'Hardware Supply', 200, 0, 0, 79, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Prep for Plaster, Drywall', 0, 0, '', 0, 0, 0, 80, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Membrane', 800, 600, 'Roofing Supply', 1400, 0, 0, 82, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Underlayment', 600, 400, 'Roofing Supply', 1000, 0, 0, 81, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Flashing: Chimney, Vent Pipes, Sidewalls, Other Penetrations', 400, 500, 'Roofers Pro', 900, 0, 0, 83, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Roofing Installation', 4000, 5000, 'Roofers Pro', 9000, 0, 0, 86, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Drip Edge', 200, 150, 'Roofing Supply', 350, 0, 0, 84, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'roofing', 'Gutters & Downspouts', 800, 600, 'Gutter Specialists', 1400, 0, 0, 85, false);

-- Exterior Finishes (15 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'All Inclusive', 0, 0, '', 20000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Housewrap, Tyvek', 400, 300, 'Building Supply', 700, 0, 0, 111, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Siding Material', 5000, 0, 'Siding Supply', 5000, 0, 0, 112, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Siding Installation', 0, 6000, 'Siding Contractors', 6000, 0, 0, 113, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Brick/Stone Veneer', 0, 0, '', 0, 0, 0, 114, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Exterior Trim', 1200, 1800, 'Trim Carpenters', 3000, 0, 0, 115, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Soffit and Fascia', 800, 1000, 'Siding Contractors', 1800, 0, 0, 116, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Entry Doors', 1500, 500, 'Door Supply', 2000, 0, 0, 117, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Windows', 6000, 2000, 'Window Supply', 8000, 0, 0, 118, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Doors, Interior', 0, 0, '', 0, 0, 0, 119, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Chimney', 0, 0, '', 0, 0, 0, 126, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Garage Door', 1200, 500, 'Garage Door Co', 1700, 0, 0, 122, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Garage Door Opener', 400, 200, 'Garage Door Co', 600, 0, 0, 123, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Screened Porch', 0, 0, '', 0, 0, 0, 142, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'exterior', 'Closet Shelving', 0, 0, '', 0, 0, 0, 120, false);

-- Plumbing Rough-In (4 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'plumbing-rough', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'plumbing-rough', 'Skylights', 0, 0, '', 0, 0, 0, 88, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'plumbing-rough', 'Drain/Waste/Vent', 1200, 2000, 'Plumbers Inc', 3200, 0, 0, 89, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'plumbing-rough', 'Water Supply Piping', 800, 1500, 'Plumbers Inc', 2300, 0, 0, 90, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'plumbing-rough', 'Gas Piping', 400, 600, 'Plumbers Inc', 1000, 0, 0, 91, false);

-- Electrical Rough-In (9 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Service Panel, Sub-Panels', 1200, 800, 'Electric Supply', 2000, 0, 0, 95, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Rough Wiring', 1500, 3000, 'Electricians Inc', 4500, 0, 0, 96, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Phone, Cable, Internet Wiring', 300, 500, 'Low Voltage Tech', 800, 0, 0, 97, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Security Wiring', 200, 400, 'Security Systems', 600, 0, 0, 144, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Switches, Receptacles', 0, 0, '', 0, 0, 0, 99, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Smoke and CO Detectors', 0, 0, '', 0, 0, 0, 98, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Lighting Fixtures', 0, 0, '', 0, 0, 0, 100, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'electrical-rough', 'Generator Hook-up', 0, 0, '', 0, 0, 0, 145, false);

-- HVAC Rough-In (6 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'All Inclusive', 0, 0, '', 10000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'Furnace', 2500, 1000, 'HVAC Supply', 3500, 0, 0, 101, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'Air Conditioning', 3000, 1500, 'HVAC Supply', 4500, 0, 0, 102, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'Ductwork', 1200, 2000, 'HVAC Contractors', 3200, 0, 0, 103, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'Venting', 300, 400, 'HVAC Contractors', 700, 0, 0, 104, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'hvac-rough', 'Fireplace', 0, 0, '', 0, 0, 0, 143, false);

-- Insulation & Air Sealing (2 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'insulation', 'All Inclusive', 0, 0, '', 6000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'insulation', 'Wall and Ceiling Insulation', 3000, 2500, 'Insulation Co', 5500, 0, 0, 131, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'insulation', 'Air Sealing', 200, 300, 'Insulation Co', 500, 0, 0, 132, false);

-- Drywall (3 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'drywall', 'All Inclusive', 0, 0, '', 8000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'drywall', 'Prep for Plaster, Drywall', 200, 0, 'Drywall Supply', 200, 0, 0, 78, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'drywall', 'Drywall Installation, Taping, Finishing', 2500, 4500, 'Drywall Pros', 7000, 0, 0, 133, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'drywall', 'Texture', 200, 400, 'Drywall Pros', 600, 0, 0, 134, false);

-- Trim Carpentry (4 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'trim-carpentry', 'All Inclusive', 0, 0, '', 6000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'trim-carpentry', 'Interior Trim, Baseboards', 1500, 2000, 'Trim Supply', 3500, 0, 0, 127, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'trim-carpentry', 'Interior Doors, Closets', 2000, 1500, 'Door Supply', 3500, 0, 0, 128, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'trim-carpentry', 'Stairs, Railings', 0, 0, '', 0, 0, 0, 129, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'trim-carpentry', 'Built-ins', 0, 0, '', 0, 0, 0, 135, false);

-- Paint (1 item)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'paint', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'paint', 'Interior Paint', 1500, 3000, 'Painters Inc', 4500, 0, 0, 136, false);

-- Flooring (1 item)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'flooring', 'All Inclusive', 0, 0, '', 12000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'flooring', 'Finish Flooring', 6000, 4000, 'Flooring Specialists', 10000, 0, 0, 130, false);

-- Kitchen & Bath (10 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'All Inclusive', 0, 0, '', 25000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Water Treatment', 0, 0, '', 0, 0, 0, 92, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Water Heater', 800, 500, 'Plumbing Supply', 1300, 0, 0, 93, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Fixtures: Toilets, Tubs, Sinks, Showers', 3000, 1500, 'Plumbing Supply', 4500, 0, 0, 94, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Kitchen Cabinets', 8000, 2000, 'Cabinet Makers', 10000, 0, 0, 105, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Countertops', 3500, 1000, 'Stone Fabricators', 4500, 0, 0, 106, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Bathroom Cabinets & Vanities', 2000, 800, 'Cabinet Supply', 2800, 0, 0, 107, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Appliances', 4000, 0, 'Appliance Store', 4000, 0, 0, 108, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Tile & Backsplash', 1500, 2000, 'Tile Setters', 3500, 0, 0, 109, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'kitchen-bath', 'Mirrors, Shower Doors', 800, 400, 'Glass Shop', 1200, 0, 0, 110, false);

-- Porches & Decks (3 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'porches-decks', 'All Inclusive', 0, 0, '', 5000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'porches-decks', 'Doors, Interior', 0, 0, '', 0, 0, 0, 119, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'porches-decks', 'Deck Footings', 0, 0, '', 0, 0, 0, 121, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'porches-decks', 'Stairs, Railings', 1500, 2000, 'Deck Builders', 3500, 0, 0, 129, false);

-- Final Touches & Punch List (4 items)
INSERT INTO budget_items (project_id, phase_id, description, materials, labor, vendor, estimated_cost, actual_cost, current_paid, sort_order, is_custom) VALUES
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'final-touches', 'All Inclusive', 0, 0, '', 3000, 0, 0, 0, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'final-touches', 'Final Cleaning', 0, 500, 'Cleaning Service', 500, 0, 0, 137, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'final-touches', 'Hardware, Bath Accessories', 400, 200, 'Hardware Supply', 600, 0, 0, 146, false),
('8a1449f9-6f73-40ea-9df0-47d7529f83a1', 'final-touches', 'Window Treatments', 800, 300, 'Window Coverings', 1100, 0, 0, 147, false);