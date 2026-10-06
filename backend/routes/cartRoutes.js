const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, cartController.getCart);
router.post('/items', protect, cartController.addItem);
router.put('/items/:itemId', protect, cartController.updateItemQty);
router.delete('/items/:itemId', protect, cartController.removeItem);
router.post('/merge', protect, cartController.mergeGuestCart);

module.exports = router;
