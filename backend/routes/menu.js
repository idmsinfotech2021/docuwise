// backend/routes/menu.js
const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// GET Menu based on role
router.get('/:role', async (req, res) => {
  try {
    const { role } = req.params;

    const result = await Menu.aggregate([
      { $match: { role } },  // Filter by role first
      { $unwind: "$menu" },
      { 
        $match: { 
          $or: [
            { "menu.status": "Active" },
            { "menu.status": { $exists: false } }
          ]
        }
      },
      {
        $addFields: {
          "menu.subMenus": {
            $filter: {
              input: "$menu.subMenus",
              as: "sub",
              cond: {
                $or: [
                  { $eq: ["$$sub.status", "Active"] },
                  { $not: "$$sub.status" }
                ]
              }
            }
          }
        }
      },
      { $sort: { "menu.sequence": 1 } },
      {
        $group: {
          _id: "$_id",
          role: { $first: "$role" },
          menu: { $push: "$menu" }
        }
      }
    ]);

    if (!result.length) {
      return res.status(404).json({ message: "No menus found for this role" });
    }

    res.json(result[0].menu); // Return the menu array
  } catch (err) {
    console.error("Error in getActiveSortedMenuByRole:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
