const mongoose = require('mongoose');

const brandingSchema = new mongoose.Schema({
  logo: String,
  favicon: String,
  color: String,
  secondaryColor: String,
  headerText: String,
  footerText: String,
  backgroundImage: String,
  font: String
}, { _id: false });

const tenantSchema = new mongoose.Schema({
  tenantCode: { type: String, required: true, unique: true },
  tenantName: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  branding: brandingSchema
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
