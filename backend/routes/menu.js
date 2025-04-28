// backend/routes/menu.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET Menu based on role
router.get('/:role', async (req, res) => {
  try {
    const { role } = req.params;
    const menuData = await Menu.findOne({ role });

    if (!menuData) {
      return res.status(404).json({ message: 'Menu not found for the given role' });
    }

    res.json(menuData.menu);
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
