const mongoose = require('mongoose');

const onsetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Onset', onsetSchema);
