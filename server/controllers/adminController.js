const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Fabric = require('../models/Fabric');
const User = require('../models/User');

exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.find({ 'payment.status': 'paid' });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.totals.total || 0), 0);
    const aov = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;

    const customOrdersCount = await Order.countDocuments({ type: 'made-to-measure' });
    const rtwOrdersCount = await Order.countDocuments({ type: 'ready-to-wear' });

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
    const lowStockItems = await Inventory.find({ available: { $lte: 5 } });

    res.json({
      success: true,
      metrics: {
        totalOrders,
        totalRevenue,
        aov,
        hasData: totalOrders > 0,
        customOrdersCount,
        rtwOrdersCount,
        recentOrders,
        lowStockCount: lowStockItems.length
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductionKanban = async (req, res, next) => {
  try {
    const orders = await Order.find({ type: { $in: ['made-to-measure', 'hybrid'] } })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    const stages = {
      order_placed: [],
      fabric_reserved: [],
      pattern_created: [],
      cutting: [],
      stitching: [],
      quality_check: [],
      packed: [],
      shipped: [],
      delivered: []
    };

    orders.forEach(order => {
      const st = order.productionStatus || 'order_placed';
      if (stages[st]) {
        stages[st].push(order);
      } else {
        stages.order_placed.push(order);
      }
    });

    res.json({
      success: true,
      stages
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProductionStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { productionStatus, trackingNumber } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (productionStatus) {
      order.productionStatus = productionStatus;
      if (productionStatus === 'delivered') order.status = 'completed';
    }

    if (trackingNumber) {
      order.tracking.number = trackingNumber;
    }

    await order.save();

    res.json({
      success: true,
      message: `Order production status updated to ${productionStatus}.`,
      order
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, gender, price, compareAtPrice, fabric, description, type, stock, images } = req.body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name,
      slug,
      category,
      gender: gender || 'unisex',
      price: Number(price),
      compareAtPrice: Number(compareAtPrice) || 0,
      fabric,
      description,
      type: type || 'ready-to-wear',
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      inventory: {
        stock: Number(stock) || 15,
        available: Number(stock) || 15,
        reserved: 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({
      success: true,
      message: 'Product updated.',
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({
      success: true,
      message: 'Product deleted.'
    });
  } catch (err) {
    next(err);
  }
};
