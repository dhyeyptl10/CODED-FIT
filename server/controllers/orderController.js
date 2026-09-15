const Order = require('../models/Order');
const Cart = require('../models/Cart');
const FitProfile = require('../models/FitProfile');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, type = 'ready-to-wear', discountCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your shopping bag is empty.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery address details.' });
    }

    // Check if user has placed previous custom orders (for First Garment Trial flag)
    let isFirstTrial = false;
    let measurementsSnapshot = null;

    if (req.user) {
      const userProfile = await FitProfile.findOne({ userId: req.user._id });
      if (userProfile) {
        measurementsSnapshot = {
          heightCm: userProfile.heightCm,
          weightKg: userProfile.weightKg,
          chestIn: userProfile.chestIn,
          waistIn: userProfile.waistIn,
          hipIn: userProfile.hipIn,
          shoulderIn: userProfile.shoulderIn,
          sleeveIn: userProfile.sleeveIn,
          inseamIn: userProfile.inseamIn
        };
      }

      const pastCustomOrders = await Order.countDocuments({
        userId: req.user._id,
        type: { $in: ['made-to-measure', 'hybrid'] }
      });
      if (pastCustomOrders === 0 && (type === 'made-to-measure' || items.some(i => i.type === 'made-to-measure'))) {
        isFirstTrial = true;
      }
    }

    // Recalculate totals on backend securely
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let price = item.price;
      if (item.product) {
        const p = await Product.findById(item.product);
        if (p) price = p.price;
      }
      subtotal += price * (item.qty || 1);
      validatedItems.push({
        ...item,
        price,
        measurementsSnapshot: item.type === 'made-to-measure' ? measurementsSnapshot : undefined
      });
    }

    const shipping = subtotal >= 2999 ? 0 : 250;
    const discount = discountCode === 'NOVA10' ? Math.round(subtotal * 0.10) : 0;
    const total = subtotal + shipping - discount;

    const orderNumber = `CF${Math.floor(100000 + Math.random() * 900000)}`;

    const order = await Order.create({
      orderNumber,
      userId: req.user ? req.user._id : null,
      items: validatedItems,
      type: items.some(i => i.type === 'made-to-measure') ? 'made-to-measure' : 'ready-to-wear',
      shippingAddress,
      totals: {
        subtotal,
        shipping,
        discount,
        tax: Math.round(total * 0.05),
        total
      },
      firstGarmentTrial: {
        isFirstTrial,
        feedbackSubmitted: false
      },
      productionStatus: 'order_placed',
      status: 'placed'
    });

    // Clear cart if authenticated
    if (req.user) {
      await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [], subtotal: 0, total: 0 });
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      order
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderByNumber = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// Section 40: Fit Data Loop
exports.submitFitFeedback = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { fitRating, areaFeedback, notes } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    order.firstGarmentTrial = {
      ...order.firstGarmentTrial,
      feedbackSubmitted: true,
      fitRating,
      areaFeedback: areaFeedback || {},
      notes: notes || ''
    };

    await order.save();

    // If user is authenticated, mark fit profile verified or note adjustments
    if (order.userId && fitRating === 'perfect') {
      await FitProfile.findOneAndUpdate(
        { userId: order.userId },
        { verifiedByTailor: true, source: 'fit_twin' }
      );
    }

    res.json({
      success: true,
      message: 'Fit feedback recorded. Your digital Fit Profile has been updated for future one-click reorders.',
      firstGarmentTrial: order.firstGarmentTrial
    });
  } catch (err) {
    next(err);
  }
};

// Section 41: One-Click Reorder
exports.oneClickReorder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const previousOrder = await Order.findById(orderId);

    if (!previousOrder) {
      return res.status(404).json({ success: false, message: 'Previous order record not found.' });
    }

    const orderNumber = `CF${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: req.user._id,
      items: previousOrder.items,
      type: previousOrder.type,
      shippingAddress: previousOrder.shippingAddress,
      totals: previousOrder.totals,
      firstGarmentTrial: {
        isFirstTrial: false,
        feedbackSubmitted: false
      },
      productionStatus: 'order_placed',
      status: 'placed'
    });

    res.status(201).json({
      success: true,
      message: 'One-Click Reorder successful with your confirmed fit profile.',
      order: newOrder
    });
  } catch (err) {
    next(err);
  }
};
