const mongoose = require('mongoose');

const subMenuSchema = new mongoose.Schema({
  label: String,
  path: String,
  icon: String,
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  sequence: { type: Number, default: 0 }
}, { _id: false });

const menuItemSchema = new mongoose.Schema({
  label: String,
  path: String,
  icon: String,
  type: String, // 'link' or 'group'
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  sequence: { type: Number, default: 0 },
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
