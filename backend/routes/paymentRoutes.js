const express = require('express');
const router = express.Router();
router.use(require('../middleware/auth').protect);
const paymentController = require('../controllers/paymentController');

router.post('/create-order', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);

module.exports = router;
