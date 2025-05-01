const ProposalSession = require('../models/ProposalSession');
const { callGeminiAPI } = require('../services/geminiService');
const { buildPromptWithContext } = require('../utils/geminiPrompt');



// Start a new proposal session
const startSession = async (req, res) => {
  const { templateId } = req.body;
  const tenantId = req.user.tenantId;
  const userId = req.user._id;

  try {
    const session = await ProposalSession.create({
      templateId,
      tenantId,
      userId,
      answers: [],
      createdAt: new Date()
    });

    res.status(201).json({ sessionId: session._id });
  } catch (err) {
    console.error('Error starting session:', err);
    res.status(500).json({ message: 'Failed to start proposal session' });
  }
};

// Save answer and get AI output
const saveAnswer = async (req, res) => {
  const { sessionId, sectionName, questionText, userInput } = req.body;

  try {
    const session = await ProposalSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const prompt = buildPromptWithContext(session, sectionName, questionText, userInput);
    const aiOutput = await callGeminiAPI(prompt);

    session.answers.push({
        sectionName,
        questionText,
        userInput,
        promptText: prompt,   // ✅ Log prompt
        aiOutput,
        confirmed: false
    });

    await session.save();
    res.status(200).json({ aiOutput });
  } catch (err) {
    console.error('Error saving answer:', err);
    res.status(500).json({ message: 'Failed to save answer' });
  }
};

// Confirm final edited answer
const confirmAnswer = async (req, res) => {
  
  const { sessionId, sectionName, finalContent } = req.body;

  try {
    const session = await ProposalSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const answer = session.answers.find(a => a.sectionName === sectionName);
    if (answer) {
      answer.finalContent = finalContent;
      answer.confirmed = true;
    }

    await session.save();
    res.status(200).json({ message: 'Answer confirmed' });
  } catch (err) {
    console.error('Error confirming answer:', err);
    res.status(500).json({ message: 'Failed to confirm answer' });
  }
};

module.exports = { startSession, saveAnswer, confirmAnswer };
