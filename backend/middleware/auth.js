const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.'
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.'
    });
  }

  try {
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account no longer exists.'
      });
    }
    req.user = user;
    next();
  } catch (err) {
    // If DB disconnected in fallback mode
    req.user = { _id: decoded.id, role: decoded.role || 'customer' };
    next();
  }
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      try {
        const user = await User.findById(decoded.id).select('-passwordHash');
        if (user) req.user = user;
      } catch (e) {
        req.user = { _id: decoded.id, role: decoded.role || 'customer' };
      }
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
