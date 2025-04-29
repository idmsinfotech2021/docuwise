const Upload = require('../models/Upload');
const ExtractedResult = require('../models/ExtractedResult');

exports.getValidationKPIs = async (req, res) => {
  try {
    const totalDocs = await Upload.countDocuments();
    const completed = await Upload.countDocuments({ status: 'completed' });
    const needsCorrection = await Upload.countDocuments({ status: 'needs_correction' });

    res.json({
      totalDocs,
      completed,
      needsCorrection
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopValidationErrors = async (req, res) => {
  try {
    const results = await ExtractedResult.aggregate([
      { $unwind: "$validationErrors" },
      { $group: {
          _id: "$validationErrors",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};