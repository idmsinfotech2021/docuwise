// routes/menuRoutes.js

const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Fetch Menus
router.get('/menus/:role', menuController.getMenusByRole);

// Add Menu Item
router.post('/menus/:role/add', menuController.addMenuItem);

// Edit Menu Item
router.put('/menus/:role/edit', menuController.editMenuItem);

// Delete Menu Item
router.delete('/menus/:role/delete', menuController.deleteMenuItem);

// New SubMenu Routes
router.post('/menus/:role/:menuIndex/submenu/add', menuController.addSubMenu);
router.put('/menus/:role/:menuIndex/submenu/edit/:subIndex', menuController.editSubMenu);
router.delete('/menus/:role/:menuIndex/submenu/delete/:subIndex', menuController.deleteSubMenu);

module.exports = router;
