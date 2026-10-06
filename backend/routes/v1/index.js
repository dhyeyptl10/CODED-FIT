/**
 * CODED FIT — Unified REST API v1 Router
 * Standardized endpoint architecture serving Web, Mobile, and Admin.
 */

const express = require('express');
const router = express.Router();

const { protect, optionalAuth } = require('../../middleware/auth');
const { getOtpProvider } = require('../../services/providers/otpProvider');
const { getPaymentProvider } = require('../../services/providers/paymentProvider');
const { getAIProvider } = require('../../services/providers/aiProvider');
const virtualTryOnService = require('../../services/virtualTryOnService');

const User = require('../../models/User');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const FitProfile = require('../../models/FitProfile');
const Cart = require('../../models/Cart');
const Fabric = require('../../models/Fabric');
const Review = require('../../models/Review');
const { generateToken } = require('../../utils/jwt');

// Existing controllers
const productController = require('../../controllers/productController');
const cartController = require('../../controllers/cartController');
const orderController = require('../../controllers/orderController');
const fitProfileController = require('../../controllers/fitProfileController');

/* ── 1. AUTH & OTP (/api/v1/auth) ── */
const authRouter = express.Router();
authRouter.use(require('../../middleware/rateLimiter').authLimiter);

// Send OTP
authRouter.post('/send-otp', async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (typeof phone !== 'string' || !/^\+?[0-9]{10,15}$/.test(phone.trim())) {
      return res.status(400).json({ success: false, message: 'Valid phone number is required.' });
    }
    const provider = getOtpProvider();
    const result = await provider.sendOtp(phone.trim());
    res.json(result);
  } catch (e) {
    next(e);
  }
});

// Verify OTP & Authenticate
authRouter.post('/verify-otp', async (req, res, next) => {
  try {
    const { phone, code, name } = req.body;
    if (typeof phone !== 'string' || typeof code !== 'string' || !/^\d{6}$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Phone and OTP code are required.' });
    }
    const provider = getOtpProvider();
    const verified = await provider.verifyOtp(phone.trim(), code.trim());
    if (!verified.success) {
      return res.status(400).json(verified);
    }

    // Find or create user
    const cleanPhone = phone.trim();
    let user = await User.findOne({ phone: cleanPhone });
    if (!user) {
      const generatedEmail = `${cleanPhone.replace(/[^0-9]/g, '')}@codedfit.user`;
      const randomPassword = Math.random().toString(36).slice(-10);
      const passwordHash = await User.hashPassword(randomPassword);
      user = await User.create({
        name: name || `Customer ${cleanPhone.slice(-4)}`,
        phone: cleanPhone,
        email: generatedEmail,
        passwordHash,
        role: 'customer'
      });
    }

    // Populate fit profile
    const fitProfile = await FitProfile.findOne({ userId: user._id });
    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        gender: user.gender,
        fitProfile: fitProfile || null
      }
    });
  } catch (e) {
    next(e);
  }
});

// Email/Password login & register fallback
authRouter.post('/register', require('../../controllers/authController').register);
authRouter.post('/login', require('../../controllers/authController').login);
authRouter.get('/me', protect, async (req, res) => {
  const fitProfile = await FitProfile.findOne({ userId: req.user._id });
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      gender: req.user.gender,
      fitProfile: fitProfile || null
    }
  });
});
router.use('/auth', authRouter);

/* ── 2. USERS (/api/v1/users) ── */
const usersRouter = express.Router();
usersRouter.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-passwordHash');
  res.json({ success: true, user });
});
usersRouter.put('/profile', protect, async (req, res) => {
  const { name, gender, phone } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { name, gender, phone } },
    { new: true }
  ).select('-passwordHash');
  res.json({ success: true, user });
});
router.use('/users', usersRouter);
router.use('/customer', require('../customerRoutes'));

/* ── 3. PRODUCTS (/api/v1/products) & CATEGORIES (/api/v1/categories) ── */
router.use('/products', require('../productRoutes'));
router.get('/categories', async (req, res) => {
  const categories = [
    { id: 't-shirts', name: 'T-Shirts', count: 24 },
    { id: 'shirts', name: 'Shirts', count: 18 },
    { id: 'hoodies', name: 'Hoodies', count: 12 },
    { id: 'bottoms', name: 'Bottoms & Pants', count: 15 },
    { id: 'jackets', name: 'Jackets & Overshirts', count: 9 }
  ];
  res.json({ success: true, categories });
});

/* ── 4. FIT PROFILE & AVATAR (/api/v1/fit-profile, /api/v1/avatar) ── */
router.use('/fit-profile', require('../fitProfileRoutes'));
router.get('/avatar', optionalAuth, async (req, res) => {
  let profile = null;
  if (req.user) {
    profile = await FitProfile.findOne({ userId: req.user._id });
  }
  res.json({
    success: true,
    avatar: {
      archetype: profile?.bodyShape || 'athletic',
      heightCm: profile?.heightCm || 178,
      weightKg: profile?.weightKg || 72,
      chestIn: profile?.chestIn || 40,
      waistIn: profile?.waistIn || 32,
      hipIn: profile?.hipIn || 38,
      recommendedSize: profile?.recommendedSize || 'M'
    }
  });
});

/* ── 5. CUSTOMIZATIONS & DESIGNS (/api/v1/customizations, /api/v1/designs) ── */
router.use('/customizations', require('../customizationRoutes'));
router.use('/designs', require('../designRoutes'));

/* ── 6. CART (/api/v1/cart) ── */
router.use('/cart', require('../cartRoutes'));

/* ── 7. CHECKOUT & PAYMENTS (/api/v1/checkout, /api/v1/payments) ── */
const checkoutRouter = express.Router();
checkoutRouter.post('/create-payment-intent', protect, require('../../controllers/paymentController').createPaymentOrder);
router.use('/checkout', checkoutRouter);
router.use('/payments', require('../paymentRoutes'));

/* ── 8. ORDERS & PRODUCTION (/api/v1/orders, /api/v1/production) ── */
router.use('/orders', require('../orderRoutes'));
const productionRouter = express.Router();
productionRouter.get('/tracker/:orderNumber', protect, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber, userId: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({
      success: true,
      orderNumber: order.orderNumber,
      status: order.status,
      productionStatus: order.productionStatus,
      firstGarmentTrial: order.firstGarmentTrial,
      tracking: order.tracking
    });
  } catch (e) {
    next(e);
  }
});
router.use('/production', productionRouter);

/* ── 9. INVENTORY, REVIEWS, RETURNS (/api/v1/inventory, reviews, returns) ── */
router.use('/inventory', require('../inventoryRoutes'));
router.use('/reviews', require('../reviewRoutes'));
router.post('/returns', protect, (req,res)=>res.status(503).json({success:false,message:'Return requests are not enabled. Please contact store support.'}));

/* ── 10. AI & VOICE (/api/v1/ai) ── */
const aiRouter = express.Router();
aiRouter.post('/command', async (req, res, next) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
    const provider = getAIProvider();
    const result = await provider.processCommand(prompt, context);
    res.json({ success: true, ...result });
  } catch (e) {
    next(e);
  }
});
// Also mount legacy chat
aiRouter.post('/chat', require('../../controllers/aiController').chat);
router.use('/ai', aiRouter);

/* ── 11. VIRTUAL TRY-ON (/api/v1/tryon) ── */
router.use('/tryon', require('../tryOnRoutes'));

/* ── 12. NOTIFICATIONS (/api/v1/notifications) ── */
router.get('/notifications', optionalAuth, (req, res) => {
  res.json({
    success: true,
    notifications: [
      {
        id: 'notif_1',
        title: 'Welcome to CODED FIT Atelier',
        message: 'Calibrate your 3D Fit Profile for Unit-of-One tailoring.',
        date: new Date().toISOString(),
        read: false
      }
    ]
  });
});

router.post('/newsletter', require('../../middleware/rateLimiter').authLimiter, async(req,res,next)=>{
  try{
    if(typeof req.body.email!=='string' || req.body.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email) || req.body.consent!==true)return res.status(400).json({message:'A valid email and consent are required.'});
    await require('../../models/Subscriber').updateOne({email:req.body.email.trim().toLowerCase()},{$set:{consent:true},$setOnInsert:{status:'requested'}},{upsert:true});
    res.json({success:true,message:'Subscription request saved.'});
  }catch(error){next(error);}
});
module.exports = router;
