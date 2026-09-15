const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required']
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'tailor'],
      default: 'customer'
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex', 'other'],
      default: 'unisex'
    },
    preferences: {
      newsletter: { type: Boolean, default: true },
      currency: { type: String, default: 'INR' },
      theme: { type: String, default: 'dark' }
    },
    fitProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FitProfile'
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

module.exports = mongoose.model('User', userSchema);
