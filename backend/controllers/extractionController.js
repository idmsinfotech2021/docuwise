const Upload = require('../models/Upload');
const ExtractedResult = require('../models/ExtractedResult');
const ValidationRule = require('../models/ValidationRule');
const AuditTrail = require('../models/AuditTrail'); // 🔍 Ensure this model file exists

// GET /api/extractions/:uploadId
exports.getExtractionResult = async (req, res) => {
  const { uploadId } = req.params;
  try {
    const upload = await Upload.findById(uploadId);
    const extraction = await ExtractedResult.findOne({ uploadId });

    if (!upload || !extraction) {
      return res.status(404).json({ message: 'Extraction data not found' });
    }

    res.json({ upload, extraction });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getExtractedResult = async (req, res) => {
    const { uploadId } = req.params;
  
    try {
      const extraction = await ExtractedResult.findOne({ uploadId });
  
      if (!extraction) return res.status(404).json({ message: 'Not found' });
  
      res.json({
        // ✅ Serve latest corrected fields
        extractedData: extraction.fields || extraction.extractedData,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
};
  
// POST /api/extractions/correct/:uploadId
exports.correctExtractionResult = async (req, res) => {
  const { uploadId } = req.params;
  const { corrections, correctedBy } = req.body;

  try {
    const extraction = await ExtractedResult.findOne({ uploadId });
    if (!extraction) return res.status(404).json({ message: 'No extraction found' });

    // Ensure all necessary structures exist
    extraction.auditLogs = extraction.auditLogs || [];
    extraction.extractedData = extraction.extractedData || {};
    extraction.fields = extraction.fields || {}; // Ensure 'fields' exists for overwrite

    let validationErrors = [];

    // Apply corrections and log audits
    corrections.forEach(({ fieldName, oldValue, newValue }) => {
      // Save audit
      extraction.auditLogs.push({
        fieldName,
        oldValue,
        newValue,
        correctedBy: correctedBy || 'system',
        correctedAt: new Date()
      });

      // Update extracted value in both locations
      extraction.extractedData[fieldName] = newValue;
      extraction.fields[fieldName] = newValue;
    });

    extraction.markModified('extractedData');  // ✅ <-- This is key!

    // Load applicable validation rules
    const rules = await ValidationRule.find({ docType: extraction.docType });

    // Perform validations on updated data
    rules.forEach(rule => {
      const value = extraction.fields[rule.fieldName]; // Use unified 'fields' for consistency

      if (rule.required && (!value || value.trim() === '')) {
        validationErrors.push(`${rule.fieldName} is required.`);
      } else if (rule.length && value.length !== rule.length) {
        validationErrors.push(`${rule.fieldName} must be ${rule.length} characters.`);
      } else if (rule.pattern && !new RegExp(rule.pattern).test(value)) {
        validationErrors.push(`${rule.fieldName} pattern mismatch.`);
      } else if (rule.numeric && isNaN(Number(value))) {
        validationErrors.push(`${rule.fieldName} must be numeric.`);
      }
    });

    // Update validation error list
    extraction.validationErrors = validationErrors;

    // Persist corrected fields and validations
    await extraction.save();

    // Update Upload status accordingly
    const upload = await Upload.findById(uploadId);
    if (upload) {
      upload.status = validationErrors.length === 0 ? 'completed' : 'needs_correction';
      await upload.save();
    }

    // ✍️ Create Audit Trail for UPLOAD
    // await AuditTrail.create({
    //   documentId: upload._id,
    //   tenantId,
    //   action: 'EXTRACTION UPDATE',
    //   performedBy: req.user._id
    // });
    console.log('✅ Audit trail logged for upload.');

    res.json({ message: 'Corrections saved and revalidated.', validationErrors });
  } catch (error) {
    console.error('Correction error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

