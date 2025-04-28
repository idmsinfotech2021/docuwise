// controllers/menuController.js

const Menu = require('../models/Menu');

// Fetch Menus for a Role
exports.getMenusByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const menuDoc = await Menu.findOne({ role });
    if (!menuDoc) {
      return res.status(404).json([]);
    }
    res.status(200).json(menuDoc.menu);
  } catch (error) {
    console.error('Error fetching menus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a New Menu Item
exports.addMenuItem = async (req, res) => {
  const { role } = req.params;
  const { newMenuItem } = req.body;

  try {
    let menuDoc = await Menu.findOne({ role });

    if (!menuDoc) {
      // If no document exists, create a new one
      menuDoc = new Menu({ role, menu: [] });
    }

    menuDoc.menu.push(newMenuItem);
    await menuDoc.save();

    res.status(200).json({ message: 'Menu item added successfully', menu: menuDoc.menu });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit an Existing Menu Item
exports.editMenuItem = async (req, res) => {
  const { role } = req.params;
  const { index, updatedMenuItem } = req.body;

  try {
    const menuDoc = await Menu.findOne({ role });

    if (!menuDoc) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (index >= 0 && index < menuDoc.menu.length) {
      menuDoc.menu[index] = updatedMenuItem;
      await menuDoc.save();
      res.status(200).json({ message: 'Menu item updated successfully', menu: menuDoc.menu });
    } else {
      res.status(400).json({ message: 'Invalid menu index' });
    }
  } catch (error) {
    console.error('Error editing menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a Menu Item
exports.deleteMenuItem = async (req, res) => {
  const { role } = req.params;
  const { index } = req.body;

  try {
    const menuDoc = await Menu.findOne({ role });

    if (!menuDoc) {
      return res.status(404).json({ message: 'Role not found' });
    }

    if (index >= 0 && index < menuDoc.menu.length) {
      menuDoc.menu.splice(index, 1);
      await menuDoc.save();
      res.status(200).json({ message: 'Menu item deleted successfully', menu: menuDoc.menu });
    } else {
      res.status(400).json({ message: 'Invalid menu index' });
    }
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
