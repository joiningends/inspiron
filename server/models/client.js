const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  groupid: {
    type: String,
    unique: true // Ensure uniqueness of groupid
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
  credit: {
    type: Number,
    default: 0
  },
  url:{
    type: String
  },
  companypayment:{
    type:Boolean
  },
  hremail:{
    type:String

  },
  hrcontactnumber:{
    type:Number
  }
});

module.exports = mongoose.model('Client', clientSchema);
