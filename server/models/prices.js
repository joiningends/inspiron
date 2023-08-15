const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
    expriencelevel:
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ExperienceLevel",
        },
        level:{
            type: String,  
        },
  session: {
    type: String,
    required: true,
  },
  sessionPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
});

module.exports = mongoose.model('Price', priceSchema);
