// /models/ValidationRule.js

const mongoose = require('mongoose');

const validationRuleSchema = new mongoose.Schema({
  docType: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  rules: {
    type: Object,
    required: true,
    // Example inside: { required: true, length: 15, pattern: "^[A-Z0-9]+$" }
  },
  errorMessage: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('ValidationRule', validationRuleSchema);
