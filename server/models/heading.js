const mongoose = require('mongoose');

const headingSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Heading', headingSchema);
