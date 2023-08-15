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

  
  sessionDuration: {
    type: Number,
    
  },
  timeBetweenSessions: {
    type: Number,
    
  },
  extendsession:{
    type: Number,
  }
 
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
