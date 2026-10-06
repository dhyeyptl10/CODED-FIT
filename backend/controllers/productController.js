const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { category, gender, type, fabric, minPrice, maxPrice, sort, search } = req.query;
    const filter = { status: 'active' };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (gender && gender !== 'all') {
      filter.gender = { $in: [gender, 'unisex'] };
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (fabric) {
      filter.fabric = new RegExp(fabric, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { fabric: new RegExp(search, 'i') }
      ];
    }

    let query = Product.find(filter);

    if (sort === 'price-low') query = query.sort({ price: 1 });
    else if (sort === 'price-high') query = query.sort({ price: -1 });
    else if (sort === 'newest') query = query.sort({ createdAt: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }
    res.json({
      success: true,
      product
    });
  } catch (err) {
    next(err);
  }
};
