const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Upload = require('../models/Upload');
const { agenda } = require('../queues/agenda'); // ✅ Import agenda object
const { verifyUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// ⚡ Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');

    if (!fs.existsSync(uploadPath)) {
      console.log('Uploads folder missing. Creating uploads folder...');
      fs.mkdirSync(uploadPath);
    }

    console.log('Uploads folder ready at:', uploadPath);
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueFilename = Date.now() + '-' + file.originalname;
    console.log('Saving file as:', uniqueFilename);
    cb(null, uniqueFilename);
  }
});

// ⚡ Multer Middleware
const upload = multer({ storage: storage });

// ⚡ Upload Route
router.post('/', verifyUser, upload.single('file'), async (req, res) => {
  try {
    console.log('--- API /api/uploads hit ---');

    if (!req.file) {
      console.error('❌ No file received in request.');
      return res.status(400).json({ message: 'File missing in upload.' });
    }
    console.log('✅ File received:', req.file.filename);

    const { docType } = req.body;
    const tenantId = req.user.tenantId;
    //console.log('✅ Tenant ID received:', req.user.tenantId);
    //console.log('✅ Doc Type received:', docType);

    if (!tenantId || !docType) {
      console.error('❌ Missing tenantId or docType fields.');
      return res.status(400).json({ message: 'tenantId or docType missing.' });
    }

    console.log('✅ All fields received. Preparing to save...');

    // Save Upload metadata
    const newUpload = await Upload.create({
      tenantId,
      docType,
      filename: req.file.filename,
      originalFilename: req.file.originalname,
      status: 'pending'
    });

    console.log('✅ Upload metadata saved successfully in database.');

    // ✅ After saving, immediately schedule Agenda Job
    await agenda.now('process uploaded document', { uploadId: newUpload._id });
    console.log('✅ Agenda job scheduled successfully for Upload ID:', newUpload._id.toString());

    res.status(201).json({ 
      success: true, 
      message: 'File uploaded and Agenda job scheduled successfully!', 
      upload: newUpload 
    });

  } catch (error) {
    console.error('❌ Exception in /api/uploads route:', error.message);
    res.status(500).json({ success: false, message: 'Server error in upload.' });
  }
});

router.get('/', async (req, res) => {
   try {
     const { tenantId } = req.query;
     let query = {};
 
     if (tenantId) {
       query.tenantId = tenantId;
     }
 
     const uploads = await Upload.find(query).sort({ createdAt: -1 });
     res.status(200).json(uploads);
 
   } catch (error) {
     console.error('Error fetching uploads:', error);
     res.status(500).json({ message: 'Error fetching uploads' });
   }
});
 

module.exports = router;
