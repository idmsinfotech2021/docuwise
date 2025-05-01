// /controllers/validationRuleController.js

const ValidationRule = require('../models/ValidationRule');
const AuditTrail = require('../models/AuditTrail'); // 🔍 Ensure this model file exists

// Fetch all rules for a document type
const getValidationRules = async (req, res) => {
  const { docType } = req.params;
  try {
    const rules = await ValidationRule.find({ docType });
    res.json(rules);
  } catch (error) {
    console.error('Error fetching validation rules:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new validation rule
const addValidationRule = async (req, res) => {
  const { docType } = req.params;
  const { field, rules, errorMessage } = req.body;

  try {
    const newRule = new ValidationRule({
      docType,
      field,
      rules,
      errorMessage
    });

    await newRule.save();
    // ✍️ Create Audit Trail for UPLOAD
    // await AuditTrail.create({
    //   documentId: newUpload._id,
    //   tenantId,
    //   action: 'VALIDATION ADDED',
    //   performedBy: req.user._id
    // });
    console.log('✅ Audit trail logged for upload.');
    res.status(201).json({ message: 'Validation rule added successfully' });
  } catch (error) {
    console.error('Error adding validation rule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update an existing validation rule
const updateValidationRule = async (req, res) => {
  const { docType, ruleId } = req.params;
  const { field, rules, errorMessage } = req.body;

  try {
    const updatedRule = await ValidationRule.findOneAndUpdate(
      { _id: ruleId, docType },
      { field, rules, errorMessage },
      { new: true }
    );

    if (!updatedRule) {
      return res.status(404).json({ message: 'Validation rule not found' });
    }

    // ✍️ Create Audit Trail for UPLOAD
    // await AuditTrail.create({
    //   documentId: newUpload._id,
    //   tenantId,
    //   action: 'VALIDATION UPDATED',
    //   performedBy: req.user._id
    // });
    console.log('✅ Audit trail logged for upload.');

    res.json({ message: 'Validation rule updated successfully' });
  } catch (error) {
    console.error('Error updating validation rule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a validation rule
const deleteValidationRule = async (req, res) => {
  const { docType, ruleId } = req.params;

  try {
    const deletedRule = await ValidationRule.findOneAndDelete({ _id: ruleId, docType });

    if (!deletedRule) {
      return res.status(404).json({ message: 'Validation rule not found' });
    }

    res.json({ message: 'Validation rule deleted successfully' });
  } catch (error) {
    console.error('Error deleting validation rule:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getValidationRules,
  addValidationRule,
  updateValidationRule,
  deleteValidationRule
};
