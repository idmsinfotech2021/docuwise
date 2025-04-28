const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true
  },
  menu: {
    type: Array,
    required: true
  }
});

module.exports = mongoose.model('Menu', menuSchema);
