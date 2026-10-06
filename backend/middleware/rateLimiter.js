const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this address. Please wait a moment.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit login/register attempts
  message: {
    success: false,
    message: 'Too many login attempts. Please try again in 15 minutes.'
  }
});

const aiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 AI requests per minute
  message: {
    success: false,
    message: 'AI assistant is busy. Please try your request in a moment.'
  }
});

module.exports = { apiLimiter, authLimiter, aiLimiter };
