const Cart = require('../models/Cart');
const Product = require('../models/Product');
const aiTools = require('../services/aiTools');

// Helper to get or create user's cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.recalculateTotals();
    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (err) {
    next(err);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, size, qty = 1, customData } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    let price = 0;
    let name = 'Custom Garment';
    let image = '';
    let type = customData ? 'made-to-measure' : 'ready-to-wear';

    if (productId && !customData) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found.' });
      }
      price = product.price;
      name = product.name;
      image = product.images[0] || '';
      type = product.type;

      // Check if item with same size exists
      const existing = cart.items.find(
        i => i.product && i.product.toString() === productId && i.size === size && !i.customData?.fabric
      );
      if (existing) {
        existing.qty += qty;
      } else {
        cart.items.push({
          product: product._id,
          name,
          price,
          qty,
          size: size || 'M',
          image,
          type
        });
      }
    } else if (customData) {
      // Made-to-measure bespoke item with validated server price
      const priceCalc = await aiTools.calculateCustomPrice({
        fabricId: customData.fabricId || 'gots_cotton',
        collarId: customData.collarId,
        cuffId: customData.cuffId,
        buttonId: customData.buttonId,
        monogram: customData.monogram
      });

      price = priceCalc.total;
      name = `Bespoke Shirt (${customData.fabric || 'GOTS Cotton'})`;
      image = customData.img || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=70';

      cart.items.push({
        name,
        price,
        qty: 1,
        size: size || 'Custom Fit',
        image,
        type: 'made-to-measure',
        customData: {
          fabric: customData.fabric,
          collar: customData.collar,
          cuff: customData.cuff,
          button: customData.button,
          monogram: customData.monogram,
          fit: customData.fit,
          fabricPriceAdd: priceCalc.fabricAdd,
          optionsPriceAdd: priceCalc.optionsAdd
        }
      });
    }

    cart.recalculateTotals();
    await cart.save();

    res.json({
      success: true,
      message: 'Item added to bag.',
      cart
    });
  } catch (err) {
    next(err);
  }
};

exports.updateItemQty = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { qty } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in bag.' });
    }

    if (qty <= 0) {
      cart.items.pull(itemId);
    } else {
      item.qty = qty;
    }

    cart.recalculateTotals();
    await cart.save();

    res.json({
      success: true,
      cart
    });
  } catch (err) {
    next(err);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cart = await getOrCreateCart(req.user._id);

    cart.items.pull(itemId);
    cart.recalculateTotals();
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from bag.',
      cart
    });
  } catch (err) {
    next(err);
  }
};

exports.mergeGuestCart = async (req, res, next) => {
  try {
    const { guestItems = [] } = req.body;
    const cart = await getOrCreateCart(req.user._id);

    for (const item of guestItems) {
      if (item.id && !item.customData) {
        const prod = await Product.findById(item.id);
        if (prod) {
          cart.items.push({
            product: prod._id,
            name: prod.name,
            price: prod.price,
            qty: item.qty || 1,
            size: item.size || 'M',
            image: prod.images[0] || '',
            type: prod.type
          });
        }
      } else if (item.customData) {
        cart.items.push({
          name: item.customData.name || item.name || 'Bespoke Garment',
          price: item.customData.price || item.price || 2499,
          qty: item.qty || 1,
          size: item.size || 'Custom Fit',
          image: item.customData.images?.[0] || item.image || '',
          type: 'made-to-measure',
          customData: item.customData.customDetails || item.customData
        });
      }
    }

    cart.recalculateTotals();
    await cart.save();

    res.json({
      success: true,
      message: 'Guest bag merged with account.',
      cart
    });
  } catch (err) {
    next(err);
  }
};
