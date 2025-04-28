// /models/ExtractedResult.js
const mongoose = require('mongoose');

const ExtractedResultSchema = new mongoose.Schema({
    tenantId: { type: String, required: true },
    uploadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
    docType: { type: String, required: true },
    extractedData: { type: mongoose.Schema.Types.Mixed },
    extractedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExtractedResult', ExtractedResultSchema);
