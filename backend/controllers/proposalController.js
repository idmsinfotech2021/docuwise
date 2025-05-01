const ProposalSession = require('../models/ProposalSession');
const { generateAIAnswer } = require('../utils/geminiPrompt');

const startProposalSession = async (req, res) => {
  const { templateId, sections, demo } = req.body;
  const tenantId = req.user.tenantId;
  const session = await ProposalSession.create({
    templateId,
    userId: req.user._id,
    sections,
    answers: [],
    tenantId,
    isDemo: demo || false
  });

  if (demo) {
    for (const section of sections) {
      session.answers.push({
        section,
        question: `Auto-generated for demo: ${section}`,
        userInput: `Demo input for ${section}`,
        aiOutput: `This is a simulated AI response for ${section}.`,
        finalContent: `This is a simulated AI response for ${section}.`,
        confirmed: true
      });
    }
    await session.save();
  }

  res.status(201).json({ sessionId: session._id });
};

const saveAnswer = async (req, res) => {
  const { sessionId, section, question, userInput } = req.body;
  const session = await ProposalSession.findById(sessionId);
  const prompt = generateAIAnswer.buildPromptWithContext(session, section, question, userInput);
  const aiOutput = await generateAIAnswer.callGeminiAPI(prompt);
  const tenantId = req.user.tenantId;
  session.answers.push({
    section,
    question,
    userInput,
    aiOutput,
    finalContent: aiOutput,
    confirmed: false,
    tenantId
  });
  await session.save();
  res.status(200).json({ aiOutput });
};

const confirmAnswer = async (req, res) => {
  const { sessionId, section, finalContent } = req.body;
  const session = await ProposalSession.findById(sessionId);
  const answer = session.answers.find(a => a.section === section);
  if (answer) {
    answer.finalContent = finalContent;
    answer.confirmed = true;
  }
  await session.save();
  res.status(200).json({ message: 'Confirmed' });
};

module.exports = { startProposalSession, saveAnswer, confirmAnswer };