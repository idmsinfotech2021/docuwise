const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  docType: { type: String, required: true },
  filename: { type: String, required: true },
  originalFilename: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'needs_correction'], default: 'pending' },
  validationErrors: {
    type: [String],
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Upload', uploadSchema);
