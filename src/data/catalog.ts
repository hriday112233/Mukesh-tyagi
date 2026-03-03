import { CatalogItem } from '../types';

export const CATALOG_DATA: CatalogItem[] = [
  {
    id: 'f1',
    name: 'Natural Oak Plank',
    category: 'flooring',
    type: 'Hardwood',
    style: 'scandinavian',
    application: ['Living Room', 'Bedroom', 'Dining Room'],
    specifications: {
      material: 'Solid Oak',
      finish: 'Matte Oil',
      thickness: '18mm',
      width: '150mm'
    },
    price: 3200,
    unit: 'sqm',
    brand: 'NordicFloors',
    imageUrl: 'https://picsum.photos/seed/wood-floor/800/600',
    supplierUrl: 'https://example.com/nordic-oak'
  },
  {
    id: 'f2',
    name: 'Polished Concrete Tile',
    category: 'flooring',
    type: 'Vitrified Tile',
    style: 'industrial',
    application: ['Kitchen', 'Bathroom', 'Commercial'],
    specifications: {
      material: 'Ceramic',
      finish: 'High Gloss',
      size: '600x600mm'
    },
    price: 850,
    unit: 'sqm',
    brand: 'Kajaria',
    imageUrl: 'https://picsum.photos/seed/concrete-tile/800/600',
    supplierUrl: 'https://example.com/kajaria-concrete'
  },
  {
    id: 'f3',
    name: 'Herringbone Walnut',
    category: 'flooring',
    type: 'Engineered Wood',
    style: 'classic',
    application: ['Study', 'Master Bedroom'],
    specifications: {
      material: 'Walnut Veneer',
      pattern: 'Herringbone',
      thickness: '15mm'
    },
    price: 4500,
    unit: 'sqm',
    brand: 'Pergo',
    imageUrl: 'https://picsum.photos/seed/herringbone/800/600',
    supplierUrl: 'https://example.com/pergo-herringbone'
  },
  {
    id: 'p1',
    name: 'Emerald Mist',
    category: 'paint',
    type: 'Emulsion',
    style: 'modern',
    application: ['Accent Walls', 'Living Room'],
    specifications: {
      finish: 'Satin',
      coverage: '12-14 sqm/L',
      dryingTime: '2-4 hours'
    },
    price: 450,
    unit: 'L',
    brand: 'Asian Paints',
    imageUrl: 'https://picsum.photos/seed/green-paint/800/600',
    supplierUrl: 'https://example.com/asian-paints-emerald'
  },
  {
    id: 'p2',
    name: 'Arctic White',
    category: 'paint',
    type: 'Acrylic',
    style: 'minimalist',
    application: ['Ceilings', 'Walls'],
    specifications: {
      finish: 'Matte',
      reflectivity: '92%',
      washable: 'Yes'
    },
    price: 380,
    unit: 'L',
    brand: 'Berger',
    imageUrl: 'https://picsum.photos/seed/white-paint/800/600',
    supplierUrl: 'https://example.com/berger-arctic'
  },
  {
    id: 'fur1',
    name: 'Mid-Century Velvet Sofa',
    category: 'furniture',
    type: 'Sofa',
    style: 'modern',
    application: ['Living Room'],
    specifications: {
      material: 'Velvet, Solid Wood Frame',
      capacity: '3 Seater',
      dimensions: '210 x 90 x 85 cm'
    },
    price: 45000,
    unit: 'pc',
    brand: 'Urban Ladder',
    imageUrl: 'https://picsum.photos/seed/sofa-velvet/800/600',
    supplierUrl: 'https://example.com/urban-ladder-sofa'
  },
  {
    id: 'fur2',
    name: 'Industrial Coffee Table',
    category: 'furniture',
    type: 'Table',
    style: 'industrial',
    application: ['Living Room', 'Lounge'],
    specifications: {
      material: 'Reclaimed Wood, Steel',
      dimensions: '100 x 60 x 45 cm',
      weight: '15kg'
    },
    price: 12000,
    unit: 'pc',
    brand: 'Pepperfry',
    imageUrl: 'https://picsum.photos/seed/coffee-table/800/600',
    supplierUrl: 'https://example.com/pepperfry-table'
  },
  {
    id: 'fur3',
    name: 'Eames Style Lounge Chair',
    category: 'furniture',
    type: 'Chair',
    style: 'modern',
    application: ['Study', 'Living Room'],
    specifications: {
      material: 'Leather, Plywood',
      features: 'Swivel, Ottoman included',
      designer: 'Inspired by Eames'
    },
    price: 35000,
    unit: 'pc',
    brand: 'DesignWithinReach',
    imageUrl: 'https://picsum.photos/seed/lounge-chair/800/600',
    supplierUrl: 'https://example.com/eames-chair',
    isPro: true
  },
  {
    id: 'l1',
    name: 'Industrial Pendant Light',
    category: 'lighting',
    type: 'Pendant',
    style: 'industrial',
    application: ['Kitchen Island', 'Dining Area'],
    specifications: {
      material: 'Matte Black Metal',
      bulbType: 'E27 LED',
      diameter: '30cm'
    },
    price: 2800,
    unit: 'pc',
    brand: 'Philips',
    imageUrl: 'https://picsum.photos/seed/industrial-light/800/600',
    supplierUrl: 'https://example.com/philips-industrial'
  },
  {
    id: 'l2',
    name: 'Crystal Waterfall Chandelier',
    category: 'lighting',
    type: 'Fancy Light',
    style: 'classic',
    application: ['Grand Foyer', 'Dining Room'],
    specifications: {
      material: 'K9 Crystal, Chrome Finish',
      dimensions: '80cm x 120cm',
      bulbs: '12 x G9 LED'
    },
    price: 85000,
    unit: 'pc',
    brand: 'Tisva',
    imageUrl: 'https://picsum.photos/seed/chandelier/800/600',
    supplierUrl: 'https://example.com/tisva-chandelier',
    isPro: true
  },
  {
    id: 'l3',
    name: 'Minimalist LED Floor Lamp',
    category: 'lighting',
    type: 'Floor Lamp',
    style: 'minimalist',
    application: ['Reading Nook', 'Bedroom'],
    specifications: {
      material: 'Aluminum',
      brightness: '1200 Lumens',
      dimmable: 'Yes'
    },
    price: 6500,
    unit: 'pc',
    brand: 'IKEA',
    imageUrl: 'https://picsum.photos/seed/floor-lamp/800/600',
    supplierUrl: 'https://example.com/ikea-lamp'
  },
  {
    id: 'pl1',
    name: 'Matte Black Rain Shower',
    category: 'plumbing',
    type: 'Shower System',
    style: 'minimalist',
    application: ['Master Bathroom'],
    specifications: {
      material: 'Brass',
      finish: 'Matte Black',
      features: 'Thermostatic Control, 12-inch Head'
    },
    price: 12500,
    unit: 'pc',
    brand: 'Kohler',
    imageUrl: 'https://picsum.photos/seed/shower-head/800/600',
    supplierUrl: 'https://example.com/kohler-shower'
  },
  {
    id: 'pl2',
    name: 'Wall-Hung Smart Toilet',
    category: 'plumbing',
    type: 'Sanitaryware',
    style: 'modern',
    application: ['Bathroom'],
    specifications: {
      features: 'Heated Seat, Bidet, Auto-Flush',
      material: 'Ceramic',
      color: 'Alpine White'
    },
    price: 65000,
    unit: 'pc',
    brand: 'Toto',
    imageUrl: 'https://picsum.photos/seed/toilet/800/600',
    supplierUrl: 'https://example.com/toto-smart-toilet',
    isPro: true
  },
  {
    id: 's1',
    name: 'Abstract Horizon Canvas',
    category: 'scenery',
    type: 'Wall Art',
    style: 'modern',
    application: ['Living Room', 'Office'],
    specifications: {
      medium: 'Oil on Canvas',
      dimensions: '120cm x 90cm',
      frame: 'Floating Black Wood'
    },
    price: 15000,
    unit: 'pc',
    brand: 'ArtZ',
    imageUrl: 'https://picsum.photos/seed/abstract-art/800/600',
    supplierUrl: 'https://example.com/artz-horizon'
  },
  {
    id: 's2',
    name: 'Tropical Palm Scenery',
    category: 'scenery',
    type: 'Framed Print',
    style: 'bohemian',
    application: ['Bedroom', 'Lounge'],
    specifications: {
      type: 'Giclee Print',
      dimensions: '60cm x 80cm',
      glass: 'Anti-Reflective'
    },
    price: 4500,
    unit: 'pc',
    brand: 'PosterGully',
    imageUrl: 'https://picsum.photos/seed/palm-art/800/600',
    supplierUrl: 'https://example.com/poster-palm'
  },
  {
    id: 'w1',
    name: 'Geometric Gold Wallpaper',
    category: 'wallpaper',
    type: 'Vinyl',
    style: 'modern',
    application: ['Bedroom', 'Feature Wall'],
    specifications: {
      pattern: 'Geometric',
      rollSize: '0.53m x 10m',
      washable: 'Yes'
    },
    price: 1200,
    unit: 'roll',
    brand: 'Marshalls',
    imageUrl: 'https://picsum.photos/seed/wallpaper-geo/800/600',
    supplierUrl: 'https://example.com/marshalls-geometric'
  },
  {
    id: 'w2',
    name: 'Textured Linen Wallpaper',
    category: 'wallpaper',
    type: 'Non-woven',
    style: 'minimalist',
    application: ['Living Room', 'Dining Room'],
    specifications: {
      texture: 'Linen',
      color: 'Oatmeal',
      breathable: 'Yes'
    },
    price: 2200,
    unit: 'roll',
    brand: 'Nilaya',
    imageUrl: 'https://picsum.photos/seed/linen-wallpaper/800/600',
    supplierUrl: 'https://example.com/nilaya-linen'
  },
  {
    id: 'd1',
    name: 'Hand-Woven Jute Rug',
    category: 'decorative',
    type: 'Rug',
    style: 'bohemian',
    application: ['Living Room', 'Entryway'],
    specifications: {
      material: 'Natural Jute',
      size: '5ft x 8ft',
      thickness: '10mm'
    },
    price: 5500,
    unit: 'pc',
    brand: 'FabIndia',
    imageUrl: 'https://picsum.photos/seed/jute-rug/800/600',
    supplierUrl: 'https://example.com/fabindia-rug'
  },
  {
    id: 'd2',
    name: 'Ceramic Vase Set',
    category: 'decorative',
    type: 'Vase',
    style: 'minimalist',
    application: ['Shelves', 'Tables'],
    specifications: {
      material: 'Hand-fired Ceramic',
      count: '3 pieces',
      finish: 'Matte'
    },
    price: 3200,
    unit: 'set',
    brand: 'HomeCentre',
    imageUrl: 'https://picsum.photos/seed/vases/800/600',
    supplierUrl: 'https://example.com/homecentre-vases'
  }
];
