const express = require('express');
const router = express.Router();
const { verifyUser } = require('../middlewares/authMiddleware');
const { saveSections, getSections } = require('../controllers/sectionConfigController');

router.post('/save', verifyUser, saveSections);
router.get('/:templateId', verifyUser, getSections);

module.exports = router;
