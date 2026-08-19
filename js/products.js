/* ===== NOVA STREET — Products Catalogue + Bespoke Config ===== */

/* ─── MEN'S LOOK IMAGES (for Virtual Try-On Studio) ─── */
const MEN_LOOKS = {
  tshirt:    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=85',
  shirt:     'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=900&q=85',
  hoodie:    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&q=85',
  jacket:    'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=900&q=85',
  trouser:   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=85',
  full_look: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85'
};

/* ─── WOMEN'S LOOK IMAGES (for Virtual Try-On Studio) ─── */
const WOMEN_LOOKS = {
  tshirt:    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=900&q=85',
  shirt:     'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=85',
  hoodie:    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=900&q=85',
  jacket:    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&q=85',
  trouser:   'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=900&q=85',
  dress:     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=85',
  full_look: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=85'
};

/* ─── FULL PRODUCT CATALOGUE ─── */
const PRODUCTS = [

  /* ══════════════════════════
     MEN'S COLLECTION (1–8)
  ══════════════════════════ */
  {
    id: 1,
    name: "Aether Oversized Drop-Shoulder Tee",
    category: "T-Shirts",
    price: 1499,
    mrp: 2499,
    badge: "BESTSELLER",
    color: "Washed Off-White",
    type: "top",
    gender: "men",
    funnel: "ready-to-wear",
    fabric: "280 GSM Ahmedabad GOTS Organic Cotton",
    dispatch: "Ships in 24 Hours",
    stockLeft: 12,
    hypeRating: 98,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=80",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    outOfStock: ["S"],
    description: "Heavyweight 280 GSM luxury combed GOTS organic cotton sourced from certified mills in Ahmedabad. Features dropped shoulders and a micro-embroidered collar tag. The quintessential Nova Street staple."
  },
  {
    id: 2,
    name: "Tactical Cargo Utility Trousers",
    category: "Bottoms",
    price: 2899,
    mrp: 3999,
    badge: "UR PICK",
    color: "Charcoal Slate",
    type: "bottom",
    gender: "men",
    funnel: "ready-to-wear",
    fabric: "320 GSM Ripstop Cotton Twill",
    dispatch: "Ships in 24 Hours",
    stockLeft: 8,
    hypeRating: 95,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=80",
      "https://images.unsplash.com/photo-1593030941791-ef63b2dbb821?w=1000&q=80"
    ],
    sizes: ["28", "30", "32", "34", "36"],
    outOfStock: [],
    description: "Multi-pocket technical cargo trousers engineered with dual anodized hardware buckles, adjustable ankle cinches, and ergonomic tapered fit. Built for the streets."
  },
  {
    id: 3,
    name: "Obsidian Boxy Denim Jacket",
    category: "Jackets",
    price: 4299,
    mrp: 5999,
    badge: "EXCLUSIVE",
    color: "Raw Black Denim",
    type: "jacket",
    gender: "men",
    funnel: "custom-made",
    fabric: "14.5oz Japanese Selvedge Denim",
    dispatch: "Bespoke Made-to-Measure (7-14 Days)",
    stockLeft: 5,
    hypeRating: 99,
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    outOfStock: ["XL"],
    description: "14.5oz rigid selvedge denim boxy jacket with hand-distressed edge work, matte black hardware, and custom printed interior lining. Made-to-measure perfection."
  },
  {
    id: 4,
    name: "Vortex Heavy Fleece Graphic Hoodie",
    category: "Hoodies",
    price: 3499,
    mrp: 4999,
    badge: "LIMITED DEAL",
    color: "Peach Terracotta",
    type: "top",
    gender: "men",
    funnel: "ready-to-wear",
    fabric: "450 GSM Heavy French Terry Fleece",
    dispatch: "Ships in 24 Hours",
    stockLeft: 19,
    hypeRating: 94,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=80",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    outOfStock: [],
    description: "450 GSM ultra-heavy french terry fleece with high-density puff print on back, double-lined hood, and seamless kangaroo pouch."
  },
  {
    id: 5,
    name: "Monolith Tailored Chino Trousers",
    category: "Bottoms",
    price: 2199,
    mrp: 3299,
    badge: "BESPOKE OPTION",
    color: "Warm Sand",
    type: "bottom",
    gender: "men",
    funnel: "custom-made",
    fabric: "GOTS Organic Cotton Twill",
    dispatch: "Bespoke Made-to-Measure (7-14 Days)",
    stockLeft: 24,
    hypeRating: 88,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1000&q=80",
      "https://images.unsplash.com/photo-1594938298603-b8ff3ddb5777?w=1000&q=80"
    ],
    sizes: ["28", "30", "32", "34"],
    outOfStock: [],
    description: "Wide-leg relaxed pleated chinos in organic cotton twill. Concealed coin pocket, horn buttons, and press-creased leg profiles."
  },
  {
    id: 6,
    name: "Cipher Ribbed Knit Polo",
    category: "T-Shirts",
    price: 1899,
    mrp: 2699,
    badge: "UR PICK",
    color: "Cobalt Dusk",
    type: "top",
    gender: "men",
    funnel: "ready-to-wear",
    fabric: "Fine Gauge Ribbed Knit",
    dispatch: "Ships in 24 Hours",
    stockLeft: 15,
    hypeRating: 91,
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=80",
      "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    outOfStock: [],
    description: "Structured fine-gauge ribbed knit polo with open collar design, seamless shoulders, and subtle contrast embroidery."
  },
  {
    id: 7,
    name: "Apex Matte Puffer Overshirt",
    category: "Jackets",
    price: 4999,
    mrp: 6999,
    badge: "LIMITED DEAL",
    color: "Onyx Black",
    type: "jacket",
    gender: "men",
    funnel: "ready-to-wear",
    fabric: "Recycled Matte Nylon & Down Alt",
    dispatch: "Ships in 24 Hours",
    stockLeft: 4,
    hypeRating: 97,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=80",
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    outOfStock: ["S", "XXL"],
    description: "Water-resistant matte nylon quilted jacket with recycled down alternative, YKK double-ended zip, and fleece-lined hand pockets."
  },
  {
    id: 8,
    name: "Specter Dual-Tone Zip Hoodie",
    category: "Hoodies",
    price: 3199,
    mrp: 4499,
    badge: "SALE",
    color: "Heather Sky",
    type: "top",
    gender: "men",
    funnel: "custom-made",
    fabric: "Brushed French Terry Fleece",
    dispatch: "Bespoke Made-to-Measure (7-14 Days)",
    stockLeft: 18,
    hypeRating: 90,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=80",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1000&q=80"
    ],
    sizes: ["S", "M", "L", "XL"],
    outOfStock: [],
    description: "Relaxed zip-up hood sweater with panelled side contrast piping, thick ribbed hem and cuffs, and custom silver hardware slider."
  },

  /* ════════════════════════════
     WOMEN'S COLLECTION (9–16)
  ════════════════════════════ */
  {
    id: 9,
    name: "Aura Fitted Crop Tee",
    category: "T-Shirts",
    price: 1299,
    mrp: 1999,
    badge: "BESTSELLER",
    color: "Ivory White",
    type: "top",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "220 GSM GOTS Organic Cotton",
    dispatch: "Ships in 24 Hours",
    stockLeft: 18,
    hypeRating: 96,
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    outOfStock: [],
    description: "Soft 220 GSM GOTS certified organic cotton crop tee with a subtle ribbed neckline and a perfectly fitted silhouette. A Nova Street wardrobe essential."
  },
  {
    id: 10,
    name: "Silhouette Flared Midi Dress",
    category: "Dresses",
    price: 3499,
    mrp: 4999,
    badge: "NEW ARRIVAL",
    color: "Dusty Rose",
    type: "dress",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "TENCEL™ Lyocell Blend",
    dispatch: "Ships in 24 Hours",
    stockLeft: 12,
    hypeRating: 94,
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80",
      "https://images.unsplash.com/photo-1485968579580-fc6f67c3ee3b?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    outOfStock: [],
    description: "Fluid TENCEL™ lyocell flared midi dress with a smocked waistband and a subtle sheen. Eco-certified, breathable, and effortlessly elegant."
  },
  {
    id: 11,
    name: "Soleil High-Waist Linen Trousers",
    category: "Bottoms",
    price: 2499,
    mrp: 3499,
    badge: "UR PICK",
    color: "Warm Oat",
    type: "bottom",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "Pure Organic Italian Linen",
    dispatch: "Ships in 24 Hours",
    stockLeft: 20,
    hypeRating: 91,
    images: [
      "https://images.unsplash.com/photo-1594938298603-b8ff3ddb5777?w=1000&q=80",
      "https://images.unsplash.com/photo-1584308666744-33d986a5c8a7?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    outOfStock: [],
    description: "Wide-leg high-waist trousers in pure organic Italian linen. Relaxed and breathable with a tailored pleat front and concealed side pockets."
  },
  {
    id: 12,
    name: "Nova Bespoke Linen Shirt",
    category: "Shirts",
    price: 2799,
    mrp: 3999,
    badge: "BESPOKE OPTION",
    color: "Powder Blue",
    type: "top",
    gender: "women",
    funnel: "custom-made",
    fabric: "210 GSM Biella Linen",
    dispatch: "Bespoke Made-to-Measure (7-14 Days)",
    stockLeft: 30,
    hypeRating: 89,
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&q=80",
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    outOfStock: [],
    description: "Custom bespoke linen shirt in premium Biella-sourced fabric. Choose collar, cuff, button, and fit. Each garment is made to your exact measurements."
  },
  {
    id: 13,
    name: "Onyx Oversized Blazer",
    category: "Jackets",
    price: 5499,
    mrp: 7499,
    badge: "EXCLUSIVE",
    color: "Carbon Black",
    type: "jacket",
    gender: "women",
    funnel: "custom-made",
    fabric: "Italian Wool-Cotton Blend",
    dispatch: "Bespoke Made-to-Measure (7-14 Days)",
    stockLeft: 8,
    hypeRating: 97,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=80",
      "https://images.unsplash.com/photo-1483985988041-943a9a0f28cb?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    outOfStock: [],
    description: "Statement oversized blazer in Italian wool-cotton blend. Bold peaked lapel, satin lining, and a powerful silhouette. Bespoke made-to-measure."
  },
  {
    id: 14,
    name: "Crescent Ribbed Knit Dress",
    category: "Dresses",
    price: 2999,
    mrp: 4299,
    badge: "LIMITED DEAL",
    color: "Caramel Beige",
    type: "dress",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "Fine Gauge Merino Rib",
    dispatch: "Ships in 24 Hours",
    stockLeft: 15,
    hypeRating: 93,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1000&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    outOfStock: ["XS"],
    description: "Sleek fine-gauge merino rib knit midi dress with a sculpted fitted silhouette, subtle ribbing detail, and a flattering round neckline."
  },
  {
    id: 15,
    name: "Cloud French Terry Hoodie",
    category: "Hoodies",
    price: 3299,
    mrp: 4699,
    badge: "SALE",
    color: "Sage Green",
    type: "top",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "380 GSM Organic French Terry",
    dispatch: "Ships in 24 Hours",
    stockLeft: 22,
    hypeRating: 90,
    images: [
      "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=1000&q=80",
      "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    outOfStock: [],
    description: "Oversized cozy hoodie in 380 GSM organic french terry. Features a drop shoulder cut, ribbed cuffs, and a kangaroo pocket."
  },
  {
    id: 16,
    name: "Drape Wide-Leg Cargo Pants",
    category: "Bottoms",
    price: 2699,
    mrp: 3799,
    badge: "NEW ARRIVAL",
    color: "Slate Grey",
    type: "bottom",
    gender: "women",
    funnel: "ready-to-wear",
    fabric: "Recycled Poly Twill",
    dispatch: "Ships in 24 Hours",
    stockLeft: 14,
    hypeRating: 88,
    images: [
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=80",
      "https://images.unsplash.com/photo-1591300067497-f7b32f94d7fd?w=1000&q=80"
    ],
    sizes: ["XS", "S", "M", "L"],
    outOfStock: [],
    description: "Relaxed wide-leg cargo pants in recycled poly twill with functional side cargo pockets and an elasticated drawstring waist."
  }

];

/* ─── BESPOKE CONFIGURATOR OPTIONS ─── */
const BESPOKE_CONFIG = {
  fabrics: [
    {
      id: "gots_cotton",
      name: "Ahmedabad GOTS Organic Cotton",
      origin: "Gujarat, India",
      gsm: "280 GSM",
      priceAdd: 0,
      previewColor: "#F5F2E7",
      forGender: "all",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=70"
    },
    {
      id: "selvedge_denim",
      name: "Japanese Selvedge Denim",
      origin: "Okayama / Gujarat Mill",
      gsm: "14.5 oz",
      priceAdd: 1200,
      previewColor: "#1c2536",
      forGender: "all",
      img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&q=70"
    },
    {
      id: "french_terry",
      name: "Heavy French Terry Fleece",
      origin: "Ahmedabad Mill",
      gsm: "450 GSM",
      priceAdd: 800,
      previewColor: "#EECDAF",
      forGender: "all",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=70"
    },
    {
      id: "italian_linen",
      name: "Pure Organic Italian Linen",
      origin: "Biella / Sourced Hub",
      gsm: "210 GSM",
      priceAdd: 1500,
      previewColor: "#E8E3DA",
      forGender: "all",
      img: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=70"
    },
    {
      id: "tencel_blend",
      name: "TENCEL™ Lyocell Blend",
      origin: "Certified Eco Mill",
      gsm: "180 GSM",
      priceAdd: 1000,
      previewColor: "#D4C5B5",
      forGender: "women",
      img: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=70"
    },
    {
      id: "merino_rib",
      name: "Fine Gauge Merino Rib",
      origin: "New Zealand / Gujarat",
      gsm: "260 GSM",
      priceAdd: 1800,
      previewColor: "#C8B8A2",
      forGender: "women",
      img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=70"
    }
  ],
  collars: [
    { id: "cutaway",     name: "Modern Cutaway Collar",  desc: "Sleek wide spread collar architecture",    priceAdd: 0   },
    { id: "button_down", name: "Casual Button-Down",      desc: "Classic collar with hidden buttons",        priceAdd: 150 },
    { id: "mandarin",    name: "Minimal Mandarin Band",   desc: "Clean collarless band architecture",        priceAdd: 200 }
  ],
  cuffs: [
    { id: "single_barrel", name: "Single Barrel 2-Button",  desc: "Standard versatile cuff architecture",       priceAdd: 0   },
    { id: "french_cuff",   name: "Double French Cuff",       desc: "Formal cuff built for cufflinks",            priceAdd: 350 },
    { id: "angled_cuff",   name: "Architectural Angled Cut", desc: "Modern asymmetrical cuff edge",              priceAdd: 200 }
  ],
  buttons: [
    { id: "mother_pearl", name: "Genuine Mother-of-Pearl",      desc: "Iridescent natural shell buttons",       priceAdd: 400 },
    { id: "horn",         name: "Natural Matte Horn",           desc: "Durable organic horn buttons",           priceAdd: 300 },
    { id: "matte_black",  name: "Anodized Matte Black Metal",   desc: "Industrial metal alloy buttons",         priceAdd: 250 }
  ]
};

/* ─── UTILITY FUNCTIONS ─── */

/**
 * Get a product by its ID.
 * @param {number|string} id
 * @returns {Object|undefined}
 */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

/**
 * Calculate discount percentage.
 * @param {number} mrp - Original price
 * @param {number} price - Sale price
 * @returns {number} Discount percentage rounded to nearest integer
 */
function discountPercent(mrp, price) {
  return Math.round(((mrp - price) / mrp) * 100);
}
