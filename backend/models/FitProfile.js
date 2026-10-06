const mongoose = require('mongoose');

const fitProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    heightCm: {
      type: Number,
      required: true,
      min: 120,
      max: 230,
      default: 175
    },
    weightKg: {
      type: Number,
      required: true,
      min: 35,
      max: 200,
      default: 70
    },
    chestIn: {
      type: Number,
      required: true,
      min: 25,
      max: 65,
      default: 40
    },
    waistIn: {
      type: Number,
      required: true,
      min: 20,
      max: 60,
      default: 32
    },
    hipIn: {
      type: Number,
      required: true,
      min: 25,
      max: 65,
      default: 38
    },
    shoulderIn: {
      type: Number,
      default: 18
    },
    sleeveIn: {
      type: Number,
      default: 25
    },
    inseamIn: {
      type: Number,
      default: 31
    },
    neckIn: {
      type: Number,
      default: 15.5
    },
    bodyShape: {
      type: String,
      enum: ['athletic', 'hourglass', 'rectangle', 'pear', 'inverted_triangle', 'plus'],
      default: 'athletic'
    },
    preferredFit: {
      type: String,
      enum: ['slim', 'regular', 'relaxed', 'oversized'],
      default: 'regular'
    },
    preferredLength: {
      type: String,
      enum: ['cropped', 'standard', 'longline'],
      default: 'standard'
    },
    bmi: {
      type: Number
    },
    recommendedSize: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Bespoke'],
      default: 'M'
    },
    source: {
      type: String,
      enum: ['manual', 'camera_scan', 'ai_recommendation', 'fit_twin'],
      default: 'manual'
    },
    verifiedByTailor: {
      type: Boolean,
      default: false
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

fitProfileSchema.pre('save', function (next) {
  if (this.heightCm && this.weightKg) {
    const heightM = this.heightCm / 100;
    this.bmi = parseFloat((this.weightKg / (heightM * heightM)).toFixed(1));
  }
  if (this.chestIn) {
    if (this.chestIn < 36) this.recommendedSize = 'XS';
    else if (this.chestIn < 39) this.recommendedSize = 'S';
    else if (this.chestIn < 42) this.recommendedSize = 'M';
    else if (this.chestIn < 45) this.recommendedSize = 'L';
    else if (this.chestIn < 48) this.recommendedSize = 'XL';
    else this.recommendedSize = 'XXL';
  }
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('FitProfile', fitProfileSchema);
