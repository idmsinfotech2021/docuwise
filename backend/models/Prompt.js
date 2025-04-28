const mongoose = require('mongoose');

const PromptSchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: false }, // <-- ADD `ref`
    docType: { type: String, required: true },
    promptText: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prompt', PromptSchema);
