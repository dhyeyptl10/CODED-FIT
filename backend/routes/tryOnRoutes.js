const express = require('express');
const router = express.Router();
const tryOnController = require('../controllers/tryOnController');
const upload = require('../middleware/upload');

// POST /api/try-on — create a virtual fitting (multipart photo or JSON base64/URL)
router.post('/', upload.single('image'), tryOnController.createTryOn);

// GET /api/try-on/:taskId — poll task status (for async providers)
router.get('/:taskId', tryOnController.getTryOnStatus);

module.exports = router;
