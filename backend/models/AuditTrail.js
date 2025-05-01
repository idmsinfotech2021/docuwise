// models/AuditTrail.js
const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  action: { type: String, enum: ['UPLOAD', 'CORRECT', 'APPROVE', 'VALIDATE', 'REVALIDATE'] },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  previousData: { type: mongoose.Schema.Types.Mixed },  // For CORRECT actions
  newData: { type: mongoose.Schema.Types.Mixed },        // For CORRECT actions
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('AuditTrail', auditTrailSchema);
