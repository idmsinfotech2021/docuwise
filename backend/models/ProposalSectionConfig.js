const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  displayName: String,
  placeholderKey: String,
  order: Number,
  required: { type: Boolean, default: false }
});

const proposalSectionConfigSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProposalTemplate' },
  sections: [sectionSchema],
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ProposalSectionConfig', proposalSectionConfigSchema);
