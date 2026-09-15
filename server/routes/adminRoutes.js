const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

// All admin routes require authentication and admin role
router.use(protect);
router.use(requireAdmin);

router.get('/metrics', adminController.getDashboardMetrics);
router.get('/kanban', adminController.getProductionKanban);
router.put('/orders/:orderId/status', adminController.updateProductionStatus);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

module.exports = router;
