// backend/routes/tenant.js
const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant'); // <-- assuming you already have a Tenant model
const multer = require('multer');
const upload = multer({ dest: 'uploads/branding/' });
const { verifyUser } = require('../middlewares/authMiddleware');

// GET tenant-specific branding
router.get('/branding', verifyUser, async (req, res) => {
  //const tenantId = req.headers['x-tenant-id'];
  const tenantId = req.user.tenantId;
  try {
    const tenant = await Tenant.findById(tenantId).select('branding');
    if (tenant && tenant.branding) {
      res.json(tenant.branding);
    } else {
      res.json(null); // Frontend will fallback to default
    }
  } catch (err) {
    console.error('Error fetching branding:', err);
    res.status(500).json({ message: 'Error retrieving branding' });
  }
});


// GET all tenants (for dropdown)
router.get('/', verifyUser, async (req, res) => {
  try {
    const tenants = await Tenant.find({}, '_id tenantName tenantCode'); // Only return needed fields
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.put('/branding', verifyUser, upload.fields([
  { name: 'logo' },
  { name: 'favicon' },
  { name: 'backgroundImage' }
]), async (req, res) => {
  const tenantId = req.user.tenantId; // Make sure this is set correctly
  try {
    const branding = {
      color: req.body.color,
      secondaryColor: req.body.secondaryColor,
      headerText: req.body.headerText,
      footerText: req.body.footerText,
      font: req.body.font
    };

    if (req.files.logo) {
      branding.logo = `/uploads/branding/${req.files.logo[0].filename}`;
    }
    if (req.files.favicon) {
      branding.favicon = `/uploads/branding/${req.files.favicon[0].filename}`;
    }
    if (req.files.backgroundImage) {
      branding.backgroundImage = `/uploads/branding/${req.files.backgroundImage[0].filename}`;
    }

    await Tenant.findByIdAndUpdate(tenantId, { branding }, { new: true });
    res.json({ success: true });
  } catch (err) {
    console.error('Branding update error:', err);
    res.status(500).json({ error: 'Failed to update branding' });
  }
});

module.exports = router;
