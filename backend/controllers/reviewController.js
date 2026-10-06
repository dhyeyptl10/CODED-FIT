const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, fitFeedback, sizePurchased } = req.body;

    // Check if user has purchased this product
    const verifiedOrder = await Order.findOne({
      userId: req.user._id,
      'items.product': productId,
      'payment.status': 'paid'
    });

    if (!verifiedOrder) {
      return res.status(403).json({
        success: false,
        message: 'Only verified purchasers of this garment can leave a review.'
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      order: verifiedOrder._id,
      rating,
      title,
      comment,
      fitFeedback: fitFeedback || 'True to Fit',
      sizePurchased: sizePurchased || 'M',
      isVerifiedBuyer: true
    });

    // Update product average rating
    const allReviews = await Review.find({ product: productId });
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    await Product.findByIdAndUpdate(productId, {
      ratings: { average: parseFloat(avg.toFixed(1)), count: allReviews.length }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully.',
      review
    });
  } catch (err) {
    next(err);
  }
};
