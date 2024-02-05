// expertise.js

const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema({
  type: {
    type: [String],
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Expertise', expertiseSchema);
