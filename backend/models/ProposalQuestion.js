const mongoose = require('mongoose');

const proposalQuestionSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProposalTemplate' },
  sectionName: String,
  questions: [
    {
      questionText: String,
      defaultAnswer: String
    }
  ],
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProposalQuestion', proposalQuestionSchema);
