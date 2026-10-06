const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.get('/:orderNumber', protect, orderController.getOrderByNumber);
router.post('/:orderId/fit-feedback', protect, orderController.submitFitFeedback);
router.post('/:orderId/reorder', protect, orderController.oneClickReorder);

module.exports = router;
