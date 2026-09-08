const Product = require('../models/Product');
const FitProfile = require('../models/FitProfile');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const Fabric = require('../models/Fabric');

const aiTools = {
  // 1. Search real products with filters
  async searchProducts({ query, category, color, maxPrice, minPrice, gender, fabric, limit = 6 }) {
    const filter = { status: 'active' };

    if (category) {
      filter.category = new RegExp(category, 'i');
    }
    if (gender && gender !== 'all') {
      filter.gender = { $in: [gender, 'unisex'] };
    }
    if (maxPrice || minPrice) {
      filter.price = {};
      if (maxPrice) filter.price.$lte = Number(maxPrice);
      if (minPrice) filter.price.$gte = Number(minPrice);
    }
    if (color) {
      filter['colors.name'] = new RegExp(color, 'i');
    }
    if (fabric) {
      filter.fabric = new RegExp(fabric, 'i');
    }
    if (query) {
      filter.$or = [
        { name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { fabric: new RegExp(query, 'i') }
      ];
    }

    try {
      const products = await Product.find(filter)
        .limit(limit)
        .select('name slug price compareAtPrice fabric category gender images colors sizes inventory badge');
      return products;
    } catch (e) {
      console.error('[AI Tools] searchProducts error:', e.message);
      return [];
    }
  },

  // 2. Get single product by slug or ID
  async getProduct({ id, slug }) {
    try {
      const query = slug ? { slug } : { _id: id };
      return await Product.findOne(query);
    } catch (e) {
      return null;
    }
  },

  // 3. Get user's saved fit profile
  async getFitProfile({ userId }) {
    if (!userId) return null;
    try {
      return await FitProfile.findOne({ userId });
    } catch (e) {
      return null;
    }
  },

  // 4. Update user's fit profile
  async updateFitProfile({ userId, heightCm, weightKg, chestIn, waistIn, hipIn, preferredFit, bodyShape }) {
    if (!userId) return null;
    try {
      let profile = await FitProfile.findOne({ userId });
      if (!profile) {
        profile = new FitProfile({ userId });
      }
      if (heightCm) profile.heightCm = heightCm;
      if (weightKg) profile.weightKg = weightKg;
      if (chestIn) profile.chestIn = chestIn;
      if (waistIn) profile.waistIn = waistIn;
      if (hipIn) profile.hipIn = hipIn;
      if (preferredFit) profile.preferredFit = preferredFit;
      if (bodyShape) profile.bodyShape = bodyShape;
      await profile.save();
      return profile;
    } catch (e) {
      return null;
    }
  },

  // 5. Get order status
  async getOrderStatus({ orderNumber, userId }) {
    try {
      const query = { orderNumber: orderNumber.trim() };
      if (userId) query.userId = userId;
      const order = await Order.findOne(query).select(
        'orderNumber status productionStatus items totals createdAt tracking firstGarmentTrial'
      );
      return order;
    } catch (e) {
      return null;
    }
  },

  // 6. Get personalized recommendations based on Fit Profile
  async getRecommendations({ bodyShape, preferredFit, gender, limit = 4 }) {
    try {
      const filter = { status: 'active' };
      if (gender && gender !== 'all') {
        filter.gender = { $in: [gender, 'unisex'] };
      }
      return await Product.find(filter).limit(limit);
    } catch (e) {
      return [];
    }
  },

  // 7. Calculate custom price for Made-to-Measure garment
  async calculateCustomPrice({ fabricId, collarId, cuffId, buttonId, monogram }) {
    let basePrice = 2499;
    let fabricAdd = 0;
    let optionsAdd = 0;

    const fabricPrices = {
      gots_cotton: 0,
      selvedge_denim: 1200,
      french_terry: 800,
      italian_linen: 1500,
      tencel_blend: 1000
    };

    const collarPrices = { cutaway: 0, button_down: 150, mandarin: 200 };
    const cuffPrices = { single_barrel: 0, french_cuff: 350, angled_cuff: 200 };
    const buttonPrices = { mother_pearl: 400, horn: 300, matte_black: 250 };

    if (fabricId && fabricPrices[fabricId] !== undefined) fabricAdd = fabricPrices[fabricId];
    if (collarId && collarPrices[collarId] !== undefined) optionsAdd += collarPrices[collarId];
    if (cuffId && cuffPrices[cuffId] !== undefined) optionsAdd += cuffPrices[cuffId];
    if (buttonId && buttonPrices[buttonId] !== undefined) optionsAdd += buttonPrices[buttonId];
    const monogramAdd = monogram && monogram.trim().length > 0 ? 299 : 0;

    const total = basePrice + fabricAdd + optionsAdd + monogramAdd;

    return {
      basePrice,
      fabricAdd,
      optionsAdd,
      monogramAdd,
      total
    };
  },

  // 8. Check real-time inventory
  async checkInventory({ productId, size, color }) {
    try {
      const p = await Product.findById(productId);
      if (!p) return { inStock: false, available: 0 };
      return {
        inStock: p.inventory.available > 0,
        available: p.inventory.available,
        dispatchTime: p.dispatchTime
      };
    } catch (e) {
      return { inStock: false, available: 0 };
    }
  }
};

module.exports = aiTools;
