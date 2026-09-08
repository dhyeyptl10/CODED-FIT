const express = require('express');
const router = express.Router();
const tryOnController = require('../controllers/tryOnController');
const upload = require('../middleware/upload');

router.post('/', upload.single('image'), tryOnController.executeTryOn);

module.exports = router;
