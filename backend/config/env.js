require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/coded_fit',
  jwtSecret: process.env.JWT_SECRET || 'coded_fit_jwt_secure_secret_key_change_in_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || ''
  },
  youcam: {
    apiKey: process.env.YOUCAM_API_KEY || '',
    secretKey: process.env.YOUCAM_SECRET_KEY || '',
    apiBase: process.env.YOUCAM_API_BASE || 'https://yce-api-01.makeupar.com/wow/api/v1'
  },
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'qwen3:8b',
    visionModel: process.env.OLLAMA_VISION_MODEL || 'qwen3-vl:8b'
  },
  clientUrl: process.env.CLIENT_URL || '*'
};
