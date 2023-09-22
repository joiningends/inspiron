const mongoose = require('mongoose');

const mediceneSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
 
});

exports.Medicene = mongoose.model('Medicene', mediceneSchema);
