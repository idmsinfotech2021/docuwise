const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadTemplate, listTemplates } = require('../controllers/templateController');
const { verifyUser } = require('../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/templates'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.endsWith('.docx')) {
      return cb(new Error('Only .docx files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/upload', verifyUser, upload.single('file'), uploadTemplate);
router.get('/list', verifyUser, listTemplates);

module.exports = router;
