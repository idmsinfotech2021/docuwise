// /models/ExtractedResult.js
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    fieldName: String,
    oldValue: mongoose.Schema.Types.Mixed,   // allow any type
    newValue: mongoose.Schema.Types.Mixed,
    correctedBy: String,
    correctedAt: Date
});



const extractedResultSchema = new mongoose.Schema({
    uploadId: { type: mongoose.Schema.Types.ObjectId, required: true },
    tenantId: { type: String },
    docType: { type: String },
    extractedData: { type: mongoose.Schema.Types.Mixed },  // the main data blob
    validationErrors: [String],
    auditLogs: [auditLogSchema],
    extractedAt: { type: Date, default: Date.now }
});
  
  module.exports = mongoose.model('ExtractedResult', extractedResultSchema);
