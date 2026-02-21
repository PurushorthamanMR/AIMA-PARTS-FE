/**
 * Mock data for POS - categories, products, brands
 * Used when API fails or returns empty data
 */

export const MOCK_CATEGORIES = [
  { id: 1, productCategoryName: 'Engine Oil', isActive: true },
  { id: 2, productCategoryName: 'Brake Pads', isActive: true },
  { id: 3, productCategoryName: 'Air Filters', isActive: true },
  { id: 4, productCategoryName: 'Spark Plugs', isActive: true },
  { id: 5, productCategoryName: 'Batteries', isActive: true },
  { id: 6, productCategoryName: 'Belts & Hoses', isActive: true },
  { id: 7, productCategoryName: 'Lighting', isActive: true },
  { id: 8, productCategoryName: 'Wipers', isActive: true },
  { id: 9, productCategoryName: 'Clutch', isActive: true },
  { id: 10, productCategoryName: 'Suspension', isActive: true }
]

export const MOCK_PRODUCTS_BY_CATEGORY = {
  'Engine Oil': [
    { id: 101, name: 'Engine Oil 5W30', pricePerUnit: 450, barcode: 'EO-5W30-001', taxDto: { taxPercentage: 18 } },
    { id: 102, name: 'Engine Oil 10W40', pricePerUnit: 520, barcode: 'EO-10W40-001', taxDto: { taxPercentage: 18 } },
    { id: 103, name: 'Engine Oil 20W50', pricePerUnit: 380, barcode: 'EO-20W50-001', taxDto: { taxPercentage: 18 } },
    { id: 104, name: 'Synthetic Oil 5W30', pricePerUnit: 890, barcode: 'SO-5W30-001', taxDto: { taxPercentage: 18 } },
    { id: 105, name: 'Synthetic Oil 0W20', pricePerUnit: 1200, barcode: 'SO-0W20-001', taxDto: { taxPercentage: 18 } }
  ],
  'Brake Pads': [
    { id: 201, name: 'Front Brake Pads', pricePerUnit: 1200, barcode: 'BP-F-001', taxDto: { taxPercentage: 18 } },
    { id: 202, name: 'Rear Brake Pads', pricePerUnit: 950, barcode: 'BP-R-001', taxDto: { taxPercentage: 18 } },
    { id: 203, name: 'Ceramic Brake Pads', pricePerUnit: 2100, barcode: 'BP-C-001', taxDto: { taxPercentage: 18 } }
  ],
  'Air Filters': [
    { id: 301, name: 'Cabin Air Filter', pricePerUnit: 350, barcode: 'AF-C-001', taxDto: { taxPercentage: 18 } },
    { id: 302, name: 'Engine Air Filter', pricePerUnit: 420, barcode: 'AF-E-001', taxDto: { taxPercentage: 18 } },
    { id: 303, name: 'Heavy Duty Air Filter', pricePerUnit: 680, barcode: 'AF-H-001', taxDto: { taxPercentage: 18 } }
  ],
  'Spark Plugs': [
    { id: 401, name: 'Copper Spark Plug', pricePerUnit: 120, barcode: 'SP-C-001', taxDto: { taxPercentage: 18 } },
    { id: 402, name: 'Iridium Spark Plug', pricePerUnit: 450, barcode: 'SP-I-001', taxDto: { taxPercentage: 18 } },
    { id: 403, name: 'Platinum Spark Plug', pricePerUnit: 280, barcode: 'SP-P-001', taxDto: { taxPercentage: 18 } }
  ],
  'Batteries': [
    { id: 501, name: '12V 35Ah Battery', pricePerUnit: 4500, barcode: 'BAT-35-001', taxDto: { taxPercentage: 18 } },
    { id: 502, name: '12V 45Ah Battery', pricePerUnit: 5200, barcode: 'BAT-45-001', taxDto: { taxPercentage: 18 } },
    { id: 503, name: '12V 65Ah Battery', pricePerUnit: 6800, barcode: 'BAT-65-001', taxDto: { taxPercentage: 18 } }
  ],
  'Belts & Hoses': [
    { id: 601, name: 'Timing Belt', pricePerUnit: 1800, barcode: 'TB-001', taxDto: { taxPercentage: 18 } },
    { id: 602, name: 'Serpentine Belt', pricePerUnit: 650, barcode: 'SB-001', taxDto: { taxPercentage: 18 } },
    { id: 603, name: 'Radiator Hose', pricePerUnit: 420, barcode: 'RH-001', taxDto: { taxPercentage: 18 } }
  ],
  'Lighting': [
    { id: 701, name: 'LED Headlight', pricePerUnit: 1500, barcode: 'LED-H-001', taxDto: { taxPercentage: 18 } },
    { id: 702, name: 'Halogen Bulb', pricePerUnit: 180, barcode: 'HB-001', taxDto: { taxPercentage: 18 } },
    { id: 703, name: 'Tail Light Assembly', pricePerUnit: 2200, barcode: 'TL-001', taxDto: { taxPercentage: 18 } }
  ],
  'Wipers': [
    { id: 801, name: 'Front Wiper 18"', pricePerUnit: 350, barcode: 'WP-F18-001', taxDto: { taxPercentage: 18 } },
    { id: 802, name: 'Rear Wiper', pricePerUnit: 280, barcode: 'WP-R-001', taxDto: { taxPercentage: 18 } },
    { id: 803, name: 'Wiper Blade Set', pricePerUnit: 450, barcode: 'WP-SET-001', taxDto: { taxPercentage: 18 } }
  ],
  'Clutch': [
    { id: 901, name: 'Clutch Plate', pricePerUnit: 3500, barcode: 'CP-001', taxDto: { taxPercentage: 18 } },
    { id: 902, name: 'Clutch Kit', pricePerUnit: 5800, barcode: 'CK-001', taxDto: { taxPercentage: 18 } }
  ],
  'Suspension': [
    { id: 1001, name: 'Shock Absorber', pricePerUnit: 2200, barcode: 'SA-001', taxDto: { taxPercentage: 18 } },
    { id: 1002, name: 'Strut Assembly', pricePerUnit: 4500, barcode: 'STR-001', taxDto: { taxPercentage: 18 } },
    { id: 1003, name: 'Stabilizer Link', pricePerUnit: 650, barcode: 'SL-001', taxDto: { taxPercentage: 18 } }
  ]
}

// Brands per product - when product has multiple brand options
export const MOCK_BRANDS_BY_PRODUCT = {
  'Engine Oil 5W30': [
    { id: 101, name: 'Castrol 5W30', pricePerUnit: 450, barcode: 'EO-5W30-C', taxDto: { taxPercentage: 18 } },
    { id: 1011, name: 'Mobil 5W30', pricePerUnit: 480, barcode: 'EO-5W30-M', taxDto: { taxPercentage: 18 } },
    { id: 1012, name: 'Shell 5W30', pricePerUnit: 420, barcode: 'EO-5W30-S', taxDto: { taxPercentage: 18 } }
  ],
  'Engine Oil 10W40': [
    { id: 102, name: 'Castrol 10W40', pricePerUnit: 520, barcode: 'EO-10W40-C', taxDto: { taxPercentage: 18 } },
    { id: 1021, name: 'Mobil 10W40', pricePerUnit: 550, barcode: 'EO-10W40-M', taxDto: { taxPercentage: 18 } }
  ],
  'Engine Oil 20W50': [
    { id: 103, name: 'Castrol 20W50', pricePerUnit: 380, barcode: 'EO-20W50-C', taxDto: { taxPercentage: 18 } },
    { id: 1031, name: 'Gulf 20W50', pricePerUnit: 350, barcode: 'EO-20W50-G', taxDto: { taxPercentage: 18 } }
  ],
  'Front Brake Pads': [
    { id: 201, name: 'Bosch Front Pads', pricePerUnit: 1200, barcode: 'BP-F-B', taxDto: { taxPercentage: 18 } },
    { id: 2011, name: 'Brembo Front Pads', pricePerUnit: 1850, barcode: 'BP-F-BR', taxDto: { taxPercentage: 18 } }
  ],
  'Cabin Air Filter': [
    { id: 301, name: 'Bosch Cabin Filter', pricePerUnit: 350, barcode: 'AF-C-B', taxDto: { taxPercentage: 18 } },
    { id: 3011, name: 'Mann Cabin Filter', pricePerUnit: 420, barcode: 'AF-C-M', taxDto: { taxPercentage: 18 } }
  ],
  '12V 35Ah Battery': [
    { id: 501, name: 'Exide 35Ah', pricePerUnit: 4500, barcode: 'BAT-35-E', taxDto: { taxPercentage: 18 } },
    { id: 5011, name: 'Amaron 35Ah', pricePerUnit: 4800, barcode: 'BAT-35-A', taxDto: { taxPercentage: 18 } }
  ]
}
