const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  centerName: {
    type: String,
  },
  centerAddress: {
    type: String,
  },
  contactNo: {
    type: String,
  },
city:{
  type: String,
},
  pin:{
    type:Number
  },
  sessionDuration: {
    type: Number,
    
  },
  timeBetweenSessions: {
    type: Number,
    
  },
  extendsession:{
    type: Number,
    default:30
  }
 
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
