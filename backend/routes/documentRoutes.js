// /routes/documentRoutes.js
const express = require('express');
const router = express.Router();
const { uploadDocument, getExtractedResults } = require('../controllers/documentController');

// POST /api/documents/upload
router.post('/upload', uploadDocument);

// GET /api/documents/results
router.get('/results', getExtractedResults);

module.exports = router;
