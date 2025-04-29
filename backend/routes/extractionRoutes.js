const express = require('express');
const router = express.Router();
const extractionController = require('../controllers/extractionController');

router.get('/:uploadId', extractionController.getExtractionResult);
router.post('/correct/:uploadId', extractionController.correctExtractionResult);

module.exports = router;
