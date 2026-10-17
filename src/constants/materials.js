// Common materials used in GSO (General Services Office) maintenance and repair work
// Separated by sub-unit: FGMU (Facilities & Grounds) and LEAU (Landscaping & Aesthetics)

export const COMMON_MATERIALS = [
  // ===========================================================================
  // FGMU Materials (Facilities & Grounds Management Unit)
  // ===========================================================================
  // Plumbing & Pipe Fittings
  { name: 'PVC Pipe 1/2 inch', category: 'Plumbing', unit: 'lengths', unit_code: 'FGMU', default_price: 120.00 },
  { name: 'PVC Pipe 3/4 inch', category: 'Plumbing', unit: 'lengths', unit_code: 'FGMU', default_price: 165.00 },
  { name: 'PVC Pipe 1 inch', category: 'Plumbing', unit: 'lengths', unit_code: 'FGMU', default_price: 220.00 },
  { name: 'PVC Elbow 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 15.00 },
  { name: 'PVC Elbow 3/4 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 20.00 },
  { name: 'PVC Tee 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 18.00 },
  { name: 'PVC Coupling 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 12.00 },
  { name: 'PVC Union 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 45.00 },
  { name: 'PVC Cement (Solvent)', category: 'Plumbing', unit: 'cans', unit_code: 'FGMU', default_price: 85.00 },
  { name: 'Teflon Tape', category: 'Plumbing', unit: 'rolls', unit_code: 'FGMU', default_price: 25.00 },
  { name: 'Gate Valve 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 280.00 },
  { name: 'Gate Valve 3/4 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 340.00 },
  { name: 'Ball Valve 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Faucet (Lavatory)', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 350.00 },
  { name: 'Faucet (Kitchen)', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 220.00 },
  { name: 'Angle Valve 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 140.00 },
  { name: 'Flexible Hose 1/2 inch', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 130.00 },
  { name: 'P-Trap (Lavatory)', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 190.00 },
  { name: 'Floor Drain 4x4', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 160.00 },
  { name: 'Cleanout Plug', category: 'Plumbing', unit: 'pcs', unit_code: 'FGMU', default_price: 55.00 },

  // Electrical
  { name: 'THHN Wire #12 (3.5mm²)', category: 'Electrical', unit: 'meters', unit_code: 'FGMU', default_price: 38.00 },
  { name: 'THHN Wire #10 (5.5mm²)', category: 'Electrical', unit: 'meters', unit_code: 'FGMU', default_price: 55.00 },
  { name: 'THHN Wire #14 (2.0mm²)', category: 'Electrical', unit: 'meters', unit_code: 'FGMU', default_price: 28.00 },
  { name: 'PDX Wire #12', category: 'Electrical', unit: 'meters', unit_code: 'FGMU', default_price: 42.00 },
  { name: 'PDX Wire #14', category: 'Electrical', unit: 'meters', unit_code: 'FGMU', default_price: 32.00 },
  { name: 'PVC Conduit 1/2 inch', category: 'Electrical', unit: 'lengths', unit_code: 'FGMU', default_price: 95.00 },
  { name: 'PVC Conduit 3/4 inch', category: 'Electrical', unit: 'lengths', unit_code: 'FGMU', default_price: 130.00 },
  { name: 'PVC Conduit 1 inch', category: 'Electrical', unit: 'lengths', unit_code: 'FGMU', default_price: 185.00 },
  { name: 'PVC Elbow 1/2 inch (Electrical)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 14.00 },
  { name: 'PVC Coupling 1/2 inch (Electrical)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 10.00 },
  { name: 'Junction Box 4x4', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 35.00 },
  { name: 'Utility Box 2x4', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 25.00 },
  { name: 'Switch (Single Pole)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 95.00 },
  { name: 'Switch (3-Way)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 135.00 },
  { name: 'Outlet (Duplex)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 160.00 },
  { name: 'Outlet (GFCI)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 650.00 },
  { name: 'Circuit Breaker 20A', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 240.00 },
  { name: 'Circuit Breaker 30A', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 260.00 },
  { name: 'Circuit Breaker 60A', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 380.00 },
  { name: 'Electrical Tape', category: 'Electrical', unit: 'rolls', unit_code: 'FGMU', default_price: 45.00 },
  { name: 'Wire Nut (Assorted)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 8.00 },
  { name: 'LED Bulb 9W', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 110.00 },
  { name: 'LED Bulb 12W', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 140.00 },
  { name: 'LED Bulb 18W', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'LED Tube 18W (T8)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 220.00 },
  { name: 'LED Panel Light 12W', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 320.00 },
  { name: 'LED Panel Light 18W', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 450.00 },
  { name: 'Starter (Fluorescent)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 35.00 },
  { name: 'Ballast (Electronic)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 260.00 },
  { name: 'Exhaust Fan', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 1150.00 },
  { name: 'Ceiling Fan', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 1850.00 },
  { name: 'Capacitor (Fan)', category: 'Electrical', unit: 'pcs', unit_code: 'FGMU', default_price: 120.00 },

  // Carpentry & Hardware
  { name: 'Marine Plywood 1/4 inch', category: 'Carpentry', unit: 'sheets', unit_code: 'FGMU', default_price: 420.00 },
  { name: 'Marine Plywood 1/2 inch', category: 'Carpentry', unit: 'sheets', unit_code: 'FGMU', default_price: 780.00 },
  { name: 'Marine Plywood 3/4 inch', category: 'Carpentry', unit: 'sheets', unit_code: 'FGMU', default_price: 1250.00 },
  { name: 'Ordinary Plywood 1/4 inch', category: 'Carpentry', unit: 'sheets', unit_code: 'FGMU', default_price: 340.00 },
  { name: 'Gypsum Board 1/2 inch', category: 'Carpentry', unit: 'sheets', unit_code: 'FGMU', default_price: 390.00 },
  { name: 'Metal Studs', category: 'Carpentry', unit: 'lengths', unit_code: 'FGMU', default_price: 160.00 },
  { name: 'Metal Tracks', category: 'Carpentry', unit: 'lengths', unit_code: 'FGMU', default_price: 155.00 },
  { name: 'Wood Screw 1 inch', category: 'Carpentry', unit: 'boxes', unit_code: 'FGMU', default_price: 160.00 },
  { name: 'Wood Screw 1-1/2 inch', category: 'Carpentry', unit: 'boxes', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Wood Screw 2 inch', category: 'Carpentry', unit: 'boxes', unit_code: 'FGMU', default_price: 210.00 },
  { name: 'Black Screw 1 inch', category: 'Carpentry', unit: 'boxes', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Black Screw 1-1/2 inch', category: 'Carpentry', unit: 'boxes', unit_code: 'FGMU', default_price: 210.00 },
  { name: 'Concrete Nail 1 inch', category: 'Carpentry', unit: 'kg', unit_code: 'FGMU', default_price: 90.00 },
  { name: 'Concrete Nail 2 inch', category: 'Carpentry', unit: 'kg', unit_code: 'FGMU', default_price: 90.00 },
  { name: 'Common Nail 1 inch', category: 'Carpentry', unit: 'kg', unit_code: 'FGMU', default_price: 75.00 },
  { name: 'Common Nail 2 inch', category: 'Carpentry', unit: 'kg', unit_code: 'FGMU', default_price: 75.00 },
  { name: 'Common Nail 3 inch', category: 'Carpentry', unit: 'kg', unit_code: 'FGMU', default_price: 75.00 },
  { name: 'Door Knob (Lockset)', category: 'Carpentry', unit: 'pcs', unit_code: 'FGMU', default_price: 550.00 },
  { name: 'Door Hinge 3x3', category: 'Carpentry', unit: 'pairs', unit_code: 'FGMU', default_price: 110.00 },
  { name: 'Door Hinge 4x4', category: 'Carpentry', unit: 'pairs', unit_code: 'FGMU', default_price: 160.00 },
  { name: 'Cabinet Hinge', category: 'Carpentry', unit: 'pairs', unit_code: 'FGMU', default_price: 65.00 },
  { name: 'Drawer Slide', category: 'Carpentry', unit: 'pairs', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Door Closer', category: 'Carpentry', unit: 'pcs', unit_code: 'FGMU', default_price: 850.00 },
  { name: 'Barrel Bolt', category: 'Carpentry', unit: 'pcs', unit_code: 'FGMU', default_price: 65.00 },
  { name: 'Padlock', category: 'Carpentry', unit: 'pcs', unit_code: 'FGMU', default_price: 280.00 },

  // Masonry & Concrete
  { name: 'Portland Cement', category: 'Masonry', unit: 'bags', unit_code: 'FGMU', default_price: 250.00 },
  { name: 'Sand (Washed)', category: 'Masonry', unit: 'cu.m.', unit_code: 'FGMU', default_price: 850.00 },
  { name: 'Gravel 3/4', category: 'Masonry', unit: 'cu.m.', unit_code: 'FGMU', default_price: 950.00 },
  { name: 'CHB 4 inch', category: 'Masonry', unit: 'pcs', unit_code: 'FGMU', default_price: 18.00 },
  { name: 'CHB 6 inch', category: 'Masonry', unit: 'pcs', unit_code: 'FGMU', default_price: 24.00 },
  { name: 'Rebar 10mm', category: 'Masonry', unit: 'lengths', unit_code: 'FGMU', default_price: 195.00 },
  { name: 'Rebar 12mm', category: 'Masonry', unit: 'lengths', unit_code: 'FGMU', default_price: 280.00 },
  { name: 'Tie Wire #16', category: 'Masonry', unit: 'kg', unit_code: 'FGMU', default_price: 85.00 },
  { name: 'Tile Adhesive', category: 'Masonry', unit: 'bags', unit_code: 'FGMU', default_price: 290.00 },
  { name: 'Tile Grout', category: 'Masonry', unit: 'bags', unit_code: 'FGMU', default_price: 95.00 },
  { name: 'Floor Tile 60x60', category: 'Masonry', unit: 'pcs', unit_code: 'FGMU', default_price: 195.00 },
  { name: 'Wall Tile 30x60', category: 'Masonry', unit: 'pcs', unit_code: 'FGMU', default_price: 125.00 },
  { name: 'Waterproofing Membrane', category: 'Masonry', unit: 'gallons', unit_code: 'FGMU', default_price: 1450.00 },
  { name: 'Concrete Neutralizer', category: 'Masonry', unit: 'gallons', unit_code: 'FGMU', default_price: 360.00 },

  // Painting
  { name: 'Flat Latex Paint (White)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 620.00 },
  { name: 'Semi-Gloss Latex Paint (White)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 720.00 },
  { name: 'Gloss Latex Paint (White)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 750.00 },
  { name: 'Flat Latex Paint (Tinted)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 680.00 },
  { name: 'QDE Paint (White)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 780.00 },
  { name: 'QDE Paint (Tinted)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 820.00 },
  { name: 'Primer (Red Oxide)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 580.00 },
  { name: 'Primer (White)', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 640.00 },
  { name: 'Paint Thinner', category: 'Painting', unit: 'gallons', unit_code: 'FGMU', default_price: 320.00 },
  { name: 'Paint Roller 7 inch', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 95.00 },
  { name: 'Paint Roller 9 inch', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 120.00 },
  { name: 'Paint Brush 2 inch', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 45.00 },
  { name: 'Paint Brush 3 inch', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 65.00 },
  { name: 'Baby Roller 4 inch', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 55.00 },
  { name: 'Putty Knife', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 45.00 },
  { name: 'Sandpaper #100', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 18.00 },
  { name: 'Sandpaper #120', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 18.00 },
  { name: 'Sandpaper #180', category: 'Painting', unit: 'pcs', unit_code: 'FGMU', default_price: 18.00 },
  { name: 'Body Filler', category: 'Painting', unit: 'kg', unit_code: 'FGMU', default_price: 195.00 },
  { name: 'Polyester Putty', category: 'Painting', unit: 'kg', unit_code: 'FGMU', default_price: 195.00 },

  // Welding & Metal Works
  { name: 'Welding Rod 6013 (1/8)', category: 'Welding', unit: 'kg', unit_code: 'FGMU', default_price: 140.00 },
  { name: 'Welding Rod 7018 (1/8)', category: 'Welding', unit: 'kg', unit_code: 'FGMU', default_price: 165.00 },
  { name: 'Cutting Disc 4 inch', category: 'Welding', unit: 'pcs', unit_code: 'FGMU', default_price: 35.00 },
  { name: 'Grinding Disc 4 inch', category: 'Welding', unit: 'pcs', unit_code: 'FGMU', default_price: 45.00 },
  { name: 'Angle Bar 1/4 x 1 x 1', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 480.00 },
  { name: 'Angle Bar 1/4 x 1-1/2 x 1-1/2', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 620.00 },
  { name: 'Angle Bar 3/16 x 2 x 2', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 790.00 },
  { name: 'Flat Bar 1/4 x 1', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 320.00 },
  { name: 'Flat Bar 1/4 x 2', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 580.00 },
  { name: 'Round Bar 10mm', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 190.00 },
  { name: 'Round Bar 12mm', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 270.00 },
  { name: 'GI Pipe 1/2 inch (Sched 40)', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 450.00 },
  { name: 'GI Pipe 3/4 inch (Sched 40)', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 580.00 },
  { name: 'GI Pipe 1 inch (Sched 40)', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 720.00 },
  { name: 'GI Pipe 2 inch (Sched 40)', category: 'Welding', unit: 'lengths', unit_code: 'FGMU', default_price: 1280.00 },

  // Aircon & Refrigeration
  { name: 'Copper Tube 1/4 inch', category: 'Aircon', unit: 'meters', unit_code: 'FGMU', default_price: 130.00 },
  { name: 'Copper Tube 3/8 inch', category: 'Aircon', unit: 'meters', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Copper Tube 1/2 inch', category: 'Aircon', unit: 'meters', unit_code: 'FGMU', default_price: 240.00 },
  { name: 'Refrigerant R-410A', category: 'Aircon', unit: 'kg', unit_code: 'FGMU', default_price: 480.00 },
  { name: 'Refrigerant R-32', category: 'Aircon', unit: 'kg', unit_code: 'FGMU', default_price: 520.00 },
  { name: 'Refrigerant R-22', category: 'Aircon', unit: 'kg', unit_code: 'FGMU', default_price: 450.00 },
  { name: 'Capacitor (Aircon) 45+5 uF', category: 'Aircon', unit: 'pcs', unit_code: 'FGMU', default_price: 350.00 },
  { name: 'Capacitor (Aircon) 50+5 uF', category: 'Aircon', unit: 'pcs', unit_code: 'FGMU', default_price: 380.00 },
  { name: 'Insulation Tape (Rubber)', category: 'Aircon', unit: 'rolls', unit_code: 'FGMU', default_price: 160.00 },

  // General Supplies & Consumables
  { name: 'Silicone Sealant (Clear)', category: 'General', unit: 'tubes', unit_code: 'FGMU', default_price: 165.00 },
  { name: 'Silicone Sealant (White)', category: 'General', unit: 'tubes', unit_code: 'FGMU', default_price: 165.00 },
  { name: 'Construction Adhesive', category: 'General', unit: 'tubes', unit_code: 'FGMU', default_price: 190.00 },
  { name: 'Epoxy A & B', category: 'General', unit: 'sets', unit_code: 'FGMU', default_price: 220.00 },
  { name: 'Contact Cement', category: 'General', unit: 'cans', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Rugby (Contact Cement)', category: 'General', unit: 'cans', unit_code: 'FGMU', default_price: 180.00 },
  { name: 'Masking Tape 1 inch', category: 'General', unit: 'rolls', unit_code: 'FGMU', default_price: 35.00 },
  { name: 'Duct Tape', category: 'General', unit: 'rolls', unit_code: 'FGMU', default_price: 95.00 },
  { name: 'Caution Tape', category: 'General', unit: 'rolls', unit_code: 'FGMU', default_price: 120.00 },
  { name: 'Tox #6', category: 'General', unit: 'pcs', unit_code: 'FGMU', default_price: 1.50 },
  { name: 'Tox #8', category: 'General', unit: 'pcs', unit_code: 'FGMU', default_price: 2.00 },
  { name: 'Screw 1 inch (Metal)', category: 'General', unit: 'boxes', unit_code: 'FGMU', default_price: 140.00 },

  // ===========================================================================
  // LEAU Materials (Landscaping & Environmental Aesthetics Unit)
  // ===========================================================================
  // Grounds Maintenance & Lawn Care
  { name: 'Nylon Trimmer Line 3.0mm (Grass Cutter)', category: 'Grounds Maintenance', unit: 'rolls', unit_code: 'LEAU', default_price: 350.00 },
  { name: 'Grass Cutter Blade (Metal 2-Tooth)', category: 'Grounds Maintenance', unit: 'pcs', unit_code: 'LEAU', default_price: 220.00 },
  { name: 'Grass Cutter Blade (Circular 40-Tooth)', category: 'Grounds Maintenance', unit: 'pcs', unit_code: 'LEAU', default_price: 280.00 },
  { name: '2T Engine Oil for Brush Cutters', category: 'Grounds Maintenance', unit: 'liters', unit_code: 'LEAU', default_price: 185.00 },
  { name: 'Regular Unleaded Gasoline (Equipment Fuel)', category: 'Grounds Maintenance', unit: 'liters', unit_code: 'LEAU', default_price: 65.00 },
  { name: 'Heavy-Duty Garden Waste Sacks', category: 'Grounds Maintenance', unit: 'pcs', unit_code: 'LEAU', default_price: 25.00 },
  { name: 'Rake Bamboo / Metal Teeth Replacement', category: 'Grounds Maintenance', unit: 'pcs', unit_code: 'LEAU', default_price: 120.00 },
  { name: 'Grass Shears Hand Trimmer', category: 'Grounds Maintenance', unit: 'pcs', unit_code: 'LEAU', default_price: 320.00 },

  // Seedlings & Ornamental Plants
  { name: 'Carabao Grass Sod (Square Foot)', category: 'Seedlings & Plants', unit: 'sq.ft.', unit_code: 'LEAU', default_price: 18.00 },
  { name: 'Bermuda Grass Turf Sod', category: 'Seedlings & Plants', unit: 'sq.ft.', unit_code: 'LEAU', default_price: 25.00 },
  { name: 'Bougainvillea Potted Shrub', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 150.00 },
  { name: 'San Francisco Plant (Codiaeum variegatum)', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 120.00 },
  { name: 'Ficus Hedge Seedlings (Green Island)', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 45.00 },
  { name: 'Palmera Palm Seedling (Areca)', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 280.00 },
  { name: 'Yellow Bell Shrub Potted', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 95.00 },
  { name: 'Ornamental Bamboo Cutting', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 75.00 },
  { name: 'Spathoglottis Ground Orchid', category: 'Seedlings & Plants', unit: 'pcs', unit_code: 'LEAU', default_price: 85.00 },

  // Soil, Fertilizers & Nursery
  { name: 'Organic Garden Soil / Topsoil', category: 'Soil & Fertilizers', unit: 'bags', unit_code: 'LEAU', default_price: 85.00 },
  { name: 'Vermicast Organic Fertilizer (50kg)', category: 'Soil & Fertilizers', unit: 'bags', unit_code: 'LEAU', default_price: 320.00 },
  { name: 'Complete Fertilizer 14-14-14', category: 'Soil & Fertilizers', unit: 'kg', unit_code: 'LEAU', default_price: 60.00 },
  { name: 'Urea Fertilizer 46-0-0', category: 'Soil & Fertilizers', unit: 'kg', unit_code: 'LEAU', default_price: 55.00 },
  { name: 'Carbonized Rice Hull (CRH)', category: 'Soil & Fertilizers', unit: 'bags', unit_code: 'LEAU', default_price: 110.00 },
  { name: 'Coco Coir Dust / Fiber', category: 'Soil & Fertilizers', unit: 'bags', unit_code: 'LEAU', default_price: 95.00 },
  { name: 'Black Seedling Nursery Bags 4x6', category: 'Soil & Fertilizers', unit: 'packs', unit_code: 'LEAU', default_price: 80.00 },
  { name: 'Garden Lime (Calcium Carbonate)', category: 'Soil & Fertilizers', unit: 'kg', unit_code: 'LEAU', default_price: 35.00 },

  // Tree Care & Arboriculture
  { name: 'Chainsaw Bar & Chain Oil', category: 'Tree Care', unit: 'liters', unit_code: 'LEAU', default_price: 220.00 },
  { name: 'Tree Wound Pruning Sealant / Tar', category: 'Tree Care', unit: 'cans', unit_code: 'LEAU', default_price: 290.00 },
  { name: 'Heavy-Duty Tree Climbing / Pulling Rope (16mm)', category: 'Tree Care', unit: 'meters', unit_code: 'LEAU', default_price: 65.00 },
  { name: 'Heavy Duty Burlap Wrap', category: 'Tree Care', unit: 'rolls', unit_code: 'LEAU', default_price: 380.00 },
  { name: 'Tree Stake Bamboo Posts 2-meter', category: 'Tree Care', unit: 'pcs', unit_code: 'LEAU', default_price: 45.00 },
  { name: 'High-Tree Pruner Replacement Blade', category: 'Tree Care', unit: 'pcs', unit_code: 'LEAU', default_price: 320.00 },

  // Irrigation & Watering
  { name: 'Garden Hose 3/4 inch Heavy-Duty (50m)', category: 'Irrigation', unit: 'rolls', unit_code: 'LEAU', default_price: 1250.00 },
  { name: 'Brass Adjustable Spray Nozzle', category: 'Irrigation', unit: 'pcs', unit_code: 'LEAU', default_price: 180.00 },
  { name: 'Impact Lawn Sprinkler Head', category: 'Irrigation', unit: 'pcs', unit_code: 'LEAU', default_price: 250.00 },
  { name: 'Stainless Hose Clamp 3/4 inch', category: 'Irrigation', unit: 'pcs', unit_code: 'LEAU', default_price: 25.00 },

  // Stage & Event Decoration Consumables
  { name: 'Floral Foam Brick (Oasis Wet)', category: 'Event Decoration', unit: 'boxes', unit_code: 'LEAU', default_price: 380.00 },
  { name: 'Satin Table & Stage Skirting Fabric', category: 'Event Decoration', unit: 'meters', unit_code: 'LEAU', default_price: 85.00 },
  { name: 'Artificial Palm Garland / Greenery Drapes', category: 'Event Decoration', unit: 'pcs', unit_code: 'LEAU', default_price: 210.00 },
  { name: 'Pot Wrap Decorative Foil (Gold/Green)', category: 'Event Decoration', unit: 'rolls', unit_code: 'LEAU', default_price: 140.00 },
  { name: 'Cable Ties Heavy Duty 12-inch', category: 'Event Decoration', unit: 'packs', unit_code: 'LEAU', default_price: 110.00 },
  { name: 'Event Floral Wire Green (Gauge 22)', category: 'Event Decoration', unit: 'rolls', unit_code: 'LEAU', default_price: 95.00 },
];

// Helper to get unique categories
export const MATERIAL_CATEGORIES = [...new Set(COMMON_MATERIALS.map(m => m.category))].sort();

// Helper to filter materials by sub-unit ('FGMU', 'LEAU', or 'ALL')
export const getMaterialsByUnit = (unit = 'ALL') => {
  const norm = String(unit || 'ALL').toUpperCase().trim();
  if (norm === 'ALL' || !norm) return COMMON_MATERIALS;
  return COMMON_MATERIALS.filter(m => m.unit_code === norm);
};

// Helper to get materials by category
export const getMaterialsByCategory = (category, unit = 'ALL') => {
  const list = getMaterialsByUnit(unit);
  return list.filter(m => m.category.toLowerCase() === String(category || '').toLowerCase());
};

// Helper to get material names list by sub-unit (for datalist/autocomplete)
export const getMaterialNamesByUnit = (unit = 'ALL') => {
  const list = getMaterialsByUnit(unit);
  return list.map(m => m.name).sort();
};

// Backward-compatible export of all material names
export const ALL_MATERIAL_NAMES = COMMON_MATERIALS.map(m => m.name).sort();

// Helper to get material info by name and optional unit
export const getMaterialInfo = (name, unit = 'ALL') => {
  if (!name) return null;
  const target = String(name).toLowerCase().trim();
  const list = getMaterialsByUnit(unit);
  return list.find(m => m.name.toLowerCase() === target) ||
         COMMON_MATERIALS.find(m => m.name.toLowerCase() === target) || null;
};

// Helper to get default unit for a material
export const getDefaultUnit = (materialName, unit = 'ALL') => {
  const material = getMaterialInfo(materialName, unit);
  return material?.unit || 'pcs';
};

// Helper to get default unit price for a material
export const getDefaultPrice = (materialName, unit = 'ALL') => {
  const material = getMaterialInfo(materialName, unit);
  return material?.default_price || 0;
};