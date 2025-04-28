// backend/routes/tenant.js
const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant'); // <-- assuming you already have a Tenant model

// GET all tenants (for dropdown)
router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find({}, '_id tenantName tenantCode'); // Only return needed fields
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
