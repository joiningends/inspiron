const mongoose = require('mongoose');

const headingSchema = new mongoose.Schema({
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
    },
  ],
});

module.exports = mongoose.model('Heading', headingSchema);
