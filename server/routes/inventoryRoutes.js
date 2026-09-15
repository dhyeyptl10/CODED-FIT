const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/check', inventoryController.checkStock);
router.get('/summary', inventoryController.getInventorySummary);

module.exports = router;
