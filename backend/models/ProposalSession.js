const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  sectionName: String,
  questionText: String,
  userInput: String,
  promptText: String,     // ✅ NEW FIELD
  aiOutput: { type: mongoose.Schema.Types.Mixed }, // ✅ allow objects here
  finalContent: String,
  confirmed: { type: Boolean, default: false }
});

const proposalSessionSchema = new mongoose.Schema({
  templateId: mongoose.Schema.Types.ObjectId,
  tenantId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId,
  answers: [answerSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProposalSession', proposalSessionSchema);
