const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    sku: {
      type: String,
      required: true,
      unique: true
    },
    itemName: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      enum: ['finished_garment', 'fabric', 'buttons', 'zippers', 'packaging', 'labels'],
      default: 'finished_garment'
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      enum: ['units', 'meters', 'pieces', 'rolls'],
      default: 'units'
    },
    size: String,
    color: String,
    reorderLevel: {
      type: Number,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

inventorySchema.pre('save', function (next) {
  this.available = Math.max(0, this.stock - this.reserved);
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
