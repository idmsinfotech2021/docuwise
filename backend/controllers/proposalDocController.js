const ProposalSession = require('../models/ProposalSession');
const ProposalTemplate = require('../models/ProposalTemplate');

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { Readable } = require('stream');

const generateDocxFromSession = async (req, res) => {
  const { sessionId } = req.params;
  const session = await ProposalSession.findById(sessionId);
  if (!session) return res.status(404).json({ message: 'Session not found' });

  const template = await ProposalTemplate.findById(session.templateId);
  if (!template || !template.filePath) {
    return res.status(400).json({ message: 'Template not available' });
  }

  const templatePath = path.join(__dirname, '..', 'uploads', template.filePath);
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const placeholderMap = {};
  for (const answer of session.answers) {
    if (answer.confirmed && answer.sectionName) {
      const key = `section_${answer.sectionName.toLowerCase().replace(/\s+/g, '_')}`;
      placeholderMap[key] = answer.finalContent;
    }
  }

  try {
    doc.render(placeholderMap);
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=Proposal_Output.docx',
    });

    const stream = Readable.from(buffer);
    stream.pipe(res);
  } catch (err) {
    console.error('❌ Error generating DOCX:', err);
    res.status(500).json({ message: 'Failed to generate document' });
  }
};

module.exports = { generateDocxFromSession };
