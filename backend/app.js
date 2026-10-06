const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const fitProfileRoutes = require('./routes/fitProfileRoutes');
const customizationRoutes = require('./routes/customizationRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const tryOnRoutes = require('./routes/tryOnRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for development and local model/CDN loading
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Enable CORS
app.use(
  cors({
    origin: (process.env.CLIENT_URL || 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Signature verification requires the exact bytes supplied by the gateway.
app.post('/api/v1/payments/webhook', express.raw({type:'application/json',limit:'1mb'}), require('./controllers/paymentWebhookController').handle);

// Body parsers
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const apiV1Routes = require('./routes/v1');

// Global API rate limiter
app.use('/api', apiLimiter);

// Versioned API v1 Router (Web & Mobile unified contract)
app.use('/api/v1', apiV1Routes);

// Legacy API Routes (backwards-compatibility)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/fit-profile', fitProfileRoutes);
app.use('/api/customization', customizationRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'CODED FIT',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', (req, res) => res.status(404).json({ success: false, message: 'API route not found' }));

// Centralized error handler
app.use(errorHandler);

module.exports = app;
