const fs = require('fs');
const path = require('path');
const ProposalTemplate = require('../models/ProposalTemplate');
const { extractPlaceholders } = require('../utils/extractPlaceholders');

const uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads/templates', req.file.filename);
    const buffer = fs.readFileSync(filePath);

    const placeholderList = extractPlaceholders(buffer);
    // if (placeholderList.length === 0) {
    //   return res.status(400).json({ message: 'No placeholders found in template' });
    // }
    const tenantId = req.user.tenantId;
    const template = await ProposalTemplate.create({
      fileName: req.file.filename,
      placeholderList,
      tenantId,
      uploadedBy: req.user._id
    });

    res.status(201).json({ message: 'Template uploaded successfully', template });
  } catch (error) {
    console.error('Template upload error:', error);
    res.status(500).json({ message: 'Error uploading template' });
  }
};

// const listTemplates = async (req, res) => {
//   const templates = await ProposalTemplate.find().sort({ uploadDate: -1 });
//   res.json(templates);
// };

const listTemplates = async (req, res) => {
  try {
    const templates = await ProposalTemplate.find({
      tenantId: req.user.tenantId
    }).sort({ createdAt: -1 });

    res.status(200).json({ templates });
  } catch (err) {
    console.error('Failed to list templates:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { uploadTemplate, listTemplates };
