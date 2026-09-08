const errorHandler = (err, req, res, next) => {
  console.error('[Error Logged]:', err.stack || err.message || err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', ')
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `An account with this ${field} already exists.`
    });
  }

  // Multer error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file is too large. Maximum allowed size is 10MB.'
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.isOperational ? err.message : 'Something went wrong. Please try again.'
  });
};

module.exports = errorHandler;
