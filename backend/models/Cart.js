const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, default: 1, min: 1 },
  size: { type: String, required: true, default: 'M' },
  image: { type: String, default: '' },
  type: {
    type: String,
    enum: ['ready-to-wear', 'made-to-measure'],
    default: 'ready-to-wear'
  },
  customData: {
    fabric: String,
    collar: String,
    cuff: String,
    button: String,
    monogram: String,
    fit: String,
    fabricPriceAdd: { type: Number, default: 0 },
    optionsPriceAdd: { type: Number, default: 0 }
  },
  fitProfileSnapshot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FitProfile'
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true
    },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

cartSchema.methods.recalculateTotals = function () {
  let subtotal = 0;
  for (const item of this.items) {
    subtotal += (item.price || 0) * (item.qty || 1);
  }
  this.subtotal = subtotal;
  this.shipping = subtotal >= 2999 || subtotal === 0 ? 0 : 250;
  this.total = Math.max(0, this.subtotal + this.shipping - this.discount);
  return this.total;
};

module.exports = mongoose.model('Cart', cartSchema);
