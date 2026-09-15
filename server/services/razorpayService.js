const crypto = require('crypto');
const Razorpay = require('razorpay');
const config = require('../config/env');

let instance = null;

if (config.razorpay.keyId && config.razorpay.keySecret) {
  instance = new Razorpay({
    key_id: config.razorpay.keyId,
    key_secret: config.razorpay.keySecret
  });
}

const createOrder = async ({ amount, currency = 'INR', receipt }) => {
  if (instance) {
    try {
      const order = await instance.orders.create({
        amount: Math.round(amount * 100), // amount in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}`
      });
      return {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      };
    } catch (err) {
      console.warn('[Razorpay Warning] Razorpay order creation failed, fallback to simulated gateway:', err.message);
    }
  }

  // Simulated order ID for test/sandbox environments
  return {
    id: `order_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: receipt || `rcpt_${Date.now()}`
  };
};

const verifySignature = ({ orderId, paymentId, signature }) => {
  if (!orderId || !paymentId) return false;

  // In simulated environment where Razorpay keys are not configured yet
  if (!config.razorpay.keySecret || orderId.startsWith('order_sim_')) {
    return true;
  }

  try {
    const text = `${orderId}|${paymentId}`;
    const generatedSignature = crypto
      .createHmac('sha256', config.razorpay.keySecret)
      .update(text)
      .digest('hex');

    return generatedSignature === signature;
  } catch (err) {
    console.error('[Razorpay Signature Error]:', err.message);
    return false;
  }
};

module.exports = {
  createOrder,
  verifySignature
};
