const Order = require('../models/Order');
const razorpayService = require('../services/razorpayService');

exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const rzpOrder = await razorpayService.createOrder({
      amount: order.totals.total,
      currency: 'INR',
      receipt: `rcpt_${order.orderNumber}`
    });

    order.payment.orderId = rzpOrder.id;
    await order.save();

    res.json({
      success: true,
      razorpayOrder: rzpOrder,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const isValid = razorpayService.verifySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature
    });

    if (!isValid) {
      order.payment.status = 'failed';
      await order.save();
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed. Transaction flagged.'
      });
    }

    // Payment verified: transition order to PAID and initiate production
    order.payment.status = 'paid';
    order.payment.id = razorpayPaymentId;
    order.payment.signature = razorpaySignature;
    order.payment.paidAt = new Date();
    order.status = 'processing';
    order.productionStatus = order.type === 'made-to-measure' ? 'fabric_reserved' : 'packed';

    await order.save();

    res.json({
      success: true,
      message: 'Payment verified. Garment production queued.',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        productionStatus: order.productionStatus,
        paidAt: order.payment.paidAt
      }
    });
  } catch (err) {
    next(err);
  }
};
