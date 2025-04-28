const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  tenantCode: { type: String, required: true, unique: true },
  tenantName: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
