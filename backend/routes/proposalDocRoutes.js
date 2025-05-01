const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/authMiddleware');
const { generateDocxFromSession } = require('../controllers/proposalDocController');

router.post('/session/:sessionId/generate-docx', verifyUser, generateDocxFromSession);

module.exports = router;
