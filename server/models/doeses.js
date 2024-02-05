const mongoose = require('mongoose');

// Define the Dose schema
const doseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
});
exports.Dose= mongoose.model('Dose', doseSchema);

