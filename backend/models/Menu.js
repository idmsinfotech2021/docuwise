const mongoose = require('mongoose');

const subMenuSchema = new mongoose.Schema({
  label: String,
  path: String,
  icon: String
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  label: String,
  path: String,
  icon: String,
  type: String, // 'link' or 'group'
  subMenus: [subMenuSchema]
}, { _id: false });

const menuSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  menu: [menuItemSchema]
});

module.exports = mongoose.model('Menu', menuSchema);
