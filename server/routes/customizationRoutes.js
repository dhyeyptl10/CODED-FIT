const express = require('express');
const router = express.Router();
const customizationController = require('../controllers/customizationController');

router.get('/options', customizationController.getCustomizationOptions);
router.post('/calculate-price', customizationController.calculatePrice);

module.exports = router;
