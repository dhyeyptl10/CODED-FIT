const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1, default: 1 },
  size: { type: String, required: true },
  image: { type: String },
  type: {
    type: String,
    enum: ['ready-to-wear', 'made-to-measure'],
    default: 'ready-to-wear'
  },
  customization: {
    fabric: String,
    collar: String,
    cuff: String,
    button: String,
    monogram: String,
    fit: String,
    fabricPriceAdd: { type: Number, default: 0 },
    optionsPriceAdd: { type: Number, default: 0 }
  },
  measurementsSnapshot: {
    heightCm: Number,
    weightKg: Number,
    chestIn: Number,
    waistIn: Number,
    hipIn: Number,
    shoulderIn: Number,
    sleeveIn: Number,
    inseamIn: Number
  }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    items: [orderItemSchema],
    type: {
      type: String,
      enum: ['ready-to-wear', 'made-to-measure', 'hybrid'],
      default: 'ready-to-wear'
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' }
    },
    payment: {
      id: { type: String, default: '' },
      orderId: { type: String, default: '' },
      method: { type: String, default: 'razorpay' },
      status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
      },
      signature: { type: String, default: '' },
      paidAt: Date
    },
    status: {
      type: String,
      enum: ['placed', 'processing', 'completed', 'cancelled'],
      default: 'placed'
    },
    productionStatus: {
      type: String,
      enum: [
        'order_placed',
        'fabric_reserved',
        'pattern_created',
        'cutting',
        'stitching',
        'quality_check',
        'packed',
        'shipped',
        'delivered'
      ],
      default: 'order_placed'
    },
    firstGarmentTrial: {
      isFirstTrial: { type: Boolean, default: false },
      feedbackSubmitted: { type: Boolean, default: false },
      fitRating: { type: String, enum: ['too_tight', 'perfect', 'too_loose', 'needs_adjustment', ''] },
      areaFeedback: {
        chest: { type: String, default: '' },
        shoulder: { type: String, default: '' },
        sleeve: { type: String, default: '' },
        waist: { type: String, default: '' },
        length: { type: String, default: '' }
      },
      notes: { type: String, default: '' }
    },
    tracking: {
      carrier: { type: String, default: 'BlueDart Express' },
      number: { type: String, default: '' },
      estimatedDelivery: Date
    },
    totals: {
      subtotal: { type: Number, required: true },
      shipping: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);
