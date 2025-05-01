const ProposalSectionConfig = require('../models/ProposalSectionConfig');

const saveSections = async (req, res) => {
  const { templateId, sections } = req.body;
  console.log("Here..............", templateId)
  
  if (!templateId || !Array.isArray(sections)) {
    return res.status(400).json({ message: 'templateId and sections are required' });
  }
  const tenantId = req.user.tenantId;
  console.log("Here.............. 0tenantId ", tenantId)
  try {
    const existing = await ProposalSectionConfig.findOneAndUpdate(
      { templateId, tenantId },  // ✅ match both
      {
        $set: {
          sections,
          updatedAt: new Date(),
          tenantId // ✅ ensure it's set in case of upsert
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Section config saved', config: existing });
  } catch (err) {
    console.error('Error saving section config:', err);
    res.status(500).json({ message: 'Failed to save section config' });
  }
};

const getSections = async (req, res) => {
  try {
    const config = await ProposalSectionConfig.findOne({ templateId: req.params.templateId });
    if (!config) return res.status(404).json({ message: 'No section config found' });
    res.status(200).json(config);
  } catch (err) {
    console.error('Error fetching section config:', err);
    res.status(500).json({ message: 'Error retrieving sections' });
  }
};

module.exports = { saveSections, getSections };
