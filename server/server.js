require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const config = require('./config/env');

const PORT = config.port || 5000;

// Connect to MongoDB
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log('====================================================');
    console.log(` CODED FIT API Server running on port ${PORT}`);
    console.log(` Environment: ${config.nodeEnv}`);
    console.log(` API URL: http://localhost:${PORT}/api`);
    console.log(` Health: http://localhost:${PORT}/api/health`);
    console.log('====================================================');
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
  });
});
