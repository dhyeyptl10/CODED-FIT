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
      'https://images.unsplash.com/photo-1593030941791-ef63b2dbb821?w=1000&q=80'
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
      'https://images.unsplash.com/photo-1596755094514-f87e32f6b717?w=1000&q=80'
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
    name: 'Gold Fluid Silk Midi Gown',
    slug: 'gold-fluid-silk-midi-gown',
    category: 'Dresses',
    price: 4299,
    compareAtPrice: 5999,
    badge: 'MADE TO MEASURE',
    fabric: 'Pure Organic Italian Linen & Silk',
    gender: 'women',
    type: 'made-to-measure',
    dispatchTime: 'Bespoke Made-to-Measure (7-14 Days)',
    description: 'Lustrous bias-cut midi dress designed to glide effortlessly over natural curves. Includes bespoke contour adjustments to bust and waist.',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1000&q=80'
    ],
    colors: [{ name: 'Ahmedabad Gold', hex: '#C9A84C' }],
    sizes: ['Custom Fit', 'XS', 'S', 'M', 'L'],
    inventory: { stock: 12, reserved: 1, available: 11 }
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
