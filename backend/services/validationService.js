// /services/validationService.js

const ValidationRule = require('../models/ValidationRule');

const validateDocument = async (docType, extractedData) => {
  const rules = await ValidationRule.find({ docType });
  console.log("Rules :::::::::::: ", rules)
  let validationErrors = [];

  for (const rule of rules) {
    const value = extractedData[rule.field];
    console.log("value :::::::::::: ", value)

    // Required Field Check
    if (rule.rules.required && (!value || value.trim() === '')) {
      validationErrors.push(`${rule.field}: ${rule.errorMessage || 'Field is required'}`);
      continue; // Skip further checks if required fails
    }

    // Length Check
    if (rule.rules.length && value && value.length !== rule.rules.length) {
      validationErrors.push(`${rule.field}: Expected length ${rule.rules.length}`);
    }

    // Pattern (Regex) Check
    if (rule.rules.pattern && value && !(new RegExp(rule.rules.pattern).test(value))) {
      validationErrors.push(`${rule.field}: Invalid format`);
    }

    // Numeric Check (Optional enhancement)
    if (rule.rules.numeric && value && isNaN(value)) {
      validationErrors.push(`${rule.field}: Must be a number`);
    }

   
    // Future: Date check, Amount check, Range check can be added here
  }
  console.log("validationErrors :::::::::::: ", validationErrors)


  return validationErrors;
};

module.exports = { validateDocument };
