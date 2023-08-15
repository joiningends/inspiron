const mongoose = require('mongoose');

const experienceLevelSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    unique: true,
  },
 
});

const ExperienceLevel = mongoose.model('ExperienceLevel', experienceLevelSchema);

module.exports = ExperienceLevel;
