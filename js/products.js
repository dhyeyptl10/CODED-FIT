/* ===== CODED FIT — Atelier Archival Catalogue & Biometric Specs ===== */

/* ─── LOOK ARCHIVES (for 3D Try-On & Studio Rigs) ─── */
const MEN_LOOKS = {
  overshirt: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=85',
  tshirt:    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85',
  cuban:     'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=1000&q=85',
  hoodie:    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=85',
  jacket:    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=85',
  trouser:   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85',
  balloon:   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85',
  trench:    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85',
  full_look: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=85'
};

const WOMEN_LOOKS = {
  poplin:    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&q=85',
  tshirt:    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=85',
  hoodie:    'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=1000&q=85',
  jacket:    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&q=85',
  trouser:   'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=85',
  dress:     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=85',
  full_look: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=85'
};

/* ─── FULL CODED FIT ATELIER CATALOGUE (EXACT MATCH TO REFERENCE IMAGES) ─── */
const PRODUCTS = [
  {
    id: 1,
    code: "CP-SH-09",
    name: "Drop-Shoulder Merino Field Overshirt",
    category: "Shirts",
    subCategory: "Overshirts",
    collection: "Drop 09: Monsoon Nomad",
    price: 3499,
    mrp: 4999,
    badge: "MADE-TO-MEASURE",
    tagline: "280 GSM MERINO TWILL // MODULAR POCKETS",
    drapeProfile: "Architectural Boxy",
    fabric: "280 GSM Pure Australian Merino Twill Blended with Japanese Filament Twill",
    fabricDensity: "280 GSM Raw Merino Twill",
    productionVelocity: "made-to-measure",
    colorway: "Charcoal Slate",
    colorHex: "#22252A",
    gender: "men",
    recoTag: "RECOMMENDED PATTERN PROFILE (CF 99%)",
    biometricSync: "Active AI Synced (#CF-8821)",
    drapeCoeff: "0.42 μ",
    thermalIndex: "16°C to 32°C Adaptive",
    hardware: "Cobra-Style Snaps Mil-Spec (Anodized Magnesium)",
    doorstepTrial: true,
    measurements: {
      chestWidth: '41.2" (104.6 CM)',
      shoulderSeam: '18.2" (46.2 CM)',
      sleeveLength: '25.8" (65.5 CM)',
      frontDrop: '29.8" (75.7 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=85",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL", "BESPOKE"],
    description: "Architectural boxy silhouette engineered with 280 GSM Australian merino yarn woven with Japanese recycled filament. Features dual modular chest bellow pockets, mil-spec cobra snaps, dropped shoulder pitch, and zero-cling humidity drape."
  },
  {
    id: 2,
    code: "CP-SH-01",
    name: "Aero-Drape Cuban Shirt",
    category: "Cuban Shirts",
    subCategory: "Resort Tech",
    collection: "Drop 09: Monsoon Nomad",
    price: 1799,
    mrp: 2999,
    badge: "NEW DROP",
    tagline: "RESORT TECH // 160 GSM",
    drapeProfile: "Relaxed Oversized",
    fabric: "160 GSM Resort Tech Micro-Ripstop",
    fabricDensity: "160 GSM Resort Tech Ripstop",
    productionVelocity: "ready-to-wear",
    colorway: "Sage Olive",
    colorHex: "#545F52",
    gender: "men",
    recoTag: "RECO: SIZE L [SHOULDER +1.2\"]",
    biometricSync: "99% AI Fit Sync",
    drapeCoeff: "0.38 μ",
    thermalIndex: "20°C to 36°C Breathable",
    hardware: "Laser-Engraved Atelier Horn Buttons",
    doorstepTrial: true,
    measurements: {
      chestWidth: '42.0" (106.6 CM)',
      shoulderSeam: '18.6" (47.2 CM)',
      sleeveLength: '10.5" (26.6 CM)',
      frontDrop: '28.5" (72.3 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=1000&q=85",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Open camp-collar silhouette in ultra-breathable 160 GSM Japanese ripstop. Featherlight drape designed specifically for high humidity tropical micro-climates."
  },
  {
    id: 3,
    code: "CP-TR-01",
    name: "Korean Relaxed Pleated Trouser",
    category: "Bespoke Trousers",
    subCategory: "Bottoms",
    collection: "Drop 09: Monsoon Nomad",
    price: 2299,
    mrp: 3499,
    badge: "BESTSELLER",
    tagline: "ANTI-CREASE POLY-TWILL // ZERO BREAK",
    drapeProfile: "Tailored Zero-Break Taper",
    fabric: "310 GSM Dense Japanese Twill Canvas",
    fabricDensity: "Japanese Dense Twill Canvas",
    productionVelocity: "ready-to-wear",
    colorway: "Obsidian Black",
    colorHex: "#111215",
    gender: "men",
    recoTag: "CALIBRATED: 30.5\" INSEAM PRE-SET",
    biometricSync: "Calibrated Inseam Lock",
    drapeCoeff: "0.45 μ",
    thermalIndex: "18°C to 30°C All-Season",
    hardware: "Internal German Waistband Gripper & YKK Metal Zips",
    doorstepTrial: true,
    measurements: {
      waist: '32.5" (82.5 CM)',
      inseam: '30.5" (77.5 CM)',
      thigh: '27.0" (68.5 CM)',
      legOpening: '18.0" (45.7 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85",
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=85"
    ],
    sizes: ["28", "30", "32", "34", "36", "BESPOKE"],
    description: "Double front pleats cascading into an architectural barrel taper. High rise with elasticated rear waistband extension for all-day biomechanical mobility."
  },
  {
    id: 4,
    code: "CP-TE-01",
    name: "Nocturne Boxy Oversized Tee",
    category: "Oversized Tees",
    subCategory: "T-Shirts",
    collection: "Drop 09: Monsoon Nomad",
    price: 1299,
    mrp: 1999,
    badge: "OVERSIZED 280 GSM",
    tagline: "100% COMBED HEAVY KNIT // ACID WASH",
    drapeProfile: "Boxy Atelier Cut",
    fabric: "280 GSM Heavy Combed Cotton Single Jersey",
    fabricDensity: "280 GSM Heavy Combed Cotton",
    productionVelocity: "ready-to-wear",
    colorway: "Washed Slate Charcoal",
    colorHex: "#2C2D31",
    gender: "men",
    recoTag: "CHEST 43.2\" + SIZE M [LOOSE]",
    biometricSync: "99.4% Biometric Sync",
    drapeCoeff: "0.52 μ",
    thermalIndex: "18°C to 34°C Breathable",
    hardware: "Twin-Needle Ribbed Heavy Neckline (No Sag)",
    doorstepTrial: true,
    measurements: {
      chestWidth: '43.2" (109.7 CM)',
      shoulderSeam: '19.4" (49.2 CM)',
      sleeveLength: '9.8" (24.8 CM)',
      frontDrop: '29.0" (73.6 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "280 GSM heavy combed GOTS cotton with drop-shoulder engineering and structured ribbed 3.2cm collar. Form stays rigid across washes without shoulder flare."
  },
  {
    id: 5,
    code: "CP-TR-02",
    name: "Tactical Parachute Utility Cargo",
    category: "Bespoke Trousers",
    subCategory: "Tactical",
    collection: "Drop 09: Monsoon Nomad",
    price: 2899,
    mrp: 3899,
    badge: "TECH RIPSTOP",
    tagline: "TACTICAL ERGONOMIC CUT // 4 POCKETS",
    drapeProfile: "Relaxed Oversized",
    fabric: "240 GSM Hydrophobic Cotton-Nylon Ripstop",
    fabricDensity: "160 GSM Resort Tech Ripstop",
    productionVelocity: "ready-to-wear",
    colorway: "Military Olive Drab",
    colorHex: "#3B4237",
    gender: "men",
    recoTag: "WAIST 33\" LOCKED [PRECISION TAPER]",
    biometricSync: "Biometric Knee Dart Locked",
    drapeCoeff: "0.40 μ",
    thermalIndex: "14°C to 32°C Monsoon Shield",
    hardware: "Bungee Ankle Hem Toggles & Quick-Release Buckles",
    doorstepTrial: true,
    measurements: {
      waist: '33.0" (83.8 CM)',
      inseam: '31.0" (78.7 CM)',
      kneeCirc: '22.0" (55.8 CM)',
      ankleHem: '14.0" (35.5 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=1000&q=85",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85"
    ],
    sizes: ["28", "30", "32", "34", "36", "BESPOKE"],
    description: "4-pocket technical cargo trousers with articulated 3D knee darts, waterproof zip storm-flaps, and bungee cord adjusters for instant silhouette transformation."
  },
  {
    id: 6,
    code: "CP-BL-01",
    name: "Archetype Handloom Wool Blazer",
    category: "3D Atelier Pieces",
    subCategory: "Bespoke Tailoring",
    collection: "Drop 09: Monsoon Nomad",
    price: 4999,
    mrp: 6499,
    badge: "ATELIER BESPOKE",
    tagline: "RAW MERINO HANDLOOM // ZERO SHOULDER PAD",
    drapeProfile: "Architectural Slim",
    fabric: "340 GSM Indian Torso Weave Raw Handloom Merino Wool",
    fabricDensity: "280 GSM Raw Merino Twill",
    productionVelocity: "made-to-measure",
    colorway: "Midnight Navy",
    colorHex: "#1B2232",
    gender: "men",
    recoTag: "COMMISSION CUT #84 IN QUEUE",
    biometricSync: "Savile Row Armscye Calibration",
    drapeCoeff: "0.58 μ",
    thermalIndex: "12°C to 24°C Formal Luxury",
    hardware: "Unstructured Canvas & Horn 2-Button Closure",
    doorstepTrial: true,
    measurements: {
      chestWidth: '41.5" (105.4 CM)',
      waistSuppress: '35.0" (88.9 CM)',
      shoulderSeam: '18.4" (46.7 CM)',
      backLength: '30.2" (76.7 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&q=85",
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=85"
    ],
    sizes: ["36R", "38R", "40R", "42R", "BESPOKE"],
    description: "Soft unconstructed Neapolitan shoulder architecture hand-tailored with Indian handloom raw merino wool. Zero shoulder padding allows natural drape matching your upper back slope."
  },
  {
    id: 7,
    code: "CP-HD-01",
    name: "Dual-Weave Archival Heavy Hoodie",
    category: "Oversized Tees",
    subCategory: "Hoodies",
    collection: "Drop 09: Monsoon Nomad",
    price: 2499,
    mrp: 3299,
    badge: "WINTER WEIGHT 420 GSM",
    tagline: "FRENCH TERRY // 420 GSM STRUCTURED HOOD",
    drapeProfile: "Boxy Atelier Cut",
    fabric: "420 GSM 100% Combed Heavyweight French Terry",
    fabricDensity: "280 GSM Heavy Combed Cotton",
    productionVelocity: "ready-to-wear",
    colorway: "Washed Iron Ore",
    colorHex: "#1E1E22",
    gender: "men",
    recoTag: "AI CALIBRATED TORSO LENGTH",
    biometricSync: "Double-Lined Hood Stand Lock",
    drapeCoeff: "0.64 μ",
    thermalIndex: "10°C to 22°C Cold Shield",
    hardware: "Heavy Herringbone Drawcords & Nickel Eyelets",
    doorstepTrial: true,
    measurements: {
      chestWidth: '44.0" (111.7 CM)',
      torsoLength: '27.5" (69.8 CM)',
      shoulderDrop: '20.0" (50.8 CM)',
      cuffRib: '3.5" (8.9 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=85",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "420 GSM heavy double-knit loopback terry. Engineered with a triple-panel structured hood that stands proud around the neck without collapsing, seamless sides, and heavyweight ribbing."
  },
  {
    id: 8,
    code: "CP-SH-04",
    name: "Minimalist Oversized Poplin Shirt",
    category: "Shirts",
    subCategory: "Ready-to-Wear",
    collection: "Drop 09: Monsoon Nomad",
    price: 1999,
    mrp: 2899,
    badge: "ZERO DEADSTOCK",
    tagline: "ORGANIC EGYPTIAN POPLIN // 140 GSM",
    drapeProfile: "Architectural Boxy",
    fabric: "140 GSM Long-Staple Giza Cotton Poplin",
    fabricDensity: "160 GSM Resort Tech Ripstop",
    productionVelocity: "ready-to-wear",
    colorway: "Optical Chalk White",
    colorHex: "#F6F6F6",
    gender: "women",
    recoTag: "PERFECT FIT PRE-CALIBRATED",
    biometricSync: "Sculpted Atelier Collar Sync",
    drapeCoeff: "0.34 μ",
    thermalIndex: "18°C to 35°C Crisp Luxury",
    hardware: "Concealed Placket Mother-of-Pearl Buttons",
    doorstepTrial: true,
    measurements: {
      chestWidth: '42.5" (107.9 CM)',
      shoulderSeam: '18.0" (45.7 CM)',
      sleeveLength: '24.5" (62.2 CM)',
      rearHemDrop: '31.0" (78.7 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=1000&q=85",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Crisp architectural volume cut from 140 GSM Egyptian Giza poplin with micro-stitched french seams, elongated cuff gauntlets, and high-low curved hemline."
  },
  {
    id: 9,
    code: "CP-TR-03",
    name: "Structured Pleated Balloon Trouser",
    category: "Bespoke Trousers",
    subCategory: "Bottoms",
    collection: "Drop 09: Monsoon Nomad",
    price: 3999,
    mrp: 5499,
    badge: "EDITORIAL DROP",
    tagline: "DOUBLE FRONT PLEAT // 340 GSM TECH WOOL",
    drapeProfile: "Tailored Zero-Break Taper",
    fabric: "340 GSM Dense Tech-Wool Composite with Shape Memory",
    fabricDensity: "Japanese Dense Twill Canvas",
    productionVelocity: "made-to-measure",
    colorway: "Pitch Black",
    colorHex: "#0D0E10",
    gender: "men",
    recoTag: "MATCHED TO INSEAM: 30.5\"",
    biometricSync: "Double Front Pleat Calibration",
    drapeCoeff: "0.48 μ",
    thermalIndex: "15°C to 28°C Adaptive",
    hardware: "Cobra Hook & Bar Hardware with YKK Metal Zips",
    doorstepTrial: true,
    measurements: {
      waist: '33.0" (83.8 CM)',
      inseam: '30.5" (77.5 CM)',
      thigh: '28.5" (72.3 CM)',
      hem: '17.5" (44.5 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=1000&q=85",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85"
    ],
    sizes: ["28", "30", "32", "34", "36", "BESPOKE"],
    description: "Extreme architectural volume tapering dramatically at the ankle. Features deep inward-facing double pleats that create sweeping lines in motion."
  },
  {
    id: 10,
    code: "CP-TE-02",
    name: "190 GSM Aero-Drape Bamboo Modal Tee",
    category: "Oversized Tees",
    subCategory: "T-Shirts",
    collection: "Drop 09: Monsoon Nomad",
    price: 1299,
    mrp: 1999,
    badge: "INNER LAYER",
    tagline: "190 GSM BAMBOO MODAL // CHALK WHITE",
    drapeProfile: "Relaxed Oversized",
    fabric: "70% Bamboo Modal, 30% Long-Staple Cotton",
    fabricDensity: "160 GSM Resort Tech Ripstop",
    productionVelocity: "ready-to-wear",
    colorway: "Chalk White",
    colorHex: "#F4F3EE",
    gender: "men",
    recoTag: "BASE-LAYER FIT RATING 100%",
    biometricSync: "Seamless Underarm Articulation",
    drapeCoeff: "0.28 μ",
    thermalIndex: "18°C to 38°C High Cooling",
    hardware: "Silky Bonded Flatlock Seams",
    doorstepTrial: true,
    measurements: {
      chestWidth: '41.0" (104.1 CM)',
      shoulderSeam: '18.0" (45.7 CM)',
      frontDrop: '28.0" (71.1 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Ultra-silky base-layer engineered from bamboo modal with natural antimicrobial drape and zero chafing seams. Breathes 3x faster than traditional jersey."
  },
  {
    id: 11,
    code: "CP-ACC-01",
    name: "Cordura Tactical Modular Sling",
    category: "3D Atelier Pieces",
    subCategory: "Accessories",
    collection: "Drop 09: Monsoon Nomad",
    price: 2299,
    mrp: 3299,
    badge: "NEW",
    tagline: "TECHNICAL WATERPROOF CORDURA // MODULAR",
    drapeProfile: "Architectural Boxy",
    fabric: "1000D Cordura Ballistic Nylon with Waterproof TPU Backing",
    fabricDensity: "Japanese Dense Twill Canvas",
    productionVelocity: "ready-to-wear",
    colorway: "Tactical Matte Black",
    colorHex: "#141416",
    gender: "men",
    recoTag: "UNIVERSAL ERGONOMIC FIT",
    biometricSync: "Cross-Body Sternum Lock",
    drapeCoeff: "N/A",
    thermalIndex: "Monsoon Proof IPX-4",
    hardware: "Quick-Release Heavy Cobra Buckle & YKK Aquaguard Zippers",
    doorstepTrial: true,
    measurements: {
      volume: "6.5 Liters",
      strapRange: '32" to 54"',
      dimensions: '30cm x 18cm x 10cm'
    },
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1000&q=85",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1000&q=85"
    ],
    sizes: ["ONE SIZE"],
    description: "Weatherproof 1000D ballistic sling bag with magnetic Fidlock cross-body stabilizer, internal padded iPad compartment, and laser-cut MOLLE modular attachments."
  },
  {
    id: 12,
    code: "CP-OT-01",
    name: "Monsoon Modular Trench Coat",
    category: "Tactical Jackets",
    subCategory: "Jackets",
    collection: "Drop 09: Monsoon Nomad",
    price: 7499,
    mrp: 9999,
    badge: "LIMITED LAB 04",
    tagline: "TECHNICAL TAILORED DWR // SLATE ONYX",
    drapeProfile: "Architectural Boxy",
    fabric: "3-Layer GORE-TEX Type Membrane with DWR C6 Coating",
    fabricDensity: "Japanese Dense Twill Canvas",
    productionVelocity: "made-to-measure",
    colorway: "Slate Onyx",
    colorHex: "#1E2024",
    gender: "men",
    recoTag: "PRECISION TAILORED LENGTH",
    biometricSync: "Storm-Flap Magnetic Seal",
    drapeCoeff: "0.55 μ",
    thermalIndex: "8°C to 24°C Monsoon Shield",
    hardware: "Magnetic Storm Flaps & Detachable Modular Hood",
    doorstepTrial: true,
    measurements: {
      chestWidth: '45.0" (114.3 CM)',
      coatLength: '44.0" (111.7 CM)',
      sleeveLength: '26.8" (68.0 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=85",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL", "BESPOKE"],
    description: "Full-length monsoon technical trench coat featuring sealed taped seams, internal backpack harness straps, and magnetic collar enclosure."
  },
  {
    id: 13,
    code: "CP-JK-02",
    name: "Monolith Modular Bomber",
    category: "Tactical Jackets",
    subCategory: "Jackets",
    collection: "Drop 09: Monsoon Nomad",
    price: 4899,
    mrp: 6999,
    badge: "BESTSELLER",
    tagline: "HEAVYWEIGHT INSULATED // WEATHERPROOF",
    drapeProfile: "Architectural Boxy",
    fabric: "Flight Nylon Shell with Primaloft Lightweight Thermal Core",
    fabricDensity: "Japanese Dense Twill Canvas",
    productionVelocity: "ready-to-wear",
    colorway: "Gunmetal Olive",
    colorHex: "#353932",
    gender: "men",
    recoTag: "BOX-CUT DROPPED SHOULDER",
    biometricSync: "Sleeve Articulation Ribs",
    drapeCoeff: "0.60 μ",
    thermalIndex: "6°C to 20°C Thermal Shield",
    hardware: "Two-Way Chunky Matte Black Zipper",
    doorstepTrial: true,
    measurements: {
      chestWidth: '44.5" (113.0 CM)',
      torsoLength: '26.5" (67.3 CM)',
      sleeveLength: '26.0" (66.0 CM)'
    },
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=85",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1000&q=85"
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Exaggerated MA-1 flight bomber with gathered arm seam ruche, heavyweight 2x2 wool-blend rib cuffs, and dual zipped sleeve utility pockets."
  },
  {
    id: 14,
    code: "CP-DR-01",
    name: "Scarlet Wrap Midi Dress",
    category: "Dresses",
    subCategory: "Dresses",
    collection: "Drop 09: Monsoon Nomad",
    price: 3799,
    mrp: 5299,
    badge: "NEW ARRIVAL",
    tagline: "TENCEL SATIN // TRUE-WRAP WAIST",
    drapeProfile: "Fluid Bias Drape",
    fabric: "TENCEL Lyocell Satin Blend",
    fabricDensity: "240 GSM TENCEL Satin",
    productionVelocity: "ready-to-wear",
    colorway: "Scarlet Noir",
    colorHex: "#7F1D1D",
    gender: "women",
    recoTag: "RECO: TRUE TO SIZE",
    biometricSync: "Waist-Tie Calibration",
    drapeCoeff: "0.30 μ",
    thermalIndex: "18°C to 34°C Breathable",
    hardware: "Concealed Side Zip",
    doorstepTrial: true,
    measurements: { chestWidth: '36.0" (91.4 CM)', waistWidth: '28.0" (71.1 CM)', dressLength: '46.0" (116.8 CM)' },
    images: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L"],
    description: "Editorial wrap midi dress in fluid TENCEL satin with true-wrap waist tie and side slit. Cut for hourglass and pear proportions."
  },
  {
    id: 15,
    code: "CP-TP-01",
    name: "Ivory Sculpted Knit Top",
    category: "Tops",
    subCategory: "Tops",
    collection: "Drop 09: Monsoon Nomad",
    price: 1899,
    mrp: 2799,
    badge: "NEW ARRIVAL",
    tagline: "GOTS KNIT // SQUARE NECKLINE",
    drapeProfile: "Second-Skin Sculpt",
    fabric: "220 GSM GOTS Organic Cotton Knit",
    fabricDensity: "220 GSM Organic Knit",
    productionVelocity: "ready-to-wear",
    colorway: "Ivory",
    colorHex: "#F5F2E7",
    gender: "women",
    recoTag: "RECO: TRUE TO SIZE",
    biometricSync: "Bust-Dart Calibration",
    drapeCoeff: "0.34 μ",
    thermalIndex: "16°C to 32°C Breathable",
    hardware: "Tag-Free Neckline",
    doorstepTrial: true,
    measurements: { chestWidth: '35.0" (88.9 CM)', sleeveLength: '23.5" (59.7 CM)', frontDrop: '24.0" (61.0 CM)' },
    images: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=85",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Second-skin sculpted knit top in breathable GOTS cotton with square neckline and long sleeves. Pairs with high-rise tailoring."
  },
  {
    id: 16,
    code: "CP-TR-04",
    name: "Noir High-Waist Wide-Leg Trouser",
    category: "Bespoke Trousers",
    subCategory: "Bottoms",
    collection: "Drop 09: Monsoon Nomad",
    price: 2799,
    mrp: 3999,
    badge: "BESTSELLER",
    tagline: "SELVEDGE STRETCH // ZERO-GAP WAIST",
    drapeProfile: "Wide-Leg Fluid Drape",
    fabric: "Japanese Selvedge Denim with Comfort Stretch",
    fabricDensity: "12oz Selvedge Stretch Denim",
    productionVelocity: "ready-to-wear",
    colorway: "Washed Indigo",
    colorHex: "#1C2536",
    gender: "women",
    recoTag: "CALIBRATED: ZERO-GAP WAIST",
    biometricSync: "Waist-to-Hip Ratio Sync",
    drapeCoeff: "0.44 μ",
    thermalIndex: "14°C to 30°C All-Season",
    hardware: "Concealed Hook & Bar",
    doorstepTrial: true,
    measurements: { waistWidth: '28.0" (71.1 CM)', hipWidth: '38.0" (96.5 CM)', inseamLength: '30.0" (76.2 CM)' },
    images: [
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=80",
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80"
    ],
    sizes: ["26", "28", "30", "32", "34"],
    description: "High-rise wide-leg trouser in comfort-stretch selvedge denim with clean front and ankle-grazing hem. Zero-gap waistband engineering."
  },
  {
    id: 17,
    code: "CP-DR-02",
    name: "Rouge Atelier Blazer Dress",
    category: "Dresses",
    subCategory: "Dresses",
    collection: "Drop 09: Monsoon Nomad",
    price: 4999,
    mrp: 6999,
    badge: "MADE-TO-MEASURE",
    tagline: "WOOL-BLEND TAILORING // PEAK LAPEL",
    drapeProfile: "Structured Hourglass",
    fabric: "Italian Wool-Blend Barathea",
    fabricDensity: "260 GSM Wool Barathea",
    productionVelocity: "made-to-measure",
    colorway: "Rouge Noir",
    colorHex: "#3B0A0A",
    gender: "women",
    recoTag: "BESPOKE CONTOUR FIT",
    biometricSync: "Bust-Waist Contour Sync",
    drapeCoeff: "0.58 μ",
    thermalIndex: "12°C to 26°C Tailored Warmth",
    hardware: "Single Horn Button",
    doorstepTrial: true,
    measurements: { chestWidth: '36.5" (92.7 CM)', waistWidth: '28.5" (72.4 CM)', dressLength: '38.0" (96.5 CM)' },
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=85",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L", "BESPOKE"],
    description: "Sculpted blazer dress with peak lapels, single-button closure, and bespoke bust-waist contouring. Boardroom to after-hours in one silhouette."
  },
  {
    id: 18,
    code: "CP-TP-02",
    name: "Cloud Soft Knit Co-ord Top",
    category: "Tops",
    subCategory: "Tops",
    collection: "Drop 09: Monsoon Nomad",
    price: 2299,
    mrp: 3299,
    badge: "NEW ARRIVAL",
    tagline: "BRUSHED KNIT // CO-ORD READY",
    drapeProfile: "Soft Relaxed Drape",
    fabric: "260 GSM Brushed Cotton-Modal Knit",
    fabricDensity: "260 GSM Brushed Knit",
    productionVelocity: "ready-to-wear",
    colorway: "Marigold Sand",
    colorHex: "#D4C5B5",
    gender: "women",
    recoTag: "RECO: TRUE TO SIZE",
    biometricSync: "Standard Knit Block",
    drapeCoeff: "0.36 μ",
    thermalIndex: "16°C to 30°C Soft Warmth",
    hardware: "None — Pull-On",
    doorstepTrial: true,
    measurements: { chestWidth: '37.0" (94.0 CM)', sleeveLength: '22.0" (55.9 CM)', frontDrop: '23.0" (58.4 CM)' },
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=85",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cloud-soft co-ord knit top in brushed cotton-modal with relaxed sleeves. Matches the Drop 09 knit skirt for a full co-ord look."
  },
  {
    id: 19,
    code: "CP-DR-03",
    name: "Ivory Bias-Cut Gown",
    category: "Dresses",
    subCategory: "Dresses",
    collection: "Drop 09: Monsoon Nomad",
    price: 5499,
    mrp: 7999,
    badge: "MADE-TO-MEASURE",
    tagline: "BIAS CUT // FLOOR SWEEP",
    drapeProfile: "Liquid Bias Drape",
    fabric: "Pure Organic Silk-Linen Voile",
    fabricDensity: "140 GSM Silk-Linen Voile",
    productionVelocity: "made-to-measure",
    colorway: "Ivory Veil",
    colorHex: "#EFE9DC",
    gender: "women",
    recoTag: "BESPOKE LENGTH INCLUDED",
    biometricSync: "Hollow-to-Hem Calibration",
    drapeCoeff: "0.26 μ",
    thermalIndex: "Evening Occasion",
    hardware: "Concealed Back Zip",
    doorstepTrial: true,
    measurements: { chestWidth: '35.5" (90.2 CM)', waistWidth: '27.5" (69.9 CM)', dressLength: '58.0" (147.3 CM)' },
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=85",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=85"
    ],
    sizes: ["XS", "S", "M", "L", "BESPOKE"],
    description: "Liquid bias-cut evening gown that pours over the body. Bespoke hollow-to-hem length and bust contouring included in every order."
  },
  {
    id: 20,
    code: "CP-TR-05",
    name: "Onyx Tailored Cigarette Pant",
    category: "Bespoke Trousers",
    subCategory: "Bottoms",
    collection: "Drop 09: Monsoon Nomad",
    price: 2999,
    mrp: 4299,
    badge: "BESTSELLER",
    tagline: "JAPANESE TWILL // ANKLE CROP",
    drapeProfile: "Tailored Slim Taper",
    fabric: "310 GSM Dense Japanese Twill",
    fabricDensity: "Japanese Dense Twill",
    productionVelocity: "ready-to-wear",
    colorway: "Onyx Black",
    colorHex: "#111215",
    gender: "women",
    recoTag: "CALIBRATED: ANKLE CROP",
    biometricSync: "Inseam Pre-Set Sync",
    drapeCoeff: "0.46 μ",
    thermalIndex: "14°C to 30°C All-Season",
    hardware: "Slanted Side Zip",
    doorstepTrial: true,
    measurements: { waistWidth: '28.5" (72.4 CM)', hipWidth: '37.5" (95.3 CM)', inseamLength: '27.0" (68.6 CM)' },
    images: [
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1000&q=80",
      "https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=80"
    ],
    sizes: ["26", "28", "30", "32", "34"],
    description: "Precision cigarette pant in dense Japanese twill with ankle crop and slanted side zip. Sharp enough for tailoring, soft enough for all day."
  },
  {
    id: 21,
    code: "CP-KD-01",
    name: "Junior Explorer Graphic Tee",
    category: "Kids Tees",
    subCategory: "Kids Tops",
    collection: "Drop 09: Junior Atelier",
    price: 899,
    mrp: 1299,
    badge: "NEW ARRIVAL",
    tagline: "180 GSM COMBED COTTON // TAG-FREE",
    drapeProfile: "Classic Kids Relaxed",
    fabric: "180 GSM Soft Combed Cotton",
    fabricDensity: "180 GSM Combed Cotton",
    productionVelocity: "ready-to-wear",
    colorway: "Cloud White",
    colorHex: "#F5F2E7",
    gender: "kids",
    recoTag: "RECO: TRUE TO SIZE",
    biometricSync: "Kids Growth Block",
    drapeCoeff: "0.34 μ",
    thermalIndex: "All-Season Play",
    hardware: "None — Pull-On",
    doorstepTrial: false,
    measurements: { chestWidth: '26.0" (66.0 CM)', sleeveLength: '6.0" (15.2 CM)', frontDrop: '18.0" (45.7 CM)' },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=85",
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&q=85"
    ],
    sizes: ["2-4Y", "6-8Y", "10-12Y"],
    description: "Everyday kids tee in soft combed cotton with reinforced shoulder seams and tag-free neckline. Playground-tested durability."
  },
  {
    id: 22,
    code: "CP-KD-02",
    name: "Junior Field Cargo Pants",
    category: "Kids Bottoms",
    subCategory: "Kids Bottoms",
    collection: "Drop 09: Junior Atelier",
    price: 1499,
    mrp: 2199,
    badge: "BESTSELLER",
    tagline: "240 GSM TWILL // ADJUSTABLE WAIST",
    drapeProfile: "Kids Relaxed Taper",
    fabric: "240 GSM Cotton Twill with Stretch",
    fabricDensity: "240 GSM Stretch Twill",
    productionVelocity: "ready-to-wear",
    colorway: "Field Olive",
    colorHex: "#3E4A3D",
    gender: "kids",
    recoTag: "GROWS-WITH-THEM HEMS",
    biometricSync: "Kids Growth Block",
    drapeCoeff: "0.42 μ",
    thermalIndex: "All-Season Play",
    hardware: "Adjustable Waist Tabs",
    doorstepTrial: false,
    measurements: { waistWidth: '22.0" (55.9 CM)', hipWidth: '28.0" (71.1 CM)', inseamLength: '20.0" (50.8 CM)' },
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=85",
      "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1000&q=85"
    ],
    sizes: ["2-4Y", "6-8Y", "10-12Y"],
    description: "Kids cargo pants with adjustable waist, knee reinforcement, and roomy pockets. Grows-with-them adjustable hems."
  },
  {
    id: 23,
    code: "CP-KD-03",
    name: "Junior Cloud Hoodie",
    category: "Kids Fleece",
    subCategory: "Kids Tops",
    collection: "Drop 09: Junior Atelier",
    price: 1699,
    mrp: 2499,
    badge: "NEW ARRIVAL",
    tagline: "320 GSM BRUSHED FLEECE // SAFE HOOD",
    drapeProfile: "Kids Cozy Relaxed",
    fabric: "320 GSM Brushed Fleece Cotton",
    fabricDensity: "320 GSM Brushed Fleece",
    productionVelocity: "ready-to-wear",
    colorway: "Oat Milk",
    colorHex: "#EECDAF",
    gender: "kids",
    recoTag: "RECO: TRUE TO SIZE",
    biometricSync: "Kids Growth Block",
    drapeCoeff: "0.40 μ",
    thermalIndex: "Cool-Season Warmth",
    hardware: "No-Drawcord Safe Hood",
    doorstepTrial: false,
    measurements: { chestWidth: '28.0" (71.1 CM)', sleeveLength: '16.0" (40.6 CM)', frontDrop: '19.0" (48.3 CM)' },
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=85",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&q=85"
    ],
    sizes: ["2-4Y", "6-8Y", "10-12Y"],
    description: "Cloud-soft kids hoodie in brushed-back fleece with double-lined hood and kangaroo pocket. No-drawcord safe design."
  },
  {
    id: 24,
    code: "CP-KD-04",
    name: "Junior Raw Denim Jacket",
    category: "Kids Jackets",
    subCategory: "Kids Jackets",
    collection: "Drop 09: Junior Atelier",
    price: 2199,
    mrp: 3199,
    badge: "LIMITED",
    tagline: "10oz SOFT DENIM // SNAP BUTTONS",
    drapeProfile: "Kids Classic Trucker",
    fabric: "10oz Soft Selvedge Denim",
    fabricDensity: "10oz Soft Denim",
    productionVelocity: "ready-to-wear",
    colorway: "Vintage Wash",
    colorHex: "#1C2536",
    gender: "kids",
    recoTag: "ROOM-TO-GROW SLEEVES",
    biometricSync: "Kids Growth Block",
    drapeCoeff: "0.52 μ",
    thermalIndex: "Cool-Season Layer",
    hardware: "Matte Snap Buttons",
    doorstepTrial: false,
    measurements: { chestWidth: '29.0" (73.7 CM)', sleeveLength: '17.0" (43.2 CM)', frontDrop: '18.5" (47.0 CM)' },
    images: [
      "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=85",
      "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1000&q=85"
    ],
    sizes: ["2-4Y", "6-8Y", "10-12Y"],
    description: "Miniaturised raw denim trucker jacket in soft-washed selvedge with snap buttons and room-to-grow sleeves."
  }
];

/* ─── BESPOKE ATELIER CUSTOMIZER MATRIX ─── */
const BESPOKE_CONFIG = {
  fabrics: [
    {
      id: "merino_twill",
      name: "280 GSM Pure Australian Merino Twill",
      origin: "Melbourne / Bengaluru Lab",
      gsm: "280 GSM",
      priceAdd: 0,
      previewColor: "#22252A",
      drape: "Architectural Boxy",
      img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=70"
    },
    {
      id: "gots_cotton",
      name: "Ahmedabad GOTS Organic Cotton Heavy Knit",
      origin: "Gujarat, India",
      gsm: "280 GSM",
      priceAdd: 0,
      previewColor: "#F4F3EE",
      drape: "Heavy Streetwear",
      img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=70"
    },
    {
      id: "tech_ripstop",
      name: "Hydrophobic Micro-Ripstop Canvas",
      origin: "Osaka / Tech Mill",
      gsm: "160 GSM",
      priceAdd: 600,
      previewColor: "#3B4237",
      drape: "Crisp Fluid",
      img: "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400&q=70"
    },
    {
      id: "heavy_terry",
      name: "Dual-Weave Heavy French Terry Fleece",
      origin: "Ahmedabad Atelier Hub",
      gsm: "420 GSM",
      priceAdd: 800,
      previewColor: "#1E1E22",
      drape: "Structured Heavy",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=70"
    },
    {
      id: "bamboo_modal",
      name: "Aero-Drape Bamboo Modal Silk Blend",
      origin: "Certified Sustainable Mill",
      gsm: "190 GSM",
      priceAdd: 500,
      previewColor: "#F6F6F6",
      drape: "Ultra-Soft Slouch",
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=70"
    }
  ],
  collars: [
    { id: "overshirt_spread", name: "Architectural Field Collar", desc: "Structured stand with clean collar point geometry", priceAdd: 0 },
    { id: "camp_cuban",       name: "Open Camp Cuban Collar",     desc: "Featherlight laid-back resort opening", priceAdd: 100 },
    { id: "band_mandarin",    name: "Minimalist Atelier Band",     desc: "Clean geometric collarless profile", priceAdd: 150 },
    { id: "hood_stand",       name: "Triple-Panel Stand Hood",    desc: "Self-supporting rigid hood architecture", priceAdd: 300 }
  ],
  hardware: [
    { id: "cobra_snaps",   name: "Anodized Magnesium Cobra Snaps", desc: "Mil-spec quick action silent snaps (Black)", priceAdd: 0 },
    { id: "matte_buttons", name: "Laser-Etched Atelier Horn Buttons", desc: "Natural organic matte dark horn", priceAdd: 200 },
    { id: "aquaguard_zip", name: "YKK Matte Aquaguard Zipper", desc: "Industrial weatherproof sealed closure", priceAdd: 400 }
  ],
  colors: [
    { id: "charcoal", name: "Concrete Charcoal", hex: "#22252A" },
    { id: "chalk",    name: "Chalk Off-White",   hex: "#F4F3EE" },
    { id: "olive",    name: "Tactical Olive",    hex: "#3B4237" },
    { id: "onyx",     name: "Pitch Onyx Black",  hex: "#0E0F12" },
    { id: "navy",     name: "Midnight Navy",     hex: "#1B2232" }
  ]
};

/* ─── UTILITY HELPERS ─── */
function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getProductByCode(code) {
  return PRODUCTS.find(p => p.code.toLowerCase() === String(code).toLowerCase());
}

function discountPercent(mrp, price) {
  return Math.round(((mrp - price) / mrp) * 100);
}

/* ─── CATALOG FILTERS (single source of truth for ?cat= links) ───
   Keys: all | men | women | kids | oversized | shirts | trousers | new */
function catalogMatches(p, key) {
  if (!p) return false;
  const cat = String(p.category || '').toLowerCase();
  const sub = String(p.subCategory || '').toLowerCase();
  const both = cat + ' ' + sub;
  switch (key) {
    case 'men': return p.gender === 'men' || p.gender === 'unisex';
    case 'women': return p.gender === 'women' || p.gender === 'unisex';
    case 'kids': return p.gender === 'kids';
    case 'oversized': return both.includes('oversized') || /oversized|boxy|balloon|relaxed/i.test(p.name || '') || /oversized/i.test(p.drapeProfile || '');
    case 'shirts': return both.includes('shirt') || both.includes('poplin');
    case 'trousers': return both.includes('trouser') || both.includes('bottom') || cat === 'bespoke trousers';
    case 'new': return /new|limited/i.test(p.badge || '');
    default: return true;
  }
}

function catalogCounts() {
  const keys = ['all', 'men', 'women', 'kids', 'oversized', 'shirts', 'trousers', 'new'];
  const out = {};
  keys.forEach(k => { out[k] = PRODUCTS.filter(p => catalogMatches(p, k)).length; });
  return out;
}
