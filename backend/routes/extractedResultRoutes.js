const express = require('express');
const ExtractedResult = require('../models/ExtractedResult');
const router = express.Router();

// Get extracted result for a given uploadId
router.get('/:uploadId', async (req, res) => {
  try {
    const extracted = await ExtractedResult.findOne({ uploadId: req.params.uploadId });
    if (!extracted) {
      return res.status(404).json({ message: "No extraction found for this document" });
    }
    res.status(200).json(extracted);
  } catch (error) {
    console.error('Error fetching extracted result:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
