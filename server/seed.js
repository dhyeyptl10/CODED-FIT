require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Fabric = require('./models/Fabric');
const Inventory = require('./models/Inventory');
const Order = require('./models/Order');

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coded_fit';

const initialFabrics = [
  {
    fabricId: 'gots_cotton',
    name: 'Ahmedabad GOTS Organic Cotton',
    origin: 'Gujarat, India',
    gsm: '280 GSM',
    composition: '100% Certified Organic Cotton',
    priceAdd: 0,
    previewColor: '#F5F2E7',
    stockMeters: 250,
    reservedMeters: 40
  },
  {
    fabricId: 'selvedge_denim',
    name: 'Japanese Selvedge Denim',
    origin: 'Okayama / Gujarat Mill',
    gsm: '14.5 oz',
    composition: '100% Ring-Spun Cotton',
    priceAdd: 1200,
    previewColor: '#1c2536',
    stockMeters: 180,
    reservedMeters: 25
  },
  {
    fabricId: 'french_terry',
    name: 'Heavy French Terry Fleece',
    origin: 'Ahmedabad Mill',
    gsm: '450 GSM',
    composition: '100% Combed Cotton',
    priceAdd: 800,
    previewColor: '#EECDAF',
    stockMeters: 140,
    reservedMeters: 15
  },
  {
    fabricId: 'italian_linen',
    name: 'Pure Organic Italian Linen',
    origin: 'Biella / Sourced Hub',
    gsm: '210 GSM',
    composition: '100% European Flax',
    priceAdd: 1500,
    previewColor: '#E8E3DA',
    stockMeters: 110,
    reservedMeters: 10
  },
  {
    fabricId: 'tencel_blend',
    name: 'TENCEL Lyocell Blend',
    origin: 'Sustainable Mill Blend',
    gsm: '240 GSM',
    composition: '65% TENCEL, 35% Organic Cotton',
    priceAdd: 1000,
    previewColor: '#4C1D95',
    stockMeters: 90,
    reservedMeters: 10
  }
];

const initialProducts = [
  {
    name: 'Aether Oversized Drop-Shoulder Tee',
    slug: 'aether-oversized-drop-shoulder-tee',
    category: 'T-Shirts',
    price: 1499,
    compareAtPrice: 2499,
    badge: 'BESTSELLER',
    fabric: '280 GSM Ahmedabad GOTS Organic Cotton',
    gender: 'men',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Heavyweight 280 GSM luxury combed GOTS organic cotton sourced from certified mills in Ahmedabad. Features dropped shoulders and structured neckline. The quintessential CODED FIT wardrobe staple.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1000&q=80'
    ],
    colors: [{ name: 'Washed Off-White', hex: '#F5F2E7' }, { name: 'Onyx Black', hex: '#18181B' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inventory: { stock: 45, reserved: 5, available: 40 }
  },
  {
    name: 'Tactical Cargo Utility Trousers',
    slug: 'tactical-cargo-utility-trousers',
    category: 'Bottoms',
    price: 2899,
    compareAtPrice: 3999,
    badge: 'SIGNATURE',
    fabric: '320 GSM Ripstop Cotton Twill',
    gender: 'men',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Multi-pocket technical cargo trousers engineered with dual anodized hardware buckles, adjustable ankle cinches, and ergonomic tapered fit.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=80',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=80'
    ],
    colors: [{ name: 'Charcoal Slate', hex: '#27272A' }, { name: 'Raw Olive', hex: '#3E4A3D' }],
    sizes: ['28', '30', '32', '34', '36'],
    inventory: { stock: 30, reserved: 4, available: 26 }
  },
  {
    name: 'Obsidian Boxy Selvedge Denim Jacket',
    slug: 'obsidian-boxy-selvedge-denim-jacket',
    category: 'Jackets',
    price: 4299,
    compareAtPrice: 5999,
    badge: 'MADE TO MEASURE',
    fabric: '14.5oz Japanese Selvedge Denim',
    gender: 'men',
    type: 'made-to-measure',
    dispatchTime: 'Bespoke Made-to-Measure (7-14 Days)',
    description: '14.5oz rigid selvedge denim boxy jacket with hand-distressed edge work, matte black hardware, and custom printed interior lining.',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=80'
    ],
    colors: [{ name: 'Raw Black Denim', hex: '#18181B' }],
    sizes: ['S', 'M', 'L', 'XL', 'Custom Fit'],
    inventory: { stock: 15, reserved: 2, available: 13 }
  },
  {
    name: 'Biella Bespoke Linen Shirt',
    slug: 'biella-bespoke-linen-shirt',
    category: 'Shirts',
    price: 2799,
    compareAtPrice: 3999,
    badge: 'MADE TO MEASURE',
    fabric: '210 GSM Biella Italian Linen',
    gender: 'men',
    type: 'made-to-measure',
    dispatchTime: 'Bespoke Made-to-Measure (7-14 Days)',
    description: 'Pure organic Italian linen shirt woven from premium flax fibers. Naturally breathable with relaxed structure, Mother-of-Pearl buttons, and hand-rolled hems.',
    images: [
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=1000&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&q=80'
    ],
    colors: [{ name: 'Sky Chambray', hex: '#93C5FD' }, { name: 'Alabaster White', hex: '#FAF8F5' }],
    sizes: ['Custom Fit', 'S', 'M', 'L', 'XL'],
    inventory: { stock: 25, reserved: 3, available: 22 }
  },
  {
    name: 'Purple Tailored Midi Dress',
    slug: 'purple-tailored-midi-dress',
    category: 'Dresses',
    price: 3499,
    compareAtPrice: 4999,
    badge: 'BESTSELLER',
    fabric: 'TENCEL Lyocell Blend',
    gender: 'women',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Structured silhouette midi dress crafted from silky TENCEL Lyocell with concealed zip fastening and architectural seam detailing.',
    images: [
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1000&q=80'
    ],
    colors: [{ name: 'Royal Purple', hex: '#4C1D95' }],
    sizes: ['XS', 'S', 'M', 'L'],
    inventory: { stock: 20, reserved: 2, available: 18 }
  },
  {
    name: 'Scarlet Wrap Midi Dress',
    slug: 'scarlet-wrap-midi-dress',
    category: 'Dresses',
    price: 3799,
    compareAtPrice: 5299,
    badge: 'NEW ARRIVAL',
    fabric: 'TENCEL Lyocell Satin Blend',
    gender: 'women',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Editorial wrap midi dress in fluid TENCEL satin with true-wrap waist tie and side slit. Cut for hourglass and pear proportions.',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&q=80'
    ],
    colors: [{ name: 'Scarlet Noir', hex: '#7F1D1D' }],
    sizes: ['XS', 'S', 'M', 'L'],
    inventory: { stock: 22, reserved: 2, available: 20 }
  },
  {
    name: 'Ivory Sculpted Knit Top',
    slug: 'ivory-sculpted-knit-top',
    category: 'Tops',
    price: 1899,
    compareAtPrice: 2799,
    badge: 'NEW ARRIVAL',
    fabric: '220 GSM GOTS Organic Cotton Knit',
    gender: 'women',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Second-skin sculpted knit top in breathable GOTS cotton with square neckline and long sleeves. Pairs with high-rise tailoring.',
    images: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1000&q=80',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&q=80'
    ],
    colors: [{ name: 'Ivory', hex: '#F5F2E7' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inventory: { stock: 34, reserved: 3, available: 31 }
  },
  {
    name: 'Noir High-Waist Wide-Leg Trouser',
    slug: 'noir-high-waist-wide-leg-trouser',
    category: 'Bottoms',
    price: 2799,
    compareAtPrice: 3999,
    badge: 'BESTSELLER',
    fabric: 'Japanese Selvedge Denim Stretch',
    gender: 'women',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'High-rise wide-leg trouser in comfort-stretch selvedge denim with clean front and ankle-grazing hem. Zero-gap waistband engineering.',
    images: [
      'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=1000&q=80'
    ],
    colors: [{ name: 'Washed Indigo', hex: '#1C2536' }],
    sizes: ['26', '28', '30', '32', '34'],
    inventory: { stock: 28, reserved: 3, available: 25 }
  },
  {
    name: 'Junior Explorer Graphic Tee (Kids)',
    slug: 'junior-explorer-graphic-tee-kids',
    category: 'Kids',
    price: 899,
    compareAtPrice: 1299,
    badge: 'NEW ARRIVAL',
    fabric: '180 GSM Soft Combed Cotton',
    gender: 'kids',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Everyday kids tee in soft combed cotton with reinforced shoulder seams and tag-free neckline. Playground-tested durability.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&q=80',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1000&q=80'
    ],
    colors: [{ name: 'Cloud White', hex: '#F5F2E7' }, { name: 'Onyx', hex: '#18181B' }],
    sizes: ['2-4Y', '6-8Y', '10-12Y', 'Custom Fit'],
    inventory: { stock: 50, reserved: 4, available: 46 }
  },
  {
    name: 'Junior Field Cargo Pants (Kids)',
    slug: 'junior-field-cargo-pants-kids',
    category: 'Kids',
    price: 1499,
    compareAtPrice: 2199,
    badge: 'BESTSELLER',
    fabric: '240 GSM Cotton Twill with Stretch',
    gender: 'kids',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Kids cargo pants with adjustable waist, knee reinforcement, and roomy pockets. Grows-with-them adjustable hems.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&q=80',
      'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=1000&q=80'
    ],
    colors: [{ name: 'Field Olive', hex: '#3E4A3D' }],
    sizes: ['2-4Y', '6-8Y', '10-12Y', 'Custom Fit'],
    inventory: { stock: 40, reserved: 3, available: 37 }
  },
  {
    name: 'Junior Cloud Hoodie (Kids)',
    slug: 'junior-cloud-hoodie-kids',
    category: 'Kids',
    price: 1699,
    compareAtPrice: 2499,
    badge: 'NEW ARRIVAL',
    fabric: '320 GSM Brushed Fleece Cotton',
    gender: 'kids',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Cloud-soft kids hoodie in brushed-back fleece with double-lined hood and kangaroo pocket. No-drawcord safe design.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&q=80'
    ],
    colors: [{ name: 'Oat Milk', hex: '#EECDAF' }],
    sizes: ['2-4Y', '6-8Y', '10-12Y', 'Custom Fit'],
    inventory: { stock: 36, reserved: 3, available: 33 }
  },
  {
    name: 'Junior Raw Denim Jacket (Kids)',
    slug: 'junior-raw-denim-jacket-kids',
    category: 'Kids',
    price: 2199,
    compareAtPrice: 3199,
    badge: 'LIMITED',
    fabric: '10oz Soft Selvedge Denim',
    gender: 'kids',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Miniaturised raw denim trucker jacket in soft-washed selvedge with snap buttons and room-to-grow sleeves.',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=1000&q=80',
      'https://images.unsplash.com/photo-1476234251651-f353703a034d?w=1000&q=80'
    ],
    colors: [{ name: 'Vintage Wash', hex: '#1C2536' }],
    sizes: ['2-4Y', '6-8Y', '10-12Y', 'Custom Fit'],
    inventory: { stock: 24, reserved: 2, available: 22 }
  },
  {
    name: 'Atlas Boxy Oversized Hoodie (Unisex)',
    slug: 'atlas-boxy-oversized-hoodie-unisex',
    category: 'Hoodies',
    price: 2999,
    compareAtPrice: 4499,
    badge: 'BESTSELLER',
    fabric: '450 GSM Heavy French Terry',
    gender: 'unisex',
    type: 'ready-to-wear',
    dispatchTime: 'Ships in 24 Hours',
    description: 'Monumental boxy-oversized hoodie in heavyweight French terry with dropped shoulders and hidden phone pocket. One cut, all bodies.',
    images: [
      'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=1000&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&q=80'
    ],
    colors: [{ name: 'Sage', hex: '#4A7C6F' }, { name: 'Onyx', hex: '#18181B' }],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inventory: { stock: 42, reserved: 5, available: 37 }
  },
  {
    name: 'Dune Oversized Camp Shirt (Unisex)',
    slug: 'dune-oversized-camp-shirt-unisex',
    category: 'Shirts',
    price: 2299,
    compareAtPrice: 3499,
    badge: 'NEW ARRIVAL',
    fabric: '200 GSM Washed Linen-Cotton',
    gender: 'unisex',
    type: 'hybrid',
    dispatchTime: 'Ships in 48 Hours',
    description: 'Breezy oversized camp-collar shirt in washed linen-cotton with coconut buttons. Gender-free block graded XS to XXL.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=80',
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=1000&q=80'
    ],
    colors: [{ name: 'Dune Sand', hex: '#D4C5B5' }],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom Fit'],
    inventory: { stock: 30, reserved: 3, available: 27 }
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('[Seed] Connected to MongoDB.');

    // Seed Fabrics
    await Fabric.deleteMany({});
    await Fabric.insertMany(initialFabrics);
    console.log(`[Seed] Seeded ${initialFabrics.length} certified fabrics.`);

    // Seed Products
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(initialProducts);
    console.log(`[Seed] Seeded ${createdProducts.length} core catalog garments.`);

    // Seed Inventories
    await Inventory.deleteMany({});
    for (const p of createdProducts) {
      await Inventory.create({
        productId: p._id,
        sku: `CF-${p.category.substring(0, 3).toUpperCase()}-${p._id.toString().substring(18, 24).toUpperCase()}`,
        itemName: p.name,
        stock: p.inventory.stock,
        reserved: p.inventory.reserved,
        available: p.inventory.available
      });
    }
    console.log('[Seed] Seeded inventory records for all products.');

    // Seed Default Admin User
    await User.deleteMany({ email: 'admin@codedfit.com' });
    const adminPasswordHash = await User.hashPassword('Admin@CodedFit2026');
    await User.create({
      name: 'CODED FIT Master Tailor',
      email: 'admin@codedfit.com',
      phone: '+91 9876543210',
      passwordHash: adminPasswordHash,
      role: 'admin'
    });
    console.log('[Seed] Created default admin account: admin@codedfit.com / Admin@CodedFit2026');

    // Seed Sample Order for tracking demo
    await Order.deleteMany({ orderNumber: 'CF1024' });
    await Order.create({
      orderNumber: 'CF1024',
      items: [
        {
          name: 'Biella Bespoke Linen Shirt',
          price: 2799,
          qty: 1,
          size: 'Custom 3D Fit',
          type: 'made-to-measure',
          customization: {
            fabric: 'Pure Organic Italian Linen',
            collar: 'Cutaway Spread Collar',
            cuff: 'French Double Cuff',
            button: 'Natural Mother-of-Pearl',
            monogram: 'CF'
          }
        }
      ],
      type: 'made-to-measure',
      shippingAddress: {
        fullName: 'Dev Patel',
        phone: '+91 9876543210',
        street: '42 Ambli Bopal Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        postalCode: '380058',
        country: 'India'
      },
      payment: {
        id: 'pay_demo_1024',
        status: 'paid',
        paidAt: new Date()
      },
      status: 'processing',
      productionStatus: 'cutting',
      firstGarmentTrial: {
        isFirstTrial: true,
        feedbackSubmitted: false
      },
      tracking: {
        carrier: 'BlueDart Express',
        number: 'BD-884920412'
      },
      totals: {
        subtotal: 2799,
        shipping: 0,
        discount: 0,
        tax: 140,
        total: 2799
      }
    });
    console.log('[Seed] Seeded demonstration order #CF1024 with 9-stage MTM production workflow.');

    console.log('[Seed] All database collections successfully initialized.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
