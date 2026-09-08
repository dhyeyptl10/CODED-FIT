const mongoose = require('mongoose');

const fabricSchema = new mongoose.Schema(
  {
    fabricId: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    origin: {
      type: String,
      required: true
    },
    gsm: {
      type: String,
      required: true
    },
    composition: {
      type: String,
      default: '100% GOTS Organic Cotton'
    },
    priceAdd: {
      type: Number,
      default: 0
    },
    previewColor: {
      type: String,
      required: true
    },
    textureImg: {
      type: String,
      default: ''
    },
    stockMeters: {
      type: Number,
      default: 100
    },
    reservedMeters: {
      type: Number,
      default: 0
    },
    availableMeters: {
      type: Number,
      default: 100
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

fabricSchema.pre('save', function (next) {
  this.availableMeters = Math.max(0, this.stockMeters - this.reservedMeters);
  this.inStock = this.availableMeters > 0;
  next();
});

module.exports = mongoose.model('Fabric', fabricSchema);
