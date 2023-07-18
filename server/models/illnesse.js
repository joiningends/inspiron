const mongoose = require('mongoose');

const illnessSchema = new mongoose.Schema({
  Onset:{
    type: String,
    required:true,
  },
  headings: [
    {
      name: {
        type: String,
        
      },
      options: [
        {
          
            type: String,
            required: false,
        
         
        },
      ],
      description: {
        type:String,
        required:true,
      }
    },
  ],
});

module.exports = mongoose.model('Illness', illnessSchema );
