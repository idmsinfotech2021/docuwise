const mongoose = require('mongoose');

const proposalTemplateSchema = new mongoose.Schema({
  fileName: String,
  placeholderList: [String],
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('ProposalTemplate', proposalTemplateSchema);
