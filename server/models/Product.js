const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: true,
      enum: ['T-Shirts', 'Shirts', 'Bottoms', 'Jackets', 'Dresses', 'Outerwear', 'Accessories'],
      default: 'Shirts'
    },
    gender: {
      type: String,
      required: true,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex'
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    compareAtPrice: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      validate: [v => v.length > 0, 'At least one image is required']
    },
    fabric: {
      type: String,
      required: true
    },
    fabricDetails: {
      gsm: { type: String, default: '' },
      origin: { type: String, default: 'Ahmedabad, India' },
      composition: { type: String, default: '100% GOTS Organic Cotton' }
    },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'Custom Fit']
    },
    inventory: {
      stock: { type: Number, default: 20 },
      reserved: { type: Number, default: 0 },
      available: { type: Number, default: 20 },
      isLowStock: { type: Boolean, default: false }
    },
    customizationOptions: {
      collars: [{ id: String, name: String, priceAdd: Number }],
      cuffs: [{ id: String, name: String, priceAdd: Number }],
      buttons: [{ id: String, name: String, priceAdd: Number }],
      monogramAllowed: { type: Boolean, default: true }
    },
    type: {
      type: String,
      enum: ['ready-to-wear', 'made-to-measure', 'hybrid'],
      default: 'ready-to-wear'
    },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active'
    },
    badge: {
      type: String,
      default: ''
    },
    dispatchTime: {
      type: String,
      default: 'Ships in 24 Hours'
    },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ name: 'text', description: 'text', fabric: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
