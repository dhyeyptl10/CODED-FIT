/**
 * CODED-FIT / NOVA STREET — Product Catalog Service
 * Complete 16 Products (8 Men + 8 Women) with Bespoke Fabric Mill specifications
 */

export interface Product {
  id: string;
  name: string;
  category: 'T-Shirts' | 'Tops' | 'Bottoms' | 'Jackets' | 'Hoodies' | 'Dresses' | 'Kids';
  price: number;
  mrp: number;
  badge: 'BESTSELLER' | 'UR PICK' | 'EXCLUSIVE' | 'LIMITED DEAL' | 'BESPOKE OPTION' | 'SALE' | 'NEW ARRIVAL' | 'LIMITED';
  fabric: string;
  dispatch: string;
  stockLeft: number;
  hypeRating: number;
  sizes: string[];
  outOfStock: string[];
  funnel: 'ready-to-wear' | 'custom-made';
  gender: 'men' | 'women' | 'kids' | 'unisex';
  images: string[];
  description: string;
  colors?: { name: string; hex: string }[];
}

export const PRODUCTS: Product[] = [
  // ── MEN'S COLLECTION ──
  {
    id: 'm1',
    name: 'Aether Oversized Tee',
    category: 'T-Shirts',
    price: 1499,
    mrp: 2499,
    badge: 'BESTSELLER',
    fabric: '280 GSM GOTS Organic Cotton',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 24,
    hypeRating: 97,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=85'
    ],
    description: 'Our signature drop-shoulder oversized silhouette. Crafted from GOTS-certified organic cotton from Ahmedabad mills. 280 GSM heavyweight jersey canvas-washed for a luxury vintage fade.'
  },
  {
    id: 'm2',
    name: 'Tactical Cargo Trousers',
    category: 'Bottoms',
    price: 2899,
    mrp: 3999,
    badge: 'UR PICK',
    fabric: '320 GSM Ripstop Cotton Twill',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 18,
    hypeRating: 94,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: ['S'],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85'
    ],
    description: '6-pocket tactical utility cargos with expandable bellows pockets, custom gunmetal D-rings, and adjustable ankle cinch cords.'
  },
  {
    id: 'm3',
    name: 'Obsidian Boxy Denim Jacket',
    category: 'Jackets',
    price: 4299,
    mrp: 5999,
    badge: 'EXCLUSIVE',
    fabric: '14.5oz Japanese Selvedge Denim',
    dispatch: 'Bespoke Made-to-Measure 7-14 Days',
    stockLeft: 8,
    hypeRating: 99,
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'custom-made',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85'
    ],
    description: 'Structured boxy jacket crafted from raw Japanese selvedge denim woven in Okayama and tailored with custom monogramming.'
  },
  {
    id: 'm4',
    name: 'Vortex Heavy Fleece Hoodie',
    category: 'Hoodies',
    price: 3499,
    mrp: 4999,
    badge: 'LIMITED DEAL',
    fabric: '450 GSM French Terry',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 14,
    hypeRating: 96,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=900&q=85'
    ],
    description: '450 GSM heavyweight French terry fleece with structured double-layer hood, hidden phone pocket, and custom metal aglets.'
  },
  {
    id: 'm5',
    name: 'Monolith Tailored Chinos',
    category: 'Bottoms',
    price: 2199,
    mrp: 3299,
    badge: 'BESPOKE OPTION',
    fabric: 'GOTS Organic Cotton Twill',
    dispatch: 'Bespoke Made-to-Measure 7-14 Days',
    stockLeft: 25,
    hypeRating: 91,
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'custom-made',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85'
    ],
    description: 'Unit-of-one tailored chinos calibrated to your exact inseam and waist measurements. Clean tapered leg with hidden coin pocket.'
  },
  {
    id: 'm6',
    name: 'Cipher Ribbed Knit Polo',
    category: 'T-Shirts',
    price: 1899,
    mrp: 2699,
    badge: 'UR PICK',
    fabric: 'Fine Gauge Ribbed Knit',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 22,
    hypeRating: 93,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=85',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85'
    ],
    description: 'Vintage-inspired knit polo with textured rib stitch, mother-of-pearl buttons, and tailored arm cuffs.'
  },
  {
    id: 'm7',
    name: 'Apex Matte Puffer Jacket',
    category: 'Jackets',
    price: 4999,
    mrp: 6999,
    badge: 'LIMITED DEAL',
    fabric: 'Recycled Matte Nylon Shell',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 6,
    hypeRating: 98,
    sizes: ['S', 'M', 'L', 'XL'],
    outOfStock: ['S'],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&q=85',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85'
    ],
    description: 'Ultra-lightweight thermal down puffer featuring matte water-repellent finish, internal carry straps, and fleece-lined pockets.'
  },
  {
    id: 'm8',
    name: 'Specter Zip Hoodie',
    category: 'Hoodies',
    price: 3199,
    mrp: 4499,
    badge: 'SALE',
    fabric: 'Brushed French Terry',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 16,
    hypeRating: 89,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=85',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85'
    ],
    description: 'Two-way heavy gauge YKK zip hoodie in double-brushed organic terry. Structured drop shoulders and deep hood.'
  },

  // ── WOMEN'S COLLECTION ──
  {
    id: 'w1',
    name: 'Aura Fitted Crop Tee',
    category: 'T-Shirts',
    price: 1299,
    mrp: 1999,
    badge: 'BESTSELLER',
    fabric: '220 GSM GOTS Organic Cotton',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 18,
    hypeRating: 96,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85'
    ],
    description: 'Flattering body-contouring crop tee with subtle stretch, baby-locked hems, and breathable combed cotton.'
  },
  {
    id: 'w2',
    name: 'Silhouette Flared Midi Dress',
    category: 'Dresses',
    price: 3499,
    mrp: 4999,
    badge: 'NEW ARRIVAL',
    fabric: 'TENCEL™ Lyocell Blend',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 12,
    hypeRating: 94,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85'
    ],
    description: 'Graceful A-line midi dress tailored from sustainable Austrian TENCEL lyocell. Features deep scoop back and flowy hem.'
  },
  {
    id: 'w3',
    name: 'Soleil High-Waist Linen Trousers',
    category: 'Bottoms',
    price: 2499,
    mrp: 3499,
    badge: 'UR PICK',
    fabric: 'Pure Italian Organic Linen',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 20,
    hypeRating: 91,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85',
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85'
    ],
    description: 'High-rise relaxed wide-leg trousers woven in Biella from European flax linen. Elasticated rear waist with tailored front pleats.'
  },
  {
    id: 'w4',
    name: 'Nova Bespoke Linen Shirt',
    category: 'Tops',
    price: 2799,
    mrp: 3999,
    badge: 'BESPOKE OPTION',
    fabric: '210 GSM Biella Linen',
    dispatch: 'Bespoke Made-to-Measure 7-14 Days',
    stockLeft: 30,
    hypeRating: 89,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'custom-made',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&q=85'
    ],
    description: 'Bespoke boyfriend linen shirt with custom monogram embroidery, french seams, and natural trocas shell buttons.'
  },
  {
    id: 'w5',
    name: 'Onyx Oversized Blazer',
    category: 'Jackets',
    price: 5499,
    mrp: 7499,
    badge: 'EXCLUSIVE',
    fabric: 'Italian Wool-Cotton Blend',
    dispatch: 'Bespoke Made-to-Measure 7-14 Days',
    stockLeft: 8,
    hypeRating: 97,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'custom-made',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85'
    ],
    description: 'Power tailoring. Lightly padded shoulders, double-breasted closure, and cupro jacquard lining woven with Nova Street motif.'
  },
  {
    id: 'w6',
    name: 'Crescent Ribbed Knit Dress',
    category: 'Dresses',
    price: 2999,
    mrp: 4299,
    badge: 'LIMITED DEAL',
    fabric: 'Fine Gauge Merino Rib',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 10,
    hypeRating: 95,
    sizes: ['XS', 'S', 'M', 'L'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=85',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&q=85'
    ],
    description: 'Sculpting midi dress in ultra-fine New Zealand merino wool blend. Features subtle side slit and mock neck collar.'
  },
  {
    id: 'w7',
    name: 'Dusk Puffer Vest',
    category: 'Jackets',
    price: 3299,
    mrp: 4699,
    badge: 'UR PICK',
    fabric: 'Recycled Ripstop Shell',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 15,
    hypeRating: 90,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85'
    ],
    description: 'Cropped boxy puffer vest with high chin-guard collar, concealed zipper pockets, and bungee hem cinch.'
  },
  {
    id: 'w8',
    name: 'Sage French Terry Hoodie',
    category: 'Hoodies',
    price: 2899,
    mrp: 4199,
    badge: 'SALE',
    fabric: '380 GSM Organic French Terry',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 19,
    hypeRating: 92,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85'
    ],
    description: 'Relaxed oversized hoodie in botanical sage green. Brushed loopback interior and embroidered tone-on-tone sleeve branding.'
  },

  // ── KIDS' COLLECTION ──
  {
    id: 'k1',
    name: 'Junior Explorer Graphic Tee',
    category: 'Kids',
    price: 899,
    mrp: 1299,
    badge: 'NEW ARRIVAL',
    fabric: '180 GSM Soft Combed Cotton',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 50,
    hypeRating: 93,
    sizes: ['2-4Y', '6-8Y', '10-12Y'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'kids',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&q=85'
    ],
    description: 'Everyday kids tee in soft combed cotton with reinforced shoulder seams and tag-free neckline. Playground-tested durability.'
  },
  {
    id: 'k2',
    name: 'Junior Field Cargo Pants',
    category: 'Kids',
    price: 1499,
    mrp: 2199,
    badge: 'BESTSELLER',
    fabric: '240 GSM Cotton Twill with Stretch',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 40,
    hypeRating: 91,
    sizes: ['2-4Y', '6-8Y', '10-12Y'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'kids',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
      'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=900&q=85'
    ],
    description: 'Kids cargo pants with adjustable waist, knee reinforcement, and roomy pockets. Grows-with-them adjustable hems.'
  },
  {
    id: 'k3',
    name: 'Junior Cloud Hoodie',
    category: 'Kids',
    price: 1699,
    mrp: 2499,
    badge: 'NEW ARRIVAL',
    fabric: '320 GSM Brushed Fleece Cotton',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 36,
    hypeRating: 94,
    sizes: ['2-4Y', '6-8Y', '10-12Y'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'kids',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&q=85'
    ],
    description: 'Cloud-soft kids hoodie in brushed-back fleece with double-lined hood and kangaroo pocket. No-drawcord safe design.'
  },
  {
    id: 'k4',
    name: 'Junior Raw Denim Jacket',
    category: 'Kids',
    price: 2199,
    mrp: 3199,
    badge: 'LIMITED',
    fabric: '10oz Soft Selvedge Denim',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 24,
    hypeRating: 90,
    sizes: ['2-4Y', '6-8Y', '10-12Y'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'kids',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
      'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=900&q=85'
    ],
    description: 'Miniaturised raw denim trucker jacket in soft-washed selvedge with snap buttons and room-to-grow sleeves.'
  },

  // ── UNISEX OVERSIZED ──
  {
    id: 'u1',
    name: 'Atlas Boxy Oversized Hoodie',
    category: 'Hoodies',
    price: 2999,
    mrp: 4499,
    badge: 'BESTSELLER',
    fabric: '450 GSM Heavy French Terry',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 42,
    hypeRating: 96,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=85',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85'
    ],
    description: 'Monumental boxy-oversized hoodie in heavyweight French terry with dropped shoulders. One cut, all bodies.'
  },
  {
    id: 'u2',
    name: 'Dune Oversized Camp Shirt',
    category: 'Tops',
    price: 2299,
    mrp: 3499,
    badge: 'NEW ARRIVAL',
    fabric: '200 GSM Washed Linen-Cotton',
    dispatch: 'Ships in 48 Hours',
    stockLeft: 30,
    hypeRating: 92,
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'unisex',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=85',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85'
    ],
    description: 'Breezy oversized camp-collar shirt in washed linen-cotton with coconut buttons. Gender-free block graded XS to XXL.'
  },
  {
    id: 'w9',
    name: 'Scarlet Wrap Midi Dress',
    category: 'Dresses',
    price: 3799,
    mrp: 5299,
    badge: 'NEW ARRIVAL',
    fabric: 'TENCEL Lyocell Satin Blend',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 22,
    hypeRating: 95,
    sizes: ['XS', 'S', 'M', 'L'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'women',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85'
    ],
    description: 'Editorial wrap midi dress in fluid TENCEL satin with true-wrap waist tie and side slit. Cut for hourglass and pear proportions.'
  },
  {
    id: 'm9',
    name: 'Onyx Tailored Cigarette Pant',
    category: 'Bottoms',
    price: 2999,
    mrp: 4299,
    badge: 'BESTSELLER',
    fabric: '310 GSM Dense Japanese Twill',
    dispatch: 'Ships in 24 Hours',
    stockLeft: 28,
    hypeRating: 93,
    sizes: ['28', '30', '32', '34', '36'],
    outOfStock: [],
    funnel: 'ready-to-wear',
    gender: 'men',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900&q=85'
    ],
    description: 'Precision tapered pant in dense Japanese twill with clean crop and slanted side zip detailing. Sharp all-day tailoring.'
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.slice(0, 6);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}

export function getProductsByGender(gender: 'men' | 'women' | 'kids' | 'unisex' | 'all'): Product[] {
  if (gender === 'all') return PRODUCTS;
  if (gender === 'men' || gender === 'women') return PRODUCTS.filter(p => p.gender === gender || p.gender === 'unisex');
  return PRODUCTS.filter(p => p.gender === gender);
}

export function getProductsByCategory(category: string, gender: 'men' | 'women' | 'kids' | 'unisex' | 'all' = 'all'): Product[] {
  let list = getProductsByGender(gender);
  if (category === 'All') return list;
  if (category === 'Outerwear') return list.filter(p => p.category === 'Jackets' || p.category === 'Hoodies');
  return list.filter(p => p.category === category);
}

export function discountPercent(mrp: number, price: number): number {
  return Math.round(((mrp - price) / mrp) * 100);
}
