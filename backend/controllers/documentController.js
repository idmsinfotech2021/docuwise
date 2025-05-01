// /controllers/documentController.js
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload');
const ExtractedResult = require('../models/ExtractedResult');
const Prompt = require('../models/Prompt');
const { agenda } = require('../queues/agenda');
const AuditTrail = require('../models/AuditTrail'); // 🔍 Ensure this model file exists

const uploadDocument = async (req, res) => {
    try {
        const { tenantId, docType } = req.body;
        if (!tenantId || !docType || !req.files || !req.files.file) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const file = req.files.file;
        const uploadPath = path.join(__dirname, '../uploads', file.name);

        // Save file to uploads folder
        await file.mv(uploadPath);

        // Save metadata to DB
        const upload = await Upload.create({
            filename: file.name,
            tenantId,
            docType
        });

        // ✍️ Create Audit Trail for UPLOAD
        await AuditTrail.create({
            documentId: upload._id,
            tenantId,
            action: 'DOCUMENT UPLOAD',
            performedBy: req.user._id
        });
        console.log('✅ Audit trail logged for upload.');

        // Queue a background job
        await agenda.now('process uploaded document', { uploadId: upload._id });

        res.status(200).json({ message: 'File uploaded and processing started', uploadId: upload._id });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getExtractedResults = async (req, res) => {
    try {
        const { tenantId, docType } = req.query;

        const query = {};
        if (tenantId) query.tenantId = tenantId;
        if (docType) query.docType = docType;

        const results = await ExtractedResult.find(query).populate('uploadId', 'filename');

        res.status(200).json(results);
    } catch (err) {
        console.error('Fetch Results Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    uploadDocument,
    getExtractedResults
};
