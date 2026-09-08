const Inventory = require('../models/Inventory');
const Fabric = require('../models/Fabric');
const Product = require('../models/Product');

exports.checkStock = async (req, res, next) => {
  try {
    const { productId, size, color } = req.query;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({
      success: true,
      inStock: product.inventory.available > 0,
      available: product.inventory.available,
      stock: product.inventory.stock,
      reserved: product.inventory.reserved,
      dispatchTime: product.dispatchTime
    });
  } catch (err) {
    next(err);
  }
};

exports.getInventorySummary = async (req, res, next) => {
  try {
    const items = await Inventory.find().populate('productId', 'name slug');
    const fabrics = await Fabric.find();

    res.json({
      success: true,
      inventory: items,
      fabrics
    });
  } catch (err) {
    next(err);
  }
};
