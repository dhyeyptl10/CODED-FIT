const express = require('express');
const router = express.Router();
const fitProfileController = require('../controllers/fitProfileController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', protect, fitProfileController.getMyFitProfile);
router.post('/', protect, fitProfileController.saveFitProfile);
router.get('/recommendation', optionalAuth, fitProfileController.getRecommendation);

module.exports = router;
