const mongoose = require('mongoose');
const ProposalQuestion = require('../models/ProposalQuestion');

const saveQuestions = async (req, res) => {
  console.log('[DEBUG] req.body:', req.body); // 🔍
  const { templateId, sectionName, questions } = req.body;

  if (!templateId || !sectionName || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'templateId, sectionName, and questions are required' });
  }
  const tenantId = req.user.tenantId;
  try {
    const record = await ProposalQuestion.findOneAndUpdate(
      { templateId, sectionName },
      { questions, updatedAt: new Date() },
      { new: true, upsert: true },
      tenantId
    );

    res.status(200).json({ message: 'Questions saved', record });
  } catch (err) {
    console.error('Error saving questions:', err);
    res.status(500).json({ message: 'Failed to save questions' });
  }
};

const getQuestions = async (req, res) => {
  const { templateId, sectionName } = req.query;
  console.log("here --------- ", req.query)
  try {
    const tenantId = req.user.tenantId;
    const record = await ProposalQuestion.findOne({ templateId: new mongoose.Types.ObjectId(templateId), sectionName, tenantId });
    console.log("Record is ", record)
    if (!record) return res.status(404).json({ message: 'No questions found' });
    res.status(200).json(record);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Error retrieving questions' });
  }
};

module.exports = { saveQuestions, getQuestions };
