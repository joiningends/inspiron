const mongoose = require('mongoose');

// Define the LabTest schema
const labTestSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true,
      required: true,
    },
    // You can add more properties related to lab tests here
  });
  exports.LabTest = mongoose.model('LabTest', labTestSchema);


