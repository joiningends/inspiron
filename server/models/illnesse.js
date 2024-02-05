const mongoose = require('mongoose');

const illnessSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
    },
  ],

});

module.exports = mongoose.model('Illness', illnessSchema );
