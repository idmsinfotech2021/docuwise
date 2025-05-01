const express = require('express');
const ProposalSession = require('../models/ProposalSession'); // ✅ Make sure path is correct

const router = express.Router();
const { verifyUser } = require('../middlewares/authMiddleware');
const {
  startSession,
  saveAnswer,
  confirmAnswer
} = require('../controllers/proposalSessionController');

// Start a new proposal generation session
router.post('/session/start', verifyUser, startSession);

// Save an answer + get AI-generated content
router.post('/session/answer', verifyUser, saveAnswer);

// Confirm edited final content
router.post('/session/confirm', verifyUser, confirmAnswer);

router.get('/session/:sessionId', verifyUser, async (req, res) => {
  const session = await ProposalSession.findById(req.params.sessionId);
  res.status(200).json(session);
});

module.exports = router;
