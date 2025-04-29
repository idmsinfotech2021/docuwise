// controllers/menuController.js

const Menu = require('../models/Menu');

// Fetch Menus for a Role
exports.getMenusByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const menuDoc = await Menu.findOne({ role });
    if (!menuDoc) return res.status(404).json([]);

    // Filter & sort top-level menus
    const activeMenus = menuDoc.menu
      .filter(menu => menu.status === 'Active')
      .sort((a, b) => a.sequence - b.sequence)
      .map(menu => ({
        ...menu.toObject(),
        subMenus: (menu.subMenus || [])
          .filter(sub => sub.status === 'Active')
          .sort((a, b) => a.sequence - b.sequence)
      }));

    res.status(200).json(activeMenus);
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

// Add SubMenu to a menu item
exports.addSubMenu = async (req, res) => {
  const { role, menuIndex } = req.params;
  const { label, path, icon } = req.body;

  try {
    const menu = await Menu.findOne({ role });

    if (!menu) {
      return res.status(404).json({ message: 'Menu for role not found' });
    }

    if (!menu.menu[menuIndex]) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    menu.menu[menuIndex].subMenus.push({ label, path, icon });
    await menu.save();

    res.json({ message: 'SubMenu added successfully' });
  } catch (error) {
    console.error('Error adding submenu:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Edit a SubMenu
exports.editSubMenu = async (req, res) => {
  const { role, menuIndex, subIndex } = req.params;
  const { label, path, type } = req.body;

  try {
    const menu = await Menu.findOne({ role });

    if (!menu) {
      return res.status(404).json({ message: 'Menu for role not found' });
    }

    if (!menu.menu[menuIndex] || !menu.menu[menuIndex].subMenus[subIndex]) {
      return res.status(404).json({ message: 'SubMenu item not found' });
    }

    menu.menu[menuIndex].subMenus[subIndex].label = label;
    menu.menu[menuIndex].subMenus[subIndex].path = path;
    menu.menu[menuIndex].subMenus[subIndex].type = type;

    await menu.save();

    res.json({ message: 'SubMenu updated successfully' });
  } catch (error) {
    console.error('Error editing submenu:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a SubMenu
exports.deleteSubMenu = async (req, res) => {
  const { role, menuIndex, subIndex } = req.params;

  try {
    const menu = await Menu.findOne({ role });

    if (!menu) {
      return res.status(404).json({ message: 'Menu for role not found' });
    }

    if (!menu.menu[menuIndex] || !menu.menu[menuIndex].subMenus[subIndex]) {
      return res.status(404).json({ message: 'SubMenu item not found' });
    }

    menu.menu[menuIndex].subMenus.splice(subIndex, 1);
    await menu.save();

    res.json({ message: 'SubMenu deleted successfully' });
  } catch (error) {
    console.error('Error deleting submenu:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
