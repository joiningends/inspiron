const mongoose = require('mongoose');

const clientSessionSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('ClientSession', clientSessionSchema);
